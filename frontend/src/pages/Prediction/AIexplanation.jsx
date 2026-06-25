// src/pages/Prediction/AIExplanation.jsx

function AIExplanation({ text }) {
  if (!text) return null;

  return (
    <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-5">
      <h3 className="text-slate-100 text-sm font-semibold mb-4">Why This Happened</h3>
      <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  );
}

export default AIExplanation;