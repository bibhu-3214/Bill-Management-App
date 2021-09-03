import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
   root: {
      width: '100%',
      '& > * + *': {
         marginTop: '20px',
      },
   },
}));

const CustomerForm = (props) => {
   const classes = useStyles();
   const { formSubmission, handleToggle, editData, setOpenPopup } = props;
   const [name, setName] = useState(props.name ? editData.name : '');
   const [price, setPrice] = useState(props.price ? editData.price : '');

   const handleSubmit = (e) => {
      e.preventDefault();
      const formData = {
         name: name,
         price: price,
      };
      formSubmission(formData);
      if (formSubmission) {
         setPrice('');
         setName('');
      }
      if (handleToggle) {
         handleToggle();
      }
      setOpenPopup(false);
   };

   return (
      <div style={{ textAlign: 'center' }}>
         <Typography
            variant="h4"
            color="primary"
            gutterBottom
            style={{ marginBottom: '30px' }}
         >
            Add Customers
         </Typography>
         <form
            className={classes.root}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
         >
            <div>
               <TextField
                  required
                  label="Name"
                  type="text"
                  name="name"
                  value={name}
                  placeholder="Enter Customer Name"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '80%' }}
               />
            </div>
            <div>
               <TextField
                  required
                  label="price"
                  type="price"
                  name="price"
                  value={price}
                  placeholder="enter your price"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ width: '80%' }}
               />
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

export default CustomerForm;
