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


---

## 5. Explainable AI & Generative Diagnostic Intelligence

A critical barrier to deploying machine learning in heavy industry is the "black box" nature of complex models. This platform addresses interpretability at two complementary levels: quantitative feature attribution through SHAP and qualitative diagnostic communication through Google Gemini 2.5 Flash.

### 5.1 SHAP (SHapley Additive exPlanations)

* **Pre-initialized TreeExplainer**: During server initialization, SHAP `TreeExplainer` instances are fitted once over the deserialized XGBoost trees. This avoids recomputing tree topologies on every request and keeps inference times within milliseconds.
* **Marginal Attribution Calculation**: For each input vector $x$, SHAP computes the Shapley value $\phi_j$ for each feature $j$:
  $$\phi_j(x) = \sum_{S \subseteq F \setminus \{j\}} \frac{|S|!(|F| - |S| - 1)!}{|F|!} \left[ f(S \cup \{j\}) - f(S) \right]$$
  where $F$ is the complete feature set, and $S$ is any subset excluding feature $j$.
* **Feature Extraction**:
  * For failure prediction, SHAP calculates the attributions on raw inputs across all 5 features.
  * For RUL prediction, SHAP evaluates contributions across the 14 scaled sensor signals.
  * The top 6 features sorted by absolute magnitude $|\phi_j|$ are returned in the API response:
    ```json
    [
      {"feature": "tool_wear", "value": 0.4215},
      {"feature": "torque", "value": 0.2831},
      {"feature": "rotational_speed", "value": -0.1542}
    ]
    ```
* **Frontend Visualization**:
  * Red bar ($\phi_j > 0$): Increases the likelihood of breakdown / accelerates machine degradation.
  * Cyan bar ($\phi_j < 0$): Stabilizes the machine / drives risk downward toward baseline.

### 5.2 Google Gemini 2.5 Flash LLM Integration

The backend leverages Google's `gemini-2.5-flash` model via the official `google-genai` SDK to convert quantitative telemetry and SHAP vectors into conversational, domain-specific advice.

* **Conditional API Invocation**:
  * **Low Risk**: To reduce latency and minimize token consumption, predictions falling into the `low` risk tier bypass the Gemini API entirely. The backend returns a pre-configured, validated normal-status response.
  * **Medium & High Risk**: The backend constructs a structured prompt combining the prediction outcome, signed SHAP impact factors, and raw sensor values, dispatching it to `gemini-2.5-flash`.
* **Prompt Engineering & Contract Enforcement**:
  The system prompt enforces strict syntactic formatting so the React client can parse the response deterministically:
  ```
  EXPLANATION
  <3 sentences max explaining why this prediction was made in plain language. No ML jargon.>

  ACTIONS
  - <action 1>
  - <action 2>
  - <action 3>
  ```
* **Automated Client Parsing**:
  * The frontend splits the returned payload across the `ACTIONS` delimiter.
  * The diagnostic block is displayed under the "Why This Happened" card.
  * The action items are rendered as prioritized checklist entries with maintenance status indicators.
* **Graceful Degradation (Fallback Handler)**:
  If an API rate limit, quota exhaustion, or network disconnect occurs, the backend catches the exception and immediately supplies a structured fallback diagnostic, ensuring the user interface never stalls or drops the prediction payload.


---

## 6. API Reference & Data Schemas

The backend exposes a high-performance RESTful API built with FastAPI, validating all input payloads through strict Pydantic models.

### 6.1 Endpoints Summary

| Method | Endpoint | Description | Request Body | Response Model |
|---|---|---|---|---|
| `POST` | `/predict/failure` | Runs binary breakdown classification, computes SHAP values, generates AI root-cause analysis, and saves to database. | `FailureInput` | `PredictionResponse` |
| `POST` | `/predict/rul` | Runs remaining operational life regression, computes SHAP values, generates AI explanation, and saves to database. | `RULInput` | `PredictionResponse` |
| `GET` | `/history` | Fetches historical prediction records sorted by date descending. Supports query parameters. | None | `list[HistoryItem]` |
| `GET` | `/health` | Service health probe returning operational status. | None | `{"status": "healthy"}` |
| `GET` | `/` | Service root identification metadata. | None | `{"status": "ok", "service": "..."}` |

