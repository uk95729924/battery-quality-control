from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

import os

from preprocessing.preprocess import preprocess_dataset
from training.train_model import train_models
from diagnosis.diagnosis import predict_quality
from prognosis.prognosis import predict_future_quality
from reports.report import generate_report


# ============================================================
# FLASK APPLICATION
# ============================================================

app = Flask(__name__)

CORS(app)


# ============================================================
# BASE DIRECTORY
# ============================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


# ============================================================
# UPLOAD DIRECTORY
# ============================================================

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads"
)

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# ============================================================
# ALLOWED FILE TYPES
# ============================================================

ALLOWED_EXTENSIONS = {
    "csv",
    "xlsx"
}


def allowed_file(filename):

    return (
        "." in filename
        and filename.rsplit(
            ".",
            1
        )[1].lower()
        in ALLOWED_EXTENSIONS
    )


# ============================================================
# HOME API
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "status": "Running",

        "project":
            "Intelligent Electrode Quality Control System",

        "backend":
            "Flask",

        "version":
            "1.0"

    })


# ============================================================
# UPLOAD DATASET API
# ============================================================

@app.route(
    "/upload",
    methods=["POST"]
)
def upload_file():

    try:

        # ----------------------------------------------------
        # Check file
        # ----------------------------------------------------

        if "file" not in request.files:

            return jsonify({

                "message":
                    "No file selected."

            }), 400

        file = request.files["file"]

        # ----------------------------------------------------
        # Check filename
        # ----------------------------------------------------

        if file.filename == "":

            return jsonify({

                "message":
                    "Empty filename."

            }), 400

        # ----------------------------------------------------
        # Validate extension
        # ----------------------------------------------------

        if not allowed_file(
            file.filename
        ):

            return jsonify({

                "message":
                    "Only CSV and XLSX files are supported."

            }), 400

        # ----------------------------------------------------
        # Secure filename
        # ----------------------------------------------------

        filename = secure_filename(
            file.filename
        )

        filepath = os.path.join(

            app.config["UPLOAD_FOLDER"],

            filename

        )

        # ----------------------------------------------------
        # Save file
        # ----------------------------------------------------

        file.save(
            filepath
        )

        print(
            "\n========== DATASET UPLOADED =========="
        )

        print(
            "Filename:",
            filename
        )

        print(
            "Path:",
            filepath
        )

        print(
            "======================================\n"
        )

        return jsonify({

            "message":
                "Dataset Uploaded Successfully",

            "filename":
                filename,

            "file_type":
                filename.rsplit(
                    ".",
                    1
                )[1].lower()

        }), 200

    except Exception as e:

        print(
            "UPLOAD ERROR:",
            str(e)
        )

        return jsonify({

            "message":
                str(e)

        }), 500


# ============================================================
# PREPROCESSING API
# ============================================================

@app.route(
    "/preprocess",
    methods=["POST"]
)
def preprocess():

    try:

        upload_folder = (
            app.config["UPLOAD_FOLDER"]
        )

        # ----------------------------------------------------
        # Find uploaded datasets
        # ----------------------------------------------------

        files = [

            f

            for f in os.listdir(
                upload_folder
            )

            if (

                f.lower().endswith(
                    ".csv"
                )

                or

                f.lower().endswith(
                    ".xlsx"
                )

            )

            and f != "processed_dataset.csv"

        ]

        # ----------------------------------------------------
        # No dataset
        # ----------------------------------------------------

        if len(files) == 0:

            return jsonify({

                "message":
                    "No uploaded dataset found."

            }), 400

        # ----------------------------------------------------
        # Latest dataset
        # ----------------------------------------------------

        latest_file = max(

            [

                os.path.join(
                    upload_folder,
                    f
                )

                for f in files

            ],

            key=os.path.getmtime

        )

        print(
            "\n========== PREPROCESSING =========="
        )

        print(
            "Dataset:",
            latest_file
        )

        # ----------------------------------------------------
        # Run preprocessing
        # ----------------------------------------------------

        df, summary = preprocess_dataset(
            latest_file
        )

        # ----------------------------------------------------
        # Save processed dataset
        # ----------------------------------------------------

        processed_file = os.path.join(

            upload_folder,

            "processed_dataset.csv"

        )

        df.to_csv(

            processed_file,

            index=False

        )

        # ----------------------------------------------------
        # Print summary
        # ----------------------------------------------------

        print(
            "\n========== PREPROCESSING SUMMARY =========="
        )

        print(
            summary
        )

        print(
            "===========================================\n"
        )

        # ----------------------------------------------------
        # Response
        # ----------------------------------------------------

        return jsonify({

            "message":
                "Preprocessing Completed Successfully",

            "rows":
                summary.get(
                    "rows",
                    0
                ),

            "columns":
                summary.get(
                    "columns",
                    0
                ),

            "missing_removed":
                summary.get(
                    "missing_removed",
                    0
                ),

            "duplicate_removed":
                summary.get(
                    "duplicate_removed",
                    0
                ),

            "encoded_columns":
                summary.get(
                    "encoded_columns",
                    0
                ),

            "scaled_columns":
                summary.get(
                    "scaled_columns",
                    0
                ),

            "target_column":
                summary.get(
                    "target_column",
                    None
                ),

            "processed_file":
                "processed_dataset.csv"

        }), 200

    except Exception as e:

        print(
            "\n========== PREPROCESSING ERROR =========="
        )

        print(
            str(e)
        )

        print(
            "=========================================\n"
        )

        return jsonify({

            "message":
                str(e)

        }), 500


