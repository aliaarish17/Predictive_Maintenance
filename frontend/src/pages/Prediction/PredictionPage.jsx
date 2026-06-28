// src/pages/Prediction/PredictionPage.jsx
import { useState } from "react";
import { predictFailure } from "../../services/api";
import Form from "./Form";
import PredictionPanel from "./PredictionPanel";
import ShapChart from "./ShapChart";
import AIExplanation from "./AIExplanation";
import { pageTransition } from "../../animations/pageTransition";
import { motion } from "motion/react";


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
    <motion.div
    variants={pageTransition}
    initial="hidden"
    animate="visible"
    exit="exit">

      <div className="px-20 w-full min-h-screen pt-18
       bg-[#0B131A] overflow-y-hidden ">
        <h2 className="text-slate-100 text-2xl font-semibold mb-2">Predict by Input</h2>
        <p className="text-slate-400 text-sm mb-6">
          AI4I 2020 dataset — manually enter sensor readings to classify breakdown risk.
        </p>
  
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Form onSubmit={handleSubmit} loading={loading} />
          {
            prediction && (
              <PredictionPanel prediction={prediction} />
            )
          }
        </div>
  
        {error && <p className="text-red-500 text-sm mb-5">{error}</p>}
  
        {prediction && (
          <div className="space-y-4">
            {/* <PredictionPanel prediction={prediction} /> */}
            <div className="grid grid-cols-2 mb-7 gap-4">
              <ShapChart shapValues={prediction.shap_values} />
              <AIExplanation text={prediction.ai_explanation} />
            </div>
          </div>
        )}
      </div>
       </motion.div>
    );
  }
  
  export default PredictionPage;
   