### 6.2 Pydantic Data Contracts

#### Request Models (`backend/schemas.py`)

```python
class FailureInput(BaseModel):
    machine_name: Optional[str] = None
    machine_type: Optional[Literal["L", "M", "H"]] = None
    air_temperature: float = Field(..., gt=0)        # Ambient air temp in Kelvin
    process_temperature: float = Field(..., gt=0)    # Process temp in Kelvin
    rotational_speed: float = Field(..., gt=0)       # Spindle speed in RPM
    torque: float = Field(..., ge=0)                 # Torque in Nm
    tool_wear: float = Field(..., ge=0)              # Tool wear time in minutes

class RULInput(BaseModel):
    unit_id: str                                     # Engine / machine unit identifier (e.g., 'Unit_1')
    sensor_readings: dict[str, float]                # 14 active sensor keys (sensor2 ... sensor21)
```

#### Response Models (`backend/schemas.py`)

```python
class ShapValue(BaseModel):
    feature: str
    value: float

class PredictionResponse(BaseModel):
    prediction_id: str                               # UUIDv4 primary key
    prediction_type: Literal["failure", "rul"]
    result: dict                                     # Breakdown confidence or RUL cycles
    risk_level: Literal["high", "medium", "low"]
    shap_values: list[ShapValue]                     # Top 6 contributing factors
    ai_explanation: str                              # Structured EXPLANATION and ACTIONS block

class HistoryItem(BaseModel):
    id: str
    created_at: str                                  # Timestamp formatted in IST
    source: str                                      # 'predict_input' or 'select_machine'
    machine_unit: Optional[str] = None
    prediction_type: str
    result: dict
    risk_level: str
```

### 6.3 Example Requests & Responses

#### Failure Prediction Request

```bash
curl -X POST http://localhost:8000/predict/failure \
  -H "Content-Type: application/json" \
  -d '{
    "machine_name": "Milling-Unit-04",
    "machine_type": "M",
    "air_temperature": 302.5,
    "process_temperature": 311.2,
    "rotational_speed": 1380.0,
    "torque": 68.4,
    "tool_wear": 215.0
  }'
```

#### Failure Prediction Response

```json
{
  "prediction_id": "7b6867e9-4e76-4d57-b087-98e3b334863c",
  "prediction_type": "failure",
  "result": {
    "failure_predicted": true,
    "confidence": 0.8841
  },
  "risk_level": "high",
  "shap_values": [
    {"feature": "tool_wear", "value": 0.4512},
    {"feature": "torque", "value": 0.3129},
    {"feature": "rotational_speed", "value": 0.1873},
    {"feature": "air_temp", "value": 0.0541},
    {"feature": "process_temp", "value": -0.0123}
  ],
  "ai_explanation": "EXPLANATION\nThe machine is exhibiting critical tool wear combined with abnormally high operational torque that significantly exceeds safe tolerance limits. These conditions indicate severe mechanical stress on the spindle assembly, creating an immediate danger of tool breakage during machining. Immediate preventative shutdown is necessary to avert catastrophic damage to the workpiece and drive mechanism.\n\nACTIONS\n- Halt current milling operations and lock out the machine spindle immediately.\n- Inspect the cutting insert and replace worn tool tooling before restarting work.\n- Verify drive motor torque sensors and calibrate lubrication feeds on the spindle head."
}
```

#### Remaining Useful Life (RUL) Request

```bash
curl -X POST http://localhost:8000/predict/rul \
  -H "Content-Type: application/json" \
  -d '{
    "unit_id": "Unit_3",
    "sensor_readings": {
      "sensor2": 642.35, "sensor3": 1582.79, "sensor4": 1401.87,
      "sensor7": 554.32, "sensor8": 2388.08, "sensor9": 9054.12,
      "sensor11": 47.47, "sensor12": 521.82, "sensor13": 2388.07,
      "sensor14": 8138.62, "sensor15": 8.4190, "sensor17": 392.0,
      "sensor20": 38.88, "sensor21": 23.37
    }
  }'
```

