import axios from 'axios';
import Swal from 'sweetalert2';

export const addProduct = (formData) => {
    return (dispatch) => {
        axios
            .post('https://dct-billing-app.herokuapp.com/api/products', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then((resp) => {
                const Product = resp.data;
                dispatch(addItem(Product));
            })
            .catch((err) => Swal.fire('something went wrong', err.message, 'error'));
    };
};

export const addItem = (Product) => {
    return {
        type: 'ADD_PRODUCT',
        payload: Product,
    };
};

export const removeProducts = (_id) => {
    return (dispatch) => {
        axios({
            method: 'delete',
            url: `https://dct-billing-app.herokuapp.com/api/products/${_id}`,
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
        type: 'REMOVE_PRODUCT',
        payload: removed,
    };
};

export const getProducts = () => {
    return (dispatch) => {
        axios({
            method: 'get',
            url: 'https://dct-billing-app.herokuapp.com/api/products',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then((resp) => {
                const allProductData = resp.data;
                dispatch(getItem(allProductData));
            })
            .catch((err) => Swal.fire('something went wrong', err.message, 'error'));
    };
};

export const getItem = (allProductData) => {
    return {
        type: 'GET_PRODUCT',
        payload: allProductData,
    };
};

export const getProductById = (_id) => {
    return (dispatch) => {
        axios({
            method: 'get',
            url: `https://dct-billing-app.herokuapp.com/api/products/${_id}`,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then((resp) => {
                const singleProduct = resp.data;
                dispatch(getById(singleProduct));
            })
            .catch((err) => Swal.fire('something went wrong', err.message, 'error'));
    };
};

export const getById = (singleProduct) => {
    return {
        type: 'GETBY_ID',
        payload: singleProduct,
    };
};

export const editProduct = (result, id) => {
    return (dispatch) => {
        axios
            .put(`https://dct-billing-app.herokuapp.com/api/products/${id}`, result, {
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
        type: 'EDIT_PRODUCT',
        payload: editedData,
    };
};
