import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
   root: {
      width: '100%',
      '& > * + *': {
         marginTop: theme.spacing(2),
      },
   },
}));

const CustomerForm = (props) => {
   const { formSubmission, handleToggle } = props;
   const [name, setName] = useState(props.name ? props.name : '');
   const [email, setEmail] = useState(props.email ? props.email : '');
   const [contact, setContact] = useState(props.contact ? props.contact : '');
   const classes = useStyles();

   const handleSubmit = (e) => {
      e.preventDefault();
      const formData = {
         name: name,
         mobile: contact,
         email: email,
      };

      formSubmission(formData);
      if (formSubmission) {
         setContact('');
         setEmail('');
         setName('');
      }

      if (handleToggle) {
         handleToggle();
      }
   };

   return (
      <div style={{ textAlign: 'center' }}>
         <Typography variant="h4" color="primary" gutterBottom>
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
                  style={{ width: '40%' }}
                  required
                  label="Name"
                  type="name"
                  name="name"
                  value={name}
                  placeholder="Enter Customer Name"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setName(e.target.value)}
               />
            </div>
            <div>
               <TextField
                  style={{ width: '40%' }}
                  required
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  placeholder="enter your email"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
               />
            </div>
            <div>
               <TextField
                  style={{ width: '40%' }}
                  required
                  label="Contact"
                  type="contact"
                  name="contact"
                  value={contact}
                  placeholder="enter Contact Number"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setContact(e.target.value)}
               />
            </div>
            <div>
               <Button
                  style={{ width: '40%', marginTop: '20px' }}
                  variant="contained"
                  color="primary"
                  type="submit"
               >
                  ADD
               </Button>
            </div>
         </form>
      </div>
   );
};

export default CustomerForm;
