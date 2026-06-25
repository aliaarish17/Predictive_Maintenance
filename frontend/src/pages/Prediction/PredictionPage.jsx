// src/pages/Prediction/PredictionPage.jsx
import { useState } from "react";
import { predictFailure } from "../../services/api";
import Form from "./Form";
import PredictionPanel from "./PredictionPanel";
import ShapChart from "./ShapChart";
import AIExplanation from "./AIExplanation";

function PredictionPage() {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await predictFailure(formData);
      setPrediction(response.data);
    } catch (err) {
      setError("Prediction failed. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-[1240px] mx-auto">
      <h2 className="text-slate-100 text-2xl font-semibold mb-2">Predict by Input</h2>
      <p className="text-slate-400 text-sm mb-6">
        AI4I 2020 dataset — manually enter sensor readings to classify breakdown risk.
      </p>

      <div className="mb-6">
        <Form onSubmit={handleSubmit} loading={loading} />
      </div>

      {error && <p className="text-red-500 text-sm mb-5">{error}</p>}

      {prediction && (
        <div className="space-y-4">
          <PredictionPanel prediction={prediction} />
          <div className="grid grid-cols-2 gap-4">
            <ShapChart shapValues={prediction.shap_values} />
            <AIExplanation text={prediction.ai_explanation} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictionPage;