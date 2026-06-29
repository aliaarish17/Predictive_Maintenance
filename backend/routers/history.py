from fastapi import APIRouter, Query
from database import get_history

router = APIRouter(prefix="/history", tags=["history"])

@router.get("")
async def get_history_endpoint(
    risk_level: str | None = Query(None),
    prediction_type: str | None = Query(None),
    limit: int = Query(0, le=200)
):
    predictions = get_history(risk_level=risk_level, prediction_type=prediction_type, limit=limit)
    return {"count": len(predictions), "predictions": predictions}