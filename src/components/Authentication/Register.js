import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { register } from '../../Redux/Actions/usersAction';
import Grid from '@material-ui/core/Grid';
import logo from '../../istockphoto-1272823665-1024x1024.jpg';
import { useFormik } from 'formik';
import * as yup from 'yup';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(3),
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 100,
        },
    },
}));

export default function Registration(props) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const initialValues = {
        username: '',
        email: '',
        password: '',
        businessName: '',
        address: '',
    };

    const onSubmit = (values) => {
        const redirectToLogin = () => {
            props.history.push('/login');
        };
        dispatch(register(values, redirectToLogin));
    };

    const validationSchema = yup.object({
        username: yup
            .string()
            .min(5, 'Username should be of minimum 6 characters length')
            .required('Required'),
        email: yup.string().email('Invalid Format').required('Required'),
        password: yup
            .string()
            .min(8, 'Password should be of minimum 8 characters length')
            .required('Required'),
        businessName: yup.string().required('Required'),
        address: yup.string().required('Required'),
    });

    const formik = useFormik({
        initialValues,
        onSubmit,
        validationSchema,
    });

    return (
        <div className={classes.root} style={{ backgroundColor: '#FFFFFF' }}>
            <Grid container spacing={3}>
                <Grid item xs={6}>
                    <img
                        src={logo}
                        alt="bill"
                        style={{
                            display: 'block',
                            marginTop: '30px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: '100%',
                        }}
                    />
                </Grid>
                <Grid
                    item
                    xs={6}
                    style={{
                        textAlign: 'center',
                        marginTop: '20px',
                    }}
                >
                    <Typography variant="h4" color="primary" gutterBottom style={{ marginBottom: '20px' }}>
                        Register Here
                    </Typography>
                    <form className={classes.root} onSubmit={formik.handleSubmit}>
                        <div>
                            <TextField
                                style={{ width: '50%', marginBottom: '10px' }}
                                required
                                label="username"
                                variant="outlined"
                                id="username"
                                type="text"
                                name="username"
                                size="small"
                                placeholder="enter your name"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.username}
                            />
                            {formik.touched.username && formik.errors.username ? (
                                <div> {formik.errors.username} </div>
                            ) : null}
                        </div>
                        <div>
                            <TextField
                                style={{ width: '50%', marginBottom: '10px' }}
                                required
                                label="Email"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="enter your email"
                                size="small"
                                variant="outlined"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.email}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <div> {formik.errors.email} </div>
                            ) : null}
                        </div>
                        <div>
                            <TextField
                                style={{ width: '50%', marginBottom: '10px' }}
                                required
                                label="password"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="enter your password"
                                size="small"
                                variant="outlined"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                            {formik.touched.password && formik.errors.password ? (
                                <div> {formik.errors.password} </div>
                            ) : null}
                        </div>
                        <div>
                            <TextField
                                style={{ width: '50%', marginBottom: '10px' }}
                                required
                                label="BusinessName"
                                id="businessName"
                                type="text"
                                name="businessName"
                                placeholder="enter your BusinessName"
                                size="small"
                                variant="outlined"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.businessName}
                            />
                            {formik.touched.businessName && formik.errors.businessName ? (
                                <div> {formik.errors.businessName} </div>
                            ) : null}
                        </div>
                        <div>
                            <TextField
                                style={{ width: '50%' }}
                                required
                                label="Address"
                                type="text"
                                name="address"
                                placeholder="enter your address"
                                size="small"
                                multiline
                                rows={3}
                                variant="outlined"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.address}
                            />
                            {formik.touched.address && formik.errors.address ? (
                                <div> {formik.errors.address} </div>
                            ) : null}
                        </div>
                        <div>
                            <Button
                                style={{
                                    width: '50%',
                                    marginTop: '20px',
                                    marginBottom: '50px',
                                }}
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                REGISTER
                            </Button>
                        </div>
                    </form>
                </Grid>
            </Grid>
        </div>
    );
}
