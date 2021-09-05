import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { MenuItem, Select } from '@material-ui/core';
import RemoveCircleRoundedIcon from '@material-ui/icons/RemoveCircleRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import SelectCustomer from './SelectCustomer';
// import SelectProduct from './SelectProduct';

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

const BillingForm = () => {
   const classes = useStyles();
   const [date, setDate] = useState('');
   const [customerId, setCustomerId] = useState([]);
   const [productId, setProductId] = useState('');
   const [quantity, setQuantity] = useState(0);
   const customers = useSelector((state) => state.customers);
   const products = useSelector((state) => state.products);

   console.log('customer', customers);
   console.log('product', products);

   const handleSubmit = () => {
      const billData = {
         date: date,
         customer: customerId,
         lineItems: [
            {
               product: productId,
               quantity: quantity,
            },
         ],
      };
      console.log(billData);
   };

   return (
      <>
         <div style={{ textAlign: 'justify', margin: '30px' }}>
            <form className={classes.root} onSubmit={handleSubmit}>
               <Typography
                  variant="h3"
                  color="primary"
                  gutterBottom
                  style={{ marginBottom: '30px' }}
               >
                  Add to Cart
               </Typography>
               <div>
                  <TextField
                     style={{ width: '30%' }}
                     required
                     id="date"
                     type="date"
                     name="date"
                     size="small"
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                     placeholder="Enter date"
                     variant="outlined"
                  />
               </div>
               <div>
                  <Select
                     id="customer"
                     variant="outlined"
                     value={customerId}
                     onChange={(e) => setCustomerId(e.target.value)}
                     style={{ height: '40px', width: '30%' }}
                  >
                     {customers.map((customer) => {
                        return (
                           <MenuItem key={customer._id} value={customer._id}>
                              {customer.name}
                           </MenuItem>
                        );
                     })}
                  </Select>
               </div>
               <div>
                  {/* <Select
                     id="product"
                     variant="outlined"
                     value={productId}
                     onChange={(e) => setProductId(e.target.value)}
                  >
                     {products.map((product) => (
                        <MenuItem key={product._id} value={product._id}>
                           {product.name}
                        </MenuItem>
                     ))}
                  </Select>
                  <Button color="primary">
                     <RemoveCircleRoundedIcon />
                  </Button>
                  <Button color="primary">
                     <AddCircleRoundedIcon />
                  </Button>
                  <Button
                     variant="contained"
                     color="primary"
                     type="submit"
                     style={{ margin: '10px' }}
                  >
                     Add
                  </Button> */}
               </div>
               {/* <div>
                  <SelectProduct
                     prodIds={prodIds}
                     prodNames={prodNames}
                     quantity={quantity}
                     productId={productId}
                     setProductId={setProductId}
                  />
               </div> */}
               <div>
                  <Button
                     variant="contained"
                     color="primary"
                     type="submit"
                     style={{ width: '30%' }}
                  >
                     GENERATE
                  </Button>
               </div>
            </form>
         </div>
      </>
   );
};

export default BillingForm;
