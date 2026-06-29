
const RISK_STYLES = {
  high: { text: "text-red-500", bg: "bg-red-500/15", border: "border-red-500/30", gradient: "from-red-500/10" },
  medium: { text: "text-amber-500", bg: "bg-amber-500/15", border: "border-amber-500/30", gradient: "from-amber-500/10" },
  low: { text: "text-emerald-400", bg: "bg-emerald-400/15", border: "border-emerald-400/30", gradient: "from-emerald-400/10" },
};

function PredictionPanel({ prediction }) {
  if (!prediction) return null;

  const risk = RISK_STYLES[prediction.risk_level];
  const { failure_predicted, confidence } = prediction.result;

  return (
    <div className={`bg-gradient-to-r ${risk.gradient} to-transparent border ${risk.border} rounded-xl p-6 flex flex-wrap items-center justify-between gap-4`}>
      <div className="flex items-center gap-4">
        <span className={`w-2 h-2 rounded-full ${risk.bg.replace("/15", "")}`}></span>
        <div>
          <div className={`text-xl font-bold ${risk.text}`}>
            Breakdown Risk: {prediction.risk_level.toUpperCase()}
          </div>
          <div className="text-slate-400 text-xs mt-0.5">
            {failure_predicted ? "Failure predicted" : "No failure predicted"}
          </div>
        </div>
      </div>
      <div className={`font-mono text-xs font-semibold px-3.5 py-1.5 rounded-full ${risk.bg} ${risk.text}`}>
        {(confidence * 100).toFixed(1)}% CONFIDENCE
      </div>
    </div>
  );
}

export default PredictionPanel;