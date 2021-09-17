import { Switch } from 'react-router-dom';
import PrivateRoute from './helper/PrivateRoute';
import ProtectedRoute from './helper/ProtectedRoute';
import Navigation from './components/Navigation';
import Home from './components/Authentication/Home';
import Register from './components/Authentication/Register';
import Login from './components/Authentication/Login';
import Admin from './components/Dashboard/Admin/Admin';
import CustomerContainer from './components/Dashboard/customers/CustomerContainer';
import ProductContainer from './components/Dashboard/products/ProductContainer';
import BillContainer from './components/Dashboard/bills/BillContainer';
import ShowBillsById from './components/Dashboard/bills/ShowBillsById';

const App = () => {
    return (
        <>
            <Navigation />
            <Switch>
                <PrivateRoute path='/billdetails/:id' component={ShowBillsById} exact />
                <PrivateRoute path='/billing' component={BillContainer} exact />
                <PrivateRoute path='/product' component={ProductContainer} exact />
                <PrivateRoute path='/customer' component={CustomerContainer} exact />
                <PrivateRoute path='/admin' component={Admin} exact />
                <ProtectedRoute path='/login' component={Login} exact />
                <ProtectedRoute path='/register' component={Register} exact />
                <ProtectedRoute path='/' component={Home} exact />
            </Switch>
        </>
    );
};

export default App;
