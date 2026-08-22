# Intelligent Electrode Quality Control System

A full-stack battery electrode quality-control application for uploading manufacturing datasets, preprocessing data, training machine-learning models, diagnosing electrode quality, forecasting future quality, and reviewing reports.

## Features

- Upload CSV and XLSX electrode datasets
- Preview uploaded CSV data in the browser
- Preprocess datasets by removing missing and duplicate records, encoding categorical values, and scaling features
- Train and compare XGBoost, LightGBM, Random Forest, and SVM models
- Configure test split, random state, and cross-validation folds
- Diagnose electrode quality from manufacturing parameters
- Predict future quality trends
- Check trained-model status
- Generate quality reports

## Technology Stack

### Frontend

- React 19
- Vite
- React Router
- Axios
- Tailwind CSS
- Recharts
- PapaParse and XLSX

### Backend

- Python
- Flask and Flask-Cors
- pandas and NumPy
- scikit-learn
- XGBoost, LightGBM, and CatBoost
- SHAP, joblib, matplotlib, and openpyxl

## Project Structure

```text
.
├── dataset/                         # Sample source dataset
├── battery-quality-control/
│   └── client/
│       ├── src/                     # React application
│       └── server/                  # Flask API and ML pipeline
│           ├── diagnosis/
│           ├── preprocessing/
│           ├── prognosis/
│           ├── reports/
│           ├── training/
│           ├── trained_models/
│           └── uploads/
└── README.md
```

## Prerequisites

- Node.js 18 or later
- npm
- Python 3.9 or later
- pip

## Installation

### 1. Install frontend dependencies

```powershell
Set-Location .\battery-quality-control\client
npm install
```

### 2. Create a Python environment

From the same `client` directory:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r .\server\requirements.txt
```

On macOS or Linux, activate the environment with:

```bash
source .venv/bin/activate
```

## Running the Application

Start the Flask backend in one terminal:

```powershell
Set-Location .\battery-quality-control\client
.\.venv\Scripts\Activate.ps1
python .\server\app.py
```

The API runs at `http://127.0.0.1:5000`.

Start the React frontend in a second terminal:

```powershell
Set-Location .\battery-quality-control\client
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Typical Workflow

1. Register or sign in from the frontend.
2. Upload a `.csv` or `.xlsx` dataset from the Upload Dataset page.
3. Run preprocessing to create `server/uploads/processed_dataset.csv`.
4. Select models and training parameters, then train the models.
5. Use Diagnosis or Prognosis with the manufacturing feature values.
6. Review model status and report information from the Reports page.

The diagnosis and prognosis endpoints expect these numeric features:

- `Electrode_Thickness`
- `Coating_Weight`
- `Coating_Uniformity`
- `Slurry_Viscosity`
- `Drying_Temperature`
- `Drying_Time`
- `Calender_Pressure`
- `Roller_Speed`
- `Electrode_Density`
- `Moisture_Content`
- `Surface_Roughness`
- `Adhesion_Strength`
- `Ambient_Humidity`
- `Ambient_Temperature`

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/` | Check backend status |
| `POST` | `/upload` | Upload a CSV or XLSX dataset using multipart field `file` |
| `POST` | `/preprocess` | Preprocess the uploaded dataset |
| `POST` | `/train` | Train selected models using JSON configuration |
| `GET` | `/model-status` | Check whether a trained model is available |
| `POST` | `/diagnosis` | Classify electrode quality from manufacturing parameters |
| `POST` | `/prognosis` | Predict future quality from manufacturing parameters |
| `GET` | `/report` | Generate the current quality report |

Example health check:

```powershell
Invoke-RestMethod http://127.0.0.1:5000/
```

Example training request:

```powershell
$body = @{
  selected_models = @("XGBoost", "LightGBM", "Random Forest", "SVM")
  test_size = 0.2
  random_state = 42
  cv_folds = 5
} | ConvertTo-Json

Invoke-RestMethod -Uri http://127.0.0.1:5000/train -Method Post -Body $body -ContentType "application/json"
```

## Frontend Commands

Run these commands from `battery-quality-control/client`:

```bash
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run lint      # Run ESLint
```

## Data and Generated Files

Uploaded files and generated artifacts are stored under `client/server/uploads/` and `client/server/trained_models/`. The repository includes sample datasets and model metadata for development. Avoid committing sensitive production data or newly generated model artifacts.

## Notes

- The frontend currently calls the backend at `http://127.0.0.1:5000` directly.
- CORS is enabled by the Flask backend for local development.
- The backend runs with Flask debug mode enabled when started directly; disable debug mode before production deployment.
- The Reports page currently contains demonstration summary and prediction-history data rather than a complete persisted prediction history.
