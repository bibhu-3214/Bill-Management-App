import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { InputAdornment, Toolbar, Typography } from '@material-ui/core';
import Popup from '../../Popup';
import { useSelector } from 'react-redux';
import Input from '../../controls/Input';
import Search from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import BillingForm from './BillingForm';
import BillList from './BillList';

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

export default function BillContainer() {
   const classes = useStyles();
   const [openPopup, setOpenPopup] = useState(false);
   const [searchInput, setSearchInput] = useState('');
   const bills = useSelector((state) => state.bills);

   return (
      <div style={{ display: 'flex', width: '70%', margin: 'auto' }}>
         <Paper
            className={classes.pageContent}
            style={{ display: 'flex', flexDirection: 'column' }}
         >
            <div>
               <Toolbar>
                  <Input
                     label="Search bill"
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
               {bills.length > 0 ? (
                  <BillList />
               ) : (
                  <Typography
                     variant="h5"
                     color="textSecondary"
                     gutterBottom
                     style={{ textAlign: 'center', margin: '30px' }}
                  >
                     Add a bill ...
                  </Typography>
               )}
            </div>
         </Paper>
         <Popup
            title="Bill Form"
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
         >
            <BillingForm setOpenPopup={setOpenPopup} />
         </Popup>
      </div>
   );
}
