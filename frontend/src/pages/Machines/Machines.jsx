// src/pages/Machines/Machines.jsx
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { predictRUL } from "../../services/api";
import { DUMMY_MACHINE_SENSORS, MACHINE_UNITS } from "../../data/Sensor"
import MachineCard from "./MachineCard";

const RISK_STYLES = {
  high: { text: "text-red-500", border: "border-red-500", bg: "bg-red-500/15" },
  medium: { text: "text-amber-500", border: "border-amber-500", bg: "bg-amber-500/15" },
  low: { text: "text-emerald-400", border: "border-emerald-400", bg: "bg-emerald-400/15" },
};

function Machines() {
  const [selectedUnit, setSelectedUnit] = useState(MACHINE_UNITS[0]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLoadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const sensorData = DUMMY_MACHINE_SENSORS[selectedUnit];
      const response = await predictRUL({
        unit_id: selectedUnit,
        sensor_readings: sensorData,
      });
      setPrediction(response.data);
    } catch (err) {
      setError("Prediction failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const risk = prediction ? RISK_STYLES[prediction.risk_level] : null;

  return (
    <div className="p-8 max-w-[1240px] mx-auto">
      <h2 className="text-slate-100 text-2xl font-semibold mb-2">Select Machine</h2>
      <p className="text-slate-400 text-sm mb-6">
        CMAPSS FD001 dataset — choose an engine unit to load its sensor history and RUL prediction.
      </p>

      {/* Dropdown + Button */}
      <div className="flex gap-4 mb-7 items-end">
        <div>
          <label className="block text-slate-400 text-xs mb-1.5">Engine Unit</label>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="bg-[#141A24] border border-[#1E2733] text-slate-100 px-4 py-3 rounded-lg text-sm min-w-[240px]"
          >
            {MACHINE_UNITS.map((unit) => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleLoadHistory}
          disabled={loading}
          className="bg-cyan-400 text-[#001016] font-semibold px-5 py-3 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed hover:bg-cyan-300 transition-colors"
        >
          {loading ? "Loading..." : "Load history"}
        </button>
      </div>

      {error && <p className="text-red-500 mb-5">{error}</p>}

      {prediction && (
        <>
          <div className="grid grid-cols-[1.6fr_1fr] gap-4 mb-4">
            {/* RUL Display */}
            <MachineCard title="Remaining Useful Life">
              <div className="flex items-center gap-7">
                <div className={`w-[120px] h-[120px] rounded-full bg-[#0A0E14] border-4 ${risk.border} flex flex-col items-center justify-center`}>
                  <div className={`${risk.text} text-2xl font-bold`}>{prediction.result.rul_cycles}</div>
                  <div className="text-slate-400 text-[10px]">CYCLES LEFT</div>
                </div>
                <div className="text-slate-400 text-sm leading-relaxed">
                  Predicted using XGBoost Regressor trained on CMAPSS FD001.
                  <br />
                  <span className={`inline-block mt-2.5 px-2.5 py-1 rounded text-xs font-semibold ${risk.bg} ${risk.text}`}>
                    {prediction.risk_level.toUpperCase()} RISK
                  </span>
                </div>
              </div>
            </MachineCard>

            {/* Sensor readings table */}
            <MachineCard title="Sensor Readings Used">
              <table className="w-full text-sm text-slate-400">
                <tbody>
                  {Object.entries(DUMMY_MACHINE_SENSORS[selectedUnit]).map(([key, val]) => (
                    <tr key={key} className="border-b border-[#1E2733] last:border-b-0">
                      <td className="py-2">{key}</td>
                      <td className="text-right text-slate-100">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </MachineCard>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* SHAP chart */}
            <MachineCard title="SHAP Explainability">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={prediction.shap_values} layout="vertical">
                  <XAxis type="number" stroke="#7C8A9C" fontSize={11} />
                  <YAxis type="category" dataKey="feature" stroke="#7C8A9C" fontSize={11} width={90} />
                  <Tooltip contentStyle={{ background: "#10151D", border: "1px solid #1E2733" }} />
                  <Bar dataKey="value">
                    {prediction.shap_values.map((entry, index) => (
                      <Cell key={index} fill={entry.value > 0 ? "#FF4D4D" : "#0A8CAA"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </MachineCard>

            {/* AI explanation */}
            <MachineCard title="Why This Happened">
              <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                {prediction.ai_explanation}
              </p>
            </MachineCard>
          </div>
        </>
      )}
    </div>
  );
}

export default Machines;