import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
   Card,
   CardContent,
   Typography,
   CardActions,
   Button,
} from '@material-ui/core';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
   root: {
      flexGrow: 1,
      margin: '40px',
   },
   paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
   },
   root1: {
      backgroundColor: '#C5CAE9',
      boxShadow:
         'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
      minWidth: 275,
   },
   bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
   },
   title: {
      fontSize: 14,
   },
   pos: {
      marginBottom: 12,
   },
}));

export default function Admin() {
   const classes = useStyles();
   const [user, setUser] = useState({});
   const customers = useSelector((state) => state.customers);
   const products = useSelector((state) => state.products);
   const bills = useSelector((state) => state.bills);
   const users = useSelector((state) => state.users.user);
   console.log('users data', users);

   useEffect(() => {
      axios
         .get('http://dct-billing-app.herokuapp.com/api/users/account', {
            headers: {
               Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
         })
         .then((resp) => {
            const result = resp.data;
            setUser(result);
         })
         .catch((err) => {
            alert(err.message);
         });
   }, []);

   return (
      <div className={classes.root}>
         <Grid container spacing={3}>
            <Grid item xs>
               <Card className={classes.root1}>
                  <CardContent>
                     <Typography
                        variant="h4"
                        component="h2"
                        style={{ color: '#3B3DEC', marginBottom: '20px' }}
                     >
                        Total Customers
                     </Typography>
                     <Typography
                        variant="h4"
                        component="h2"
                        style={{ color: '#3B3DEC' }}
                     >
                        {customers.length}
                     </Typography>
                  </CardContent>
                  <CardActions>
                     <Button size="small" style={{ color: '#3B3DEC' }}>
                        Learn More
                     </Button>
                  </CardActions>
               </Card>
            </Grid>
            <Grid item xs>
               <Card className={classes.root1}>
                  <CardContent>
                     <Typography
                        variant="h4"
                        component="h2"
                        style={{ color: '#3B3DEC', marginBottom: '20px' }}
                     >
                        Total Products
                     </Typography>
                     <Typography
                        variant="h4"
                        component="h2"
                        style={{ color: '#3B3DEC' }}
                     >
                        {products.length}
                     </Typography>
                  </CardContent>
                  <CardActions>
                     <Button size="small" style={{ color: '#3B3DEC' }}>
                        Learn More
                     </Button>
                  </CardActions>
               </Card>
            </Grid>
            <Grid item xs>
               <Card className={classes.root1}>
                  <CardContent>
                     <Typography
                        variant="h4"
                        component="h3"
                        style={{ color: '#3B3DEC', marginBottom: '20px' }}
                     >
                        Total Bills
                     </Typography>
                     <Typography
                        variant="h4"
                        component="h2"
                        style={{ color: '#3B3DEC' }}
                     >
                        {bills.length}
                     </Typography>
                  </CardContent>
                  <CardActions>
                     <Button size="small" style={{ color: '#3B3DEC' }}>
                        Learn More
                     </Button>
                  </CardActions>
               </Card>
            </Grid>
            <Grid item xs={12}>
               <Card className={classes.root1}>
                  <CardContent>
                     <Typography
                        variant="h4"
                        component="h2"
                        style={{ color: '#3B3DEC', marginBottom: '20px' }}
                     >
                        User Informations
                     </Typography>
                     <Typography
                        variant="h4"
                        component="h2"
                        style={{ color: '#3B3DEC' }}
                     >
                        {users.length}
                     </Typography>
                     <Typography
                        variant="h5"
                        component="h3"
                        style={{ color: '#3B3DEC' }}
                     >
                        UserName : {user.username}
                     </Typography>
                     <Typography
                        variant="h5"
                        component="h3"
                        style={{ color: '#3B3DEC' }}
                     >
                        Email : {user.email}
                     </Typography>
                     <Typography
                        variant="h5"
                        component="h3"
                        style={{ color: '#3B3DEC' }}
                     >
                        BusinessName : {user.businessName}
                     </Typography>
                     <Typography
                        variant="h5"
                        component="h3"
                        style={{ color: '#3B3DEC' }}
                     >
                        Address : {user.address}
                     </Typography>
                  </CardContent>
                  <CardActions>
                     <Button size="small" style={{ color: '#3B3DEC' }}>
                        Learn More
                     </Button>
                  </CardActions>
               </Card>
            </Grid>
         </Grid>
      </div>
   );
}
