# Industrial Predictive Maintenance Platform

An end-to-end industrial predictive maintenance platform engineered to detect machine failure risks and forecast Remaining Useful Life (RUL) of heavy machinery in real time. The system combines tree-based machine learning (XGBoost), model interpretability (SHAP), and large language model intelligence (Google Gemini 2.5 Flash) into a unified operational dashboard built with FastAPI and React.

---

## 1. System Overview

In industrial environments, unplanned equipment downtime leads to severe operational bottlenecks, safety hazards, and compounding maintenance expenses. This platform ingests multi-sensor telemetry (temperature, rotational speed, torque, tool wear, and turbofan cycle degradation metrics) to provide real-time diagnostic and prognostic intelligence:

1. **Binary Failure Classification**: Evaluates current operational telemetry to determine whether equipment failure is imminent and categorizes operational risk into Low, Medium, or High tiers.
2. **Remaining Useful Life (RUL) Estimation**: Forecasts the remaining operational cycle count for machinery and engine components before critical maintenance thresholds are reached.
3. **Model Explainability (SHAP)**: Computes local Shapley additive explanations for every inference call, highlighting exactly which sensor parameters drive risk upward or downward.
4. **Natural Language Root-Cause Analysis**: Integrates Google Gemini 2.5 Flash to automatically translate statistical model outputs and SHAP attributions into actionable diagnostic summaries and prescriptive maintenance steps for floor technicians.
5. **Auditable Telemetry History**: Persists every inference request, raw input payload, risk tier, SHAP contribution list, and AI action plan to an embedded SQLite database with Indian Standard Time (IST) timestamps.

---

## 2. High-Level Architecture

The platform follows a decoupled, three-tier microservice-style architecture designed for low inference latency and clear separation of concerns.

```
+-----------------------------------------------------------------------------------+
|                                  USER BROWSER                                     |
|  React 19 + Vite Frontend (Port 5173 / 3000)                                      |
|  - Real-Time Predictive Dashboard (KPI cards, risk trends, distribution charts)  |
|  - Failure Diagnostics Form (5 continuous sensor inputs)                         |
|  - Turbofan RUL Analyzer (14 degradation sensors, interactive gauge)             |
|  - SHAP Explainer Visualizations (Bidirectional Recharts Bar Charts)             |
|  - Historical Audit Log (Filterable table by risk and prediction type)            |
+------------------------------------------+----------------------------------------+
                                           |
                                  HTTP REST (Axios)
                                  JSON Request / Response
                                           |
+------------------------------------------v----------------------------------------+
|                                  BACKEND API                                      |
|  FastAPI + Uvicorn (Port 8000)                                                    |
|  - CORS Middleware validation                                                     |
|  - Pydantic schema validation (FailureInput, RULInput)                            |
|  - REST routing (/predict/failure, /predict/rul, /history, /health)               |
+---------------------+-------------------------------+-----------------------------+
                      |                               |
       +--------------+--------------+                |
       |                             |                |
+------v---------------------+ +-----v----------------v-----+ +---------------------+
|      ML INFERENCE          | |      AI EXPLAINABILITY     | |   DATA PERSISTENCE  |
| - XGBoost Classifier       | | - Google Gemini 2.5 Flash  | | - SQLite DB         |
|   (AI4I 2020 Model)        | |   (Prompt engineering)     | | - Predictions table |
| - XGBoost Regressor        | | - Low-risk static cache    | | - IST timestamping  |
|   (NASA CMAPSS FD001)      | | - Structured fallback      | | - Filtered queries  |
| - Precomputed TreeExplainer| |   generator                | +---------------------+
| - Pretrained MinMaxScaler  | +----------------------------+
+----------------------------+
```

---

## 3. Technology Stack

| Domain | Technology / Library | Version | Operational Function |
|---|---|---|---|
| **Frontend Framework** | React.js | 19.2.6 | Component-based interactive user interface |
| **Build Tool** | Vite | 8.0.12 | High-speed frontend bundling and local HMR dev server |
| **Client Routing** | React Router DOM | 7.18.0 | Declarative multi-page routing and navigation state |
| **Styling** | Tailwind CSS | 4.3.1 | Utility-first responsive design and custom dark UI theme |
| **Visualizations** | Recharts | 3.9.0 | Horizontal bar charts for SHAP, trend area charts, pie charts |
| **UI Motion** | Motion (Framer Motion) | 12.42.0 | Page transitions and reactive card entrance animations |
| **Icons** | Material UI Icons | 9.1.1 | Visual navigation and status badges |
| **HTTP Client** | Axios | 1.18.1 | Promise-based asynchronous HTTP client |
| **Backend Framework** | FastAPI | >= 0.115.0 | High-performance asynchronous REST API framework |
| **ASGI Web Server** | Uvicorn | >= 0.30.6 | Production-grade lightning-fast ASGI server |
| **Data Validation** | Pydantic & Pydantic-Settings | >= 2.9.2 | Strict schema parsing, runtime type checks, .env loading |
| **Machine Learning** | XGBoost | >= 2.1.1 | Gradient boosted classification and regression models |
| **Model Interpretability**| SHAP | >= 0.46.0 | Game-theoretic feature attribution via TreeExplainer |
| **Preprocessing & Metrics**| Scikit-Learn | >= 1.5.2 | Train/test splits, MinMaxScaler, classification metrics |
| **Data Manipulation** | Pandas & NumPy | >= 2.2.0 / >= 1.26.4 | Telemetry vector transformation and tabular ingestion |
| **Generative AI** | Google GenAI SDK (`gemini-2.5-flash`) | 1.3.0 | Automated diagnostic reporting and corrective action drafting |
| **Database** | SQLite3 | Native | Embedded ACID-compliant relational persistence store |


