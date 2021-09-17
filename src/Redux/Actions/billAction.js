import axios from 'axios';
import Swal from 'sweetalert2';

export const addBill = (formData, redirectToShowBills) => {
    return dispatch => {
        axios
            .post('http://dct-billing-app.herokuapp.com/api/bills', formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
            .then(resp => {
                const bill = resp.data;
                dispatch(addItem(bill));
                redirectToShowBills(bill._id);
            })
            .catch(err => Swal.fire('something went wrong', err.message, 'error'));
    };
};

export const addItem = bill => {
    return {
        type: 'ADD_BILL',
        payload: bill,
    };
};

export const removeBill = _id => {
    return dispatch => {
        axios({
            method: 'delete',
            url: `http://dct-billing-app.herokuapp.com/api/bills/${_id}`,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(resp => {
                const removed = resp.data;
                dispatch(removeItem(removed._id));
            })
            .catch(err => Swal.fire('something went wrong', err.message, 'error'));
    };
};

export const removeItem = id => {
    return {
        type: 'REMOVE_BILL',
        payload: id,
    };
};

export const getBills = () => {
    return dispatch => {
        axios({
            method: 'get',
            url: 'http://dct-billing-app.herokuapp.com/api/bills',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then(resp => {
                const allBillData = resp.data;
                dispatch(getItem(allBillData.reverse()));
            })
            .catch(err => Swal.fire('something went wrong', err.message, 'error'));
    };
};

export const getItem = allBillData => {
    return {
        type: 'GET_BILL',
        payload: allBillData,
    };
};

export const getBillById = _id => {
    return dispatch => {
        axios({
            method: 'get',
            url: `http://dct-billing-app.herokuapp.com/api/bills/${_id}`,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
            .then(resp => {
                const singleBill = resp.data;
                dispatch(getById(singleBill));
            })
            .catch(err => Swal.fire('something went wrong', err.message, 'error'));
    };
};

export const getById = data => {
    return {
        type: 'GETBY_ID',
        payload: data,
    };
};
