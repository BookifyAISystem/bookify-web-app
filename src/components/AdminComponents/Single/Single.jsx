import React from 'react'
import {
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from "recharts";
  import "./Single.scss";
  
  const Single = ({ id, img, title, info, chart, activities }) => {
    return (
      <div className="single">
        <div className="view">
          <div className="info">
            <div className="topInfo">
              {img && <img src={img} alt="" />}
              <h1>{title}</h1>
              <button>Update</button>
            </div>
            <div className="details">
              {Object.entries(info).map(([key, value]) => (
                <div className="item" key={key}>
                  <span className="itemTitle">{key}</span>
                  <span className="itemValue">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <hr />
          {chart && (
            <div className="chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={chart.data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {chart.dataKeys.map((dataKey, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey={dataKey.name}
                      stroke={dataKey.color}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="activities">
          <h2>Latest Activities</h2>
          {activities && (
            <ul>
              {activities.map((activity, index) => (
                <li key={index}>
                  <div>
                    <p>{activity.text}</p>
                    <time>{activity.time}</time>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };
  
  export default Single;
  