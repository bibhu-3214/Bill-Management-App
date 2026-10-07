import React from 'react';
import DashboardRoundedIcon from '@material-ui/icons/DashboardRounded';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import InventoryRoundedIcon from '@material-ui/icons/LocalMallRounded';
import ReceiptRoundedIcon from '@material-ui/icons/ReceiptRounded';
import ExitToAppRoundedIcon from '@material-ui/icons/ExitToAppRounded';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import PersonAddRoundedIcon from '@material-ui/icons/PersonAddRounded';
import AssessmentRoundedIcon from '@material-ui/icons/AssessmentRounded';
import Tooltip from '@material-ui/core/Tooltip';
import { Link, NavLink, withRouter } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Redux/Actions/usersAction';

function Navigation({ history }) {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.users.isLoggedIn);

    const handleLogout = () => {
        dispatch(logout());
        Swal.fire('Signed out', 'Your local encryption key was cleared from this session.', 'success');
        history.push('/');
    };

    const navItem = (to, label, icon, exact = false) => (
        <li>
            <NavLink className='nav-link' activeClassName='active' exact={exact} to={to}>
                {icon}<span>{label}</span>
            </NavLink>
        </li>
    );

    return (
        <header className='topbar'>
            <Link to={isLoggedIn ? '/admin' : '/'} className='brand' aria-label='BillFlow home'>
                <span className='brand-mark'><AssessmentRoundedIcon /></span>
                <span className='brand-word'>Bill<span>Flow</span></span>
            </Link>
            <nav aria-label='Primary navigation'>
                <ul className='nav-links'>
                    {isLoggedIn ? (
                        <>
                            {navItem('/admin', 'Overview', <DashboardRoundedIcon />, true)}
                            {navItem('/customer', 'Customers', <PeopleAltRoundedIcon />)}
                            {navItem('/product', 'Products', <InventoryRoundedIcon />)}
                            {navItem('/billing', 'Invoices', <ReceiptRoundedIcon />)}
                            <li className='nav-signout'>
                                <Tooltip title='Sign out' arrow>
                                    <button className='signout-button' aria-label='Sign out' onClick={handleLogout} type='button'>
                                        <ExitToAppRoundedIcon />
                                    </button>
                                </Tooltip>
                            </li>
                        </>
                    ) : (
                        <>
                            {navItem('/login', 'Sign in', <AccountCircleRoundedIcon />)}
                            {navItem('/register', 'Create account', <PersonAddRoundedIcon />)}
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default withRouter(Navigation);
