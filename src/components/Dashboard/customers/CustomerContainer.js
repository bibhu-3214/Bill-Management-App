import React, { useEffect, useState } from 'react';
import CustomerList from './CustomerList';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { InputAdornment, Paper, Toolbar, Typography } from '@material-ui/core';
import Popup from '../../Popup';
import { useSelector } from 'react-redux';
import Input from '../../controls/Input';
import Search from '@material-ui/icons/Search';
import CustomerForm from './CustomerForm';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';

export default function CustomerContainer() {
    const [openPopup, setOpenPopup] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const customers = useSelector((state) => state.customers);
    const { bills } = useSelector(state => state.bills);
    const billedCustomers = new Set(bills.map(bill => bill.customer)).size;

    useEffect(() => {
        const query = searchInput.trim().toLowerCase();
        const results = customers.filter(customer => customer.name.toLowerCase().includes(query));
        setSearchResult(results);
    }, [customers, searchInput]);

    return (
        <section className='workspace-page page-enter'>
            <header className='workspace-hero customer-workspace-hero'>
                <div className='workspace-hero-copy'>
                    <span className='workspace-kicker'><PeopleAltRoundedIcon /> Relationships</span>
                    <h1>Customers</h1>
                    <p>Every relationship, contact, and billing profile in one place.</p>
                </div>
                <div className='workspace-hero-stats'>
                    <div><span>Total customers</span><strong>{customers.length}</strong></div>
                    <div><span>With invoices</span><strong>{billedCustomers}</strong></div>
                    <div><span>New opportunity</span><strong>{Math.max(customers.length - billedCustomers, 0)}</strong></div>
                </div>
            </header>
            <Paper className='data-panel surface-card' elevation={0}>
                <div>
                    <Toolbar className='data-toolbar'>
                        <Input
                            label="Search customers"
                            size="small"
                            value={searchInput}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <Button
                            variant="outlined"
                            size="large"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setOpenPopup(true);
                            }}
                        >
                            Add customer
                        </Button>
                    </Toolbar>
                </div>
                <div>
                    {customers.length > 0 ? (
                        <CustomerList searchResult={searchResult} />
                    ) : (
                        <Typography
                            variant="h5"
                            color="textSecondary"
                            gutterBottom
                            className='empty-state'
                        >
                            No customers yet. Add your first customer to get started.
                        </Typography>
                    )}
                </div>
            </Paper>
            <Popup title="Customer Form" openPopup={openPopup} setOpenPopup={setOpenPopup}>
                <CustomerForm setOpenPopup={setOpenPopup} />
            </Popup>
        </section>
    );
}
