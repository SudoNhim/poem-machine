import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';
import rootReducer from './reducers';

ReactDOM.render(
    <Provider store={createStore(rootReducer)}>
        <App/>
    </Provider>, 
    document.getElementById('app'));