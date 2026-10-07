import React from 'react';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';
import PlayCircleOutlineRoundedIcon from '@material-ui/icons/PlayCircleOutlineRounded';
import { Link } from 'react-router-dom';

const Home = () => (
    <section className='hero page-enter'>
        <div className='hero-grid'>
            <div>
                <div className='eyebrow'><span className='eyebrow-dot' /> Operations, simplified</div>
                <h1>Run your billing with <span>clarity.</span></h1>
                <p className='hero-copy'>
                    Customers, products, invoices, and business performance in one focused workspace.
                    Built for teams that value speed, control, and a clean close every month.
                </p>
                <div className='hero-actions'>
                    <Link to='/register' className='hero-link primary'>Start for free <ArrowForwardRoundedIcon /></Link>
                    <Link to='/login' className='hero-link secondary'><PlayCircleOutlineRoundedIcon /> Open workspace</Link>
                </div>
            </div>
            <div className='hero-visual' aria-label='Revenue dashboard preview'>
                <div className='hero-panel surface-card'>
                    <div className='mock-top'>
                        <div><div className='mock-label'>Revenue overview</div><div className='mock-value'>₹84,240</div></div>
                        <span className='trend'>↗ 12.8%</span>
                    </div>
                    <div className='bars' aria-hidden='true'>
                        {[38, 54, 44, 71, 63, 92].map(height => <span className='bar' style={{ height: `${height}%` }} key={height} />)}
                    </div>
                    <div className='mock-stats'>
                        <div className='mock-stat'><strong>148</strong><span>Invoices</span></div>
                        <div className='mock-stat'><strong>92</strong><span>Customers</span></div>
                        <div className='mock-stat'><strong>98.4%</strong><span>Collected</span></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default Home;
