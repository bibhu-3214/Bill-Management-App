import 'date-fns';
import { Button, makeStyles, Typography, IconButton } from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { addBill } from '../../../Redux/Actions/billAction';
import RemoveCircleRoundedIcon from '@material-ui/icons/RemoveCircleRounded';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import { useSelector } from 'react-redux';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: '20px',
        },
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

const BillingForm = ({ setOpenPopup }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const customers = useSelector((state) => state.customers);
    const products = useSelector((state) => state.products);
    const [startDate, setStartDate] = useState(new Date().toISOString().substr(0, 10));
    const [customer, setCustomer] = useState('');
    const [product, setProduct] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [quantity, setQuantity] = useState(1);

    const customerOptions = customers.map((customer) => {
        return { value: customer._id, label: customer.name };
    });
    const productOptions = products.map((product) => {
        return { value: product._id, label: product.name };
    });

    const handleChange = (date) => {
        setStartDate(date);
    };
    const handleCustomerChange = (data) => {
        setCustomer(data);
    };
    const handleProductChange = (product) => {
        setProduct(product);
    };

    const addToCart = (e) => {
        e.preventDefault();
        const newCartItem = {
            id: product.value,
            name: product.label,
            quantity: quantity,
        };
        setCartItems([newCartItem, ...cartItems]);
        setProduct('');
    };

    const handleQuantity = (id, count) => {
        const newCartResult = cartItems.map((cartItem) => {
            if (cartItem.id === id) {
                return { ...cartItem, quantity: cartItem.quantity + count };
            } else {
                return { ...cartItem };
            }
        });
        setCartItems(newCartResult);
    };

    const removeItemFromCart = (id) => {
        const cartResult = cartItems.filter((item) => item.id !== id);
        setCartItems(cartResult);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const lineItems = cartItems.map((cartItem) => {
            return { product: cartItem.id, quantity: cartItem.quantity };
        });
        const formData = {
            date: startDate,
            customer: customer.value,
            lineItems: lineItems,
        };
        dispatch(addBill(formData));
        setOpenPopup(false);
    };

    return (
        <div style={{ marginBottom: '30px' }}>
            <form className={classes.root} onSubmit={handleSubmit}>
                <Typography
                    variant="h4"
                    color="primary"
                    gutterBottom
                    style={{ textAlign: 'center', marginBottom: '30px' }}
                >
                    Add to Cart
                </Typography>
                <div>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inlined"
                            format="MM/dd/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label="Add Date"
                            value={startDate}
                            onChange={handleChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </MuiPickersUtilsProvider>
                </div>
                <div>
                    <Select
                        name="customer"
                        value={customer}
                        onChange={handleCustomerChange}
                        options={customerOptions}
                    />
                </div>
                <div>
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
                        variant="contained"
                        color="primary"
                        onClick={addToCart}
                        style={{ margin: '10px' }}
                    >
                        Add
                    </Button>
                </div>
                <div>
                    <Button variant="contained" color="primary" type="submit" style={{ width: '100%' }}>
                        GENERATE
                    </Button>
                </div>
            </form>
            <div>
                {cartItems.length > 0 && (
                    <table className="table table-borderless">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleQuantity(item.id, -1)}
                                                disabled={item.quantity === 1}
                                            >
                                                <RemoveCircleRoundedIcon />
                                            </IconButton>
                                            {item.quantity}
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleQuantity(item.id, 1)}
                                            >
                                                <AddCircleRoundedIcon />
                                            </IconButton>
                                        </td>
                                        <td>
                                            <Button onClick={() => removeItemFromCart(item.id)}>
                                                Remove
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default BillingForm;
