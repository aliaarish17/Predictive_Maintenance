import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

function ShapChart({ shapValues }) {
  if (!shapValues || shapValues.length === 0) return null;

  return (
    <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-5">
      <h3 className="text-slate-100 text-sm font-semibold mb-4">SHAP Explainability</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={shapValues} layout="vertical">
          <XAxis type="number" stroke="#7C8A9C" fontSize={11} />
          <YAxis type="category" dataKey="feature" stroke="#7C8A9C" fontSize={11} width={100} />
          <Tooltip contentStyle={{ background: "#10151D", border: "1px solid #1E2733" }} />
          <Bar dataKey="value">
            {shapValues.map((entry, index) => (
              <Cell key={index} fill={entry.value > 0 ? "#FF4D4D" : "#0A8CAA"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ShapChart;