
const ACTION_ICON = ["🔍", "🔧", "📋"];

function parseExplanation(text) {
  const [exp, act] = text.split("ACTIONS");
  return {
    explanation: exp.replace("EXPLANATION", "").trim(),
    actions: act
      ? act
          .trim()
          .split("\n")
          .map((item) => item.replace("-", "").trim())
          .filter(Boolean)
      : [],
  };
}

function AIExplanation({ text }) {
  if (!text) return null;

  const { explanation, actions } = parseExplanation(text);

  return (
    <div className="bg-[#10151D] border border-[#1E2733] rounded-xl p-5">
      <h3 className="text-slate-100 text-sm font-semibold mb-4">Why This Happened</h3>
      <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">{explanation}</p>

      {actions.length > 0 && (
        <div className="flex flex-col gap-3 mt-4">
          {actions.map((action, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-base leading-none mt-0.5 shrink-0">
                {ACTION_ICON[i] ?? "•"}
              </span>
              <span className="text-slate-400 text-sm leading-snug">{action}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AIExplanation;