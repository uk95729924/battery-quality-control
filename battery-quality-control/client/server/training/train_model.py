import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score
)

from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

from xgboost import XGBClassifier
from lightgbm import LGBMClassifier


print("Current Working Directory :", os.getcwd())
print("This File :", __file__)


def train_models(dataset_path):

    # ===================================
    # Load Dataset
    # ===================================

    df = pd.read_csv(dataset_path)

    print("\n========== DATASET ==========")
    print(df.head())
    print(df.dtypes)

    print("\n========== DATASET STATISTICS ==========")
    print(df.describe(include="all"))
    print("========================================")

    if "Unnamed: 0" in df.columns:
        df = df.drop(columns=["Unnamed: 0"])

    # ===================================
    # Detect Target Column
    # ===================================

    possible_targets = [
        "Quality_Status",
        "Defect_Type",
        "Machine failure",
        "Machine_failure",
        "Target",
        "Label",
        "Class"
    ]

    target_column = None

    for col in possible_targets:

        if col in df.columns:
            target_column = col
            break

    if target_column is None:
        target_column = df.columns[-1]

    print("\nTarget Column :", target_column)

    # ===================================
    # Features & Target
    # ===================================

    X = df.drop(columns=[target_column])

    y = df[target_column]

    print("Target dtype :", y.dtype)
    print("Unique Labels :", sorted(y.unique()))

    # ===================================
    # Train Test Split
    # ===================================

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    print("\nTrain Shape :", X_train.shape)
    print("Test Shape :", X_test.shape)

    # ===================================
    # Models
    # ===================================

    models = {

        "Random Forest": RandomForestClassifier(
            n_estimators=200,
            random_state=42
        ),

        "SVM": SVC(
            probability=True,
            random_state=42
        ),

        "XGBoost": XGBClassifier(
            random_state=42,
            eval_metric="mlogloss"
        ),

        "LightGBM": LGBMClassifier(
            random_state=42
        )

    }

    # ===================================
    # Create Folder
    # ===================================

    base_dir = os.path.dirname(os.path.dirname(__file__))

    model_folder = os.path.join(
        base_dir,
        "trained_models"
    )

    os.makedirs(
        model_folder,
        exist_ok=True
    )

    print("\nModel Folder :", model_folder)

    # ===================================
    # Training
    # ===================================

    results = {}

    best_accuracy = 0
    best_model = ""

    for name, model in models.items():

        print("\n====================================")
        print("Training :", name)
        print("====================================")

        try:

            model.fit(
                X_train,
                y_train
            )

            prediction = model.predict(
                X_test
            )

            accuracy = accuracy_score(
                y_test,
                prediction
            )

            precision = precision_score(
                y_test,
                prediction,
                average="weighted",
                zero_division=0
            )

            recall = recall_score(
                y_test,
                prediction,
                average="weighted",
                zero_division=0
            )

            f1 = f1_score(
                y_test,
                prediction,
                average="weighted",
                zero_division=0
            )

            filename = (
                name.lower()
                .replace(" ", "_")
                + ".pkl"
            )

            joblib.dump(
                model,
                os.path.join(
                    model_folder,
                    filename
                )
            )

            results[name] = {

                "accuracy": round(
                    accuracy * 100,
                    2
                ),

                "precision": round(
                    precision * 100,
                    2
                ),

                "recall": round(
                    recall * 100,
                    2
                ),

                "f1": round(
                    f1 * 100,
                    2
                )

            }

            print("Accuracy :", accuracy)

            if accuracy > best_accuracy:

                best_accuracy = accuracy
                best_model = name

            print(name, "SUCCESS")

        except Exception as e:

            print("\n", name, "FAILED")
            print(e)

    # ===================================
    # Print Results
    # ===================================

    print("\n========== RESULTS ==========")
    print(results)

    print("\nBest Model :", best_model)

    # ===================================
    # Save Best Model
    # ===================================

    best_model_file = os.path.join(
        model_folder,
        "best_model.txt"
    )

    with open(best_model_file, "w") as file:
        file.write(best_model)

    print("Best Model Saved :", best_model_file)

    # ===================================
    # Final Response
    # ===================================

    return {

        "message": "Training Completed Successfully",

        "rows": len(df),

        "columns": len(df.columns),

        "target": target_column,

        "train_rows": len(X_train),

        "test_rows": len(X_test),

        "best_model": best_model,

        "results": results

    }