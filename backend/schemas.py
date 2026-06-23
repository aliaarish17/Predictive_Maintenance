from pydantic import BaseModel,Field
from typing import Literal,Optional,Annotated

class FailureInput(BaseModel):
    machine_type : Optional[Literal['L','M','H']] = None
    air_temperature: float = Field(..., gt=0)
    process_temperature: float = Field(..., gt=0)
    rotational_speed: float = Field(..., gt=0)
    torque: float = Field(..., ge=0)
    tool_wear: float = Field(..., ge=0)

class RULInput(BaseModel):
    unit_id: str
    sensor_readings: dict[str, float]

class ShapValue(BaseModel):
    feature: str
    value: float

class PredictionResponse(BaseModel):
    prediction_id: str
    prediction_type: Literal["failure", "rul"]
    result: dict
    risk_level: Literal["high", "medium", "low"]
    shap_values: list[ShapValue]
    ai_explanation: str

class HistoryItem(BaseModel):
    id: str
    created_at: str
    source: str
    machine_unit: Optional[str] = None
    prediction_type: str
    result: dict
    risk_level: str