# ============================================================
# TRAINING API
# ============================================================

# ============================================
# Train Model API
# ============================================
@app.route("/train", methods=["POST"])
def train():

    print("\n========================================")
    print("TRAIN API CALLED")
    print("========================================")

    processed_file = os.path.join(
        app.config["UPLOAD_FOLDER"],
        "processed_dataset.csv"
    )

    print("Dataset :", processed_file)

    # ----------------------------------------
    # Check processed dataset
    # ----------------------------------------

    if not os.path.exists(processed_file):

        print("Processed dataset not found.")

        return jsonify({
            "message": "Please preprocess dataset first."
        }), 400

    try:

        # ------------------------------------
        # Read frontend request
        # ------------------------------------

        data = request.get_json(
            silent=True
        ) or {}

        print("\n========== TRAINING CONFIG ==========")
        print("Request Data :", data)

        # ------------------------------------
        # Selected Models
        # ------------------------------------

        selected_models = data.get(
            "selected_models",
            [
                "XGBoost",
                "LightGBM",
                "Random Forest",
                "SVM"
            ]
        )

        # ------------------------------------
        # Train/Test Split
        # ------------------------------------

        test_size = float(
            data.get(
                "test_size",
                0.20
            )
        )

        # ------------------------------------
        # Random State
        # ------------------------------------

        random_state = int(
            data.get(
                "random_state",
                42
            )
        )

        # ------------------------------------
        # Cross Validation
        # ------------------------------------

        cv_folds = int(
            data.get(
                "cv_folds",
                5
            )
        )

        print(
            "Selected Models :",
            selected_models
        )

        print(
            "Test Size       :",
            test_size
        )

        print(
            "Random State    :",
            random_state
        )

        print(
            "CV Folds        :",
            cv_folds
        )

        print(
            "====================================\n"
        )

        # ------------------------------------
        # Validation
        # ------------------------------------

        allowed_models = {
            "XGBoost",
            "LightGBM",
            "Random Forest",
            "SVM"
        }

        invalid_models = [
            model
            for model in selected_models
            if model not in allowed_models
        ]

        if invalid_models:

            return jsonify({
                "message": (
                    "Invalid model(s) selected: "
                    + ", ".join(invalid_models)
                )
            }), 400

        if len(selected_models) == 0:

            return jsonify({
                "message":
                    "Please select at least one model."
            }), 400

        if not 0 < test_size < 1:

            return jsonify({
                "message":
                    "Test size must be between 0 and 1."
            }), 400

        if cv_folds < 2:

            return jsonify({
                "message":
                    "Cross validation must have at least 2 folds."
            }), 400

        # ------------------------------------
        # Train Models
        # ------------------------------------

        print(
            "Calling train_models()..."
        )

        result = train_models(

            processed_file,

            selected_models=selected_models,

            test_size=test_size,

            random_state=random_state,

            cv_folds=cv_folds

        )

        # ------------------------------------
        # Training Finished
        # ------------------------------------

        print(
            "\nTraining Finished Successfully"
        )

        print(
            "Best Model :",
            result.get("best_model")
        )

        print(
            "====================================\n"
        )

        return jsonify(result), 200

    except Exception as e:

        print(
            "\n========== TRAINING ERROR =========="
        )

        print(
            type(e).__name__,
            ":",
            str(e)
        )

        print(
            "====================================\n"
        )

        return jsonify({
            "message": str(e)
        }), 500

# ============================================================
# MODEL STATUS API
# ============================================================

