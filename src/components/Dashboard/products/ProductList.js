import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeProducts } from '../../../Redux/Actions/productAction';
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
import ProductForm from './ProductForm';
import LocalMallRoundedIcon from '@material-ui/icons/LocalMallRounded';

const useStyles1 = makeStyles((theme) => ({
    table: {
        marginTop: theme.spacing(3),
        '& thead th': {
            fontWeight: '600',
            color: '#65708a',
            backgroundColor: '#f7f8fc',
        },
        '& tbody td': {
            fontWeight: '500',
        },
        '& tbody tr:hover': {
            backgroundColor: '#f8f9ff',
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

const ProductList = ({ searchResult }) => {
    const classes = useStyles();
    const classes1 = useStyles1();
    const dispatch = useDispatch();
    const [openPopup, setOpenPopup] = useState(false);
    const [editData, setEditData] = useState({});
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
        dispatch(removeProducts(_id));
    };

    const handleEdit = (data) => {
        setEditData(data);
        handleToggle();
    };

    return (
        <>
            <TableContainer className={classes.container}>
                <Table className={classes1.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>PRODUCT NAME</TableCell>
                            <TableCell>PRICE</TableCell>
                            <TableCell>STATUS</TableCell>
                            <TableCell align='right'>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {searchResult.map(product => (
                            <TableRow key={product._id} hover>
                                <TableCell>
                                    <div className='entity-cell'>
                                        <span className='entity-avatar product-avatar'><LocalMallRoundedIcon /></span>
                                        <div><strong>{product.name}</strong><span>Catalog item</span></div>
                                    </div>
                                </TableCell>
                                <TableCell><span className='price-value'>₹{Number(product.price).toLocaleString('en-IN')}</span></TableCell>
                                <TableCell><span className='status-pill'><i /> Active</span></TableCell>
                                <TableCell align='right'>
                                    <div className='table-actions'>
                                    <ActionButton
                                        aria-label={`Edit ${product.name}`}
                                        color="primary"
                                        onClick={() => handleEdit(product)}
                                    >
                                        <EditTwoToneIcon />
                                    </ActionButton>
                                    <ActionButton
                                        aria-label={`Delete ${product.name}`}
                                        color="secondary"
                                        onClick={() => {
                                            setConfirmDialog({
                                                isOpen: true,
                                                title: 'Are you sure to delete this record?',
                                                subTitle: 'This Record is being Used in Bill',
                                                onConfirm: () => {
                                                    handleRemove(product._id);
                                                },
                                            });
                                        }}
                                    >
                                        <DeleteIcon />
                                    </ActionButton>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {Object.keys(editData).length > 0 && toggle ? (
                <Popup openPopup={openPopup} setOpenPopup={setOpenPopup}>
                    <ProductForm editData={editData} setOpenPopup={setOpenPopup} />
                </Popup>
            ) : null}
            <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </>
    );
};

export default ProductList;
