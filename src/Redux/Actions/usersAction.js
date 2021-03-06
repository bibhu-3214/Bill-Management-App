import axios from 'axios';
import Swal from 'sweetalert2';
import { getCustomers } from './customersAction';
import { getProducts } from './productAction';
import { getBills } from './billAction';

export const register = (values, redirectToLogin) => {
    return () => {
        axios
            .post('https://dct-billing-app.herokuapp.com/api/users/register', values)
            .then(resp => {
                const result = resp.data;
                if (result.hasOwnProperty('errors')) {
                    alert(result.message);
                } else {
                    Swal.fire('successfully created user', '', 'success');
                    redirectToLogin();
                }
            })
            .catch(err => Swal.fire('something went wrong', err.message, 'error'));
    };
};

export const login = (values, redirectToAdmin) => {
    return dispatch => {
        axios
            .post('https://dct-billing-app.herokuapp.com/api/users/login', values)
            .then(resp => {
                const res = resp.data;
                if (res.hasOwnProperty('errors')) {
                    alert(res.errors);
                } else if (res.token) {
                    localStorage.setItem('token', res.token);
                    dispatch(isLogin());
                    Swal.fire('Logged In Successful', 'welcome to Dashboard', 'success');
                    dispatch(usersDetails());
                    dispatch(getCustomers());
                    dispatch(getProducts());
                    dispatch(getBills());
                    redirectToAdmin();
                }
            })
            .catch(err => Swal.fire('something went wrong', err.message, 'error'));
    };
};

const isLogin = () => {
    return {
        type: 'LOGIN',
    };
};

export const usersDetails = () => {
    return dispatch => {
        axios
            .get('https://dct-billing-app.herokuapp.com/api/users/account', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then(response => {
                const data = response.data;
                dispatch(userInformation(data));
            })
            .catch(err => Swal.fire('something went wrong', err.message, 'error'));
    };
};

export const userInformation = userdata => {
    return {
        type: 'USER_INFORMATION',
        payload: userdata,
    };
};
