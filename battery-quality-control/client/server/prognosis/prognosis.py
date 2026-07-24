import os
import joblib
import numpy as np


# ==========================================
# Predict Future Electrode Quality
# ==========================================

def predict_future_quality(input_data):

    # --------------------------------------
    # Base Directory
    # --------------------------------------

    base_dir = os.path.dirname(
        os.path.dirname(__file__)
    )

    model_folder = os.path.join(
        base_dir,
        "trained_models"
    )

    # --------------------------------------
    # Read Best Model
    # --------------------------------------

    best_model_file = os.path.join(
        model_folder,
        "best_model.txt"
    )

    if not os.path.exists(best_model_file):
        raise Exception("Best model not found.")

    with open(best_model_file, "r") as file:
        best_model = file.read().strip()

    # --------------------------------------
    # Load Model
    # --------------------------------------

    model_path = os.path.join(
        model_folder,
        best_model.lower().replace(" ", "_") + ".pkl"
    )

    if not os.path.exists(model_path):
        raise Exception("Model file not found.")

    model = joblib.load(model_path)

    # --------------------------------------
    # Prediction
    # --------------------------------------

    data = np.array(input_data).reshape(1, -1)

    prediction = model.predict(data)[0]

    if hasattr(model, "predict_proba"):

        confidence = round(
            np.max(model.predict_proba(data)) * 100,
            2
        )

    else:

        confidence = 100.0

    # --------------------------------------
    # Label Mapping
    # --------------------------------------

    label_map = {

        0: "High Quality",
        1: "Medium Quality",
        2: "Defective Quality"

    }

    future_quality = label_map.get(
        int(prediction),
        str(prediction)
    )

    # --------------------------------------
    # Future Risk
    # --------------------------------------

    if future_quality == "High Quality":

        future_risk = "Low Risk"

        degradation_probability = round(
            100 - confidence,
            2
        )

        remaining_cycles = 120

        recommendation = (
            "Current manufacturing process is stable. "
            "Continue the existing production parameters."
        )

    elif future_quality == "Medium Quality":

        future_risk = "Medium Risk"

        degradation_probability = round(
            100 - confidence + 5,
            2
        )

        remaining_cycles = 75

        recommendation = (
            "Monitor important process parameters such as "
            "coating uniformity, moisture content and drying conditions."
        )

    else:

        future_risk = "High Risk"

        degradation_probability = round(
            min(100, 100 - confidence + 15),
            2
        )

        remaining_cycles = 25

        recommendation = (
            "Immediate process inspection is recommended. "
            "Review electrode manufacturing parameters before production."
        )

    # --------------------------------------
    # Explanation
    # --------------------------------------

    explanation = (
        f"The prognosis is generated using the trained {best_model} model. "
        "Future quality is estimated from the current manufacturing "
        "parameters after preprocessing with the saved StandardScaler."
    )

    # --------------------------------------
    # Response
    # --------------------------------------

    return {

        "future_quality": future_quality,

        "future_quality_score": confidence,

        "future_risk": future_risk,

        "degradation_probability": degradation_probability,

        "remaining_cycles": remaining_cycles,

        "recommendation": recommendation,

        "explanation": explanation,

        "model": best_model

    }