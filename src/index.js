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
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import theme from './theme';
import localData from './data/localData';

const store = configureStore();

if (localData.hasActiveSession()) {
    const hasValidSession = store.dispatch(usersDetails());
    if (hasValidSession) {
        Promise.all([store.dispatch(getCustomers()), store.dispatch(getProducts()), store.dispatch(getBills())]);
    }
}

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ThemeProvider>
    </Provider>,
    document.getElementById('root'),
);
