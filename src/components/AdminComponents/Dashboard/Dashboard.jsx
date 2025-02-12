import React from 'react'
import './Dashboard.scss'
import TopBox from '../topBox/TopBox'
import ChartBox from '../ChartBox/ChartBox'
import { chartBoxConversion, chartBoxProduct, chartBoxRevenue, chartBoxUser } from '../Data/chartBox'
import BarChartBox from '../BarChartBox/BarChartBox'
import { barChartBoxRevenue, barChartBoxVisit } from '../Data/barChart'

const Dashboard = () => {
  return (
    <div className='dashboard'>
      <div className='box box1'>
        <TopBox />
      </div>
      <div className='box box2'><ChartBox {...chartBoxUser}/></div>
      <div className='box box3'><ChartBox {...chartBoxProduct}/></div>
      <div className='box box4'>Box4</div>
      <div className='box box5'><ChartBox {...chartBoxRevenue}/></div>
      <div className='box box6'><ChartBox {...chartBoxConversion}/></div>
      <div className='box box7'>Box7</div>
      <div className='box box8'><BarChartBox {...barChartBoxRevenue}/></div>
      <div className='box box9'><BarChartBox {...barChartBoxVisit}/></div>
    </div>
  )
}

export default Dashboard
