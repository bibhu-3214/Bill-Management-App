import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ProductList from './ProductList';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import { InputAdornment, Paper, Toolbar } from '@material-ui/core';
import Input from '../../controls/Input';
import Popup from '../../Popup';
import { Search } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import ProductForm from './ProductForm';

const useStyles = makeStyles((theme) => ({
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

export default function ProductContainer() {
    const classes = useStyles();
    const [openPopup, setOpenPopup] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const products = useSelector((state) => state.products);

    useEffect(() => {
        const results = products.filter((customer) => customer.name.toLowerCase().includes(searchInput));
        setSearchResult(results);
    }, [products, searchInput]);

    return (
        <div style={{ display: 'flex', width: '60%', margin: 'auto' }}>
            <Paper className={classes.pageContent} style={{ display: 'flex', flexDirection: 'column' }}>
                <div>
                    <Toolbar>
                        <Input
                            label="Search products"
                            size="small"
                            className={classes.searchInput}
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
                            className={classes.Button}
                            startIcon={<AddIcon />}
                            style={{
                                float: 'right',
                            }}
                            onClick={() => {
                                setOpenPopup(true);
                            }}
                        >
                            Add
                        </Button>
                    </Toolbar>
                </div>
                <div>
                    {products.length > 0 ? (
                        <ProductList searchResult={searchResult} />
                    ) : (
                        <Typography
                            variant="h5"
                            color="textSecondary"
                            gutterBottom
                            style={{ textAlign: 'center', margin: '30px' }}
                        >
                            Add a Product ...
                        </Typography>
                    )}
                </div>
            </Paper>
            <Popup title="Product Form" openPopup={openPopup} setOpenPopup={setOpenPopup}>
                <ProductForm setOpenPopup={setOpenPopup} />
            </Popup>
        </div>
    );
}
