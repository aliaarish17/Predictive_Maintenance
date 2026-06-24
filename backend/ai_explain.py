# ai_explain.py
from google import genai
from config import settings

client = genai.Client(api_key=settings.gemini_api_key)

def generate_explanation(prediction_type: str, result: dict, shap_values: list[dict], input_data: dict, risk_level: str) -> str:
    # ── LOW risk: hardcoded, no LLM call ──
    if risk_level == "low":
        return get_low_risk_message(prediction_type, result)

    # ── HIGH / MEDIUM risk: LLM call, with fallback on failure ──
    try:
        return _call_gemini(prediction_type, result, shap_values, input_data)
    except Exception:
        return get_fallback_explanation(prediction_type, risk_level)


def _call_gemini(prediction_type: str, result: dict, shap_values: list[dict], input_data: dict) -> str:
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

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text


def get_low_risk_message(prediction_type: str, result: dict) -> str:
    """Low risk ke liye hardcoded, professional-sounding message — no API call needed."""
    if prediction_type == "failure":
        return (
            "This machine is currently operating within normal parameters and shows "
            "no significant signs of impending failure. Sensor readings are stable "
            "and consistent with healthy operation.\n\n"
            "Recommended actions:\n"
            "- Continue routine monitoring on the standard schedule.\n"
            "- No immediate maintenance action required."
        )
    else:
        cycles = result.get("rul_cycles", "a substantial number of")
        return (
            f"This unit has an estimated {cycles} cycles of remaining useful life, "
            "indicating healthy operating condition with no immediate concerns. "
            "Sensor trends do not show signs of accelerated degradation.\n\n"
            "Recommended actions:\n"
            "- Continue routine monitoring on the standard schedule.\n"
            "- Re-check prediction after the next scheduled maintenance cycle."
        )


def get_fallback_explanation(prediction_type: str, risk_level: str) -> str:
    """LLM call fail hone par (high/medium risk ke liye) generic fallback."""
    return (
        f"This {prediction_type} prediction indicates a {risk_level} risk level. "
        "Detailed explanation is temporarily unavailable — please review the SHAP "
        "chart above and consult your maintenance guidelines."
    )