import axios from 'axios';
import Swal from 'sweetalert2';

export const addCustomer = (formData) => {
    return (dispatch) => {
        axios
            .post('http://dct-billing-app.herokuapp.com/api/customers', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((resp) => {
                const customer = resp.data;
                dispatch(addItem(customer));
            })
            .catch((err) => Swal.fire('something went wrong', err.message, 'error'));
    };
};

export const addItem = (customer) => {
    return {
        type: 'ADD_CUSTOMER',
        payload: customer,
    };
};

export const removeCustomer = (_id) => {
    return (dispatch) => {
        axios({
            method: 'delete',
            url: `http://dct-billing-app.herokuapp.com/api/customers/${_id}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((resp) => {
                const removed = resp.data;
                dispatch(removeItem(removed));
            })
            .catch((err) => Swal.fire('something went wrong', err.message, 'error'));
    };
};

export const removeItem = (removed) => {
    return {
        type: 'REMOVE_CUSTOMER',
        payload: removed,
    };
};

export const getCustomers = () => {
    return (dispatch) => {
        axios
            .get('http://dct-billing-app.herokuapp.com/api/customers', {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            })
            .then((resp) => {
                const allCustomerData = resp.data;
                dispatch(getItem(allCustomerData));
            })
            .catch((err) => Swal.fire('something went wrong', err.message, 'error'));
    };
};

export const getItem = (allCustomerData) => {
    return {
        type: 'GET_CUSTOMER',
        payload: allCustomerData,
    };
};

export const editCustomer = (values, _id) => {
    return (dispatch) => {
        axios
            .put(`http://dct-billing-app.herokuapp.com/api/customers/${_id}`, values, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((response) => {
                const editedData = response.data;
                dispatch(editItem(editedData));
            })
            .catch((err) => Swal.fire('something went wrong', err.message, 'error'));
    };
};

export const editItem = (editedData) => {
    return {
        type: 'EDIT_CUSTOMER',
        payload: editedData,
    };
};
