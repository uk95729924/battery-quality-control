import os
import joblib
import numpy as np
import pandas as pd
import shap


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
# DATASET CLASS MAPPING
# ============================================================

# 0 -> Good
# 1 -> Major_Defect
# 2 -> Minor_Defect

CLASS_MAPPING = {

    0: "Good",
    1: "Major_Defect",
    2: "Minor_Defect"

}


# ============================================================
# SHAP EXPLANATION
# ============================================================

def generate_shap_explanation(model, input_scaled):

    """
    Generate SHAP feature contribution for the prediction.

    The model receives scaled input, therefore SHAP explains
    the same transformed feature representation used by the
    trained LightGBM model.
    """

    try:

        print("\n==========================================")
        print("          SHAP EXPLAINABILITY")
        print("==========================================")

        # ----------------------------------------------------
        # Create Tree Explainer
        # ----------------------------------------------------

        explainer = shap.TreeExplainer(model)

        shap_values = explainer.shap_values(input_scaled)

        # ----------------------------------------------------
        # Handle different SHAP output formats
        #
        # Multiclass SHAP can return:
        #
        # 1. list of arrays
        # 2. numpy array
        #
        # ----------------------------------------------------

        if isinstance(shap_values, list):

            # Get predicted class
            prediction = int(
                model.predict(input_scaled)[0]
            )

            if prediction < len(shap_values):

                contribution_values = np.asarray(
                    shap_values[prediction]
                )[0]

            else:

                contribution_values = np.asarray(
                    shap_values[0]
                )[0]

        else:

            shap_array = np.asarray(shap_values)

            # ------------------------------------------------
            # Possible shape:
            #
            # (samples, features, classes)
            # ------------------------------------------------

            if shap_array.ndim == 3:

                prediction = int(
                    model.predict(input_scaled)[0]
                )

                if shap_array.shape[2] > prediction:

                    contribution_values = (
                        shap_array[0, :, prediction]
                    )

                else:

                    contribution_values = (
                        shap_array[0, :, 0]
                    )

            # ------------------------------------------------
            # Standard shape:
            #
            # (samples, features)
            # ------------------------------------------------

            elif shap_array.ndim == 2:

                contribution_values = shap_array[0]

            else:

                contribution_values = shap_array.flatten()

        # ----------------------------------------------------
        # Make sure feature/value length matches
        # ----------------------------------------------------

        contribution_values = np.asarray(
            contribution_values,
            dtype=float
        ).flatten()

        if len(contribution_values) != len(FEATURE_NAMES):

            print(
                "SHAP feature count mismatch:",
                len(contribution_values),
                "expected:",
                len(FEATURE_NAMES)
            )

            return []

        # ----------------------------------------------------
        # Create feature contribution list
        # ----------------------------------------------------

        shap_results = []

        for feature, value in zip(
            FEATURE_NAMES,
            contribution_values
        ):

            shap_results.append({

                "name": feature,

                "value": round(
                    float(value),
                    6
                ),

                "impact": round(
                    abs(float(value)),
                    6
                )

            })

        # ----------------------------------------------------
        # Sort by absolute contribution
        # ----------------------------------------------------

        shap_results.sort(
            key=lambda x: x["impact"],
            reverse=True
        )

        # ----------------------------------------------------
        # Add rank
        # ----------------------------------------------------

        for index, item in enumerate(
            shap_results,
            start=1
        ):

            item["rank"] = index

        # ----------------------------------------------------
        # Print SHAP results
        # ----------------------------------------------------

        print("\nFeature Contributions:")

        for item in shap_results:

            direction = (
                "Positive"
                if item["value"] > 0
                else "Negative"
                if item["value"] < 0
                else "Neutral"
            )

            print(
                f"{item['rank']}. "
                f"{item['name']} : "
                f"{item['value']} "
                f"({direction})"
            )

        print("==========================================\n")

        return shap_results

    except Exception as error:

        print(
            "\nSHAP explanation failed:",
            str(error)
        )

        # Important:
        # Diagnosis should still work even if SHAP fails.

        return []


# ============================================================
# PREDICT ELECTRODE QUALITY
# ============================================================

