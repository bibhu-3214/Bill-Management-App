import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
   getCustomers,
   removeCustomer,
} from '../../../Redux/Actions/customersAction';
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
import Popup from '../../Popup';
import ActionButton from '../../controls/ActionButton';
import CustomerForm from './CustomerForm';

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

const CustomerList = ({ searchResult }) => {
   const [openPopup, setOpenPopup] = useState(false);
   const classes = useStyles();
   const classes1 = useStyles1();
   const dispatch = useDispatch();
   const [editData, setEditData] = useState({});
   const [toggle, setToggle] = useState(false);
   const [confirmDialog, setConfirmDialog] = useState({
      isOpen: false,
      title: '',
      subTitle: '',
   });
   const customers = useSelector((state) => state.customers);

   const handleToggle = () => {
      setToggle(!toggle);
      setOpenPopup(true);
   };

   const handleRemove = (_id) => {
      setConfirmDialog({
         ...confirmDialog,
         isOpen: false,
      });
      dispatch(removeCustomer(_id));
   };

   const handleEdit = (data) => {
      setEditData(data);
      handleToggle();
   };

   // useEffect(() => {
   //    dispatch(getCustomers());
   // }, [dispatch]);

   return (
      <>
         {customers.length === 0 ? (
            <h4>No Customer found...</h4>
         ) : (
            <>
               <TableContainer className={classes.container}>
                  <Table className={classes1.table}>
                     <TableHead>
                        <TableRow>
                           <TableCell>CUSTOMER NAME</TableCell>
                           <TableCell>EMAIL</TableCell>
                           <TableCell>CONTACT</TableCell>
                           <TableCell>ACTIONS</TableCell>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {searchResult.map((customer) => (
                           <TableRow key={customer._id} hover tabIndex={-1}>
                              <TableCell
                                 style={{ textTransform: 'capitalize' }}
                              >
                                 {customer.name}
                              </TableCell>
                              <TableCell>{customer.email}</TableCell>
                              <TableCell>{customer.mobile}</TableCell>
                              <TableCell style={{ display: 'flex' }}>
                                 <ActionButton
                                    aria-label="edit"
                                    color="primary"
                                    onClick={() => handleEdit(customer)}
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
                                             handleRemove(customer._id);
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
               {Object.keys(editData).length > 0 && toggle ? (
                  <Popup openPopup={openPopup} setOpenPopup={setOpenPopup}>
                     <CustomerForm
                        editData={editData}
                        handleToggle={handleToggle}
                        setOpenPopup={setOpenPopup}
                     />
                  </Popup>
               ) : null}
               <ConfirmDialog
                  confirmDialog={confirmDialog}
                  setConfirmDialog={setConfirmDialog}
               />
            </>
         )}
      </>
   );
};

export default CustomerList;
