from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from preprocessing.preprocess import preprocess_dataset
from training.train_model import train_models
from diagnosis.diagnosis import predict_quality
from prognosis.prognosis import predict_future_quality
from reports.report import generate_report

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# ============================================
# Home API
# ============================================
@app.route("/")
def home():
    return {
        "status": "Running",
        "project": "Intelligent Electrode Quality Control System"
    }


# ============================================
# Upload Dataset API
# ============================================
@app.route("/upload", methods=["POST"])
def upload_file():

    if "file" not in request.files:
        return jsonify({
            "message": "No file selected"
        }), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({
            "message": "Empty filename"
        }), 400

    filepath = os.path.join(
        app.config["UPLOAD_FOLDER"],
        file.filename
    )

    file.save(filepath)

    print("\n========== DATASET UPLOADED ==========")
    print(filepath)
    print("======================================\n")

    return jsonify({
        "message": "Dataset Uploaded Successfully",
        "filename": file.filename
    })


# ============================================
# Preprocessing API
# ============================================
@app.route("/preprocess", methods=["POST"])
def preprocess():

    upload_folder = app.config["UPLOAD_FOLDER"]

    files = [
        f for f in os.listdir(upload_folder)
        if f.endswith(".csv") and f != "processed_dataset.csv"
    ]

    if len(files) == 0:
        return jsonify({
            "message": "No uploaded dataset found."
        }), 400

    latest_file = max(
        [os.path.join(upload_folder, f) for f in files],
        key=os.path.getmtime
    )

    print("\n========== PREPROCESSING ==========")
    print("Dataset :", latest_file)

    df, summary = preprocess_dataset(latest_file)

    processed_file = os.path.join(
        upload_folder,
        "processed_dataset.csv"
    )

    df.to_csv(
        processed_file,
        index=False
    )

    print("\n========== SUMMARY ==========")
    print(summary)
    print("=============================\n")

    return jsonify({

        "message": "Preprocessing Completed Successfully",

        "rows": summary["rows"],

        "columns": summary["columns"],

        "missing_removed": summary["missing_removed"],

        "duplicate_removed": summary["duplicate_removed"],

        "encoded_columns": summary["encoded_columns"],

        "scaled_columns": summary["scaled_columns"],

        "processed_file": "processed_dataset.csv"

    })


# ============================================
# Train Model API
# ============================================
# ============================================
# Diagnosis API
# ============================================

@app.route("/diagnosis", methods=["POST"])
def diagnosis():

    try:

        data = request.json

        input_data = [

            data["Electrode_Thickness"],
            data["Coating_Weight"],
            data["Coating_Uniformity"],
            data["Slurry_Viscosity"],
            data["Drying_Temperature"],
            data["Drying_Time"],
            data["Calender_Pressure"],
            data["Roller_Speed"],
            data["Electrode_Density"],
            data["Moisture_Content"],
            data["Surface_Roughness"],
            data["Adhesion_Strength"],
            data["Ambient_Humidity"],
            data["Ambient_Temperature"]

        ]

        result = predict_quality(input_data)

        return jsonify(result)

    except Exception as e:

        return jsonify({
            "message": str(e)
        }), 500

@app.route("/train", methods=["POST"])
def train():

    print("\n========== TRAIN API CALLED ==========")

    processed_file = os.path.join(
        app.config["UPLOAD_FOLDER"],
        "processed_dataset.csv"
    )

    print("Dataset :", processed_file)

    if not os.path.exists(processed_file):

        print("Processed dataset not found.")

        return jsonify({
            "message": "Please preprocess dataset first."
        }), 400

    try:

        print("Calling train_models()...")

        result = train_models(processed_file)

        print("Training Finished Successfully")

        return jsonify(result)

    except Exception as e:

        print("\n========== TRAINING ERROR ==========")
        print(e)
        print("====================================\n")

        return jsonify({
            "message": str(e)
        }), 500
    
    # ============================================
# Prognosis API
# ============================================

@app.route("/prognosis", methods=["POST"])
def prognosis():

    try:

        data = request.json

        input_data = [

            data["Electrode_Thickness"],
            data["Coating_Weight"],
            data["Coating_Uniformity"],
            data["Slurry_Viscosity"],
            data["Drying_Temperature"],
            data["Drying_Time"],
            data["Calender_Pressure"],
            data["Roller_Speed"],
            data["Electrode_Density"],
            data["Moisture_Content"],
            data["Surface_Roughness"],
            data["Adhesion_Strength"],
            data["Ambient_Humidity"],
            data["Ambient_Temperature"]

        ]

        result = predict_future_quality(input_data)

        return jsonify(result)

    except Exception as e:

        return jsonify({

            "message": str(e)

        }), 500


# ============================================
# reports
# ============================================
@app.route("/report", methods=["GET"])
def report():

    try:

        result = generate_report()

        return jsonify(result)

    except Exception as e:

        return jsonify({

            "message": str(e)

        }), 500
# ============================================
# Run Flask Server
# ============================================
if __name__ == "__main__":

    print("\n====================================")
    print("Starting Flask Server...")
    print("====================================\n")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )