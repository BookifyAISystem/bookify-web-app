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
import { getAllOrders, getTotalRevenue } from '../../../services/orderService'

const Dashboard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    bookCount: 0,
    revenue: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountsResponse = await getAllAccounts();        
        const booksResponse = await getAllBooks("", 1, 1000);        
        const totalRevenue = await getTotalRevenue();

        const newStats = {
          userCount: accountsResponse?.totalCount || 0,
          bookCount: booksResponse?.totalItems || 0,
          revenue: totalRevenue || 0
        };

        setStats(newStats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("🔄 Stats updated:", stats);
  }, [stats]);

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
    dataKey: "users",
    percentage: 45,
  };

  const chartBoxProduct = {
    color: "#ff8042",
    icon: "/productIcon.svg",
    title: "Total Books",
    number: stats.bookCount,
    dataKey: "products",
    percentage: 21,
  };

  const chartBoxRevenue = {
    color: "teal",
    icon: "/revenueIcon.svg",
    title: "Total Revenue",
    number: formatCurrency(stats.revenue),
    dataKey: "revenue",
    percentage: 12,
  };

  return (
    <div className='dashboard'>
      <div className='box box2'><ChartBox {...chartBoxUser}/></div>
      <div className='box box3'><ChartBox {...chartBoxProduct}/></div>
      <div className='box box4'><PieChartBox /></div>
      <div className='box box5'><ChartBox {...chartBoxRevenue}/></div>
      <div className='box box6'><ChartBox {...chartBoxConversion}/></div>
      <div className='box box7'><BigChartBox /></div>
      <div className='box box8'><BarChartBox {...barChartBoxRevenue}/></div>
      <div className='box box9'><BarChartBox {...barChartBoxVisit}/></div>
    </div>
  )
}

export default Dashboard
