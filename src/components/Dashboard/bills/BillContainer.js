import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
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

const useStyles = makeStyles(theme => ({
    pageContent: {
        width: '100%',
        margin: theme.spacing(5),
        padding: theme.spacing(3),
        boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    },
    searchInput: {
        width: '80%',
    },
    Button: {
        position: 'absolute',
        right: '10px',
    },
}));

export default function BillContainer() {
    const classes = useStyles();
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
        <div style={{ display: 'flex', width: '60%', margin: 'auto' }}>
            <Paper className={classes.pageContent} style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                    <Toolbar>
                        <Input
                            label='Search bill'
                            size='small'
                            className={classes.searchInput}
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
                            className={classes.Button}
                            style={{ float: 'right' }}
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
                            style={{ textAlign: 'center', margin: '30px' }}>
                            Add a bill ...
                        </Typography>
                    )}
                </div>
            </Paper>
            <Popup title='Bill Form' openPopup={openPopup} setOpenPopup={setOpenPopup}>
                <BillingForm setOpenPopup={setOpenPopup} />
            </Popup>
        </div>
    );
}
