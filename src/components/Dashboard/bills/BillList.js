import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import TableContainer from '@material-ui/core/TableContainer';
import ConfirmDialog from './ConfirmDialog';
import ActionButton from '../../controls/ActionButton';
import { removeBill } from '../../../Redux/Actions/billAction';
import { Typography } from '@material-ui/core';

const useStyles1 = makeStyles((theme) => ({
   table: {
      width: '100%',
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

const BillList = () => {
   const classes = useStyles();
   const classes1 = useStyles1();
   const dispatch = useDispatch();
   const [confirmDialog, setConfirmDialog] = useState({
      isOpen: false,
      title: '',
      subTitle: '',
   });
   const bills = useSelector((state) => state.bills);

   const handleRemove = (_id) => {
      setConfirmDialog({
         ...confirmDialog,
         isOpen: false,
      });
      dispatch(removeBill(_id));
   };

   return (
      <>
         <TableContainer className={classes.container}>
            <Table className={classes1.table}>
               <TableHead>
                  <TableRow>
                     <TableCell>NAME</TableCell>
                     <TableCell>PRODUCT</TableCell>
                     <TableCell>QUANTITY</TableCell>
                     <TableCell>PRICE</TableCell>
                     <TableCell>SUBTOTAL</TableCell>
                     <TableCell>ACTION</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {bills.map((bill, _id) => (
                     <TableRow key={_id} hover>
                        <TableCell>{bill.customer}</TableCell>
                        <TableCell>
                           {bill.lineItems.map((item) => item.product)}
                        </TableCell>
                        <TableCell>
                           {bill.lineItems.map((item) => item.quantity)}
                        </TableCell>
                        <TableCell>
                           {bill.lineItems.map((item) => item.price)}
                        </TableCell>
                        <TableCell>
                           {bill.lineItems.map((item) => item.subTotal)}
                        </TableCell>
                        <TableCell style={{ display: 'flex' }}>
                           <ActionButton
                              aria-label="delete"
                              color="secondary"
                              onClick={() => {
                                 setConfirmDialog({
                                    isOpen: true,
                                    title: 'Are you sure to delete this record?',
                                    onConfirm: () => {
                                       handleRemove(bill._id);
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

         <div
            style={{
               display: 'flex',
               justifyContent: 'flex-end',
               margin: '10px',
            }}
         >
            <Typography>Total - </Typography>
            <Typography>{bills.map((item) => item.total)}</Typography>
         </div>
         <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
         />
      </>
   );
};

export default BillList;
