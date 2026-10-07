import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { addCustomer, editCustomer } from '../../../Redux/Actions/customersAction';

const useStyles = makeStyles(() => ({
    root: {
        width: 'min(460px, 100%)',
        margin: '0 auto',
        '& > * + *': {
            marginTop: '20px',
        },
    },
}));

const CustomerForm = (props) => {
    const classes = useStyles();
    const { editData, setOpenPopup } = props;
    const { _id, name, email, mobile } = editData ? editData : {};
    const dispatch = useDispatch();

    const initialValues = {
        name: name ? name : '',
        email: email ? email : '',
        mobile: mobile ? mobile : '',
    };

    const onSubmit = (values) => {
        if (_id) {
            dispatch(editCustomer(values, _id));
        } else {
            dispatch(addCustomer(values));
        }
        setOpenPopup(false);
    };

    const validationSchema = yup.object({
        name: yup.string().min(3, 'Use at least 3 characters').required('Name is required'),
        email: yup.string().email('Enter a valid email').required('Email is required'),
        mobile: yup
            .string()
            .matches(/^[0-9]{10,15}$/, 'Enter a valid phone number')
            .required('Phone number is required'),
    });

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
    });

    return (
        <div className='modal-form'>
            <Typography variant="h4" color="primary" gutterBottom style={{ marginBottom: '30px' }}>
                {_id ? 'Edit customer' : 'Add customer'}
            </Typography>
            <form className={classes.root} onSubmit={formik.handleSubmit}>
                <div>
                    <TextField
                        id="name"
                        label="Name"
                        type="text"
                        name="name"
                        placeholder="Enter Customer Name"
                        size="small"
                        variant="outlined"
                        fullWidth
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name ? <div className='field-error'>{formik.errors.name}</div> : null}
                </div>
                <div>
                    <TextField
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="enter your email"
                        size="small"
                        variant="outlined"
                        fullWidth
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? <div className='field-error'>{formik.errors.email}</div> : null}
                </div>
                <div>
                    <TextField
                        id="mobile"
                        label="Phone number"
                        type="tel"
                        name="mobile"
                        placeholder="enter mobile Number"
                        size="small"
                        variant="outlined"
                        fullWidth
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.mobile}
                    />
                    {formik.touched.mobile && formik.errors.mobile ? (
                        <div className='field-error'>{formik.errors.mobile}</div>
                    ) : null}
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={{
                            width: '100%',
                            marginTop: '10px',
                            marginBottom: '30px',
                        }}
                    >
                        {_id ? 'Save changes' : 'Add customer'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CustomerForm;
