import React from 'react';
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
   },
   paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
   },
   root1: {
      backgroundColor: '#C5CAE9',
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
   const customers = useSelector((state) => state.customers);
   const products = useSelector((state) => state.products);

   return (
      <div className={classes.root}>
         <Grid container spacing={3}>
            <Grid item xs>
               <Card className={classes.root1}>
                  <CardContent>
                     <Typography
                        variant="h4"
                        component="h2"
                        style={{ color: '#1a237e', marginBottom: '20px' }}
                     >
                        Total Customers
                     </Typography>
                     <Typography
                        variant="h4"
                        component="h2"
                        style={{ color: '#1a237e' }}
                     >
                        {customers.length}
                     </Typography>
                  </CardContent>
                  <CardActions>
                     <Button size="small" style={{ color: '#1a237e' }}>
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
                        style={{ color: '#1a237e', marginBottom: '20px' }}
                     >
                        Total Products
                     </Typography>
                     <Typography
                        variant="h4"
                        component="h2"
                        style={{ color: '#1a237e' }}
                     >
                        {products.length}
                     </Typography>
                  </CardContent>
                  <CardActions>
                     <Button size="small" style={{ color: '#1a237e' }}>
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
                        style={{ color: '#1a237e', marginBottom: '20px' }}
                     >
                        Total Bills
                     </Typography>
                     <Typography
                        variant="h4"
                        component="h2"
                        style={{ color: '#1a237e' }}
                     >
                        5
                     </Typography>
                  </CardContent>
                  <CardActions>
                     <Button size="small" style={{ color: '#1a237e' }}>
                        Learn More
                     </Button>
                  </CardActions>
               </Card>
            </Grid>
         </Grid>
      </div>
   );
}
