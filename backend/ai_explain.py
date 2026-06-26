# ai_explain.py
from google import genai
from config import settings

client = genai.Client(api_key=settings.gemini_api_key)

def generate_explanation(prediction_type: str, result: dict, shap_values: list[dict], input_data: dict, risk_level: str) -> str:
    if risk_level == "low":
        return get_low_risk_message(prediction_type, result)
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

Respond in EXACTLY this format with no extra text:

EXPLANATION
<3 sentences max explaining why this prediction was made in plain language. No ML jargon.>

ACTIONS
- <action 1>
- <action 2>
- <action 3>

Rules:
- EXPLANATION must be exactly 3 sentences
- ACTIONS must be exactly 3 bullet points starting with -
- No bold, no asterisks, no extra headings
- Keep each action to 1 sentence"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )
    return response.text


def get_low_risk_message(prediction_type: str, result: dict) -> str:
    if prediction_type == "failure":
        return (
            "EXPLANATION\n"
            "This machine is currently operating within normal parameters and shows no significant signs of impending failure. "
            "Sensor readings are stable and consistent with healthy operation. "
            "No immediate intervention is required at this time.\n\n"
            "ACTIONS\n"
            "- Continue routine monitoring on the standard schedule.\n"
            "- Log current sensor readings as baseline for future comparison.\n"
            "- No immediate maintenance action required."
        )
    else:
        cycles = result.get("rul_cycles", "many")
        return (
            f"EXPLANATION\n"
            f"This unit has an estimated {cycles} cycles of remaining useful life, indicating healthy operating condition. "
            "Sensor trends do not show signs of accelerated degradation or wear. "
            "The machine is performing within expected parameters for its current stage.\n\n"
            "ACTIONS\n"
            "- Continue routine monitoring on the standard schedule.\n"
            "- Re-check prediction after the next scheduled maintenance cycle.\n"
            "- Log current sensor readings as a healthy baseline."
        )


def get_fallback_explanation(prediction_type: str, risk_level: str) -> str:
    return (
        f"EXPLANATION\n"
        f"This {prediction_type} prediction indicates a {risk_level} risk level based on current sensor readings. "
        "Detailed AI analysis is temporarily unavailable due to a connection issue. "
        "Please review the SHAP chart and consult your maintenance guidelines.\n\n"
        "ACTIONS\n"
        "- Inspect the top sensors flagged in the SHAP chart above.\n"
        "- Consult your standard maintenance checklist for this risk level.\n"
        "- Re-run the prediction once the AI service is restored."
    )