import * as React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { About } from './components/About';
// Pages
import { Header } from './components/Header';
import { Main } from './components/Main';

const AppImpl = () => (
  <BrowserRouter>
    <div>
        <Header />
        <Switch>
            <Route exact path='/' component={Main} />
            <Route path='/about' component={About} />
        </Switch>
    </div>
  </BrowserRouter>
);

export const App = hot(module)(AppImpl);