#### Querying Historical Predictions

```bash
curl -X GET "http://localhost:8000/history?risk_level=high&limit=10"
```


---

## 7. Database Architecture & Persistence Layer

All incoming telemetry, model outputs, SHAP explanations, and AI recommendations are committed to an embedded SQLite database (`backend/predictive_maintenance.db`).

### 7.1 Relational Schema (`predictions` table)

The database schema is initialized automatically upon application startup through FastAPI's lifespan handler:

```sql
CREATE TABLE IF NOT EXISTS predictions (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    source TEXT NOT NULL,
    machine_unit TEXT,
    machine_type TEXT,
    input_data TEXT NOT NULL,
    prediction_type TEXT NOT NULL,
    result TEXT NOT NULL,
    shap_values TEXT NOT NULL,
    ai_explanation TEXT,
    risk_level TEXT NOT NULL
);
```

### 7.2 Field Specifications

| Column | SQL Type | Description |
|---|---|---|
| `id` | `TEXT PRIMARY KEY` | Universally Unique Identifier (UUIDv4) generated per inference request. |
| `created_at` | `TEXT` | Timestamp string recorded in Indian Standard Time (IST, UTC+5:30) via `%Y-%m-%d %H:%M:%S`. |
| `source` | `TEXT` | Request origin identifier: `'predict_input'` (manual form) or `'select_machine'` (preconfigured unit). |
| `machine_unit` | `TEXT` | Plant identifier or turbofan unit label (e.g., `'Unit_1'`, `'Milling-Unit-04'`). Nullable. |
| `machine_type` | `TEXT` | Tool quality rating: `'L'` (Low), `'M'` (Medium), `'H'` (High). Nullable. |
| `input_data` | `TEXT` | Serialized JSON payload containing the raw multi-sensor telemetry readings submitted. |
| `prediction_type` | `TEXT` | Categorical classification of request: `'failure'` or `'rul'`. |
| `result` | `TEXT` | Serialized JSON dictionary of inference results (`failure_predicted`, `confidence`, or `rul_cycles`). |
| `shap_values` | `TEXT` | Serialized JSON array of the top 6 features and their signed marginal impact values. |
| `ai_explanation` | `TEXT` | Raw text block returned by Gemini 2.5 Flash (`EXPLANATION` and `ACTIONS`). |
| `risk_level` | `TEXT` | Normalized operational risk classification: `'low'`, `'medium'`, or `'high'`. |

### 7.3 Data Access Pattern & Thread Safety

* **Context-Managed Sessions**: Database connections are wrapped inside a Python context manager (`get_db()`) that ensures every connection is securely committed and closed immediately upon transaction completion, preventing connection leaks.
* **Row Factory Mapping**: The `sqlite3.Row` factory is utilized to enable dict-like key access across SQL results.
* **Parameterized Filtering**: The `get_history()` query engine builds parameterized `WHERE` clauses dynamically, preventing SQL injection vulnerabilities while enabling flexible multi-dimensional filtering across risk tiers and prediction types:
  ```python
  def get_history(risk_level: str | None = None, prediction_type: str | None = None, limit: int = 50):
      # Dynamic parameterized query construction
      ...
  ```


---

## 8. Frontend Architecture & User Interface

The frontend is constructed with React 19, Vite, and Tailwind CSS, following a modular component architecture with client-side routing.

### 8.1 Page Routing & Views (`src/main.jsx`)

The user interface is structured around five primary routes managed by `createBrowserRouter`:

