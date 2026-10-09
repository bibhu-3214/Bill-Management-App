import { Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
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
    const isDemo = useSelector(state => state.users.userDetails.isDemo);
    return (
        <div className="app-shell">
            <a className="skip-link" href="#main-content">Skip to content</a>
            <Navigation />
            <main className="app-content" id="main-content" tabIndex={-1}>
                {isDemo && <aside className='demo-notice' aria-label='Sample workspace'>
                    <strong>Sample workspace</strong> · Fictional data. Changes stay in this tab. Sign out and reopen the demo to reset.
                </aside>}
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
            </main>
        </div>
    );
};

export default App;
