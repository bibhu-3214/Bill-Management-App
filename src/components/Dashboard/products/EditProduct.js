import React from 'react';
import { useDispatch } from 'react-redux';
import { editProduct } from '../../../Redux/Actions/productAction';
import ProductForm from './ProductForm';

const EditProduct = (props) => {
   const { id, name, price, editData, handleToggle, setOpenPopup } = props;
   const dispatch = useDispatch();

   const formSubmission = (result) => {
      dispatch(editProduct(result, id));
   };

   return (
      <div>
         <ProductForm
            name={name}
            price={price}
            formSubmission={formSubmission}
            editData={editData}
            handleToggle={handleToggle}
            setOpenPopup={setOpenPopup}
         />
      </div>
   );
};

export default EditProduct;
