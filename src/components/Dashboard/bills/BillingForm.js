import 'date-fns';
import { Button, makeStyles, Typography } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { addBill } from '../../../Redux/Actions/billAction';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import CartDetails from './CartDetails';
import { useHistory } from 'react-router';

const useStyles = makeStyles(theme => ({
    root: {
        minWidth: 620,
    },
    paper: {
        display: 'flex',
        padding: theme.spacing(3),
        color: theme.palette.text.secondary,
    },
}));

const BillingForm = ({ setOpenPopup }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const customers = useSelector(state => state.customers);
    const products = useSelector(state => state.products);
    const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
    const [customer, setCustomer] = useState('');
    const [product, setProduct] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [quantity] = useState(1);

    let history = useHistory();

    const customerLabels = customers.map(customer => {
        return { value: customer._id, label: customer.name };
    });

    const productLabels = products.map(product => {
        return { value: product._id, label: product.name };
    });

    const handleDateChange = date => {
        setDate(date);
    };
    const handleCustomerChange = data => {
        setCustomer(data);
    };
    const handleProductChange = product => {
        setProduct(product);
    };

    const productAmount = id => {
        const productAmountDetails = products.find(product => product._id === id);
        return productAmountDetails.price;
    };

    const handleCart = e => {
        e.preventDefault();
        const findExistProduct = cartItems.find(item => item.id === product.value);
        if (findExistProduct) {
            const setModifiedData = cartItems.map(item => {
                if (item.id === product.value) {
                    return {
                        ...item,
                        quantity: item.quantity + 1,
                        subtotal: productAmount(product.value) + item.subtotal,
                    };
                } else {
                    return { ...item };
                }
            });
            setCartItems(setModifiedData);
        } else {
            const setDefaultData = {
                id: product.value,
                name: product.label,
                quantity: quantity,
                subtotal: productAmount(product.value) * quantity,
            };
            setCartItems([setDefaultData, ...cartItems]);
        }
        setProduct('');
    };

    const handleQuantity = (id, count) => {
        const cartValues = cartItems.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    quantity: item.quantity + count,
                    subTotal: (item.quantity + count) * productAmount(id),
                };
            } else {
                return { ...item };
            }
        });
        setCartItems(cartValues);
    };

    const removeCartItem = id => {
        const removedItems = cartItems.filter(item => item.id !== id);
        setCartItems(removedItems);
    };
    const redirectToShowBills = id => history.push(`/billdetails/${id}`);
    const handleSubmit = e => {
        e.preventDefault();
        const lineItems = cartItems.map(cartItem => {
            return { product: cartItem.id, quantity: cartItem.quantity };
        });
        const formData = {
            date: date,
            customer: customer.value,
            lineItems: lineItems,
        };
        dispatch(addBill(formData, redirectToShowBills));
        setOpenPopup(false);
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <Paper style={{ flexDirection: 'column' }} className={classes.paper}>
                        <form onSubmit={handleSubmit}>
                            <Typography
                                variant='h4'
                                color='primary'
                                gutterBottom
                                style={{ textAlign: 'center', marginBottom: '10px' }}>
                                Add to Cart
                            </Typography>
                            <div style={{ marginBottom: '10px' }}>
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        autoOk
                                        disabled={cartItems.length > 0}
                                        inputVariant='outlined'
                                        size='small'
                                        format='MM/dd/yyyy'
                                        margin='normal'
                                        name='Add Date'
                                        value={date}
                                        onChange={handleDateChange}
                                        style={{ width: '100%' }}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                            <div style={{ marginBottom: '10px', width: '100%' }}>
                                <Select
                                    name='customer'
                                    value={customer}
                                    isDisabled={cartItems.length > 0}
                                    onChange={handleCustomerChange}
                                    options={customerLabels}
                                />
                            </div>
                            <div style={{ marginBottom: '10px', width: '100%' }}>
                                <Select
                                    name='product'
                                    value={product}
                                    onChange={handleProductChange}
                                    options={productLabels}
                                />
                            </div>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}>
                                <Button
                                    variant='outlined'
                                    color='primary'
                                    onClick={handleCart}
                                    disabled={!product}
                                    style={{ width: '100%', marginTop: '10px', marginBottom: '10px' }}>
                                    Add Products
                                </Button>
                            </div>
                            <div>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    type='submit'
                                    disabled={cartItems.length === 0}
                                    style={{ width: '100%' }}>
                                    GENERATE
                                </Button>
                            </div>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <CartDetails
                        cartItems={cartItems}
                        handleQuantity={handleQuantity}
                        removeCartItem={removeCartItem}
                    />
                </Grid>
            </Grid>
        </div>
    );
};

export default BillingForm;
