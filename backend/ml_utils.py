# ml_utils.py
import pickle
import shap
import pandas as pd
import numpy as np
from config import settings

# ── Models + scaler load (ek baar, server start hote hi) ──
with open(settings.failure_model_path, "rb") as f:
    failure_model = pickle.load(f)

with open(settings.rul_model_path, "rb") as f:
    rul_model = pickle.load(f)

with open(settings.rul_scaler_path, "rb") as f:
    rul_scaler = pickle.load(f)

failure_explainer = shap.TreeExplainer(failure_model)
rul_explainer = shap.TreeExplainer(rul_model)

# ── FAILURE MODEL ── (train_failure.py ke exact 5 columns)
FAILURE_FEATURES = ["air_temp", "process_temp", "rotational_speed", "torque", "tool_wear"]

def predict_failure(data: dict):
    row = {
        "air_temp": data["air_temperature"],
        "process_temp": data["process_temperature"],
        "rotational_speed": data["rotational_speed"],
        "torque": data["torque"],
        "tool_wear": data["tool_wear"],
    }
    df = pd.DataFrame([row])[FAILURE_FEATURES]

    proba = failure_model.predict_proba(df)[0]

# Probability of failure (class 1)
    failure_prob = float(proba[1])

    pred_class = 1 if failure_prob >= 0.5 else 0

    shap_vals = failure_explainer.shap_values(df)
    shap_row = shap_vals[1][0] if isinstance(shap_vals, list) else shap_vals[0]

    shap_list = [
        {
            "feature": feat,
            "value": round(float(val), 4)
        }
        for feat, val in sorted(
            zip(FAILURE_FEATURES, shap_row),
            key=lambda x: -abs(x[1])
        )[:6]
    ]

    risk = (
        "high" if failure_prob > 0.7
        else "medium" if failure_prob > 0.4
        else "low"
    )

    return {
        "result": {
            "failure_predicted": bool(pred_class),
            "confidence": round(failure_prob, 4)
        },
        "shap_values": shap_list,
        "risk_level": risk
    }

# ── RUL MODEL ── (train_rul.py ke exact 14 columns, scaled)
RUL_DROP_SENSORS = ["sensor1", "sensor5", "sensor6", "sensor10", "sensor16", "sensor18", "sensor19"]
RUL_FEATURES = [f"sensor{i}" for i in range(1, 22) if f"sensor{i}" not in RUL_DROP_SENSORS]

def predict_rul(sensor_readings: dict):
    df = pd.DataFrame([sensor_readings])[RUL_FEATURES]
    df_scaled = rul_scaler.transform(df)

    rul_cycles = float(rul_model.predict(df_scaled)[0])

    shap_vals = rul_explainer.shap_values(df_scaled)
    shap_list = [
        {"feature": feat, "value": round(float(val), 4)}
        for feat, val in sorted(zip(RUL_FEATURES, shap_vals[0]), key=lambda x: -abs(x[1]))[:6]
    ]

    risk = "high" if rul_cycles < 20 else "medium" if rul_cycles < 60 else "low"
    return {
        "result": {"rul_cycles": round(rul_cycles, 1)},
        "shap_values": shap_list,
        "risk_level": risk
    }