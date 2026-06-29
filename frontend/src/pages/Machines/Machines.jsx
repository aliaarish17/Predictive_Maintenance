import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { predictRUL } from "../../services/api";
import { DUMMY_MACHINE_SENSORS, MACHINE_UNITS, UNIT_RISK_HINT } from "../../data/Sensor";
import MachineCard from "./MachineCard";
import { data } from "react-router-dom";
import { motion } from "motion/react";
import { pageTransition } from "../../animations/pageTransition";

const RISK = {
  high: 
    { 
      text: "text-red-400", 
      border: "border-red-500",
      bg: "bg-red-500/10",
      dot: "bg-red-400",    
      label: "HIGH RISK" 
    },

  medium: 
  { text: "text-amber-400",   
    border: "border-amber-500",   
    bg: "bg-amber-500/10",   
    dot: "bg-amber-400",   
    label: "MEDIUM RISK" 
  },

  low:    
  { text: "text-emerald-400", 
    border: "border-emerald-500", 
    bg: "bg-emerald-500/10", 
    dot: "bg-emerald-400", 
    label: "LOW RISK" 
  },
};

const ACTION_ICON = ["🔍", "🔧", "📋"]; 

function getRulTrend(rul) {
  if (rul >= 100) return { label: "Healthy", color: "text-emerald-400" };
  if (rul >= 45
  ) return { label: "Declining", color: "text-amber-400" };
  return { label: "Critical", color: "text-red-400" };
}

function getConfidence(rul) {
  if (rul >= 120) return "96%";
  if (rul >= 80)  return "91%";
  if (rul >= 40)  return "87%";
  return "82%";
}


// spliting the string into shorter one
function parseExplanation(text) {
  const [exp, act] = text.split("ACTIONS"); // breaks/SPLITS AT ACTIONS WORD ,  [0,1][0]=> exp, [1]act WALA PART
  return {
    explanation: exp.replace("EXPLANATION", "").trim(), //.trim() removes extra lines and extra spaces

    // condn ? if true : if false:
    actions: act
      ? act // checking if act exists
          .trim()
          .split("\n") //strings--> array
          .map(item => item.replace("-", "").trim()) //on every element same operation
          .filter(Boolean) // removes empty strings
      : [],
  };
}

