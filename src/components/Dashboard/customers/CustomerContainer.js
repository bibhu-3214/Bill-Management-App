import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CustomerList from './CustomerList';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { InputAdornment, Paper, Toolbar, Typography } from '@material-ui/core';
import Popup from '../../Popup';
import { useSelector } from 'react-redux';
import Input from '../../controls/Input';
import Search from '@material-ui/icons/Search';
import CustomerForm from './CustomerForm';

const useStyles = makeStyles((theme) => ({
   pageContent: {
      width: '100%',
      margin: theme.spacing(5),
      padding: theme.spacing(3),
      boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
   },
   searchInput: {
      width: '80%',
   },
   Button: {
      position: 'absolute',
      right: '10px',
   },
}));

export default function CustomerContainer() {
   const classes = useStyles();
   const [openPopup, setOpenPopup] = useState(false);
   const [searchInput, setSearchInput] = useState('');
   const [searchResult, setSearchResult] = useState([]);
   const customers = useSelector((state) => state.customers);

   useEffect(() => {
      const results = customers.filter((customer) =>
         customer.name.toLowerCase().includes(searchInput),
      );
      setSearchResult(results);
   }, [customers, searchInput]);

   return (
      <div style={{ display: 'flex', width: '60%', margin: 'auto' }}>
         <Paper
            className={classes.pageContent}
            style={{ display: 'flex', flexDirection: 'column' }}
         >
            <div>
               <Toolbar>
                  <Input
                     label="Search customers"
                     className={classes.searchInput}
                     value={searchInput}
                     InputProps={{
                        startAdornment: (
                           <InputAdornment position="start">
                              <Search />
                           </InputAdornment>
                        ),
                     }}
                     onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <Button
                     variant="contained"
                     color="primary"
                     startIcon={<AddIcon />}
                     className={classes.Button}
                     style={{
                        float: 'right',
                        marginBottom: '10px',
                     }}
                     onClick={() => {
                        setOpenPopup(true);
                     }}
                  >
                     Add
                  </Button>
               </Toolbar>
            </div>
            <div>
               {customers.length > 0 ? (
                  <CustomerList searchResult={searchResult} />
               ) : (
                  <Typography
                     variant="h5"
                     color="textSecondary"
                     gutterBottom
                     style={{ textAlign: 'center', margin: '30px' }}
                  >
                     Add a customer ...
                  </Typography>
               )}
            </div>
         </Paper>
         <Popup
            title="Customer Form"
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
         >
            <CustomerForm setOpenPopup={setOpenPopup} />
         </Popup>
      </div>
   );
}
