import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Card, CardContent, Typography, CardActions, Button } from '@material-ui/core';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        margin: '40px',
        fontFamily: 'Operator Mono',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    root1: {
        backgroundColor: '#f5f5f5',
        boxShadow: 'rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px',
        minWidth: 275,
        transition: 'all 0.3s ease',
        position: 'relative',
    },

    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
}));

export default function Admin() {
    const classes = useStyles();
    const customers = useSelector((state) => state.customers);
    const products = useSelector((state) => state.products);
    const { bills } = useSelector((state) => state.bills);
    const { userDetails } = useSelector((state) => state.users);

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs>
                    <Card className={classes.root1}>
                        <CardContent>
                            <Typography
                                variant="h4"
                                component="h2"
                                style={{ color: '#757de8', marginBottom: '20px' }}
                            >
                                Total Customers
                            </Typography>
                            <Typography variant="h4" component="h2" style={{ color: '#757de8' }}>
                                {customers.length}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" style={{ color: '#757de8' }}>
                                Learn More
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card className={classes.root1}>
                        <CardContent>
                            <Typography
                                variant="h4"
                                component="h2"
                                style={{ color: '#757de8', marginBottom: '20px' }}
                            >
                                Total Products
                            </Typography>
                            <Typography variant="h4" component="h2" style={{ color: '#757de8' }}>
                                {products.length}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" style={{ color: '#757de8' }}>
                                Learn More
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs>
                    <Card className={classes.root1}>
                        <CardContent>
                            <Typography
                                variant="h4"
                                component="h3"
                                style={{ color: '#757de8', marginBottom: '20px' }}
                            >
                                Total Bills
                            </Typography>
                            <Typography variant="h4" component="h2" style={{ color: '#757de8' }}>
                                {bills.length}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" style={{ color: '#757de8' }}>
                                Learn More
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card className={classes.root1}>
                        <CardContent>
                            <Typography
                                variant="h4"
                                component="h2"
                                style={{ color: '#757de8', marginBottom: '20px' }}
                            >
                                User Informations
                            </Typography>
                            <Typography variant="h4" component="h2" style={{ color: '#757de8' }}>
                                {userDetails.length}
                            </Typography>
                            <Typography variant="h5" component="h3" style={{ color: '#757de8' }}>
                                UserName : {userDetails.username}
                            </Typography>
                            <Typography variant="h5" component="h3" style={{ color: '#757de8' }}>
                                Email : {userDetails.email}
                            </Typography>
                            <Typography variant="h5" component="h3" style={{ color: '#757de8' }}>
                                BusinessName : {userDetails.businessName}
                            </Typography>
                            <Typography variant="h5" component="h3" style={{ color: '#757de8' }}>
                                Address : {userDetails.address}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" style={{ color: '#757de8' }}>
                                Learn More
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}
