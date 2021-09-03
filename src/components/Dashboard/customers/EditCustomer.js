import React from 'react';
import { useDispatch } from 'react-redux';
import { editCustomer } from '../../../Redux/Actions/customersAction';
import CustomerForm from './CustomerForm';

const EditCustomer = (props) => {
   const { id, name, email, contact, handleToggle, editData, setOpenPopup } =
      props;
   const dispatch = useDispatch();

   const formSubmission = (result) => {
      dispatch(editCustomer(result, id));
   };

   return (
      <div>
         <CustomerForm
            name={name}
            email={email}
            contact={contact}
            formSubmission={formSubmission}
            editData={editData}
            handleToggle={handleToggle}
            setOpenPopup={setOpenPopup}
         />
      </div>
   );
};

export default EditCustomer;
