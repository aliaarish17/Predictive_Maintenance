"""
Verification script for Predictive Maintenance ML Pipeline & API models.
Run this script to verify that models, scalers, and explainers load and produce valid predictions.
"""

import sys
from ml_utils import predict_failure, predict_rul

def run_tests():
    print("=" * 60)
    print("PREDICTIVE MAINTENANCE ML PIPELINE VERIFICATION")
    print("=" * 60)

    # 1. Test Failure Prediction
    print("\n[1/2] Testing Failure Prediction model...")
    sample_failure_input = {
        "air_temperature": 300.0,
        "process_temperature": 310.0,
        "rotational_speed": 1500,
        "torque": 40.0,
        "tool_wear": 100,
    }
    failure_res = predict_failure(sample_failure_input)
    assert "result" in failure_res, "Missing 'result' in failure prediction"
    assert "risk_level" in failure_res, "Missing 'risk_level' in failure prediction"
    assert "shap_values" in failure_res, "Missing 'shap_values' in failure prediction"
    print(f"  -> Prediction result: {failure_res['result']}")
    print(f"  -> Risk level: {failure_res['risk_level']}")
    print(f"  -> Top SHAP feature: {failure_res['shap_values'][0]['feature']} ({failure_res['shap_values'][0]['value']})")
    print("  [PASS] Failure prediction operational.")

    # 2. Test RUL Prediction
    print("\n[2/2] Testing Remaining Useful Life (RUL) model...")
    sample_rul_input = {f"sensor{i}": 500.0 + i for i in range(1, 22)}
    rul_res = predict_rul(sample_rul_input)
    assert "result" in rul_res, "Missing 'result' in RUL prediction"
    assert "rul_cycles" in rul_res["result"], "Missing 'rul_cycles' in RUL result"
    print(f"  -> Predicted RUL cycles: {rul_res['result']['rul_cycles']}")
    print(f"  -> Risk level: {rul_res['risk_level']}")
    print("  [PASS] RUL prediction operational.")

    print("\n" + "=" * 60)
    print("ALL ML PIPELINE VERIFICATION TESTS PASSED")
    print("=" * 60)

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as exc:
        print(f"[FAIL] Pipeline verification failed: {exc}", file=sys.stderr)
        sys.exit(1)
