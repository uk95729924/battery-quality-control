import os
import joblib
import numpy as np
import pandas as pd


# ============================================================
# EXPECTED ELECTRODE FEATURES
# ============================================================

FEATURE_NAMES = [

    "Electrode_Thickness",
    "Coating_Weight",
    "Coating_Uniformity",
    "Slurry_Viscosity",
    "Drying_Temperature",
    "Drying_Time",
    "Calender_Pressure",
    "Roller_Speed",
    "Electrode_Density",
    "Moisture_Content",
    "Surface_Roughness",
    "Adhesion_Strength",
    "Ambient_Humidity",
    "Ambient_Temperature"

]


# ============================================================
# QUALITY CLASS MAPPING
# ============================================================

CLASS_MAPPING = {

    0: "Good",
    1: "Major_Defect",
    2: "Minor_Defect"

}


# ============================================================
# PROGNOSIS PROFILES
# ============================================================
#
# These are model-derived quality/health profiles.
# They are NOT experimentally measured battery RUL values.
#
# The current dataset does not contain an actual cycle-life
# target, therefore the life value is reported as an
# Estimated Production-Cycle Index.
# ============================================================

QUALITY_PROFILE = {

    "Good": {

        "health_factor": 1.00,

        "life_factor": 1.00

    },

    "Minor_Defect": {

        "health_factor": 0.65,

        "life_factor": 0.60

    },

    "Major_Defect": {

        "health_factor": 0.25,

        "life_factor": 0.25

    }

}


# ============================================================
# SAFE FLOAT
# ============================================================

def safe_float(value, default=0.0):

    try:

        value = float(value)

        if np.isnan(value) or np.isinf(value):

            return default

        return value

    except Exception:

        return default


# ============================================================
# PREDICT FUTURE ELECTRODE QUALITY
# ============================================================

