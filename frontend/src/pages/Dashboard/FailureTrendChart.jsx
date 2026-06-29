import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Label } from "recharts";

function FailureTrendChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%" >
      <LineChart data={data} margin={{top:15 ,right:10, left:15, bottom:15}}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1E2733" />
        <XAxis dataKey="cycle" stroke="#7C8A9C" fontSize={12} dy={5} >
          <Label value='Time (Cycles)' offset={-13} position='insideBottom' fill="#7C8A9C" fontSize={16} fontWeight={500}/>
        </XAxis>
        <YAxis stroke="#7C8A9C" fontSize={12} domain={[0, 100]} dx={-5} >
          <Label value="Failure Risk (%)" angle={-90} position='insideLeft' style={{textAnchor: 'middle'}} fill="#7C8A9C" fontSize={16} fontWeight={500}/>
        </YAxis>
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