import axios from 'axios';
import Swal from 'sweetalert2';

export const register = (values, redirectToLogin) => {
   return (dispatch) => {
      axios
         .post(
            'http://dct-billing-app.herokuapp.com/api/users/register',
            values,
         )
         .then((resp) => {
            const result = resp.data;
            if (result.hasOwnProperty('errors')) {
               alert(result.message);
            } else {
               Swal.fire('successfully created user', '', 'success');
               redirectToLogin();
            }
            dispatch(isRegister(result));
         })
         .catch((err) => {
            alert(err.message);
         });
   };
};

const isRegister = (result) => {
   return {
      type: 'REGISTER',
      payload: result,
   };
};

export const login = (formData, redirectToAdmin) => {
   return (dispatch) => {
      axios
         .post('http://dct-billing-app.herokuapp.com/api/users/login', formData)
         .then((resp) => {
            const res = resp.data;
            if (res.hasOwnProperty('errors')) {
               alert(res.errors);
            } else {
               Swal.fire(
                  'Logged In Successful',
                  'welcome to Dashboard',
                  'success',
               );
               localStorage.setItem('token', res.token);
               redirectToAdmin();
            }
            dispatch(isLogin(res));
         })
         .catch((err) => {
            alert(err.message);
         });
   };
};

const isLogin = (res) => {
   return {
      type: 'LOGIN',
      payload: res,
   };
};
