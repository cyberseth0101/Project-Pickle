import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import reducers from './redux/reducers';

ReactDOM.render(
    <Provider store={createStore(reducers)}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.querySelector('#root')
);
