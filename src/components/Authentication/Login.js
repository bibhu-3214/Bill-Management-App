import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { useDispatch } from 'react-redux';
import { login } from '../../Redux/Actions/usersAction';

const useStyles = makeStyles((theme) => ({
   root: {
      width: '100%',
      '& > * + *': {
         marginTop: theme.spacing(2),
      },
   },
}));

export default function Login(props) {
   const classes = useStyles();
   const [email, setEmail] = React.useState('');
   const [password, setPassword] = React.useState('');

   const dispatch = useDispatch();

   const handleSubmit = (e) => {
      e.preventDefault();
      const formData = { email: email, password: password };
      const redirectToAdmin = () => {
         props.history.push('/admin');
         props.handleAuth();
      };
      dispatch(login(formData, redirectToAdmin));
   };

   return (
      <div style={{ textAlign: 'center' }}>
         <Typography variant="h4" color="primary" gutterBottom>
            Login here
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
               <Button
                  style={{ width: '40%', marginTop: '20px' }}
                  variant="contained"
                  color="primary"
                  type="submit"
               >
                  LOGIN
               </Button>
            </div>
         </form>
      </div>
   );
}
