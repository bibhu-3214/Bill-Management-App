import React from 'react';
import PeopleAltRoundedIcon from '@material-ui/icons/PeopleAltRounded';
import LocalMallRoundedIcon from '@material-ui/icons/LocalMallRounded';
import ReceiptRoundedIcon from '@material-ui/icons/ReceiptRounded';
import TrendingUpRoundedIcon from '@material-ui/icons/TrendingUpRounded';
import BusinessRoundedIcon from '@material-ui/icons/BusinessRounded';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import RoomOutlinedIcon from '@material-ui/icons/RoomOutlined';
import ArrowUpwardRoundedIcon from '@material-ui/icons/ArrowUpwardRounded';
import { useSelector } from 'react-redux';
import BarChart from './BarChart';

export default function Admin() {
    const customers = useSelector(state => state.customers);
    const products = useSelector(state => state.products);
    const { bills } = useSelector(state => state.bills);
    const { userDetails } = useSelector(state => state.users);
    const revenue = bills.reduce((sum, bill) => sum + Number(bill.total || 0), 0);
    const averageInvoice = bills.length ? Math.round(revenue / bills.length) : 0;
    const today = new Intl.DateTimeFormat('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(new Date());

    const metrics = [
        {
            label: 'Customers',
            value: customers.length,
            detail: customers.length ? 'Profiles in your workspace' : 'Add your first customer',
            icon: <PeopleAltRoundedIcon />,
            tone: 'violet',
        },
        {
            label: 'Products',
            value: products.length,
            detail: products.length ? 'Ready to add to invoices' : 'Build your catalog',
            icon: <LocalMallRoundedIcon />,
            tone: 'teal',
        },
        {
            label: 'Invoices',
            value: bills.length,
            detail: bills.length ? `₹${averageInvoice.toLocaleString('en-IN')} average value` : 'No invoices generated yet',
            icon: <ReceiptRoundedIcon />,
            tone: 'amber',
        },
        {
            label: 'Total revenue',
            value: `₹${revenue.toLocaleString('en-IN')}`,
            detail: 'All-time recorded revenue',
            icon: <TrendingUpRoundedIcon />,
            tone: 'blue',
        },
    ];

    return (
        <section className='dashboard-page page-enter'>
            <header className='overview-hero'>
                <div className='overview-orb overview-orb-one' />
                <div className='overview-orb overview-orb-two' />
                <div className='overview-copy'>
                    <span className='overview-date'>{today}</span>
                    <h1>Good to see you, {userDetails.username || 'there'}.</h1>
                    <p>Your business is organized and ready for what’s next.</p>
                </div>
                <div className='overview-revenue'>
                    <span>Revenue recorded</span>
                    <strong>₹{revenue.toLocaleString('en-IN')}</strong>
                    <div><ArrowUpwardRoundedIcon /> Across {bills.length} invoice{bills.length === 1 ? '' : 's'}</div>
                </div>
            </header>
            <div className='section-heading'>
                <div><span>At a glance</span><h2>Workspace performance</h2></div>
                <div className='live-chip'><span /> Synced locally</div>
            </div>
            <div className='metric-grid'>
                {metrics.map((metric, index) => (
                    <article className='metric-card surface-card' style={{ animationDelay: `${index * 70}ms` }} key={metric.label}>
                        <div className='metric-card-top'>
                            <div className={`metric-icon ${metric.tone}`}>{metric.icon}</div>
                            <span className='metric-menu'>•••</span>
                        </div>
                        <span>{metric.label}</span>
                        <strong>{metric.value}</strong>
                        <small>{metric.detail}</small>
                    </article>
                ))}
            </div>
            <div className='dashboard-grid'>
                <article className='chart-card surface-card'>
                    <div className='card-heading'>
                        <div><span>Performance</span><h2>Revenue trend</h2></div>
                        <span className='period-chip'>Last 6 months</span>
                    </div>
                    <BarChart />
                </article>
                <article className='profile-card surface-card'>
                    <div className='card-heading'><div><span>Account</span><h2>Business profile</h2></div></div>
                    <div className='profile-avatar'>{(userDetails.businessName || 'B').charAt(0).toUpperCase()}</div>
                    <h3>{userDetails.businessName || 'Your business'}</h3>
                    <p className='profile-owner'>{userDetails.username || 'Business owner'}</p>
                    <div className='profile-details'>
                        <div><MailOutlineRoundedIcon /><span>{userDetails.email || 'Email unavailable'}</span></div>
                        <div><BusinessRoundedIcon /><span>{userDetails.businessName || 'Business name unavailable'}</span></div>
                        <div><RoomOutlinedIcon /><span>{userDetails.address || 'Address unavailable'}</span></div>
                    </div>
                </article>
            </div>
        </section>
    );
}
