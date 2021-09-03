import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ProductList from './ProductList';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Popup from './Popup';
import AddProduct from './AddProduct';

const useStyles = makeStyles((theme) => ({
   pageContent: {
      width: '100%',
      margin: theme.spacing(5),
      padding: theme.spacing(3),
   },
}));

export default function ProductContainer() {
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
               <ProductList />
            </div>
         </Paper>
         <Popup
            title="Product Form"
            openPopup={openPopup}
            setOpenPopup={setOpenPopup}
         >
            <AddProduct setOpenPopup={setOpenPopup} />
         </Popup>
      </div>
   );
}
