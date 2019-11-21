import * as React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Header } from './components/Header';
import { About } from './components/About';
import PoemMachine from './components/PoemMachine';

const AppImpl = () => (
  <BrowserRouter>
    <div>
        <Header />
        <Switch>
            <Route exact path='/' component={PoemMachine} />
            <Route path='/doc/*' component={PoemMachine} />
            <Route path='/search/:searchTerm' component={PoemMachine} />
            <Route exact path='/about' component={About} />
        </Switch>
    </div>
  </BrowserRouter>
);

const App = hot(module)(AppImpl);

export default App;