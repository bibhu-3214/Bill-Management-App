import React, { useState, useEffect } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { InputAdornment, Toolbar, Typography } from '@material-ui/core';
import Popup from '../../Popup';
import { useSelector } from 'react-redux';
import Input from '../../controls/Input';
import Search from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import BillingForm from './BillingForm';
import BillList from './BillList';

export default function BillContainer() {
    const [openPopup, setOpenPopup] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const { bills } = useSelector(state => state.bills);
    const customers = useSelector(state => state.customers);

    useEffect(() => {
        let searchData = [];
        const customerName = customers.filter(customer =>
            customer.name.toLowerCase().includes(searchInput.toLowerCase()),
        );
        customerName.forEach(name => {
            const result = bills.filter(bill => bill.customer === name._id);
            searchData = searchData.concat(result);
        });
        setSearchResult(searchData);
    }, [bills, customers, searchInput]);

    return (
        <section className='workspace-page page-enter'>
            <div className='workspace-heading'>
                <div><h1>Invoices</h1><p>Create, find, and download customer invoices.</p></div>
            </div>
            <Paper className='data-panel surface-card' elevation={0}>
                <div>
                    <Toolbar className='data-toolbar'>
                        <Input
                            label='Search bill'
                            size='small'
                            value={searchInput}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                        <Button
                            variant='outlined'
                            size='large'
                            color='primary'
                            startIcon={<AddIcon />}
                            onClick={() => {
                                setOpenPopup(true);
                            }}>
                            Add
                        </Button>
                    </Toolbar>
                </div>
                <div>
                    {bills.length > 0 ? (
                        <BillList searchResult={searchResult} />
                    ) : (
                        <Typography
                            variant='h5'
                            color='textSecondary'
                            gutterBottom
                            className='empty-state'>
                            No invoices yet. Generate your first invoice to get started.
                        </Typography>
                    )}
                </div>
            </Paper>
            <Popup title='Bill Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
                <BillingForm setOpenPopup={setOpenPopup} />
            </Popup>
        </section>
    );
}
