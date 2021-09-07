import {
   Button,
   makeStyles,
   TextField,
   Select,
   MenuItem,
   Typography,
   IconButton,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { addBill } from '../../../Redux/Actions/billAction';
import RemoveCircleRoundedIcon from '@material-ui/icons/RemoveCircleRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';

import { useSelector } from 'react-redux';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
   root: {
      width: '100%',
      '& > * + *': {
         marginTop: '20px',
      },
   },
   selectEmpty: {
      marginTop: theme.spacing(2),
   },
}));

const BillingForm = ({ setOpenPopup }) => {
   const classes = useStyles();
   const dispatch = useDispatch();
   const customers = useSelector((state) => state.customers);
   const products = useSelector((state) => state.products);
   const [date, setDate] = useState('');
   const [customerId, setCustomerId] = useState([]);
   const [productId, setProductId] = useState([]);
   const [quantity, setQuantity] = useState(1);
   // const [openSelectInput, setOpenSelectInput] = useState(false);

   const handleSubmit = () => {
      const billData = {
         date: date,
         customer: customerId,
         lineItems: [
            {
               product: productId,
               quantity: Number(quantity),
            },
         ],
      };
      const resetForm = () => {
         setDate('');
         setCustomerId([]);
         setProductId([]);
         setQuantity(1);
      };
      dispatch(addBill(billData, resetForm));
      setOpenPopup(false);
      console.log(billData);
   };

   const handleDecrease = () => {
      const dec = quantity - 1;
      if (quantity < 2) {
         return null;
      } else {
         setQuantity(dec);
      }
   };
   const handleIncrease = () => {
      const inc = quantity + 1;
      setQuantity(inc);
   };
   const handleClick = () => {
      // setOpenSelectInput(true);
   };

   return (
      <div style={{ marginBottom: '30px' }}>
         <form className={classes.root} onSubmit={handleSubmit}>
            <Typography
               variant="h4"
               color="primary"
               gutterBottom
               style={{ textAlign: 'center', marginBottom: '30px' }}
            >
               Add to Cart
            </Typography>
            <div>
               <TextField
                  style={{ width: '100%' }}
                  required
                  id="date"
                  type="date"
                  name="date"
                  size="small"
                  placeholder="Enter date"
                  variant="outlined"
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
               />
            </div>
            <div>
               <Select
                  id="customer"
                  variant="outlined"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  style={{ height: '40px', width: '100%' }}
               >
                  {customers.map((customer, _id) => {
                     return (
                        <MenuItem key={_id} value={customer._id}>
                           {customer.name}
                        </MenuItem>
                     );
                  })}
               </Select>
            </div>
            <div>
               <Select
                  id="product"
                  variant="outlined"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  style={{ height: '40px', width: '100%' }}
               >
                  {products.map((product, _id) => (
                     <MenuItem key={_id} value={product._id}>
                        {product.name}
                     </MenuItem>
                  ))}
               </Select>
            </div>
            <div
               style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
               }}
            >
               <IconButton
                  color="primary"
                  style={{ marginRight: '10px' }}
                  onClick={handleDecrease}
               >
                  <RemoveCircleRoundedIcon />
               </IconButton>
               <IconButton style={{ marginTop: 'auto', marginRight: '10px' }}>
                  {quantity}
               </IconButton>
               <IconButton color="primary" onClick={handleIncrease}>
                  <AddCircleRoundedIcon />
               </IconButton>
               <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClick}
                  style={{ margin: '10px' }}
               >
                  Add
               </Button>
            </div>

            <div>
               <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  // onClick={handleSubmit}
                  style={{ width: '100%' }}
               >
                  GENERATE
               </Button>
            </div>
         </form>
      </div>
   );
};

export default BillingForm;
