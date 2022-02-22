/**
 * Calls to backend api.
 */

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { makeADT, ofType } from "@morphic-ts/adt";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import { failure } from "io-ts/lib/PathReporter";
import { flow, pipe } from "fp-ts/function";
import * as t from "io-ts";
import { useEffect, useState } from "react";

// (string, any -> string, config) -> TaskEither(Error, AxiosResponse)

export const getTask = (
  url: string,
  onError: (err: unknown) => Error,
  config?: AxiosRequestConfig
) => pipe(
  TE.tryCatch(() => axios.get(url, config), onError),
  TE.map(({ data }) => data)
);

const decodeTask = <A>(decoder: t.Decoder<unknown, A>) => flow(
  decoder.decode,
  E.mapLeft((errors) => new Error(failure(errors).join("\n"))),
  TE.fromEither,
);

export const getDecodedDataTask = (config?: AxiosRequestConfig) => <A>(
  url: string,
  decoder: t.Decoder<unknown, A>) => pipe(
    getTask(url, () => Error("Error making get request"), config),
    TE.chain(decodeTask(decoder))
  )

/*
 * Task Status
 */

interface Loading { type: "loading" };
interface Success<_> { type: "success", data: _ }
interface Failure { type: "failure", error: Error };

type Status<_> = Loading | Success<_> | Failure;

/*
 * Use TaskEither hook for react
 */

export const useTE = <A>(task: TE.TaskEither<Error, A>) => {
  const [ state, setState ] = useState<Status<A>>({ type: "loading" });

  useEffect(() => {
    task().then(flow(E.fold(
      e => ({ type: "failure", error: e } as Status<A>),
      data => ({ type: "success", data: data } as Status<A>)
    ), setState))
  }, [])

  return state;
}