def predict_future_quality(input_data):

    print("\n======================================")
    print("          PROGNOSIS API")
    print("======================================")

    # ========================================================
    # BASE DIRECTORY
    # ========================================================

    base_dir = os.path.dirname(
        os.path.dirname(__file__)
    )

    models_folder = os.path.join(
        base_dir,
        "models"
    )

    trained_models_folder = os.path.join(
        base_dir,
        "trained_models"
    )

    # ========================================================
    # CHECK INPUT
    # ========================================================

    if input_data is None:

        raise Exception(
            "Input data is required."
        )

    if len(input_data) != len(FEATURE_NAMES):

        raise Exception(
            f"Expected {len(FEATURE_NAMES)} input features, "
            f"received {len(input_data)}."
        )

    try:

        input_data = [

            float(value)

            for value in input_data

        ]

    except Exception:

        raise Exception(
            "All prognosis input values must be numeric."
        )

    print("\nInput Features:")
    print(input_data)

    # ========================================================
    # LOAD BEST MODEL NAME
    # ========================================================

    best_model_file = os.path.join(
        trained_models_folder,
        "best_model.txt"
    )

    if not os.path.exists(
        best_model_file
    ):

        raise Exception(
            "Best model file not found."
        )

    with open(
        best_model_file,
        "r",
        encoding="utf-8"
    ) as file:

        best_model = file.read().strip()

    if not best_model:

        raise Exception(
            "Best model name is empty."
        )

    print(
        "\nBest Model:",
        best_model
    )

    # ========================================================
    # LOAD MODEL
    # ========================================================

    model_filename = (

        best_model
        .lower()
        .replace(" ", "_")
        + ".pkl"

    )

    model_path = os.path.join(
        trained_models_folder,
        model_filename
    )

    if not os.path.exists(
        model_path
    ):

        raise Exception(
            f"Trained model not found: {model_path}"
        )

    model = joblib.load(
        model_path
    )

    print(
        "Model Loaded:",
        model_filename
    )

    # ========================================================
    # LOAD STANDARD SCALER
    # ========================================================

    scaler_path = os.path.join(
        models_folder,
        "scaler.pkl"
    )

    if not os.path.exists(
        scaler_path
    ):

        raise Exception(
            "Scaler not found. "
            "Please train the model first."
        )

    scaler = joblib.load(
        scaler_path
    )

    print(
        "Scaler Loaded"
    )

    # ========================================================
    # LOAD FEATURE ORDER
    # ========================================================

    feature_order_path = os.path.join(
        models_folder,
        "feature_order.pkl"
    )

    if not os.path.exists(
        feature_order_path
    ):

        raise Exception(
            "Feature order file not found. "
            "Please train the model first."
        )

    feature_order = joblib.load(
        feature_order_path
    )

    print(
        "\nFeature Order Loaded:"
    )

    for index, feature in enumerate(
        feature_order,
        start=1
    ):

        print(
            f"{index}. {feature}"
        )

    if list(feature_order) != FEATURE_NAMES:

        raise Exception(
            "Feature order mismatch between "
            "training and prognosis."
        )

    # ========================================================
    # CREATE DATAFRAME
    # ========================================================

    input_df = pd.DataFrame(
        [input_data],
        columns=feature_order
    )

    # ========================================================
    # SCALE INPUT
    # ========================================================

    input_scaled = scaler.transform(
        input_df
    )

    print(
        "\nInput Scaling Completed"
    )

    # ========================================================
    # PREDICTION
    # ========================================================

    raw_prediction = model.predict(
        input_scaled
    )[0]

    prediction = int(
        raw_prediction
    )

    print(
        "Raw Prediction:",
        prediction
    )

    # ========================================================
    # PREDICTION PROBABILITY
    # ========================================================

    probabilities = {

        "0": 0.0,

        "1": 0.0,

        "2": 0.0

    }

    if hasattr(
        model,
        "predict_proba"
    ):

        probability_array = np.asarray(

            model.predict_proba(
                input_scaled
            )[0],

            dtype=float

        )

        model_classes = getattr(

            model,

            "classes_",

            [0, 1, 2]

        )

        for class_id, probability in zip(

            model_classes,

            probability_array

        ):

            class_id = int(
                class_id
            )

            if str(class_id) in probabilities:

                probabilities[
                    str(class_id)
                ] = round(

                    safe_float(
                        probability
                    ) * 100,

                    2

                )

        confidence = round(

            float(
                np.max(
                    probability_array
                )
            ) * 100,

            2

        )

    else:

        confidence = 100.0

        probabilities[
            str(prediction)
        ] = 100.0

    print(
        "Prediction Confidence:",
        confidence,
        "%"
    )

    print(
        "Probabilities:",
        probabilities
    )

    # ========================================================
    # QUALITY LABEL
    # ========================================================

    future_quality_label = CLASS_MAPPING.get(

        prediction,

        "Unknown"

    )

    # ========================================================
    # CLASS PROBABILITIES
    # ========================================================

    good_probability = safe_float(

        probabilities.get(
            "0",
            0.0
        )

    )

    major_probability = safe_float(

        probabilities.get(
            "1",
            0.0
        )

    )

    minor_probability = safe_float(

        probabilities.get(
            "2",
            0.0
        )

    )

    # ========================================================
    # DYNAMIC ESTIMATED HEALTH
    # ========================================================
    #
    # Health is probability-weighted.
    #
    # Good        -> 100
    # Minor Defect -> 65
    # Major Defect -> 25
    #
    # Therefore health changes continuously according to
    # the model probability distribution.
    # ========================================================

    estimated_health = (

        (
            good_probability
            *
            QUALITY_PROFILE["Good"]["health_factor"]
        )

        +

        (
            minor_probability
            *
            QUALITY_PROFILE["Minor_Defect"]["health_factor"]
        )

        +

        (
            major_probability
            *
            QUALITY_PROFILE["Major_Defect"]["health_factor"]
        )

    )

    estimated_health = round(

        max(

            0.0,

            min(

                100.0,

                estimated_health

            )

        ),

        2

    )

    # ========================================================
    # DYNAMIC DEGRADATION PROBABILITY
    # ========================================================
    #
    # Probability of entering either Minor or Major Defect.
    # ========================================================

    degradation_probability = round(

        max(

            0.0,

            min(

                100.0,

                major_probability
                +
                minor_probability

            )

        ),

        2

    )

    # ========================================================
    # QUALITY / RISK ASSESSMENT
    # ========================================================

    if prediction == 0:

        future_quality = "Good Quality"

        future_risk = "Low Risk"

        risk_level = "LOW"

        trend = "Stable"

        recommendation = (

            "The electrode is expected to maintain good "
            "quality under the given manufacturing conditions. "
            "Continue monitoring the current process parameters."

        )

    elif prediction == 2:

        future_quality = "Minor Defect"

        future_risk = "Medium Risk"

        risk_level = "MEDIUM"

        trend = "Gradual Decline"

        recommendation = (

            "The electrode is predicted to have a minor defect. "
            "Additional quality inspection and monitoring of "
            "coating uniformity, moisture content, drying "
            "conditions and related manufacturing parameters "
            "are recommended."

        )

    elif prediction == 1:

        future_quality = "Major Defect"

        future_risk = "High Risk"

        risk_level = "HIGH"

        trend = "Significant Decline"

        recommendation = (

            "The electrode is predicted to have a major defect. "
            "Immediate inspection of coating, drying, calendering "
            "and related manufacturing parameters is recommended "
            "before further battery production."

        )

    else:

        future_quality = "Unknown Quality"

        future_risk = "Unknown Risk"

        risk_level = "UNKNOWN"

        trend = "Unknown"

        recommendation = (

            "The predicted class is not recognized by the "
            "current electrode quality assessment rules."

        )

    # ========================================================
    # ESTIMATED PRODUCTION-CYCLE INDEX
    # ========================================================
    #
    # IMPORTANT:
    # This is NOT experimentally measured RUL.
    #
    # The dataset does not contain an actual cycle-life target.
    # Therefore this value is an estimated production-cycle
    # index derived from the probability-weighted health.
    # ========================================================

    MAX_REFERENCE_CYCLES = 120

    estimated_life = (

        MAX_REFERENCE_CYCLES

        *

        (

            (
                good_probability
                *
                QUALITY_PROFILE["Good"]["life_factor"]
            )

            +

            (
                minor_probability
                *
                QUALITY_PROFILE["Minor_Defect"]["life_factor"]
            )

            +

            (
                major_probability
                *
                QUALITY_PROFILE["Major_Defect"]["life_factor"]
            )

        )

        / 100.0

    )

    remaining_life = int(

        round(
            estimated_life
        )

    )

    remaining_life = max(

        1,

        min(

            MAX_REFERENCE_CYCLES,

            remaining_life

        )

    )

    # ========================================================
    # LIFE CATEGORY
    # ========================================================

    if remaining_life >= 80:

        life_status = "Long Estimated Life"

    elif remaining_life >= 40:

        life_status = "Moderate Estimated Life"

    else:

        life_status = "Short Estimated Life"

    # ========================================================
    # HEALTH STATUS
    # ========================================================

    if estimated_health >= 80:

        health_status = "Healthy"

    elif estimated_health >= 40:

        health_status = "Moderate Health"

    else:

        health_status = "Poor Health"

    # ========================================================
    # PROJECTION
    # ========================================================
    #
    # These are estimated projection stages, not measured
    # future observations.
    # ========================================================

    projection_steps = 6

    health_projection = []

    quality_projection = []

    life_projection = []

    # The degradation rate depends on current degradation risk.
    # Maximum total projection decline is capped at 20%.
    total_decline = min(

        0.20,

        (
            degradation_probability
            /
            100.0
        )
        *
        0.20

    )

    for stage in range(
        projection_steps
    ):

        progress = (

            stage
            /
            (
                projection_steps - 1
            )

        )

        projected_health = (

            estimated_health
            *
            (
                1.0
                -
                (
                    total_decline
                    *
                    progress
                )
            )

        )

        projected_health = round(

            max(

                0.0,

                min(

                    100.0,

                    projected_health

                )

            ),

            2

        )

        projected_quality = round(

            max(

                0.0,

                min(

                    100.0,

                    projected_health

                )

            ),

            2

        )

        projected_life = int(

            round(

                remaining_life

                *

                (

                    1.0
                    -
                    (
                        progress
                        *
                        (
                            degradation_probability
                            /
                            100.0
                        )
                    )

                )

            )

        )

        projected_life = max(

            0,

            projected_life

        )

        health_projection.append(
            projected_health
        )

        quality_projection.append(
            projected_quality
        )

        life_projection.append(
            projected_life
        )

    # ========================================================
    # EXPLANATION
    # ========================================================

    explanation = (

        f"The future quality prognosis is generated using "
        f"the trained {best_model} model. The 14 electrode "
        f"manufacturing parameters are arranged in the same "
        f"feature order used during model training and "
        f"transformed using the StandardScaler fitted on "
        f"the training data. The model prediction is "
        f"interpreted using the electrode quality mapping: "
        f"0 = Good, 1 = Major Defect, and 2 = Minor Defect. "
        f"Prediction confidence is obtained from the model "
        f"probability distribution. Estimated health is "
        f"calculated using probability-weighted quality "
        f"profiles, while degradation probability represents "
        f"the probability of a non-Good future class. "
        f"The remaining-life value is an estimated production "
        f"cycle index because an actual cycle-life target is "
        f"not present in the current dataset."

    )

    # ========================================================
    # FINAL RESULT
    # ========================================================

    result = {

        # ----------------------------------------------------
        # FUTURE QUALITY
        # ----------------------------------------------------

        "future_quality":
            future_quality,

        "future_quality_label":
            future_quality_label,

        # ----------------------------------------------------
        # CONFIDENCE
        # ----------------------------------------------------

        "future_quality_score":
            confidence,

        "prediction_confidence":
            confidence,

        "prediction_class":
            prediction,

        # ----------------------------------------------------
        # PROBABILITIES
        # ----------------------------------------------------

        "probabilities":
            probabilities,

        # ----------------------------------------------------
        # HEALTH
        # ----------------------------------------------------

        "estimated_health":
            estimated_health,

        "health_status":
            health_status,

        # ----------------------------------------------------
        # LIFE
        # ----------------------------------------------------

        "remaining_life":
            remaining_life,

        "remaining_life_unit":
            "Cycles",

        "estimated_production_cycles":
            remaining_life,

        "life_metric":
            "Estimated Production-Cycle Index",

        "life_status":
            life_status,

        # ----------------------------------------------------
        # RISK
        # ----------------------------------------------------

        "future_risk":
            future_risk,

        "risk_level":
            risk_level,

        "degradation_probability":
            degradation_probability,

        "trend":
            trend,

        # ----------------------------------------------------
        # RECOMMENDATION
        # ----------------------------------------------------

        "recommendation":
            recommendation,

        # ----------------------------------------------------
        # MODEL
        # ----------------------------------------------------

        "model":
            best_model,

        # ----------------------------------------------------
        # FEATURES
        # ----------------------------------------------------

        "features":
            feature_order,

        # ----------------------------------------------------
        # PROJECTIONS
        # ----------------------------------------------------

        "health_projection":
            health_projection,

        "life_projection":
            life_projection,

        "quality_projection":
            quality_projection,

        "projection_steps":
            projection_steps,

        # ----------------------------------------------------
        # EXPLANATION
        # ----------------------------------------------------

        "explanation":
            explanation,

        # ----------------------------------------------------
        # RESEARCH NOTE
        # ----------------------------------------------------

        "prognosis_note":
            (
                "The estimated production-cycle index is a "
                "model-derived projection and should not be "
                "interpreted as experimentally measured "
                "remaining useful life because the current "
                "dataset does not contain an actual cycle-life "
                "target."
            )

    }

    # ========================================================
    # TERMINAL OUTPUT
    # ========================================================

    print("\n======================================")
    print("          PROGNOSIS RESULT")
    print("======================================")

    print(
        "Prediction Class:",
        prediction
    )

    print(
        "Prediction Label:",
        future_quality_label
    )

    print(
        "Future Quality:",
        future_quality
    )

    print(
        "Prediction Confidence:",
        confidence,
        "%"
    )

    print(
        "Estimated Health:",
        estimated_health,
        "%"
    )

    print(
        "Health Status:",
        health_status
    )

    print(
        "Remaining Life:",
        remaining_life,
        "Cycles"
    )

    print(
        "Life Status:",
        life_status
    )

    print(
        "Risk:",
        future_risk
    )

    print(
        "Risk Level:",
        risk_level
    )

    print(
        "Degradation Probability:",
        degradation_probability,
        "%"
    )

    print(
        "Trend:",
        trend
    )

    print(
        "Recommendation:",
        recommendation
    )

    print(
        "Probabilities:",
        probabilities
    )

    print(
        "Model:",
        best_model
    )

    print(
        "Health Projection:",
        health_projection
    )

    print(
        "Life Projection:",
        life_projection
    )

    print(
        "Quality Projection:",
        quality_projection
    )

    print("======================================\n")

    return result