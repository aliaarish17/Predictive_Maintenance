// src/pages/Dashboard/FailureTrendChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function FailureTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2733" />
        <XAxis dataKey="cycle" stroke="#7C8A9C" fontSize={12} />
        <YAxis stroke="#7C8A9C" fontSize={12} domain={[0, 100]} />
        <Tooltip
          contentStyle={{ background: "#10151D", border: "1px solid #1E2733" }}
          labelStyle={{ color: "#E6EDF3" }}
        />
        <Line type="monotone" dataKey="avgRisk" stroke="#00D9FF" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default FailureTrendChart;