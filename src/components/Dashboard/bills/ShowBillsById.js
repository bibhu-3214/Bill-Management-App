import React, { useEffect } from 'react';
import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    Button,
    Paper,
} from '@material-ui/core';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { PDFExport } from '@progress/kendo-react-pdf';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { getBillById } from '../../../Redux/Actions/billAction';

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        maxHeight: 440,
    },
    paper: {
        padding: theme.spacing(4),
        color: theme.palette.text.secondary,
        backgroundColor: '#fff',
        border: '1px solid #e7eaf1',
        boxShadow: '0 22px 60px rgba(31, 41, 68, 0.09)',
    },
    table: {
        minWidth: 450,
        marginTop: theme.spacing(3),
        '& thead th': {
            fontWeight: '600',
            color: '#65708a',
            backgroundColor: '#f7f8fc',
        },
        '& tbody td': {
            fontWeight: '400',
        },
        '& tbody tr:hover': {
            backgroundColor: '#f8f9ff',
            cursor: 'pointer',
        },
    },
}));

const ShowBillsById = props => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const products = useSelector(state => state.products);
    const customers = useSelector(state => state.customers);
    const { billDetails } = useSelector(state => state.bills);
    const pdfExportComponent = React.useRef(null);

    const billId = props.match.params.id;

    useEffect(() => {
        dispatch(getBillById(billId));
    }, [billId, dispatch]);

    const exportPDFWithComponent = () => {
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save();
        }
    };
    const findCustomer = id => {
        return customers.find(customer => customer._id === id);
    };
    const findProduct = id => {
        return products.find(product => product._id === id);
    };
    const customer = findCustomer(billDetails.customer);

    return (
        <section className='invoice-page page-enter'>
            <div className='workspace-heading'>
                <div><h1>Invoice details</h1><p>Review and export this customer invoice.</p></div>
            </div>
            <Paper className={classes.paper}>
                {Object.keys(billDetails).length > 0 && (
                    <React.Fragment>
                        <div>
                            <PDFExport ref={pdfExportComponent} paperSize='A4' margin='2cm'>
                                <div className='invoice-header'>
                                    <div className='invoice-brand'>Bill<span>Flow</span></div>
                                    <Typography variant='h5' gutterBottom>
                                        {customer ? customer.name : 'Customer unavailable'}
                                    </Typography>
                                    <Typography variant='body1' gutterBottom>
                                        Issued {moment(billDetails.date).format('ll')}
                                    </Typography>
                                    <Typography variant='body1' gutterBottom>
                                        {customer ? customer.mobile : 'Contact unavailable'}
                                    </Typography>
                                </div>
                                <TableContainer className={classes.container}>
                                    <Table className={classes.table}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Products</TableCell>
                                                <TableCell>Quantity</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell>SubTotal</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {billDetails.lineItems.map(item => {
                                                return (
                                                    <TableRow key={item._id} hover>
                                                        <TableCell>
                                                            {findProduct(item.product)?.name || 'Unavailable'}
                                                        </TableCell>
                                                        <TableCell>{item.quantity}</TableCell>
                                                        <TableCell>{item.price}</TableCell>
                                                        <TableCell>{item.subTotal}</TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <div className='invoice-total'><span>Total due</span><strong>₹{billDetails.total}</strong></div>
                            </PDFExport>
                        </div>
                        <div>
                            <Button
                                variant='contained'
                                color='primary'
                                startIcon={<GetAppRoundedIcon />}
                                onClick={exportPDFWithComponent}
                                style={{ width: '100%', marginTop: '20px' }}>
                                Download PDF
                            </Button>
                        </div>
                    </React.Fragment>
                )}
            </Paper>
        </section>
    );
};

export default ShowBillsById;
