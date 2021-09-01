import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import AddCustomer from './AddCustomer';
import CustomerList from './CustomerList';

const useStyles = makeStyles(() => ({
   root: {
      flexGrow: 1,
   },
}));

export default function CenteredGrid() {
   const classes = useStyles();

   return (
      <Container style={{ marginTop: '50px' }}>
         <div className={classes.root}>
            <Grid container spacing={8}>
               <Grid item xs={6}>
                  <CustomerList />
               </Grid>
               <Grid item xs={6}>
                  <AddCustomer />
               </Grid>
            </Grid>
         </div>
      </Container>
   );
}
