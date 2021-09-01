import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { register } from '../../Redux/Actions/usersAction';

const useStyles = makeStyles((theme) => ({
   root: {
      '& .MuiTextField-root': {
         margin: theme.spacing(1),
         width: 200,
      },
   },
}));

export default function Register(props) {
   const classes = useStyles();
   const [username, setUsername] = React.useState('');
   const [email, setEmail] = React.useState('');
   const [password, setPassword] = React.useState('');
   const [business, setBusiness] = React.useState('');
   const [address, setAddress] = React.useState('');

   const dispatch = useDispatch();

   const handleSubmit = (e) => {
      e.preventDefault();
      const formData = {
         username: username,
         email: email,
         password: password,
         businessName: business,
         address: address,
      };
      const redirectToLogin = () => {
         props.history.push('/login');
      };
      const resetForm = () => {
         setUsername('');
         setEmail('');
         setPassword('');
         setBusiness('');
         setAddress('');
      };
      dispatch(register(formData, resetForm, redirectToLogin));
   };

   return (
      <div style={{ textAlign: 'center' }}>
         <Typography variant="h4" color="primary" gutterBottom>
            Register with us
         </Typography>
         <form
            className={classes.root}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
         >
            <div>
               <TextField
                  style={{ width: '40%' }}
                  required
                  label="username"
                  variant="outlined"
                  type="text"
                  name="username"
                  value={username}
                  size="small"
                  placeholder="enter your name"
                  onChange={(e) => setUsername(e.target.value)}
               />
            </div>
            <div>
               <TextField
                  style={{ width: '40%' }}
                  required
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  placeholder="enter your email"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setEmail(e.target.value)}
               />
            </div>
            <div>
               <TextField
                  style={{ width: '40%' }}
                  required
                  label="password"
                  type="password"
                  name="password"
                  value={password}
                  placeholder="enter your password"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setPassword(e.target.value)}
               />
            </div>
            <div>
               <TextField
                  style={{ width: '40%' }}
                  required
                  label="BusinessName"
                  type="text"
                  name="business"
                  value={business}
                  placeholder="enter your BusinessName"
                  size="small"
                  variant="outlined"
                  onChange={(e) => setBusiness(e.target.value)}
               />
            </div>
            <div>
               <TextField
                  style={{ width: '40%' }}
                  required
                  label="Address"
                  type="text"
                  name="address"
                  value={address}
                  placeholder="enter your address"
                  size="small"
                  multiline
                  rows={3}
                  variant="outlined"
                  onChange={(e) => setAddress(e.target.value)}
               />
            </div>
            <div>
               <Button
                  style={{ width: '40%', marginTop: '20px' }}
                  variant="contained"
                  color="primary"
                  type="submit"
               >
                  REGISTER
               </Button>
            </div>
         </form>
      </div>
   );
}
