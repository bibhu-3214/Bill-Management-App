import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './Redux/configureStore';
import { usersDetails } from './Redux/Actions/usersAction';
import { getCustomers } from './Redux/Actions/customersAction';
import { getProducts } from './Redux/Actions/productAction';
import { getBills } from './Redux/Actions/billAction';

const store = configureStore();
console.log('state', store.getState());

store.subscribe(() => {
    console.log('state update', store.getState());
});

if (localStorage.getItem('token')) {
    store.dispatch(usersDetails());
    store.dispatch(getCustomers());
    store.dispatch(getProducts());
    store.dispatch(getBills());
}

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
    document.getElementById('root'),
);
