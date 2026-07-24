import os
import joblib
import numpy as np


# ==========================================
# Predict Electrode Quality
# ==========================================

def predict_quality(input_data):

    # ==========================================
    # Base Directory
    # ==========================================

    base_dir = os.path.dirname(
        os.path.dirname(__file__)
    )

    # ==========================================
    # Load Best Model
    # ==========================================

    trained_model_folder = os.path.join(
        base_dir,
        "trained_models"
    )

    best_model_file = os.path.join(
        trained_model_folder,
        "best_model.txt"
    )

    if not os.path.exists(best_model_file):
        raise Exception("Best model not found.")

    with open(best_model_file, "r") as file:
        best_model = file.read().strip()

    model_path = os.path.join(
        trained_model_folder,
        best_model.lower().replace(" ", "_") + ".pkl"
    )

    if not os.path.exists(model_path):
        raise Exception("Trained model not found.")

    model = joblib.load(model_path)

    # ==========================================
    # Load Scaler
    # ==========================================

    model_folder = os.path.join(
        base_dir,
        "models"
    )

    scaler_path = os.path.join(
        model_folder,
        "scaler.pkl"
    )

    if not os.path.exists(scaler_path):
        raise Exception("Scaler not found.")

    scaler = joblib.load(scaler_path)

    # ==========================================
    # Prepare Input
    # ==========================================

    input_array = np.array(
        input_data,
        dtype=float
    ).reshape(1, -1)

    input_scaled = scaler.transform(
        input_array
    )

    # ==========================================
    # Prediction
    # ==========================================

    prediction = model.predict(
        input_scaled
    )[0]

    if hasattr(model, "predict_proba"):

        probability = model.predict_proba(
            input_scaled
        )[0]

        quality_score = round(
            np.max(probability) * 100,
            2
        )

    else:

        quality_score = 100.0

    # ==========================================
    # Quality Mapping
    # ==========================================

    if int(prediction) == 0:

        quality = "High Quality"

        risk = "Low Risk"

        recommendation = (
            "Suitable for Battery Manufacturing."
        )

    elif int(prediction) == 1:

        quality = "Medium Quality"

        risk = "Medium Risk"

        recommendation = (
            "Additional Quality Inspection Recommended."
        )

    else:

        quality = "Low Quality"

        risk = "High Risk"

        recommendation = (
            "Reject Before Battery Manufacturing."
        )

    # ==========================================
    # Explanation
    # ==========================================

    explanation = (
        "The prediction is generated using the trained "
        f"{best_model} model after preprocessing the input "
        "features with the saved StandardScaler."
    )

    # ==========================================
    # Response
    # ==========================================

    return {

        "quality": quality,

        "quality_score": quality_score,

        "risk": risk,

        "recommendation": recommendation,

        "model": best_model,

        "explanation": explanation

    }