// src/pages/Dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import { getHistory } from "../../services/api";
import FailureTrendChart from "./FailureTrendChart";

const RISK_SCORE = { high: 100, medium: 50, low: 10 };

function getRollingAverage(data, windowSize = 5) {
  return data.map((_, i) => {
    const window = data.slice(Math.max(0, i - windowSize + 1), i + 1);
    const avg = window.reduce((sum, d) => sum + d.avgRisk, 0) / window.length;
    return { cycle: data[i].cycle, avgRisk: Math.round(avg) };
  });
}

function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(()=>{
  ;(async () => {
    try {
      setLoading(true)
      setError(false)
       const res = await getHistory({limit:200})
      //  console.log(res.data)
       const preds = res.data.predictions;
       setPredictions(preds)

       const sorted = preds.slice().sort((a,b)=> new Date(a.created_at)- new Date(b.created_at));

       const scored = sorted.map((p,i)=> ({cycle: i+1, avgRisk: RISK_SCORE[p.risk_level]??0}));

       setTrendData(getRollingAverage(scored));
       
    } catch (error) {
      setError(true)
          
    } finally{
      setLoading(false)
    }
    
  })();

 },[]);
 if (error){
  return <div className="text-red-500">Something went wrong</div>
 }

 if (loading){
  return <div className="text-red-500">Loading...</div>
 }

  const uniqueMachines = new Set(
    predictions.filter((p) => p.machine_unit).map((p) => p.machine_unit)
  ).size;

  const highRiskCount = predictions.filter((p) => p.risk_level === "high").length;

  const rulPredictions = predictions.filter((p) => p.prediction_type === "rul");
  const avgRUL = rulPredictions.length
    ? (rulPredictions.reduce((sum, p) => sum + p.result.rul_cycles, 0) / rulPredictions.length).toFixed(1)
    : 0;

  const today = new Date().toISOString().split("T")[0];
  const todayCount = predictions.filter((p) => p.created_at.startsWith(today)).length;

  const needsAttention = predictions
    .filter((p) => p.risk_level !== "low" && p.machine_unit)
    .slice(0, 5);

  return (
    <div className="p-8 max-w-[1240px] mx-auto">
      <h2 className="text-black  text-3xl font-semibold mb-5">Fleet Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-7">
        <KpiCard label="Machines Monitored" value={uniqueMachines} />
        <KpiCard label="High Breakdown Risk" value={highRiskCount} colorClass="text-red-500" />
        <KpiCard label="Avg Life Remaining" value={`${avgRUL} cycles`} colorClass="text-amber-500" />
        <KpiCard label="Predictions Today" value={todayCount} colorClass="text-emerald-400" />
      </div>

      {/* Failure Risk Trend */}
      <div className="bg-[#10151D] border border-[#1E2733]  rounded-xl p-5 mb-4">
        <h3 className="text-slate-100 text-sm font-semibold mb-4">Failure Risk Trend</h3>
        <FailureTrendChart  data={trendData} />
      </div>

      {/* Machines Needing Attention */}
      <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-5">
        <h3 className="text-slate-100 text-sm font-semibold mb-4">Machines Needing Attention</h3>
        {needsAttention.length === 0 ? (
          <p className="text-slate-400 text-sm">No machines need attention right now.</p>
        ) : (
          needsAttention.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center py-3 border-b border-[#1E2733] last:border-b-0 text-slate-100 text-sm"
            >
              <span>{p.machine_unit}</span>
              <span className={p.risk_level === "high" ? "text-red-500 font-semibold" : "text-amber-500 font-semibold"}>
                {p.risk_level.toUpperCase()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function KpiCard({ label, value, colorClass = "text-slate-100" }) {
  return (
    <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-5">
      <div className="text-slate-400 text-xs uppercase tracking-wide">{label}</div>
      <div className={`${colorClass} text-3xl font-semibold mt-3`}>{value}</div>
    </div>
  );
}

export default Dashboard;