---

## 4. Machine Learning Pipelines & Datasets

The platform employs two distinct machine learning models tailored to different industrial maintenance paradigms: binary breakdown classification and continuous run-to-failure regression.

### 4.1 Failure Classification Pipeline (AI4I 2020 Dataset)

* **Dataset Origin**: AI4I 2020 Predictive Maintenance Dataset (`backend/data/ai4i2020.csv`), comprising 10,000 synthetic milling machine operation records reflecting real-world tool wear and thermal limits.
* **Feature Schema**:
  * `air_temp`: Air temperature in Kelvin (surrounding ambient working conditions).
  * `process_temp`: Process temperature in Kelvin (internal operational temperature).
  * `rotational_speed`: Spindle rotational speed in revolutions per minute (RPM).
  * `torque`: Torque generated by the spindle in Newton-meters (Nm).
  * `tool_wear`: Accumulated tool usage in minutes.
* **Target Variable**: `Machine failure` (binary: 0 = normal operation, 1 = equipment failure).
* **Training Methodology**:
  * Evaluated on an 80/20 train-test split (`random_state=42`).
  * Classifier: Extreme Gradient Boosting (`XGBClassifier`) configured with:
    * `n_estimators=100`
    * `max_depth=6`
    * `learning_rate=0.1`
    * `random_state=42`
* **Performance Benchmark**:
  * **Overall Accuracy**: 98.3%
  * **Weighted F1 Score**: 0.98
  * **Failure Class Precision**: 0.79
  * **Failure Class Recall**: 0.61
* **Serialized Artifact**: `backend/models/failure_model.pkl`

### 4.2 Remaining Useful Life (RUL) Pipeline (NASA CMAPSS FD001)

* **Dataset Origin**: NASA Commercial Modular Aero-Propulsion System Simulation (CMAPSS) Turbofan Engine Degradation Simulation (`backend/data/train_FD001.txt`). Contains run-to-failure operational profiles across multiple engine units under sea-level conditions.
* **Feature Engineering**:
  * Ground-truth RUL target computed per engine unit:
    $$\text{RUL}_{i,t} = \max(\text{cycle}_i) - \text{cycle}_{i,t}$$
  * Sensor Reduction: Non-informative columns and invariant sensors showing zero variance across cycles are eliminated (`sensor1`, `sensor5`, `sensor6`, `sensor10`, `sensor16`, `sensor18`, `sensor19`, `setting1`, `setting2`, `setting3`).
  * Retained 14 predictive sensor streams: `sensor2`, `sensor3`, `sensor4`, `sensor7`, `sensor8`, `sensor9`, `sensor11`, `sensor12`, `sensor13`, `sensor14`, `sensor15`, `sensor17`, `sensor20`, `sensor21`.
* **Preprocessing**: Scikit-Learn `MinMaxScaler` fitted exclusively on training sensor vectors, scaling feature inputs to the range $[0, 1]$.
* **Training Methodology**:
  * Evaluated on an 80/20 train-test split (`random_state=42`).
  * Regressor: Extreme Gradient Boosting (`XGBRegressor`) configured with:
    * `n_estimators=100`
    * `max_depth=6`
    * `learning_rate=0.1`
    * `random_state=42`
* **Performance Benchmark**:
  * **Mean Absolute Error (MAE)**: 29.76 operational cycles
  * **Root Mean Squared Error (RMSE)**: 41.54 operational cycles
* **Serialized Artifacts**: `backend/models/rul_model.pkl` and `backend/models/rul_scaler.pkl`

### 4.3 Risk Tier Assignment Matrix

Inference responses translate raw model probabilities and cycle estimations into standard operational risk levels:

| Prediction Type | Metric Condition | Assigned Risk Level | Operational Meaning |
|---|---|---|---|
| **Failure Prediction** | Probability > 0.70 | `high` | Imminent breakdown expected. Immediate intervention required. |
| **Failure Prediction** | 0.40 < Probability <= 0.70 | `medium` | Anomalous conditions detected. Inspection recommended. |
| **Failure Prediction** | Probability <= 0.40 | `low` | Machine is operating within normal tolerances. |
| **RUL Estimation** | Predicted RUL < 45 cycles | `high` | Critical end-of-life window. Schedule immediate overhaul. |
| **RUL Estimation** | 45 <= Predicted RUL < 100 cycles | `medium` | Degradation active. Prepare spare parts and schedule maintenance. |
| **RUL Estimation** | Predicted RUL >= 100 cycles | `low` | Healthy operating horizon. Continue routine monitoring. |
