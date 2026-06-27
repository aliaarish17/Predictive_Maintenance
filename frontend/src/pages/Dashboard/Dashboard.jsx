// Dashboard.jsx
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getHistory } from "../../services/api";
import FailureTrendChart from "./FailureTrendChart";
import MPie from "./Pie";
import { pageTransition } from "../../animations/pageTransition";

const RISK_SCORE = { high: 100, medium: 50, low: 10 };

function getRollingAverage(data, windowSize = 5) {
  return data.map((_, i) => {
    const window = data.slice(Math.max(0, i - windowSize + 1), i + 1);
    const avg = window.reduce((sum, d) => sum + d.avgRisk, 0) / window.length;
    return { cycle: data[i].cycle, avgRisk: Math.round(avg) };
  });
}

function formatResult(p) {
  if (p.prediction_type === "rul") return `${p.result.rul_cycles} cycles`;
  return p.result.failure_predicted ? "Failure predicted" : "No failure";
}

function Dashboard() {
  const [predictions, setPredictions] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getHistory({ limit: 200 })
      .then((res) => {
        const preds = res.data.predictions;
        setPredictions(preds);

        const sorted = preds.slice().sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const scored = sorted.map((p, i) => ({ cycle: i + 1, avgRisk: RISK_SCORE[p.risk_level] ?? 0 }));
        setTrendData(getRollingAverage(scored));
      })
      .catch(() => setError("Could not load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-slate-400 p-8">Loading dashboard...</p>;
  if (error) return <p className="text-red-500 p-8">{error}</p>;

  const uniqueMachines = new Set(
    predictions.filter((p) => p.machine_unit).map((p) => p.machine_unit)
  ).size;

  const highRiskCount = new Set(
    predictions.filter((p) => p.risk_level === "high" && p.machine_unit).map((p) => p.machine_unit)
  ).size;

  const rulPredictions = predictions.filter((p) => p.prediction_type === "rul");
  const avgRUL = rulPredictions.length
    ? (rulPredictions.reduce((sum, p) => sum + p.result.rul_cycles, 0) / rulPredictions.length).toFixed(1)
    : 0;

  const today = new Date().toISOString().split("T")[0];
  const todayCount = predictions.filter((p) => p.created_at.startsWith(today)).length;

  // Sirf most recent 6 — table mein dikhane ke liye, naya-se-purana
  const recentPredictions = predictions
    .slice()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 8);

  const healthyCount = predictions.filter((p) => p.risk_level === "low").length;
  const warningCount = predictions.filter((p) => p.risk_level === "medium").length;
  const criticalCount = predictions.filter((p) => p.risk_level === "high").length;
  const pieData = [
    { name: "Healthy", value: healthyCount, color: "#10B981" },
    { name: "Warning", value: warningCount, color: "#F59E0B" },
    { name: "Critical", value: criticalCount, color: "#EF4444" },
  ];

  return (
    <motion.div
    variants={pageTransition}
    initial="hidden"
    animate="visible"
    exit="exit">

    <div className="h-[calc(100vh-64px)] flex flex-col p-6 max-w-[1400px] mx-auto overflow-hidden">
      <h2 className="text-slate-100 text-xl font-semibold mb-4 shrink-0">Fleet Overview</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3 mb-3 shrink-0">
        <KpiCard label="Machines Monitored" value={uniqueMachines} />
        <KpiCard label="High Breakdown Risk" value={highRiskCount} colorClass="text-red-500" />
        <KpiCard label="Avg Life Remaining" value={`${avgRUL} cycles`} colorClass="text-amber-500" />
        <KpiCard label="Predictions Today" value={todayCount} colorClass="text-emerald-400" />
      </div>

      {/* Middle row — chart + pie */}
      <div className="grid grid-cols-[1.7fr_1fr] gap-3 mb-3 flex-1 min-h-0">
        <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-4 flex flex-col min-h-0">
          <h3 className="text-slate-100 text-xs font-semibold mb-2 shrink-0">Failure Risk Trend</h3>
          <div className="flex-1 min-h-0">
            <FailureTrendChart data={trendData} />
          </div>
        </div>

        <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-4 flex flex-col min-h-0">
          <h3 className="text-slate-100 text-xs font-semibold mb-3 shrink-0">Machine Health Distribution</h3>
          <div className="flex-1 min-h-0">
            <MPie data={pieData} />
          </div>
        </div>
      </div>

      {/* Bottom — Recent Predictions table */}
      <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-4 shrink-0 flex flex-col" style={{ height: "210px" }}>
        <h3 className="text-slate-100 text-xs font-semibold mb-2 shrink-0">Recent Predictions</h3>
        <div className="flex-1 overflow-y-auto min-h-0">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#10151D]">
              <tr className="border-b border-[#1E2733]">
                <th className="text-left text-slate-500 text-[11px] uppercase font-medium py-2 px-2">Timestamp</th>
                <th className="text-left text-slate-500 text-[11px] uppercase font-medium py-2 px-2">Type</th>
                <th className="text-left text-slate-500 text-[11px] uppercase font-medium py-2 px-2">Machine</th>
                <th className="text-left text-slate-500 text-[11px] uppercase font-medium py-2 px-2">Result</th>
                <th className="text-left text-slate-500 text-[11px] uppercase font-medium py-2 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPredictions.map((p) => (
                <tr key={p.id} className="border-b border-[#1E2733]/50 hover:bg-white/[0.02]">
                  <td className="py-2 px-2 font-mono text-xs text-slate-400">{p.created_at}</td>
                  <td className="py-2 px-2">
                    <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                      p.prediction_type === "failure" ? "bg-red-500/15 text-red-400" : "bg-cyan-500/15 text-cyan-400"
                    }`}>
                      {p.prediction_type === "failure" ? "Failure" : "RUL"}
                    </span>
                  </td>
                  <td className="py-2 px-2 font-mono text-xs text-slate-300">{p.machine_unit || "—"}</td>
                  <td className="py-2 px-2 text-slate-100">{formatResult(p)}</td>
                  <td className="py-2 px-2">
                    <span className={`text-xs font-semibold ${
                      p.risk_level === "high" ? "text-red-500" : p.risk_level === "medium" ? "text-amber-500" : "text-emerald-400"
                    }`}>
                      {p.risk_level === "high" ? "Will Fail: Yes" : p.risk_level === "low" ? "Good" : "Watch"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </motion.div>
  );
}

function KpiCard({ label, value, colorClass = "text-slate-100" }) {
  return (
    <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-4">
      <div className="text-slate-400 text-[11px] uppercase tracking-wide">{label}</div>
      <div className={`${colorClass} text-2xl font-semibold mt-2`}>{value}</div>
    </div>
  );
}

export default Dashboard;