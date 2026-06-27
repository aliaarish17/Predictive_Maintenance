import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getHistory } from "../../services/api";
import { pageTransition } from "../../animations/pageTransition";

// Risk level styles
const riskColor = {
  high: "text-red-500",
  medium: "text-amber-500",
  low: "text-emerald-400",
};

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [riskFilter, setRiskFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Fetch on mount and whenever filters change
  useEffect(() => {
    setLoading(true);
    getHistory({
      limit: 25,
      ...(riskFilter && { risk_level: riskFilter }),
      ...(typeFilter && { prediction_type: typeFilter }),
    })
      .then((res) => setPredictions(res.data.predictions))
      .catch(() => setError("Failed to load history."))
      .finally(() => setLoading(false));
  }, [riskFilter, typeFilter]);

  // Format "2024-06-01 14:32:00" → "Jun 1, 2:32 PM"
  function formatDate(str) {
    if (!str) return "—";
    return new Date(str).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  // Show a short result summary per prediction type
  function getResult(p) {
    if (p.prediction_type === "failure") {
      const prob = p.result?.failure_probability;
      return prob != null
        ? `${(prob * 100).toFixed(1)}% failure prob`
        : p.result?.failure_predicted
        ? "Failure predicted"
        : "No failure";
    }
    if (p.prediction_type === "rul") {
      return `${p.result?.rul_cycles ?? "—"} cycles left`;
    }
    return "—";
  }

  return (
    <motion.div
    variants={pageTransition}
    initial="hidden"
    animate="visible"
    exit="exit">

    <div className="pt-19 px-20 min-h-screen bg-[#0B131A] overflow-x-hidden ">

      {/* Header */}
      <h2 className="text-slate-100 text-2xl font-semibold mb-1">Prediction History</h2>
      <p className="text-slate-400 text-sm mb-6">Browse all past predictions.</p>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="bg-[#10151D] border border-[#1E2733] text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none"
        >
          <option value="">All Risk Levels</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#10151D] border border-[#1E2733] text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="failure">Failure</option>
          <option value="rul">RUL</option>
        </select>

        {(riskFilter || typeFilter) && (
          <button
            onClick={() => { setRiskFilter(""); setTypeFilter(""); }}
            className="text-black-400 text-sm  border border-[#1E2733] rounded-lg px-3 py-2 hover:text-slate-200"
          >
            Clear
          </button>
        )}

        <span className="ml-auto text-slate-500 text-sm self-center">
          {predictions.length} results
        </span>
      </div>

      {/* Table */}
      <div className="bg-[#10151D] max-h-[500px] p-3 overflow-x-hidden overflow-y-auto border border-[#1E2733] rounded-xl overflow-hidden">

        {/* Loading / Error / Empty states */}
        {loading && <p className="text-slate-400 p-8">Loading...</p>}
        {error   && <p className="text-red-500 p-8">{error}</p>}
        {!loading && !error && predictions.length === 0 && (
          <p className="text-slate-400 p-8">No predictions found.</p>
        )}

        {/* Table rows */}
        {!loading && !error && predictions.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E2733] text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3">Time</th>
                <th className="text-left px-5 py-3">Machine</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-left px-5 py-3">Result</th>
                <th className="text-left px-5 py-3">Risk</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#1E2733] last:border-b-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3 text-slate-400">{formatDate(p.created_at)}</td>
                  <td className="px-5 py-3 text-slate-200">{p.machine_unit || "—"}</td>
                  <td className="px-5 py-3 text-slate-300 capitalize">{p.prediction_type}</td>
                  <td className="px-5 py-3 text-slate-300">{getResult(p)}</td>
                  <td className={`px-5 py-3 font-semibold ${riskColor[p.risk_level]}`}>
                    {p.risk_level.toUpperCase()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </motion.div>
  );
}