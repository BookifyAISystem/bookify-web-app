import React from 'react';
import './BigChartBox.scss';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const BigChartBox = ({ data }) => {
  // Use default data if no data is provided
  const chartData = data && data.length > 0 ? data : [
    { name: "Sun", books: 4000 },
    { name: "Mon", books: 3000 },
    { name: "Tue", books: 2000 },
    { name: "Wed", books: 2780 },
    { name: "Thu", books: 1890 },
    { name: "Fri", books: 2390 },
    { name: "Sat", books: 3490 },
  ];

  return (
    <div className="bigChartBox">
      <h1>Book Revenue Analytics</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => new Intl.NumberFormat('vi-VN', {
                style: 'currency', currency: 'VND'
              }).format(value)}
            />
            <Area
              type="monotone"
              dataKey="books"
              stackId="1"
              stroke="#ffc658"
              fill="#ffc658"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BigChartBox;