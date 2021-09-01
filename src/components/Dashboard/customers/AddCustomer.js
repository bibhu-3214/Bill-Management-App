import React from 'react';
import CustomerForm from './CustomerForm';
import { useDispatch } from 'react-redux';

const AddCustomer = () => {
   const dispatch = useDispatch();

   const formSubmission = (formData) => {
      dispatch(addCustomer(formData));
   };

   return (
      <div>
         <CustomerForm formSubmission={formSubmission} />
      </div>
   );
};

export default AddCustomer;