export default function Machines() {
  const [selectedUnit, setSelectedUnit] = useState(MACHINE_UNITS[0]);
  const [prediction, setPrediction]     = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  async function handleLoadHistory() {
    setLoading(true);
    setError(null);
    setPrediction(null); // old prediction hatao
    try {
      const res = await predictRUL({
        unit_id: selectedUnit,
        sensor_readings: DUMMY_MACHINE_SENSORS[selectedUnit],
      });
      
      
      setPrediction(res.data);
    } catch {
      setError("Prediction failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  }

  let hintRisk = UNIT_RISK_HINT[selectedUnit];
  if (!hintRisk) {
    hintRisk = "low"; //use "low " as defalt if risk nhi mila toh
 }

  const risk = prediction ? RISK[prediction.risk_level] : RISK[hintRisk]; //if prediction comes from backend then we'll use risk_level else dummy level

  const sensorEntries = Object.entries(DUMMY_MACHINE_SENSORS[selectedUnit]); // converts value to array
  
  let rul;
  if (prediction && prediction.result) {
  rul = prediction.result.rul_cycles;
 }

  const trend         = rul !== undefined ? getRulTrend(rul)   : null;
  const confidence    = rul !== undefined ? getConfidence(rul) : null;

  const { explanation, actions } = prediction
    ? parseExplanation(prediction.ai_explanation)
    : { explanation: "", actions: [] };

  let headingColor = "text-cyan-400";

 if (prediction) {
   if (prediction.risk_level === "high") {
     headingColor = "text-red-400";
   }  else if (prediction.risk_level === "medium") {
     headingColor = "text-amber-400";
   }  else {
     headingColor = "text-emerald-400";
   }
 }

 function handleUnitChange(e){
  setSelectedUnit(e.target.value)
  setPrediction(null)
 }

  return (
    <motion.div
    variants={pageTransition}
    initial="hidden"
    animate="visible"
    exit="exit">

    <div className="pt-19 px-20 bg-[#10151D] min-h-screen mx-auto">

      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-slate-100 text-2xl font-semibold">Select Machine</h2>
        <p className="text-slate-400 text-sm mt-1">
          CMAPSS FD001 dataset — choose an engine unit to run RUL prediction.
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-end mb-7 flex-wrap">
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 text-xs uppercase tracking-wider">Engine Unit</label>
          <select
            value={selectedUnit}
            onChange={handleUnitChange}
            className="bg-[#10151D] border border-[#1E2733] text-slate-100 px-4 py-2.5 rounded-lg text-sm min-w-[220px] outline-none cursor-pointer focus:border-slate-500"
          >
            {MACHINE_UNITS.map((u) => 
            <option key={u} 
            value={u}> 
            {u} 
            </option>)}

          </select>
        </div>

        {/* <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${RISK[hintRisk].border} ${RISK[hintRisk].bg}`}>
          <span className={`w-2 h-2 rounded-full ${RISK[hintRisk].dot}`} />
          <span className={`text-xs font-bold ${RISK[hintRisk].text}`}>{RISK[hintRisk].label}</span>
        </div> */}

        <button
          onClick={handleLoadHistory}
          disabled={loading}
          className="h-[32px] cursor-pointer bg-gradient-to-r from-white via-emerald-500 to-emerald-600 text-[#0B131A] font-semibold rounded-lg disabled:opacity-60 disabled:cursor-not-allowed hover:bg-cyan-300 transition-w-full px-4 font-bold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-white via-emerald-400 to-emerald-600 text-[#0B131A] shadow-[0_0_20px_rgba(52,211,153,0.3)]"
        >
          
          {loading ? "Running..." : "Run Prediction"}
        
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl p-4 mb-5">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-1 bg-[#10151D] border border-[#1E2733] rounded-xl h-56 animate-pulse" />
            <div className="flex-1 bg-[#10151D] border border-[#1E2733] rounded-xl h-56 animate-pulse" />
          </div>
          <div className="flex gap-4">
            <div className="flex-1 bg-[#10151D] border border-[#1E2733] rounded-xl h-56 animate-pulse" />
            <div className="flex-1 bg-[#10151D] border border-[#1E2733] rounded-xl h-56 animate-pulse" />
          </div>
        </div>
      )}

      {/* ── ROW 1: RUL + AI Explanation ── */}
      {prediction && (
        <>
          <div className="flex gap-4 mb-4 items-stretch">

            {/* ── RUL Card ──
                Outer: dark card, column layout, full height
                1) Title
                2) Gauge circle — centered
                3) Risk badge — centered
                4) 3 stat boxes in a row
                5) Dataset label
            */}
            <div className="flex-1 min-w-0">
              <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-5 h-full flex flex-col items-center gap-4">

                {/* Title — left-aligned via self-start */}
                <h3 className="text-slate-100 text-sm font-semibold self-start">Remaining Useful Life</h3>

                {/* Gauge circle */}
                <div className={`w-36 h-36 rounded-full bg-[#0A0E14] border-4 ${risk.border} flex flex-col items-center justify-center`}>
                  <span className={`${risk.text} text-4xl font-bold leading-none`}>{rul}</span>
                  <span className="text-slate-500 text-[10px] mt-1 uppercase tracking-widest">cycles</span>
                </div>

                {/* Risk badge */}
                <span className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-widest border ${risk.bg} ${risk.text} ${risk.border}`}>
                  {risk.label}
                </span>

                {/* 3 stat boxes */}
                <div className="flex gap-2 w-full">
                  <div className="flex-1 bg-[#0A0E14] border border-[#1E2733] rounded-lg p-3 text-center">
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Confidence</p>
                    <p className="text-slate-200 text-sm font-semibold">{confidence}</p>
                  </div>
                  <div className="flex-1 bg-[#0A0E14] border border-[#1E2733] rounded-lg p-3 text-center">
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Trend</p>
                    <p className={`text-sm font-semibold ${trend.color}`}>{trend.label}</p>
                  </div>
                  <div className="flex-1 bg-[#0A0E14] border border-[#1E2733] rounded-lg p-3 text-center">
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">Model</p>
                    <p className="text-slate-200 text-sm font-semibold">XGBoost</p>
                  </div>
                </div>

                {/* Dataset label */}
                <p className="text-slate-600 text-[11px]">CMAPSS FD001 Dataset</p>

              </div>
            </div>

            {/* AI Explanation Card */}
            <div className="flex-1 min-w-0">
              <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-5 h-full flex flex-col">
                <h3 className="text-slate-100 text-sm font-semibold mb-4">Why This Happened</h3>

                {/* Analysis */}
                <div className="mb-4">
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${headingColor}`}>
                    Analysis
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{explanation}</p>
                </div>

                <div className="border-t border-[#1E2733] mb-4" />

                {/* Actions */}
                <div className="flex-1">
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${headingColor}`}>
                    Recommended Actions
                  </div>
                  <div className="flex flex-col gap-3">
                    {actions.map((action, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-base leading-none mt-0.5 flex-shrink-0">{ACTION_ICON[i] ?? "•"}</span>
                        <span className="text-slate-400 text-sm leading-snug">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── ROW 2: SHAP + Sensor Readings ── */}
          <div className="flex gap-4 items-stretch">

            {/* SHAP Chart */}
            <div className="flex-1 min-w-0">
              <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-5 h-full flex flex-col">
                <h3 className="text-slate-100 text-sm font-semibold mb-4">SHAP Explainability</h3>
                <div className="flex-1 flex flex-col justify-center">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={prediction.shap_values} layout="vertical" margin={{ left: 0, right: 10 }}>
                      <XAxis type="number" stroke="#4B5563" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="feature" stroke="#6B7280" fontSize={11} width={72} tickLine={false} axisLine={false} />
                      <Tooltip
                        contentStyle={{ background: "#0A0E14", border: "1px solid #1E2733", borderRadius: 8, fontSize: 12 }}
                        cursor={{ fill: "rgba(255,255,255,0.03)" }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {prediction.shap_values.map((entry, i) => (
                          <Cell key={i} fill={entry.value > 0 ? "#f87171" : "#22d3ee"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex gap-4 mt-3 justify-center">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="w-3 h-2 rounded-sm bg-red-400 inline-block" /> Increases risk
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="w-3 h-2 rounded-sm bg-cyan-400 inline-block" /> Reduces risk
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sensor Readings — all in one card, two columns */}
            <div className="flex-1 min-w-0">
              <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-5 h-full flex flex-col">
                <h3 className="text-slate-100 text-sm font-semibold mb-4">Sensor Readings</h3>
                <div className="flex gap-6 flex-1">
                  {/* Left column */}
                  <table className="flex-1 text-sm h-fit">
                    <tbody>
                      {sensorEntries.slice(0, Math.ceil(sensorEntries.length / 2)).map(([key, val]) => (
                        <tr key={key} className="border-b border-[#1E2733] last:border-b-0">
                          <td className="py-2 text-slate-400">{key}</td>
                          <td className="py-2 text-right text-slate-100 font-mono pl-4">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/* Right column */}
                  <table className="flex-1 text-sm h-fit">
                    <tbody>
                      {sensorEntries.slice(Math.ceil(sensorEntries.length / 2)).map(([key, val]) => (
                        <tr key={key} className="border-b border-[#1E2733] last:border-b-0">
                          <td className="py-2 text-slate-400">{key}</td>
                          <td className="py-2 text-right text-slate-100 font-mono pl-4">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
    </motion.div>
  );
}