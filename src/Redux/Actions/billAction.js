import axios from 'axios';

export const addBill = (billData, resetForm) => {
   return (dispatch) => {
      axios
         .post('http://dct-billing-app.herokuapp.com/api/bills', billData, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         .then((resp) => {
            const bill = resp.data;
            if (bill.hasOwnProperty('errors')) {
               alert(bill.message);
            } else {
               resetForm();
               dispatch(addItem(bill));
            }
         })
         .catch((err) => {
            alert(err.message);
         });
   };
};

export const addItem = (bill) => {
   return {
      type: 'ADD_BILL',
      payload: bill,
   };
};

export const removeBill = (_id) => {
   return (dispatch) => {
      axios({
         method: 'delete',
         url: `http://dct-billing-app.herokuapp.com/api/bills/${_id}`,
         headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
         },
      })
         .then((resp) => {
            const removed = resp.data;
            dispatch(removeItem(removed));
         })
         .catch((err) => {
            alert(err.message);
         });
   };
};

export const removeItem = (removed) => {
   return {
      type: 'REMOVE_BILL',
      payload: removed,
   };
};

export const getBills = () => {
   return (dispatch) => {
      axios({
         method: 'get',
         url: 'http://dct-billing-app.herokuapp.com/api/bills',
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
         .then((resp) => {
            const allBillData = resp.data;
            dispatch(getItem(allBillData));
         })
         .catch((err) => {
            alert(err.message);
         });
   };
};

export const getItem = (allBillData) => {
   return {
      type: 'GET_BILL',
      payload: allBillData,
   };
};

export const getBillById = (_id) => {
   return (dispatch) => {
      axios({
         method: 'get',
         url: `http://dct-billing-app.herokuapp.com/api/bills/${_id}`,
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
         .then((resp) => {
            const singleBill = resp.data;
            dispatch(getById(singleBill));
         })
         .catch((err) => {
            alert(err.message);
         });
   };
};

export const getById = (singleBill) => {
   return {
      type: 'GETBY_ID',
      payload: singleBill,
   };
};
