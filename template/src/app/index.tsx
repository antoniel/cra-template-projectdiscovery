import React from 'react';

import { useCurrentRoute } from 'app/router';
import { BrowserHistory } from 'history'
import { getDecodedDataTask, useTE } from './api';
import * as t from 'io-ts';
import { match } from 'ts-pattern';


interface AppP {
    history: BrowserHistory
}


const getPlaceholderDataTask = getDecodedDataTask({
    baseURL: "https://jsonplaceholder.typicode.com/"
})

function App({ history }: AppP) {
  const route = useCurrentRoute(history);

  const todosTaskStatus = useTE(getPlaceholderDataTask("/todos",
    t.array(t.interface({ title: t.string })),
  ))

  return (
    <span className="App">
      Project Discovery CRA Template
      <br />
      <br />
      <br />
      {route.type === "Home" ?

          match(todosTaskStatus)
          .with({ type: "failure" }, ({ error }) => <span>{ error.message }</span>)
          .with({ type: "loading" }, () => <span>Loading...</span>)
          .with({ type: "success" }, ({ data }) => (
              <ul>{ data.map(({ title }, i) => <li key={i}>{ title }</li>) }</ul>
          )).exhaustive()
      : null}
    </span>
  );
}

export default App;
