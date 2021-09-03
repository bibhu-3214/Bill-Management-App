import axios from 'axios';

export const addProduct = (formData) => {
   return (dispatch) => {
      axios
         .post('http://dct-billing-app.herokuapp.com/api/products', formData, {
            headers: {
               Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
         })
         .then((resp) => {
            const Product = resp.data;
            dispatch(addItem(Product));
         })
         .catch((err) => {
            alert(err.message);
         });
   };
};

export const addItem = (Product) => {
   return {
      type: 'ADD_Product',
      payload: Product,
   };
};

export const removeProduct = (_id) => {
   return (dispatch) => {
      axios({
         method: 'delete',
         url: `http://dct-billing-app.herokuapp.com/api/products/${_id}`,
         headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
         },
      })
         .then((resp) => {
            const removed = resp.data;
            dispatch(removeItem(removed._id));
         })
         .catch((err) => {
            alert(err.message);
         });
   };
};

export const removeItem = (_id) => {
   return {
      type: 'REMOVE_ITEM',
      payload: _id,
   };
};

export const getProducts = () => {
   return (dispatch) => {
      axios({
         method: 'get',
         url: 'http://dct-billing-app.herokuapp.com/api/products',
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
         .then((resp) => {
            const allProductData = resp.data;
            dispatch(getItem(allProductData));
         })
         .catch((err) => {
            alert(err.message);
         });
   };
};

export const getItem = (allProductData) => {
   return {
      type: 'GET_ITEM',
      payload: allProductData,
   };
};

export const getProductById = (_id) => {
   return (dispatch) => {
      axios({
         method: 'get',
         url: `http://dct-billing-app.herokuapp.com/api/products/${_id}`,
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
         .then((resp) => {
            const singleProduct = resp.data;
            dispatch(getById(singleProduct));
         })
         .catch((err) => {
            alert(err.message);
         });
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
         .put(
            `http://dct-billing-app.herokuapp.com/api/products/${id}`,
            result,
            {
               headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
               },
            },
         )
         .then((response) => {
            const editedData = response.data;
            dispatch(editItem(editedData));
         })
         .catch((err) => {
            alert(err.message);
         });
   };
};

export const editItem = (editedData) => {
   return {
      type: 'EDIT_ITEM',
      payload: editedData,
   };
};
