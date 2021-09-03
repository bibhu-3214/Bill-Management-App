import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
   getProducts,
   removeProduct,
} from '../../../Redux/Actions/productAction';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditTwoToneIcon from '@material-ui/icons/EditTwoTone';
import DeleteIcon from '@material-ui/icons/Delete';
import TableContainer from '@material-ui/core/TableContainer';
import ConfirmDialog from './ConfirmDialog';
import Popup from './Popup';
import EditProduct from './EditProduct';
import ActionButton from '../../controls/ActionButton';

const useStyles1 = makeStyles((theme) => ({
   table: {
      marginTop: theme.spacing(3),
      '& thead th': {
         fontWeight: '600',
         color: '#e8eaf6',
         backgroundColor: theme.palette.primary.light,
      },
      '& tbody td': {
         fontWeight: '300',
      },
      '& tbody tr:hover': {
         backgroundColor: '#fffbf2',
         cursor: 'pointer',
      },
   },
}));

const useStyles = makeStyles({
   container: {
      width: '100%',
      maxHeight: 440,
   },
});

const ProductList = () => {
   const [openPopup, setOpenPopup] = useState(false);
   const classes = useStyles();
   const classes1 = useStyles1();
   const products = useSelector((state) => state.products);
   const dispatch = useDispatch();
   const [toggle, setToggle] = useState(false);
   const [confirmDialog, setConfirmDialog] = useState({
      isOpen: false,
      title: '',
      subTitle: '',
   });

   const handleToggle = () => {
      setToggle(!toggle);
      setOpenPopup(true);
   };

   const handleRemove = (_id) => {
      setConfirmDialog({
         ...confirmDialog,
         isOpen: false,
      });
      dispatch(removeProduct(_id));
   };

   useEffect(() => {
      dispatch(getProducts());
   }, [dispatch]);

   return (
      <>
         {products.length === 0 ? (
            <h4 className="display-5">No Product found...</h4>
         ) : (
            <>
               <TableContainer className={classes.container}>
                  <Table className={classes1.table}>
                     <TableHead>
                        <TableRow>
                           <TableCell>PRODUCT NAME</TableCell>
                           <TableCell>PRICE</TableCell>
                           <TableCell>ACTIONS</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {products.map((Product) => (
                           <TableRow key={Product._id} hover tabIndex={-1}>
                              <TableCell
                                 style={{ textTransform: 'capitalize' }}
                              >
                                 {Product.name}
                              </TableCell>
                              <TableCell>{Product.price}</TableCell>
                              <TableCell style={{ display: 'flex' }}>
                                 <ActionButton
                                    aria-label="edit"
                                    color="primary"
                                    onClick={handleToggle}
                                 >
                                    <EditTwoToneIcon />
                                 </ActionButton>
                                 <ActionButton
                                    aria-label="delete"
                                    color="secondary"
                                    onClick={() => {
                                       setConfirmDialog({
                                          isOpen: true,
                                          title: 'Are you sure to delete this record?',
                                          onConfirm: () => {
                                             handleRemove(Product._id);
                                          },
                                       });
                                    }}
                                 >
                                    <DeleteIcon />
                                 </ActionButton>
                              </TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </TableContainer>

               {toggle && (
                  <Popup openPopup={openPopup} setOpenPopup={setOpenPopup}>
                     {products.map((Product, _id) => {
                        return (
                           <EditProduct
                              key={_id}
                              id={Product._id}
                              name={Product.name}
                              price={Product.price}
                              handleToggle={handleToggle}
                              setOpenPopup={setOpenPopup}
                           />
                        );
                     })}
                  </Popup>
               )}
               <ConfirmDialog
                  confirmDialog={confirmDialog}
                  setConfirmDialog={setConfirmDialog}
               />
            </>
         )}
      </>
   );
};

export default ProductList;
