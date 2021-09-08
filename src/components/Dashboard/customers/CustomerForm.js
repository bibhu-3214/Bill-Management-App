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
        width: '100%',
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
        name: yup.string().min(5, 'name should be of minimum 6 characters length').required('Required'),
        email: yup.string().email('Invalid Format').required('Required'),
        mobile: yup
            .string()
            .min(10, 'Password should be of minimum 8 characters length')
            .required('Required'),
    });

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
    });

    return (
        <div style={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary" gutterBottom style={{ marginBottom: '30px' }}>
                {_id ? 'Edit Customer' : 'Add Customers'}
            </Typography>
            <form className={classes.root} onSubmit={formik.handleSubmit}>
                <div>
                    <TextField
                        required
                        id="name"
                        label="Name"
                        type="text"
                        name="name"
                        placeholder="Enter Customer Name"
                        size="small"
                        variant="outlined"
                        style={{ width: '80%' }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name ? <div> {formik.errors.name} </div> : null}
                </div>
                <div>
                    <TextField
                        required
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="enter your email"
                        size="small"
                        variant="outlined"
                        style={{ width: '80%' }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? <div> {formik.errors.email} </div> : null}
                </div>
                <div>
                    <TextField
                        required
                        id="mobile"
                        label="mobile"
                        type="text"
                        name="mobile"
                        placeholder="enter mobile Number"
                        size="small"
                        variant="outlined"
                        style={{ width: '80%' }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.mobile}
                    />
                    {formik.touched.mobile && formik.errors.mobile ? (
                        <div> {formik.errors.mobile} </div>
                    ) : null}
                </div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        style={{
                            width: '80%',
                            marginTop: '10px',
                            marginBottom: '30px',
                        }}
                    >
                        ADD
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CustomerForm;
