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

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        maxHeight: 440,
    },
    table: {
        width: '100%',
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

const ShowBills = ({ CustomerNames, billDetails }) => {
    const classes = useStyles();
    const products = useSelector((state) => state.products);

    const pdfExportComponent = React.useRef(null);

    const exportPDFWithComponent = () => {
        if (pdfExportComponent.current) {
            pdfExportComponent.current.save();
        }
    };

    const findProduct = (id) => {
        const productNames = products.find((product) => product._id === id);
        return productNames ? productNames.name : '';
    };

    return (
        <>
            <div>
                <PDFExport ref={pdfExportComponent} paperSize="A4" margin="2cm">
                    <Typography
                        variant="h5"
                        color="primary"
                        gutterBottom
                        style={{ textTransform: 'capitalize', textAlign: 'center' }}
                    >
                        Product Details of - {CustomerNames}
                    </Typography>
                    <TableContainer className={classes.container}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Names</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>SubTotal</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {billDetails.lineItems.map((item) => {
                                    return (
                                        <TableRow key={item._id} hover>
                                            <TableCell>{findProduct(item.product)}</TableCell>
                                            <TableCell>{item.price}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
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
        </>
    );
};

export default ShowBills;
