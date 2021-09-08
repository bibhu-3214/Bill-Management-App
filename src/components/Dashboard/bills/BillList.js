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
import { getBillById, removeBill } from '../../../Redux/Actions/billAction';
import { IconButton } from '@material-ui/core';
import VisibilityTwoToneIcon from '@material-ui/icons/VisibilityTwoTone';
import Popup from '../../Popup';
import BillDetails from './BillDetails';

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
    const [openPopup, setOpenPopup] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        subTitle: '',
    });
    const customers = useSelector((state) => state.customers);
    const { bills } = useSelector((state) => {
        return state.bills;
    });

    const CustomerNames = (id) => {
        const result = customers.find((cust) => cust._id === id);
        return result ? result.name : '';
    };

    const handleRemove = (_id) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false,
        });
        dispatch(removeBill(_id));
    };
    const popUpShow = () => setOpenPopup(true);

    const showBillDetails = (_id) => {
        dispatch(getBillById(_id));
        popUpShow();
    };

    return (
        <>
            <TableContainer className={classes.container}>
                <Table className={classes1.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>CUSTOMER NAME</TableCell>
                            <TableCell>TOTAL AMOUNT</TableCell>
                            <TableCell>DETAILS</TableCell>
                            <TableCell>DELETE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {customers.length > 0 &&
                            bills.map((bill) => (
                                <TableRow key={bill._id} hover>
                                    <TableCell>{CustomerNames(bill.customer)}</TableCell>
                                    <TableCell>{bill.total}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => showBillDetails(bill._id)}>
                                            <VisibilityTwoToneIcon />
                                        </IconButton>
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
            <Popup title="Bill Details" openPopup={openPopup} setOpenPopup={setOpenPopup}>
                {bills.map((bill, _id) => (
                    <BillDetails key={_id} CustomerNames={CustomerNames(bill.customer)} />
                ))}
            </Popup>
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
};

export default BillList;
