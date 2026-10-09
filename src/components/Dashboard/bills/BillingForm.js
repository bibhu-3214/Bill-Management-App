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
        width: 'min(820px, 82vw)',
    },
    paper: {
        display: 'flex',
        padding: theme.spacing(2.5),
        color: theme.palette.text.secondary,
        border: '1px solid #edf0f6',
        boxShadow: 'none',
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
        return productAmountDetails ? Number(productAmountDetails.price) : 0;
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
                quantity: 1,
                subtotal: productAmount(product.value),
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
                    subtotal: (item.quantity + count) * productAmount(id),
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
        if (!customer || cartItems.length === 0) return;

        const formData = {
            date,
            customer: customer.value,
            lineItems,
        };
        dispatch(addBill(formData, redirectToShowBills));
        setOpenPopup(false);
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper style={{ flexDirection: 'column' }} className={classes.paper}>
                        <form onSubmit={handleSubmit}>
                            <Typography
                                variant='h4'
                                color='primary'
                                gutterBottom
                                style={{ textAlign: 'center', marginBottom: '10px' }}>
                                Build invoice
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
                                        label='Invoice date'
                                        value={date}
                                        onChange={handleDateChange}
                                        style={{ width: '100%' }}
                                    />
                                </MuiPickersUtilsProvider>
                            </div>
                            <div style={{ marginBottom: '10px', width: '100%' }}>
                                <Select
                                    name='customer'
                                    aria-label='Select customer'
                                    value={customer}
                                    isDisabled={cartItems.length > 0}
                                    onChange={handleCustomerChange}
                                    options={customerLabels}
                                    placeholder='Select customer'
                                />
                            </div>
                            <div style={{ marginBottom: '10px', width: '100%' }}>
                                <Select
                                    name='product'
                                    aria-label='Select product'
                                    value={product}
                                    onChange={handleProductChange}
                                    options={productLabels}
                                    placeholder='Select product'
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
                                    Add product
                                </Button>
                            </div>
                            <div>
                                <Button
                                    variant='contained'
                                    color='primary'
                                    type='submit'
                                    disabled={!customer || cartItems.length === 0}
                                    style={{ width: '100%' }}>
                                    Generate invoice
                                </Button>
                            </div>
                        </form>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
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
