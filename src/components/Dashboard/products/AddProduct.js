import React from 'react';
import ProductForm from './ProductForm';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../../Redux/Actions/productAction';

const AddProduct = (props) => {
   const { setOpenPopup } = props;
   const dispatch = useDispatch();

   const formSubmission = (formData) => {
      dispatch(addProduct(formData));
   };

   return (
      <div>
         <ProductForm
            formSubmission={formSubmission}
            setOpenPopup={setOpenPopup}
         />
      </div>
   );
};

export default AddProduct;
