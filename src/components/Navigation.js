import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DashboardTwoToneIcon from '@material-ui/icons/DashboardTwoTone';
import AssignmentIndTwoToneIcon from '@material-ui/icons/AssignmentIndTwoTone';
import ContactMailTwoToneIcon from '@material-ui/icons/ContactMailTwoTone';
import LocalMallTwoToneIcon from '@material-ui/icons/LocalMallTwoTone';
import ReceiptTwoToneIcon from '@material-ui/icons/ReceiptTwoTone';
import AccountBoxTwoToneIcon from '@material-ui/icons/AccountBoxTwoTone';
import { Link, withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';

const useStyles = makeStyles((theme) => ({
   root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: '#f5f5f5',
   },
   Tabs: {
      backgroundColor: '#c5cae9',
   },
}));

function Navigation(props) {
   const classes = useStyles();
   const { isLoggedIn, handleAuth } = props;

   return (
      <div className={classes.root}>
         <AppBar position="static">
            <Tabs className={classes.Tabs}>
               {!isLoggedIn ? (
                  <ul
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        listStyleType: 'none',
                     }}
                  >
                     <li>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                           <Tab label="Home" icon={<DashboardTwoToneIcon />} />
                        </Link>
                     </li>
                     <li>
                        <Link to="/register" style={{ textDecoration: 'none' }}>
                           <Tab
                              label="Register"
                              icon={<ContactMailTwoToneIcon />}
                           />
                        </Link>
                     </li>
                     <li>
                        <Link to="/login" style={{ textDecoration: 'none' }}>
                           <Tab
                              label="Login"
                              icon={<AccountBoxTwoToneIcon />}
                           />
                        </Link>
                     </li>
                  </ul>
               ) : (
                  <ul
                     style={{
                        display: 'flex',
                        flexDirection: 'row',
                        listStyleType: 'none',
                     }}
                  >
                     <li>
                        <Link to="/admin" style={{ textDecoration: 'none' }}>
                           <Tab
                              label="Admin"
                              icon={<ContactMailTwoToneIcon />}
                           />
                        </Link>
                     </li>
                     <li>
                        <Link to="/customer" style={{ textDecoration: 'none' }}>
                           <Tab
                              label="Customers"
                              icon={<AssignmentIndTwoToneIcon />}
                           />
                        </Link>
                     </li>
                     <li>
                        <Link to="/product" style={{ textDecoration: 'none' }}>
                           <Tab
                              label="Products"
                              icon={<LocalMallTwoToneIcon />}
                           />
                        </Link>
                     </li>
                     <li>
                        <Link to="/billing" style={{ textDecoration: 'none' }}>
                           <Tab label="billing" icon={<ReceiptTwoToneIcon />} />
                        </Link>
                     </li>
                     <li>
                        <Link
                           to=""
                           style={{ textDecoration: 'none' }}
                           onClick={() => {
                              localStorage.removeItem('token');
                              Swal.fire(
                                 'successfully logged out',
                                 "we'd like you to visit again",
                                 'success',
                              );
                              handleAuth();
                              props.history.push('/');
                           }}
                        >
                           <Tab
                              label="logout"
                              icon={<AccountBoxTwoToneIcon />}
                           />
                        </Link>
                     </li>
                  </ul>
               )}
            </Tabs>
         </AppBar>
      </div>
   );
}
export default withRouter(Navigation);
