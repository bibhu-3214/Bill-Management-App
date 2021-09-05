import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { addProduct, editProduct } from '../../../Redux/Actions/productAction';

const useStyles = makeStyles(() => ({
   root: {
      width: '100%',
      '& > * + *': {
         marginTop: '20px',
      },
   },
}));

const ProductForm = (props) => {
   const classes = useStyles();
   const { editData, setOpenPopup } = props;
   const { _id, name, price } = editData ? editData : {};
   const dispatch = useDispatch();

   const initialValues = {
      name: name ? name : '',
      price: price ? price : '',
   };

   const onSubmit = (values) => {
      if (_id) {
         dispatch(editProduct(values, _id));
      } else {
         dispatch(addProduct(values));
      }
      setOpenPopup(false);
   };

   const validationSchema = yup.object({
      name: yup
         .string()
         .min(5, 'name should be of minimum 5 characters length')
         .required('Required'),
      price: yup.string().required('Required'),
   });

   const formik = useFormik({
      initialValues,
      onSubmit,
      validationSchema,
   });

   return (
      <div style={{ textAlign: 'center' }}>
         <Typography
            variant="h4"
            color="primary"
            gutterBottom
            style={{ marginBottom: '30px' }}
         >
            {_id ? 'Edit Product' : 'Add Product'}
         </Typography>
         <form
            className={classes.root}
            noValidate
            autoComplete="off"
            onSubmit={formik.handleSubmit}
         >
            <div>
               <TextField
                  required
                  label="Name"
                  type="text"
                  name="name"
                  placeholder="Enter Product Name"
                  size="small"
                  variant="outlined"
                  style={{ width: '80%' }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.name}
               />
               {formik.touched.name && formik.errors.name ? (
                  <div> {formik.errors.name} </div>
               ) : null}
            </div>
            <div>
               <TextField
                  required
                  label="price"
                  type="text"
                  name="price"
                  placeholder="enter your price"
                  size="small"
                  variant="outlined"
                  style={{ width: '80%' }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.price}
               />
               {formik.touched.price && formik.errors.price ? (
                  <div> {formik.errors.price} </div>
               ) : null}
            </div>
            <div>
               <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ width: '80%', marginTop: '10px' }}
               >
                  ADD
               </Button>
            </div>
         </form>
      </div>
   );
};

export default ProductForm;
