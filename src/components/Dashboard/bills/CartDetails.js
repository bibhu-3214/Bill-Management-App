import {
    makeStyles,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveCircleRoundedIcon from '@material-ui/icons/RemoveCircleRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        width: '100%',
        padding: theme.spacing(3),
        color: theme.palette.text.secondary,
    },
    table: {
        display: 'flex',
        width: '100%',
        '& thead th': {
            fontWeight: '600',
        },
        '& tbody td': {
            fontWeight: '400',
        },
    },
}));

const CartDetails = (props) => {
    const { cartItems, handleQuantity, removeCartItem } = props;
    const classes = useStyles();

    return (
        <div>
            <Paper style={{ flexDirection: 'column' }} className={classes.paper}>
                <Typography variant="h5" color="primary" style={{ textAlign: 'center' }} gutterBottom>
                    Product Details
                </Typography>
                {cartItems.length > 0 && (
                    <Table style={{ flexDirection: 'column' }} className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell></TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell></TableCell>
                                <TableCell>Remove</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cartItems.map((item) => {
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell style={{ display: 'flex', flexDirection: 'row' }}>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleQuantity(item.id, -1)}
                                                disabled={item.quantity === 1}
                                            >
                                                <RemoveCircleRoundedIcon />
                                            </IconButton>
                                            <IconButton style={{ marginTop: '1px' }}>
                                                {item.quantity}
                                            </IconButton>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleQuantity(item.id, 1)}
                                            >
                                                <AddCircleRoundedIcon />
                                            </IconButton>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="secondary"
                                                onClick={() => removeCartItem(item.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </Paper>
        </div>
    );
};

export default CartDetails;
