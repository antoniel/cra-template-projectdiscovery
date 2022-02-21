import React from 'react';

import { useCurrentRoute } from 'app/router';
import { BrowserHistory } from 'history'

interface AppP {
    history: BrowserHistory
}

function App({ history }: AppP) {
  const route = useCurrentRoute(history);

  return (
    <span className="App">
      Project Discovery CRA Template
      {route.type}
    </span>
  );
}

export default App;
