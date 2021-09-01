import React from 'react';
import { useDispatch } from 'react-redux';
import { editCustomer } from '../../../Redux/Actions/customersAction';
import CustomerForm from './CustomerForm';

const EditNote = (props) => {
   const { id, title, body, handleToggle } = props;

   const dispatch = useDispatch();

   const formSubmission = (result) => {
      dispatch(editCustomer(result, id));
   };

   return (
      <div>
         <CustomerForm
            title={title}
            body={body}
            formSubmission={formSubmission}
            handleToggle={handleToggle}
         />
      </div>
   );
};

export default EditNote;
