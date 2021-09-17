import { useSelector } from 'react-redux';
import Chart from 'react-google-charts';
import moment from 'moment';

const BarChart = () => {
    const { bills } = useSelector(state => state.bills);
    const recentMonth = moment().month() + 1;
    const salesPerMonth = {};
    for (let i = recentMonth; i > recentMonth - 6; i--) {
        let recentSales = 0;
        bills.forEach(bill => {
            if (moment(bill.date).month() + 1 === i) {
                recentSales += bill.total;
            }
        });
        salesPerMonth[moment(i, 'M').format('MMMM')] = recentSales;
    }
    const chartData = Object.entries(salesPerMonth);
    chartData.unshift(['Month', 'Sales']);

    return (
        <div>
            <Chart
                width={'500px'}
                height={'300px'}
                chartType='Bar'
                loader={<div>Loading Chart</div>}
                data={chartData}
                options={{
                    chart: {
                        title: 'Business Performance',
                        subtitle: 'Sales per Month',
                    },
                }}
                rootProps={{ 'data-testid': '2' }}
            />
        </div>
    );
};

export default BarChart;