def predict_quality(input_data):

    print("\n")
    print("==========================================")
    print("           DIAGNOSIS API")
    print("==========================================")

    # ========================================================
    # VALIDATE INPUT
    # ========================================================

    if input_data is None:

        raise ValueError(
            "Input data is required."
        )

    if len(input_data) != len(FEATURE_NAMES):

        raise ValueError(
            f"Expected {len(FEATURE_NAMES)} input features, "
            f"but received {len(input_data)}."
        )

    # ========================================================
    # BASE DIRECTORY
    # ========================================================

    base_dir = os.path.dirname(
        os.path.dirname(__file__)
    )

    print("Input:", input_data)

    # ========================================================
    # MODEL DIRECTORIES
    # ========================================================

    trained_model_folder = os.path.join(
        base_dir,
        "trained_models"
    )

    model_folder = os.path.join(
        base_dir,
        "models"
    )

    # ========================================================
    # LOAD BEST MODEL NAME
    # ========================================================

    best_model_file = os.path.join(
        trained_model_folder,
        "best_model.txt"
    )

    if not os.path.exists(best_model_file):

        raise Exception(
            "Best model not found. "
            "Please train the models first."
        )

    with open(
        best_model_file,
        "r"
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
    # MODEL FILE
    # ========================================================

    model_filename = (

        best_model
        .lower()
        .replace(" ", "_")
        + ".pkl"

    )

    model_path = os.path.join(
        trained_model_folder,
        model_filename
    )

    if not os.path.exists(model_path):

        raise Exception(
            f"Trained model not found: "
            f"{model_filename}"
        )

    # ========================================================
    # LOAD MODEL
    # ========================================================

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
        model_folder,
        "scaler.pkl"
    )

    if not os.path.exists(scaler_path):

        raise Exception(
            "StandardScaler not found. "
            "Please train the models first."
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
        model_folder,
        "feature_order.pkl"
    )

    if not os.path.exists(feature_order_path):

        raise Exception(
            "Feature order file not found. "
            "Please train the models again."
        )

    trained_feature_order = joblib.load(
        feature_order_path
    )

    print(
        "\nFeature Order Loaded:"
    )

    for index, feature in enumerate(
        trained_feature_order,
        start=1
    ):

        print(
            f"{index}. {feature}"
        )

    # ========================================================
    # VALIDATE FEATURE ORDER
    # ========================================================

    if list(trained_feature_order) != FEATURE_NAMES:

        raise Exception(
            "Feature order mismatch between "
            "training and diagnosis."
        )

    # ========================================================
    # LOAD LABEL ENCODER
    # ========================================================

    label_encoder_path = os.path.join(
        model_folder,
        "label_encoders.pkl"
    )

    target_encoder = None

    if os.path.exists(label_encoder_path):

        label_encoders = joblib.load(
            label_encoder_path
        )

        print(
            "\nLabel Encoder Loaded"
        )

        # ----------------------------------------------------
        # Dictionary of encoders
        # ----------------------------------------------------

        if isinstance(
            label_encoders,
            dict
        ):

            if "Quality_Status" in label_encoders:

                target_encoder = (
                    label_encoders[
                        "Quality_Status"
                    ]
                )

            else:

                for key, encoder in label_encoders.items():

                    if hasattr(
                        encoder,
                        "classes_"
                    ):

                        target_encoder = encoder

                        print(
                            "Target Encoder:",
                            key
                        )

                        break

        # ----------------------------------------------------
        # Single encoder
        # ----------------------------------------------------

        elif hasattr(
            label_encoders,
            "classes_"
        ):

            target_encoder = label_encoders

    # ========================================================
    # PRINT ENCODER INFORMATION
    # ========================================================

    if target_encoder is not None:

        print(
            "\nSaved Encoder Classes:"
        )

        try:

            for index, label in enumerate(
                target_encoder.classes_
            ):

                print(
                    index,
                    "->",
                    label
                )

        except Exception:

            pass

    else:

        print(
            "\nTarget encoder not available."
        )

    # ========================================================
    # PREPARE INPUT
    # ========================================================

    try:

        input_array = np.array(
            input_data,
            dtype=float
        ).reshape(
            1,
            -1
        )

    except Exception:

        raise ValueError(
            "All electrode manufacturing "
            "parameters must be numeric."
        )

    # ========================================================
    # PRINT INPUT FEATURES
    # ========================================================

    print(
        "\nInput Features:"
    )

    for feature, value in zip(
        FEATURE_NAMES,
        input_data
    ):

        print(
            f"{feature}: {value}"
        )

    # ========================================================
    # CREATE DATAFRAME
    # ========================================================

    input_df = pd.DataFrame(
        input_array,
        columns=FEATURE_NAMES
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
    # MODEL PREDICTION
    # ========================================================

    prediction = model.predict(
        input_scaled
    )[0]

    prediction = int(
        prediction
    )

    print(
        "\nRaw Prediction:",
        prediction
    )

    # ========================================================
    # CLASS DECODING
    # ========================================================

    predicted_label = CLASS_MAPPING.get(
        prediction,
        "Unknown"
    )

    # ========================================================
    # OPTIONAL ENCODER CHECK
    # ========================================================

    if target_encoder is not None:

        try:

            encoder_classes = list(
                target_encoder.classes_
            )

            if len(
                encoder_classes
            ) > prediction:

                encoder_label = (
                    encoder_classes[
                        prediction
                    ]
                )

                if isinstance(
                    encoder_label,
                    str
                ):

                    if encoder_label in [
                        "Good",
                        "Major_Defect",
                        "Minor_Defect"
                    ]:

                        predicted_label = (
                            encoder_label
                        )

        except Exception:

            pass

    # ========================================================
    # NORMALIZE LABEL
    # ========================================================

    predicted_label = str(
        predicted_label
    )

    # ========================================================
    # PREDICTION PROBABILITY
    # ========================================================

    probabilities = {}

    quality_score = 0.0

    if hasattr(
        model,
        "predict_proba"
    ):

        probability_array = model.predict_proba(
            input_scaled
        )[0]

        model_classes = getattr(
            model,
            "classes_",
            range(
                len(
                    probability_array
                )
            )
        )

        for class_index, probability in zip(
            model_classes,
            probability_array
        ):

            class_index = int(
                class_index
            )

            class_label = CLASS_MAPPING.get(
                class_index,
                str(class_index)
            )

            probabilities[
                class_label
            ] = round(
                float(probability) * 100,
                2
            )

        quality_score = round(
            float(
                np.max(
                    probability_array
                )
            ) * 100,
            2
        )

    else:

        quality_score = 100.0

    # ========================================================
    # SHAP EXPLAINABILITY
    # ========================================================

    shap_explanation = generate_shap_explanation(
        model,
        input_scaled
    )

    # ========================================================
    # TOP FEATURES
    # ========================================================

    top_features = shap_explanation[:5]

    # ========================================================
    # RISK ASSESSMENT
    # ========================================================

    if predicted_label == "Good":

        quality_status = "Good Quality"

        risk = "Low Risk"

        recommendation = (
            "The electrode is classified as Good. "
            "The manufacturing parameters are suitable "
            "for continued battery production."
        )

    elif predicted_label == "Major_Defect":

        quality_status = "Major Defect"

        risk = "High Risk"

        recommendation = (
            "A Major Defect has been detected. "
            "Immediate process inspection is recommended "
            "before the electrode is used for battery manufacturing."
        )

    elif predicted_label == "Minor_Defect":

        quality_status = "Minor Defect"

        risk = "Medium Risk"

        recommendation = (
            "A Minor Defect has been detected. "
            "Additional quality inspection is recommended. "
            "Review process parameters before production."
        )

    else:

        quality_status = "Unknown Quality"

        risk = "Unknown Risk"

        recommendation = (
            "The predicted class is not recognized "
            "by the current quality assessment rules."
        )

    # ========================================================
    # DISPLAY-FRIENDLY LABEL
    # ========================================================

    if predicted_label == "Good":

        display_label = "Good"

    elif predicted_label == "Major_Defect":

        display_label = "Major Defect"

    elif predicted_label == "Minor_Defect":

        display_label = "Minor Defect"

    else:

        display_label = predicted_label

    # ========================================================
    # EXPLANATION
    # ========================================================

    explanation = (

        "The diagnosis is generated using the trained "

        f"{best_model} model. "

        "The 14 electrode manufacturing parameters are "

        "provided in the same feature order used during "

        "model training and transformed using the "

        "StandardScaler fitted on the training dataset. "

        "The predicted class is interpreted using the "

        "electrode quality mapping: "

        "0 = Good, "

        "1 = Major Defect, "

        "and 2 = Minor Defect. "

        "SHAP explainability is used to identify the "
        "relative contribution of each manufacturing "
        "parameter to the model prediction."

    )

    # ========================================================
    # PRINT FINAL RESULT
    # ========================================================

    print(
        "\n=========================================="
    )

    print(
        "          DIAGNOSIS RESULT"
    )

    print(
        "=========================================="
    )

    print(
        "Prediction Class:",
        prediction
    )

    print(
        "Prediction Label:",
        display_label
    )

    print(
        "Quality:",
        quality_status
    )

    print(
        "Quality Score:",
        quality_score,
        "%"
    )

    print(
        "Risk:",
        risk
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
        "\nTop SHAP Features:"
    )

    for item in top_features:

        print(
            f"{item['rank']}. "
            f"{item['name']} "
            f"-> {item['value']}"
        )

    print(
        "==========================================\n"
    )

    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "quality":
            quality_status,

        "quality_label":
            display_label,

        "quality_score":
            quality_score,

        "risk":
            risk,

        "recommendation":
            recommendation,

        "model":
            best_model,

        "prediction_class":
            prediction,

        "probabilities":
            probabilities,

        "features":
            FEATURE_NAMES,

        # ----------------------------------------------------
        # SHAP EXPLAINABILITY
        # ----------------------------------------------------

        "shap_explanation":
            shap_explanation,

        "top_features":
            top_features,

        "explanation":
            explanation

    }