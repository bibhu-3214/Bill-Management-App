import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CustomerList from './CustomerList';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Popup from './Popup';
import AddCustomer from './AddCustomer';

const useStyles = makeStyles((theme) => ({
   pageContent: {
      width: '100%',
      margin: theme.spacing(5),
      padding: theme.spacing(3),
   },
}));

export default function CustomerContainer() {
   const classes = useStyles();
   const [openPopup, setOpenPopup] = useState(false);

   return (
      <div style={{ display: 'flex', width: '60%', margin: 'auto' }}>
         <Paper
            className={classes.pageContent}
            style={{ display: 'flex', flexDirection: 'column' }}
         >
            <div>
               <SearchIcon />
               <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
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
            </div>
            <div>
               <CustomerList />
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
