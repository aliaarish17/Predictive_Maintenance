# ai_explain.py
import google.generativeai as genai
from config import settings

genai.configure(api_key=settings.gemini_api_key)
model = genai.GenerativeModel("gemini-2.0-flash")

def generate_explanation(prediction_type: str, result: dict, shap_values: list[dict], input_data: dict) -> str:
    shap_summary = ", ".join(
        f"{s['feature']} ({'+' if s['value'] > 0 else ''}{s['value']})"
        for s in shap_values
    )

    if prediction_type == "failure":
        outcome = f"Failure predicted: {result['failure_predicted']}, confidence {result['confidence']*100:.1f}%"
    else:
        outcome = f"Remaining useful life: {result['rul_cycles']} cycles"

    prompt = f"""You are an industrial maintenance assistant explaining a machine learning prediction
    to a plant floor technician who is not a data scientist.

    Prediction outcome: {outcome}
    Top contributing factors: {shap_summary}
    Raw input readings: {input_data}

    Write a short, plain-language explanation (3-4 sentences) of why this prediction was made,
    followed by 2-3 concrete recommended safety/maintenance actions as a bulleted list.
    Avoid technical ML jargon like 'SHAP' or 'feature importance'."""

    response = model.generate_content(prompt)
    return response.text

def get_fallback_explanation(prediction_type: str, risk_level: str) -> str:
    return (
        f"This {prediction_type} prediction indicates a {risk_level} risk level. "
        "Detailed explanation is temporarily unavailable — please review the SHAP "
        "chart above and consult your maintenance guidelines."
    )