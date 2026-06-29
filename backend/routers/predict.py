from fastapi import APIRouter, HTTPException
from schemas import FailureInput, RULInput, PredictionResponse
from ml_utils import predict_failure, predict_rul
from ai_explain import generate_explanation
from database import insert_prediction
import uuid

router = APIRouter(prefix="/predict", tags=["predictions"])

@router.post("/failure", response_model=PredictionResponse)
async def predict_failure_endpoint(payload: FailureInput):
    data = payload.model_dump()
    try:
        prediction = predict_failure(data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failure prediction error: {str(e)}")

   
    explanation = generate_explanation(
            "failure",
            prediction["result"],
            prediction["shap_values"],
            data,
            prediction["risk_level"]
    )
    


    record = {
        "id": str(uuid.uuid4()),
        "source": "predict_input",
        "machine_unit": data.get("machine_name"),
        "machine_type": data.get("machine_type"),
        "input_data": data,
        "prediction_type": "failure",
        "result": prediction["result"],
        "shap_values": prediction["shap_values"],
        "ai_explanation": explanation,
        "risk_level": prediction["risk_level"],
    }
    insert_prediction(record)

    return PredictionResponse(
        prediction_id=record["id"],
        prediction_type="failure",
        result=prediction["result"],
        risk_level=prediction["risk_level"],
        shap_values=prediction["shap_values"],
        ai_explanation=explanation,
    )

@router.post("/rul", response_model=PredictionResponse)
async def predict_rul_endpoint(payload: RULInput):
    data = payload.model_dump()
    try:
        prediction = predict_rul(data["sensor_readings"])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RUL prediction error: {str(e)}")
    
    explanation = generate_explanation(
            "rul",
            prediction["result"],
            prediction["shap_values"],
            data["sensor_readings"],
            prediction["risk_level"]
        )
   

    record = {
        "id": str(uuid.uuid4()),
        "source": "select_machine",
        "machine_unit": data["unit_id"],
        "input_data": data["sensor_readings"],
        "prediction_type": "rul",
        "result": prediction["result"],
        "shap_values": prediction["shap_values"],
        "ai_explanation": explanation,
        "risk_level": prediction["risk_level"],
    }
    insert_prediction(record)

    return PredictionResponse(
        prediction_id=record["id"],
        prediction_type="rul",
        result=prediction["result"],
        risk_level=prediction["risk_level"],
        shap_values=prediction["shap_values"],
        ai_explanation=explanation,
    )