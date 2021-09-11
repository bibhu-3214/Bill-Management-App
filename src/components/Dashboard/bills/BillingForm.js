import 'date-fns';
import {
    Button,
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
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { addBill } from '../../../Redux/Actions/billAction';
import RemoveCircleRoundedIcon from '@material-ui/icons/RemoveCircleRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        display: 'flex',
        padding: theme.spacing(3),
        color: theme.palette.text.secondary,
    },
    table: {
        display: 'flex',
        width: '80%',
        '& thead th': {
            fontWeight: '600',
        },
        '& tbody td': {
            fontWeight: '400',
        },
    },
}));

const BillingForm = ({ setOpenPopup }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const customers = useSelector((state) => state.customers);
    const products = useSelector((state) => state.products);
    // const { bills, billDetails } = useSelector((state) => state.bills);
    const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
    const [customer, setCustomer] = useState('');
    const [product, setProduct] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [quantity] = useState(1);

    const customerOptions = customers.map((customer) => {
        return { value: customer._id, named: customer.name };
    });

    const productOptions = products.map((product) => {
        return { value: product._id, named: product.name };
    });

    const handleDateChange = (date) => {
        setDate(date);
    };
    const handleCustomerChange = (data) => {
        setCustomer(data);
    };
    const handleProductChange = (product) => {
        setProduct(product);
    };

    const handleCart = (e) => {
        e.preventDefault();
        const cartData = {
            id: product.value,
            name: product.named,
            quantity: quantity,
        };
        if (!cartItems.includes(product.named)) {
            setCartItems([cartData, ...cartItems]);
        }
        setProduct('');
    };

    const handleQuantity = (id, count) => {
        const cartValues = cartItems.map((item) => {
            if (item.id === id) {
                return { ...item, quantity: item.quantity + count };
            } else {
                return { ...item };
            }
        });
        setCartItems(cartValues);
    };

    const removeCartItem = (id) => {
        const removedItems = cartItems.filter((item) => item.id !== id);
        setCartItems(removedItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const lineItems = cartItems.map((cartItem) => {
            return { product: cartItem.id, quantity: cartItem.quantity };
        });
        const formData = {
            date: date,
            customer: customer.value,
            lineItems: lineItems,
        };
        dispatch(addBill(formData));
        setOpenPopup(false);
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Paper style={{ flexDirection: 'column' }} className={classes.paper}>
                        <form onSubmit={handleSubmit}>
                            <Typography
                                variant="h4"
                                color="primary"
                                gutterBottom
                                style={{ textAlign: 'center', marginBottom: '10px' }}
                            >
                                Add to Cart
                            </Typography>
                            <div style={{ marginBottom: '10px' }}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        required
                                        disableToolbar
                                        variant="inline"
                                        format="MM/dd/yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        named="Add Date"
                                        value={date}
                                        onChange={handleDateChange}
                                        style={{ width: '100%' }}
                                        KeyboardButtonProps={{
                                            'aria-named': 'change date',
                                        }}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                            <div style={{ marginBottom: '10px', width: '100%' }}>
                                <Select
                                    name="customer"
                                    value={customer}
                                    isDisabled={cartItems.length > 0}
                                    onChange={handleCustomerChange}
                                    options={customerOptions}
                                />
                            </div>
                            <div style={{ marginBottom: '10px', width: '100%' }}>
                                <Select
                                    name="product"
                                    value={product}
                                    onChange={handleProductChange}
                                    options={productOptions}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={handleCart}
                                    style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}
                                >
                                    Add Products
                                </Button>
                            </div>
                            <div>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    style={{ width: '100%' }}
                                >
                                    GENERATE
                                </Button>
                            </div>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
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
                </Grid>
            </Grid>
        </div>
    );
};

export default BillingForm;
