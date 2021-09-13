import React from 'react';
import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Typography,
    Button,
} from '@material-ui/core';
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { PDFExport } from '@progress/kendo-react-pdf';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        maxHeight: 440,
    },
    table: {
        minWidth: 450,
        marginTop: theme.spacing(3),
        '& thead th': {
            fontWeight: '600',
            color: '#e8eaf6',
            backgroundColor: theme.palette.primary.light,
        },
        '& tbody td': {
            fontWeight: '400',
        },
        '& tbody tr:hover': {
            backgroundColor: '#fffbf2',
            cursor: 'pointer',
        },
    },
}));

const ShowBills = () => {
    const classes = useStyles();
    const products = useSelector((state) => state.products);
    const customers = useSelector((state) => state.customers);
    const { billDetails } = useSelector((state) => state.bills);
    const pdfExportComponent = React.useRef(null);

    const exportPDFWithComponent = () => {
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save();
        }
    };
    const findCustomer = (id) => {
        return customers.find((customer) => customer._id === id);
    };
    const findProduct = (id) => {
        return products.find((product) => product._id === id);
    };

    return (
        <React.Fragment>
            {Object.keys(billDetails).length > 0 && (
                <React.Fragment>
                    <div>
                        <PDFExport ref={pdfExportComponent} paperSize="A4" margin="2cm">
                            <div style={{ textTransform: 'capitalize' }}>
                                <Typography variant="h5" color="primary" gutterBottom>
                                    Customer Name - {findCustomer(billDetails.customer).name}
                                </Typography>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Date: {moment(billDetails.date).format('ll')}
                                </Typography>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    Contact Details: {findCustomer(billDetails.customer).mobile}
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
                                        {billDetails.lineItems.map((item) => {
                                            return (
                                                <TableRow key={item._id} hover>
                                                    <TableCell>{findProduct(item.product).name}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell>{item.price}</TableCell>
                                                    <TableCell>{item.subTotal}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Typography style={{ float: 'right', margin: '20px' }}>
                                Total - {billDetails.total}
                            </Typography>
                        </PDFExport>
                    </div>
                    <div>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<GetAppRoundedIcon />}
                            onClick={exportPDFWithComponent}
                            style={{ width: '100%', marginTop: '20px' }}
                        >
                            Download
                        </Button>
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
};

export default ShowBills;
