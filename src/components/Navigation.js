import React from 'react';
import PropTypes from 'prop-types';
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
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Home from './Authentication/Home';
import Register from './Authentication/Register';
import Login from './Authentication/Login';
import Admin from './Dashboard/Admin/Admin';
import CustomerContainer from './Dashboard/customers/CustomerContainer';
import Product from './Dashboard/products/Product';
import Billing from './Dashboard/bills/Billing';
import { Link, Route, Switch, withRouter } from 'react-router-dom';

function TabPanel(props) {
   const { children, value, index, ...other } = props;

   return (
      <div
         role="tabpanel"
         hidden={value !== index}
         id={`scrollable-force-tabpanel-${index}`}
         aria-labelledby={`scrollable-force-tab-${index}`}
         {...other}
      >
         {value === index && (
            <Box p={3}>
               <Typography>{children}</Typography>
            </Box>
         )}
      </div>
   );
}

TabPanel.propTypes = {
   children: PropTypes.node,
   index: PropTypes.any.isRequired,
   value: PropTypes.any.isRequired,
};

function a11yProps(index) {
   return {
      id: `scrollable-force-tab-${index}`,
      'aria-controls': `scrollable-force-tabpanel-${index}`,
   };
}

const useStyles = makeStyles((theme) => ({
   root: {
      flexGrow: 1,
      width: '100%',
      backgroundColor: theme.palette.background.paper,
   },
}));

function Navigation(props) {
   const { isLoggedIn, handleAuth } = props;
   const classes = useStyles();
   const [value, setValue] = React.useState(0);

   const handleChange = (event, newValue) => {
      setValue(newValue);
   };

   return (
      <div className={classes.root}>
         <AppBar position="static" style={{ backgroundColor: '#e8eaf6' }}>
            <Tabs
               value={value}
               onChange={handleChange}
               style={{ color: 'white' }}
               variant="scrollable"
               scrollButtons="on"
               indicatorColor="primary"
               textColor="primary"
               aria-label="scrollable force tabs example"
            >
               {!isLoggedIn ? (
                  <ul>
                     <Link to="/" style={{ textDecoration: 'none' }}>
                        <Tab
                           label="Home"
                           icon={<DashboardTwoToneIcon />}
                           {...a11yProps(0)}
                        />
                     </Link>
                     <Link to="/register" style={{ textDecoration: 'none' }}>
                        <Tab
                           label="Register"
                           icon={<ContactMailTwoToneIcon />}
                           {...a11yProps(1)}
                        />
                     </Link>
                     <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Tab
                           label="Login"
                           icon={<AccountBoxTwoToneIcon />}
                           {...a11yProps(2)}
                        />
                     </Link>
                  </ul>
               ) : (
                  <ul>
                     <Link to="/admin" style={{ textDecoration: 'none' }}>
                        <Tab
                           label="Admin"
                           icon={<ContactMailTwoToneIcon />}
                           {...a11yProps(3)}
                        />
                     </Link>
                     <Link to="/customer" style={{ textDecoration: 'none' }}>
                        <Tab
                           label="Customers"
                           icon={<AssignmentIndTwoToneIcon />}
                           {...a11yProps(4)}
                        />
                     </Link>
                     <Link to="/product" style={{ textDecoration: 'none' }}>
                        <Tab
                           label="Products"
                           icon={<LocalMallTwoToneIcon />}
                           {...a11yProps(5)}
                        />
                     </Link>
                     <Link to="/billing" style={{ textDecoration: 'none' }}>
                        <Tab
                           label="billing"
                           icon={<ReceiptTwoToneIcon />}
                           {...a11yProps(6)}
                        />
                     </Link>
                     <Link
                        to=""
                        style={{ textDecoration: 'none' }}
                        onClick={() => {
                           localStorage.removeItem('token');
                           alert('successfully logged out');
                           handleAuth();
                           props.history.push('/');
                        }}
                     >
                        <Tab
                           label="logout"
                           icon={<AccountBoxTwoToneIcon />}
                           {...a11yProps(0)}
                        />
                     </Link>
                  </ul>
               )}
            </Tabs>
         </AppBar>
         <Switch>
            <Route
               path="/billing"
               render={(props) => {
                  return (
                     <TabPanel value={value} index={0}>
                        <Billing />
                     </TabPanel>
                  );
               }}
            />
            <Route
               path="/product"
               render={(props) => {
                  return (
                     <TabPanel value={value} index={0}>
                        <Product />
                     </TabPanel>
                  );
               }}
            />
            <Route
               path="/customer"
               render={(props) => {
                  return (
                     <TabPanel value={value} index={0}>
                        <CustomerContainer />
                     </TabPanel>
                  );
               }}
            />
            <Route
               path="/admin"
               render={(props) => {
                  return (
                     <TabPanel value={value} index={0}>
                        <Admin />
                     </TabPanel>
                  );
               }}
            />
            <Route
               path="/login"
               render={(props) => {
                  return (
                     <TabPanel value={value} index={0}>
                        <Login {...props} handleAuth={handleAuth} />
                     </TabPanel>
                  );
               }}
            />
            <Route
               path="/register"
               render={(props) => {
                  return (
                     <TabPanel value={value} index={0}>
                        <Register />
                     </TabPanel>
                  );
               }}
            />
            <Route
               path="/"
               render={(props) => {
                  return (
                     <TabPanel value={value} index={0}>
                        <Home />
                     </TabPanel>
                  );
               }}
            />
         </Switch>
      </div>
   );
}
export default withRouter(Navigation);
