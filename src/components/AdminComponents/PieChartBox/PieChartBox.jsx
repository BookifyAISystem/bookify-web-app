import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell
} from "recharts";
import "./PieChartBox.scss";

// Default data as fallback
const defaultData = [
  { name: "Mobile", value: 400, color: "#0088FE" },
  { name: "Desktop", value: 300, color: "#00C49F" },
  { name: "Laptop", value: 400, color: "#FFBB28" },
  { name: "Tablet", value: 200, color: "#FF8042" }
];

const PieChartBox = ({ data = defaultData, title = "Leads by Source" }) => {
  // Use provided data or default if none/empty
  const chartData = data && data.length > 0 ? data : defaultData;

  return (
    <div className="pieChartBox">
      <h1>{title}</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height={300}>
          <PieChart>
            <Tooltip 
              contentStyle={{ background: "white", borderRadius: "5px" }} 
              formatter={(value, name) => [`${value}`, name]}
            />
            <Pie
              data={chartData}
              innerRadius="70%"
              outerRadius="90%"
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="options">
        {chartData.map((item) => (
          <div className="option" key={item.name}>
            <div className="title">
              <div className="dot" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartBox;
