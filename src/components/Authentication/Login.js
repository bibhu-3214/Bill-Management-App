import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { login } from '../../Redux/Actions/usersAction';
import { Grid } from '@material-ui/core';
import logo from '../../img-login.svg';
import { useFormik } from 'formik';
import * as yup from 'yup';

const useStyles = makeStyles((theme) => ({
   root: {
      width: '100%',
      '& > * + *': {
         marginTop: theme.spacing(2),
      },
   },
   paper: {
      display: 'flex',
      width: '50%',
      margin: theme.spacing(5),
      padding: theme.spacing(3),
   },
}));

export default function Login(props) {
   const classes = useStyles();
   const dispatch = useDispatch();

   const initialValues = {
      email: 'bibhu098@gmail.com',
      password: 'bibhu1920',
   };

   const onSubmit = (values) => {
      const redirectToAdmin = () => {
         props.history.push('/admin');
      };
      dispatch(login(values, redirectToAdmin));
   };

   const validationSchema = yup.object({
      email: yup.string().email('Invalid Format').required('Required'),
      password: yup
         .string()
         .min(8, 'Password should be of minimum 8 characters length')
         .required('Required'),
   });

   const formik = useFormik({
      initialValues,
      onSubmit,
      validationSchema,
   });

   return (
      <div className={classes.root}>
         <Grid container spacing={3}>
            <Grid item xs={6}>
               <img
                  src={logo}
                  alt="bill"
                  style={{
                     display: 'block',
                     marginLeft: 'auto',
                     marginRight: 'auto',
                     width: '70%',
                  }}
               />
            </Grid>
            <Grid
               item
               xs={6}
               style={{ textAlign: 'center', marginTop: '90px' }}
            >
               <Typography
                  variant="h4"
                  color="primary"
                  gutterBottom
                  style={{ marginBottom: '40px' }}
               >
                  Login Here
               </Typography>
               <form
                  className={classes.root}
                  noValidate
                  autoComplete="off"
                  onSubmit={formik.handleSubmit}
               >
                  <div>
                     <TextField
                        style={{ width: '50%', marginBottom: '10px' }}
                        required
                        label="Email"
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
                        style={{ width: '50%' }}
                        required
                        label="password"
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
                     <Button
                        style={{ width: '50%', marginTop: '20px' }}
                        variant="contained"
                        color="primary"
                        type="submit"
                     >
                        LOGIN
                     </Button>
                  </div>
               </form>
            </Grid>
         </Grid>
      </div>
   );
}
