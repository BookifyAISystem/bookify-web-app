import React, { useEffect, useState } from 'react'
import './Dashboard.scss'
import ChartBox from '../ChartBox/ChartBox'
import { chartBoxConversion } from '../Data/chartBox'
import BarChartBox from '../BarChartBox/BarChartBox'
import { barChartBoxRevenue, barChartBoxVisit } from '../Data/barChart'
import PieChartBox from '../PieChartBox/PieChartBox'
import BigChartBox from '../BigChartBox/BigChartBox'
import { getAllAccounts } from '../../../services/accountService'
import { getAllBooks } from '../../../services/bookService'
import { getAllOrders } from '../../../services/orderService'

const Dashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    bookCount: 0,
    revenue: 0,
    userStats: [],
    bookStats: [],
    revenueStats: [],
    revenueAnalytics: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountsResponse = await getAllAccounts();        
        const booksResponse = await getAllBooks("", 1, 1000);        
        const ordersResponse = await getAllOrders();
        
        console.log("All orders:", ordersResponse);
        
        // Calculate total revenue from completed orders (status 4)
        let totalRevenue = 0;
        
        if (Array.isArray(ordersResponse)) {
          const completedOrders = ordersResponse.filter(order => order.status === 4);
          console.log("Completed orders:", completedOrders);
          
          totalRevenue = completedOrders.reduce((sum, order) => {
            // Use 'total' field instead of 'totalAmount'
            const orderAmount = Number(order.total);
            if (!isNaN(orderAmount)) {
              return sum + orderAmount;
            }
            return sum;
          }, 0);
          
          console.log("Calculated total revenue:", totalRevenue);
        }
        
        // Generate daily revenue data for chart
        const generateRevenueData = () => {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return days.map(day => ({
            name: day,
            revenue: Math.floor(totalRevenue * (0.5 + Math.random() * 0.5) / 7) // Distribute revenue across days
          }));
        };

        // Generate sample data for charts
        const generateWeeklyData = (total) => {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return days.map(day => ({
            name: day,
            value: Math.floor(total * (0.7 + Math.random() * 0.6)) // Random fluctuation around total
          }));
        };

        // Generate revenue analytics data for BigChartBox
        const generateRevenueAnalytics = () => {
          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          return days.map(day => {
            // Generate random values based on total revenue
            const multiplier = 0.1 + Math.random() * 0.2; // 10-30% of total revenue 
            const books = Math.floor(totalRevenue * multiplier);
            
            return {
              name: day,
              books: books
            };
          });
        };

        const newStats = {
          userCount: accountsResponse?.totalCount || 0,
          bookCount: booksResponse?.totalItems || 0,
          revenue: totalRevenue,
          userStats: generateWeeklyData(accountsResponse?.totalCount || 0),
          bookStats: generateWeeklyData(booksResponse?.totalItems || 0),
          revenueStats: generateRevenueData(),
          revenueAnalytics: generateRevenueAnalytics()
        };

        console.log("New stats:", newStats);
        setStats(newStats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(amount);
  };

  const chartBoxUser = {
    color: "#8884d8",
    icon: "/userIcon.svg",
    title: "Total Users",
    number: stats.userCount,
    dataKey: "value",
    percentage: 45,
    chartData: stats.userStats
  };

  const chartBoxProduct = {
    color: "#ff8042",
    icon: "/productIcon.svg",
    title: "Total Books",
    number: stats.bookCount,
    dataKey: "value",
    percentage: 21,
    chartData: stats.bookStats
  };

  const chartBoxRevenue = {
    color: "teal",
    icon: "/revenueIcon.svg",
    title: "Total Revenue",
    number: formatCurrency(stats.revenue),
    dataKey: "revenue",
    percentage: 12,
    chartData: stats.revenueStats
  };

  return (
    <div className='dashboard'>
      <div className='dashboard-row'>
        <div className='dashboard-column'>
          <ChartBox {...chartBoxUser} />
        </div>
        <div className='dashboard-column'>
          <ChartBox {...chartBoxProduct} />
        </div>
        <div className='dashboard-column'>
          <ChartBox {...chartBoxRevenue} />
        </div>
      </div>

      <div className='dashboard-row'>
        <div className='dashboard-column'>
          <PieChartBox />
        </div>
        <div className='dashboard-column'>
          <BigChartBox data={stats.revenueAnalytics} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