@app.route(
    "/model-status",
    methods=["GET"]
)
def model_status():

    try:

        trained_model_folder = os.path.join(
            BASE_DIR,
            "trained_models"
        )

        best_model_file = os.path.join(
            trained_model_folder,
            "best_model.txt"
        )

        if not os.path.exists(best_model_file):

            return jsonify({

                "trained": False,

                "message":
                    "No trained model found."

            }), 200

        with open(
            best_model_file,
            "r",
            encoding="utf-8"
        ) as file:

            best_model = file.read().strip()

        model_file = os.path.join(
            trained_model_folder,
            best_model.lower().replace(" ", "_") + ".pkl"
        )

        return jsonify({

            "trained":
                os.path.exists(model_file),

            "best_model":
                best_model,

            "model_file":
                os.path.basename(model_file)

        }), 200

    except Exception as e:

        return jsonify({

            "trained": False,

            "message":
                str(e)

        }), 500


# ============================================================
# DIAGNOSIS API
# ============================================================

@app.route(
    "/diagnosis",
    methods=["POST"]
)
def diagnosis():

    try:

        # ----------------------------------------------------
        # Get JSON
        # ----------------------------------------------------

        data = request.get_json(
            silent=True
        )

        if not data:

            return jsonify({

                "message":
                    "No input data received."

            }), 400

        # ----------------------------------------------------
        # Required features
        # ----------------------------------------------------

        required_features = [

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

        # ----------------------------------------------------
        # Validate features
        # ----------------------------------------------------

        missing_features = [

            feature

            for feature in required_features

            if feature not in data

        ]

        if missing_features:

            return jsonify({

                "message":
                    "Missing required features.",

                "missing_features":
                    missing_features

            }), 400

        # ----------------------------------------------------
        # Convert input values
        # ----------------------------------------------------

        try:

            input_data = [

                float(
                    data[feature]
                )

                for feature in required_features

            ]

        except (
            ValueError,
            TypeError
        ):

            return jsonify({

                "message":
                    "All manufacturing parameters must be numeric."

            }), 400

        # ----------------------------------------------------
        # Prediction
        # ----------------------------------------------------

        print(
            "\n========== DIAGNOSIS API =========="
        )

        print(
            "Input:",
            input_data
        )

        result = predict_quality(
            input_data
        )

        print(
            "Diagnosis Result:",
            result
        )

        print(
            "===================================\n"
        )

        return jsonify(
            result
        ), 200

    except Exception as e:

        print(
            "\n========== DIAGNOSIS ERROR =========="
        )

        print(
            type(e).__name__,
            ":",
            str(e)
        )

        print(
            "=====================================\n"
        )

        return jsonify({

            "message":
                str(e)

        }), 500


# ============================================================
# PROGNOSIS API
# ============================================================

@app.route(
    "/prognosis",
    methods=["POST"]
)
def prognosis():

    try:

        # ----------------------------------------------------
        # Get JSON
        # ----------------------------------------------------

        data = request.get_json(
            silent=True
        )

        if not data:

            return jsonify({

                "message":
                    "No input data received."

            }), 400

        # ----------------------------------------------------
        # Required features
        # ----------------------------------------------------

        required_features = [

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

        # ----------------------------------------------------
        # Validate
        # ----------------------------------------------------

        missing_features = [

            feature

            for feature in required_features

            if feature not in data

        ]

        if missing_features:

            return jsonify({

                "message":
                    "Missing required features.",

                "missing_features":
                    missing_features

            }), 400

        # ----------------------------------------------------
        # Convert input
        # ----------------------------------------------------

        try:

            input_data = [

                float(
                    data[feature]
                )

                for feature in required_features

            ]

        except (
            ValueError,
            TypeError
        ):

            return jsonify({

                "message":
                    "All manufacturing parameters must be numeric."

            }), 400

        # ----------------------------------------------------
        # Prognosis
        # ----------------------------------------------------

        print(
            "\n========== PROGNOSIS API =========="
        )

        result = predict_future_quality(
            input_data
        )

        print(
            "Prognosis Result:",
            result
        )

        print(
            "===================================\n"
        )

        return jsonify(
            result
        ), 200

    except Exception as e:

        print(
            "\n========== PROGNOSIS ERROR =========="
        )

        print(
            type(e).__name__,
            ":",
            str(e)
        )

        print(
            "=====================================\n"
        )

        return jsonify({

            "message":
                str(e)

        }), 500


# ============================================================
# REPORT API
# ============================================================

@app.route(
    "/report",
    methods=["GET"]
)
def report():

    try:

        result = generate_report()

        return jsonify(
            result
        ), 200

    except Exception as e:

        print(
            "\n========== REPORT ERROR =========="
        )

        print(
            str(e)
        )

        print(
            "==================================\n"
        )

        return jsonify({

            "message":
                str(e)

        }), 500


# ============================================================
# RUN FLASK SERVER
# ============================================================

if __name__ == "__main__":

    print(
        "\n===================================="
    )

    print(
        " Intelligent Electrode Quality Control"
    )

    print(
        " Flask Backend Starting..."
    )

    print(
        "====================================\n"
    )

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )