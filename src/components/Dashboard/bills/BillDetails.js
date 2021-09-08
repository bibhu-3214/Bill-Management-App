import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@material-ui/core';
import { useSelector } from 'react-redux';

const ShowBillDetails = ({ CustomerNames }) => {
    const { billDetails } = useSelector((state) => state.bills);
    const products = useSelector((state) => state.products);

    const productName = (id) => {
        const productName = products.find((product) => product._id === id);
        return productName ? productName.name : '';
    };

    return (
        <div>
            <Typography>{CustomerNames}</Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Products</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>SubTotal</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {billDetails.lineItems.map((lineitem) => {
                            return (
                                <TableRow key={lineitem._id} hover>
                                    <TableCell>{productName(lineitem.product)}</TableCell>
                                    <TableCell>{lineitem.quantity}</TableCell>
                                    <TableCell>{lineitem.price}</TableCell>
                                    <TableCell>{lineitem.subTotal}</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ShowBillDetails;
