import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CustomerList from './CustomerList';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { InputAdornment, Paper, Toolbar } from '@material-ui/core';
import Popup from '../../Popup';
import AddCustomer from './AddCustomer';
import { useSelector } from 'react-redux';
import Input from '../../controls/Input';
import Search from '@material-ui/icons/Search';

const useStyles = makeStyles((theme) => ({
   pageContent: {
      width: '100%',
      margin: theme.spacing(5),
      padding: theme.spacing(3),
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

   const handleSearch = (e) => {
      setSearchInput(e.target.value);
   };

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
                     onChange={handleSearch}
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
               <CustomerList searchResult={searchResult} />
            </div>
         </Paper>
         <Popup
            title="Customer Form"
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
         >
            <AddCustomer setOpenPopup={setOpenPopup} />
         </Popup>
      </div>
   );
}