| Route | Component | Key Responsibilities |
|---|---|---|
| `/home` | `Home.jsx` | Landing screen showcasing industrial monitoring capabilities, architectural breakdown, and quick action pathways. |
| `/dashboard` | `Dashboard.jsx` | Executive overview displaying 4 key metrics (Monitored Machines, High Risk Count, Average RUL, Today's Inferences), a 5-point rolling average risk trend AreaChart, a fleet risk distribution PieChart, and a live recent predictions table. |
| `/predict` | `PredictionPage.jsx` | Failure diagnostic portal. Contains a 5-parameter numerical input form (`Form.jsx`), a real-time risk assessment badge (`PredictionPanel.jsx`), a horizontal SHAP attribution chart (`ShapChart.jsx`), and the Gemini root-cause explanation box (`AIexplanation.jsx`). |
| `/machines` | `Machines.jsx` | Turbofan engine health monitor. Allows technicians to select specific engine units (`Unit_1` through `Unit_10`), view loaded multi-sensor readings, execute RUL regressions, visualize remaining cycles inside a circular gauge, and review component-level SHAP attributions. |
| `/history` | `History.jsx` | Comprehensive audit log displaying past machine evaluations with filters for prediction type (`failure`, `rul`) and risk tier (`all`, `high`, `medium`, `low`). |

### 8.2 Core Visual Components

#### Horizontal SHAP Attribution Chart (`src/pages/Prediction/ShapChart.jsx`)
* Built with Recharts `BarChart` in vertical layout.
* Maps feature attributions directly to visual impact colors:
  * **Red (`#f87171`)**: Positive SHAP value indicating a feature driving failure probability upward.
  * **Cyan (`#22d3ee`)**: Negative SHAP value indicating a feature stabilizing equipment condition.
* Responsive tooltip displays exact Shapley values up to 4 decimal places.

#### Circular RUL Gauge (`src/pages/Machines/Machines.jsx`)
* Custom SVG radial gauge displaying predicted remaining operating cycles centered with real-time risk-colored ring borders.
* Automatically marks equipment status as **Critical** ($< 45$ cycles), **Degrading** ($45 - 99$ cycles), or **Nominal** ($\ge 100$ cycles).

### 8.3 Risk-Responsive Design System

The visual design system enforces immediate cognitive clarity by propagating risk state across text, borders, and backgrounds:

| Risk Tier | UI Badge | Border Class | Text Class | Background Accent |
|---|---|---|---|---|
| **High** | `CRITICAL RISK` | `border-red-500` | `text-red-400` | `bg-red-500/10` |
| **Medium** | `WARNING / MODERATE` | `border-amber-500` | `text-amber-400` | `bg-amber-500/10` |
| **Low** | `HEALTHY / NOMINAL` | `border-emerald-500` | `text-emerald-400` | `bg-emerald-500/10` |


---

## 9. Installation & Execution Guide

Follow these sequential steps to install dependencies, configure environment secrets, train machine learning models, and launch both frontend and backend development servers.

### 9.1 System Prerequisites

* **Operating System**: Windows 10/11, macOS, or Linux
* **Python**: Version 3.10, 3.11, or 3.12 installed
* **Node.js**: Version 18.x or 20.x (LTS recommended) with `npm`
* **Git**: Installed and configured
* **Google Gemini API Key**: Acquired via Google AI Studio

### 9.2 Clone the Repository

```bash
git clone https://github.com/aliaarish17/Predictive_Maintenance.git
cd Predictive-Maintenance
```

### 9.3 Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   * **Windows (PowerShell)**:
     ```powershell
     python -m venv myenv
     .\myenv\Scripts\Activate.ps1
     ```
   * **macOS / Linux**:
     ```bash
     python3 -m venv myenv
     source myenv/bin/activate
     ```

3. Install required Python packages:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

4. Configure environment variables in `backend/.env`:
   Create a `.env` file in the `backend/` directory with the following variables:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   FAILURE_MODEL_PATH=models/failure_model.pkl
   RUL_MODEL_PATH=models/rul_model.pkl
   RUL_SCALER_PATH=models/rul_scaler.pkl
   ```

### 9.4 (Optional) Retrain ML Models

Pretrained model weights (`failure_model.pkl`, `rul_model.pkl`, `rul_scaler.pkl`) are already provided in `backend/models/`. If you want to retrain the models from the raw source datasets in `backend/data/`:

1. Train the binary failure classifier (AI4I 2020 dataset):
   ```bash
   python ml/train_failure.py
   ```
   *This outputs accuracy and classification metrics, then saves `backend/models/failure_model.pkl`.*

2. Train the turbofan remaining useful life regressor (CMAPSS dataset):
   ```bash
   python ml/train_rul.py
   ```
   *This runs feature engineering, scales sensors with `MinMaxScaler`, and saves `backend/models/rul_model.pkl` and `backend/models/rul_scaler.pkl`.*

### 9.5 Frontend Setup

1. Open a separate terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install all node dependencies:
   ```bash
   npm install
   ```

### 9.6 Running the Application

#### Step 1: Start the FastAPI Backend Server
In the activated Python backend terminal:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
* **Interactive OpenAPI Swagger Docs**: Accessible at `http://localhost:8000/docs`
* **ReDoc Documentation**: Accessible at `http://localhost:8000/redoc`
* **Health Check**: `http://localhost:8000/health`

#### Step 2: Start the Vite React Frontend
In the frontend terminal:
```bash
npm run dev
```
The terminal will display the local Vite server URL (typically `http://localhost:5173` or `http://localhost:5174`). Open this URL in any modern web browser to access the application.


---

## 10. Repository Directory Structure

```
Predictive_Maintenance/
│
├── backend/
│   ├── data/
│   │   ├── ai4i2020.csv              # AI4I 2020 failure classification dataset (10,000 records)
│   │   ├── train_FD001.txt           # NASA CMAPSS run-to-failure turbofan training dataset
│   │   ├── test_FD001.txt            # CMAPSS test split sensor trajectories
│   │   └── RUL_FD001.txt             # True RUL target labels for test engines
│   │
│   ├── ml/
│   │   ├── train_failure.py          # Script to train XGBoost failure classifier
│   │   └── train_rul.py              # Script to train XGBoost RUL regressor and fit MinMaxScaler
│   │
│   ├── models/
│   │   ├── failure_model.pkl         # Serialized XGBoost classification model
│   │   ├── rul_model.pkl             # Serialized XGBoost regression model
│   │   └── rul_scaler.pkl            # Serialized MinMaxScaler object
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── predict.py                # POST /predict/failure and POST /predict/rul routes
│   │   └── history.py                # GET /history route with parameter filtering
│   │
│   ├── ai_explain.py                 # Google Gemini 2.5 Flash SDK integration & prompt handler
│   ├── config.py                     # Pydantic Settings reading .env configurations
│   ├── database.py                   # SQLite connection, DDL migration, and IST persistence engine
│   ├── main.py                       # FastAPI application entry point, CORS, and lifespan handler
│   ├── ml_utils.py                   # Model inference pipelines and SHAP TreeExplainer routines
│   ├── requirements.txt              # Backend Python dependencies
│   ├── schemas.py                    # Pydantic validation models for input/output contracts
│   └── predictive_maintenance.db     # SQLite persistence store (auto-generated)
│
├── frontend/
│   ├── public/                       # Static public assets
│   ├── src/
│   │   ├── animations/
│   │   │   └── pageTransition.js     # Framer Motion entrance/exit variants
│   │   ├── assets/                   # Static imagery and SVG icons
│   │   ├── components/
│   │   │   └── UI/
│   │   │       ├── FeatureCard.jsx   # Interactive landing page capability cards
│   │   │       └── Navbar.jsx        # Navigation bar across routes
│   │   ├── data/
│   │   │   └── Sensor.js             # Preloaded CMAPSS engine unit sensor readings
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx     # Fleet metrics, rolling risk trend, risk distribution
│   │   │   │   ├── FailureTrendChart.jsx # AreaChart for rolling risk averages
│   │   │   │   └── Pie.jsx           # Risk categorization PieChart
│   │   │   ├── History/
│   │   │   │   └── History.jsx       # Historical query log table with search and filtering
│   │   │   ├── Home/
│   │   │   │   └── Home.jsx          # Architecture and capability landing view
│   │   │   ├── Machines/
│   │   │   │   ├── MachineCard.jsx   # Engine status and telemetry overview card
│   │   │   │   └── Machines.jsx      # Turbofan RUL predictor, gauge, and SHAP explainer
│   │   │   └── Prediction/
│   │   │       ├── AIexplanation.jsx # Gemini root-cause analysis and actions block parser
│   │   │       ├── Form.jsx          # 5-feature input form for machine failure diagnostics
│   │   │       ├── PredictionPage.jsx# Failure diagnostic portal layout
│   │   │       ├── PredictionPanel.jsx # Breakdown risk status badge and confidence gauge
│   │   │       └── ShapChart.jsx     # Horizontal SHAP attribution bar chart
│   │   ├── services/
│   │   │   └── api.js                # Centralized Axios HTTP client instance
│   │   ├── Layout.jsx                # Global navigation shell and page transition wrapper
│   │   ├── index.css                 # Global styling and Tailwind directives
│   │   └── main.jsx                  # React application root and router declarations
│   ├── package.json                  # Node dependencies and build scripts
│   ├── vite.config.js                # Vite build and plugin configurations
│   └── index.html                    # Single-page HTML shell
│
└── README.md                         # Project technical documentation
```

---

## 11. End-to-End Operational Flow

When a technician performs an evaluation on the frontend, the platform executes the following 10-step lifecycle:

```
[1. User Action]      Technician inputs sensor parameters in React UI and clicks 'Run Prediction'.
       ↓
[2. Form Trigger]     React updates local component state (loading=true, error=null).
       ↓
[3. Axios Call]       src/services/api.js dispatches an HTTP POST request to FastAPI backend.
       ↓
[4. Schema Check]     FastAPI validates incoming JSON payload against Pydantic schema (FailureInput / RULInput).
       ↓
[5. ML Inference]     ml_utils.py formats input into a DataFrame and invokes model.predict_proba() or model.predict().
       ↓
[6. SHAP Attribution] Pre-cached TreeExplainer calculates marginal feature contributions and extracts the top 6 factors.
       ↓
[7. Risk Evaluation]  Calculated probability or RUL cycles determine risk level ('low', 'medium', or 'high').
       ↓
[8. Gemini Analysis]  If risk is medium or high, prompt is sent to Google Gemini 2.5 Flash for root-cause synthesis and corrective actions.
       ↓
[9. DB Persistence]   database.py inserts full audit record with an IST timestamp into SQLite predictions table.
       ↓
[10. DOM Render]      FastAPI returns PredictionResponse JSON. React renders the risk badge, SHAP bar chart, and AI action checklist.
```

---

## 12. Troubleshooting & FAQ

#### Missing Machine Learning Models
* **Symptom**: `FileNotFoundError: models/failure_model.pkl` on backend launch.
* **Resolution**: Run `python ml/train_failure.py` and `python ml/train_rul.py` from within the `backend/` directory to regenerate all serialized artifacts.

#### CORS (Cross-Origin Resource Sharing) Block
* **Symptom**: Browser console indicates `Cross-Origin Request Blocked`.
* **Resolution**: Ensure the frontend dev server port matches one of the origins specified in `backend/config.py` (`http://localhost:5173`, `http://localhost:5174`, or `http://localhost:3000`). Update `settings.cors_origins` in `config.py` if your frontend runs on a custom port.

#### Gemini API Quota or Connection Failures
* **Symptom**: Prediction succeeds, but the explanation displays a fallback notice.
* **Resolution**: Verify that `GEMINI_API_KEY` is present in `backend/.env` and valid. If quotas are exceeded, the built-in fallback handler ensures predictions continue operating without throwing a 500 error.

#### SQLite Database Locking
* **Symptom**: `sqlite3.OperationalError: database is locked`.
* **Resolution**: Ensure database connections are acquired exclusively through the `get_db()` context manager, which handles deterministic closing of connections upon completion.

---

## 13. Project Metadata & Contributions

* **Author**: Aarish Ali
* **Project**: Industrial Predictive Maintenance Platform
* **Repository**: [https://github.com/aliaarish17/Predictive_Maintenance](https://github.com/aliaarish17/Predictive_Maintenance)
* **License**: MIT
