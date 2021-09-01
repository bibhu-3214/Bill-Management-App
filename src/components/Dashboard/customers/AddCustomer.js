import React from 'react';
import CustomerForm from './CustomerForm';
import { useDispatch } from 'react-redux';
import { addCustomer } from '../../../Redux/Actions/customersAction';

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
