import React, { Suspense } from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import WebFontLoader from './WebFontLoader';

import Auth from './auth/Auth';
import Main from './main/Main';
import NotFound from './NotFound';

const fontConfig = {
  google: {
    families: ['Rubik:400,500,700:latin,cyrillic']
  },
};

function App() {
  return (
    <BrowserRouter>
      <WebFontLoader config={fontConfig}>
        <Suspense fallback={<div />}>
          <Switch>
            <Route path="/auth" component={Auth} />
            <Route exact path="/404" component={NotFound} />
            <Route path="/" component={Main} />
          </Switch>
        </Suspense>
      </WebFontLoader>
    </BrowserRouter>
  );
}

export default hot(module)(App);
