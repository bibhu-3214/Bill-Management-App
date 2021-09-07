import { Switch, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Authentication/Home';
import Register from './components/Authentication/Register';
import Login from './components/Authentication/Login';
import Admin from './components/Dashboard/Admin/Admin';
import CustomerContainer from './components/Dashboard/customers/CustomerContainer';
import ProductContainer from './components/Dashboard/products/ProductContainer';
import BillContainer from './components/Dashboard/bills/BillContainer';

const App = () => {
   return (
      <>
         <Navigation />
         <Switch>
            <Route path="/billing" component={BillContainer} exact />
            <Route path="/product" component={ProductContainer} exact />
            <Route path="/customer" component={CustomerContainer} exact />
            <Route path="/admin" component={Admin} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/" component={Home} exact />
         </Switch>
      </>
   );
};

export default App;
