import { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Authentication/Home';
import Register from './components/Authentication/Register';
import Login from './components/Authentication/Login';
import Admin from './components/Dashboard/Admin/Admin';
import CustomerContainer from './components/Dashboard/customers/CustomerContainer';
import ProductContainer from './components/Dashboard/products/ProductContainer';
import BillingForm from './components/Dashboard/bills/BillingForm';

const App = () => {
   const [isLoggedIn, setIsLoggedIn] = useState(false);

   const handleAuth = () => {
      setIsLoggedIn(!isLoggedIn);
   };

   useEffect(() => {
      if (localStorage.getItem('token')) {
         handleAuth();
      }
   }, []);

   return (
      <>
         <Navigation isLoggedIn={isLoggedIn} handleAuth={handleAuth} />
         <Switch>
            <Route path="/billing" component={BillingForm} exact />
            <Route path="/product" component={ProductContainer} exact />
            <Route path="/customer" component={CustomerContainer} exact />
            <Route path="/admin" component={Admin} exact />
            <Route
               path="/login"
               exact
               render={(props) => {
                  return <Login {...props} handleAuth={handleAuth} />;
               }}
            />
            <Route path="/register" component={Register} exact />
            <Route path="/" component={Home} exact />
         </Switch>
      </>
   );
};

export default App;
