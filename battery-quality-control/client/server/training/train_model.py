import os
import time
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_validate
)

from sklearn.preprocessing import (
    StandardScaler,
    LabelEncoder
)

from sklearn.pipeline import Pipeline

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    balanced_accuracy_score,
    make_scorer
)

from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC

from sklearn.inspection import permutation_importance

from xgboost import XGBClassifier
from lightgbm import LGBMClassifier


# ============================================================
# MODULE START
# ============================================================

print("==========================================")
print("TRAINING MODULE LOADED")
print("==========================================")
print("Current Working Directory :", os.getcwd())
print("This File :", __file__)


# ============================================================
# TARGET COLUMN DETECTION
# ============================================================

def detect_target_column(df):

    possible_targets = [

        "Quality_Status",
        "Defect_Type",
        "Machine failure",
        "Machine_failure",
        "Target",
        "Label",
        "Class"

    ]

    for column in possible_targets:

        if column in df.columns:

            return column

    return df.columns[-1]


# ============================================================
# FEATURE IMPORTANCE
# ============================================================

def get_feature_importance(
    model,
    model_name,
    X_test,
    y_test,
    random_state=42
):

    try:

        # ----------------------------------------------------
        # TREE-BASED MODELS
        # ----------------------------------------------------

        if model_name in [

            "Random Forest",
            "XGBoost",
            "LightGBM"

        ]:

            importance = model.feature_importances_

        # ----------------------------------------------------
        # SVM
        # ----------------------------------------------------

        elif model_name == "SVM":

            permutation_result = permutation_importance(

                model,

                X_test,

                y_test,

                n_repeats=3,

                random_state=random_state,

                scoring="balanced_accuracy"

            )

            importance = (
                permutation_result.importances_mean
            )

        else:

            return []

        importance = np.asarray(
            importance,
            dtype=float
        )

        # ----------------------------------------------------
        # Remove negative importance
        # ----------------------------------------------------

        importance = np.maximum(
            importance,
            0
        )

        total = importance.sum()

        if total > 0:

            normalized = (
                importance / total
            )

        else:

            normalized = importance

        feature_importance = []

        for feature_name, value in zip(
            X_test.columns,
            normalized
        ):

            feature_importance.append({

                "name":
                    str(feature_name),

                "value":
                    round(
                        float(value),
                        6
                    )

            })

        # ----------------------------------------------------
        # Sort
        # ----------------------------------------------------

        feature_importance.sort(

            key=lambda x:
                x["value"],

            reverse=True

        )

        return feature_importance

    except Exception as e:

        print(
            "\nFeature Importance Error:",
            e
        )

        return []


# ============================================================
# TRAIN MODELS
# ============================================================

def train_models(
    dataset_path,
    selected_features=None,
    target_column=None,
    selected_models=None,
    test_size=0.20,
    random_state=42,
    cv_folds=5
):

    print("\n")
    print("==========================================")
    print("STARTING MODEL TRAINING")
    print("==========================================")

    # ========================================================
    # TRAINING CONFIGURATION
    # ========================================================

    if selected_models is None:
        selected_models = [
            "Random Forest",
            "SVM",
            "XGBoost",
            "LightGBM"
        ]

    model_aliases = {
        "randomforest": "Random Forest",
        "random_forest": "Random Forest",
        "random forest": "Random Forest",
        "svm": "SVM",
        "xgboost": "XGBoost",
        "lightgbm": "LightGBM",
        "light gbm": "LightGBM"
    }

    normalized_models = []

    for model_name in selected_models:
        key = str(model_name).strip().lower()
        normalized_name = model_aliases.get(key)

        if normalized_name and normalized_name not in normalized_models:
            normalized_models.append(normalized_name)

    selected_models = normalized_models

    if len(selected_models) == 0:
        raise ValueError(
            "Please select at least one machine learning model."
        )

    try:
        test_size = float(test_size)
    except (TypeError, ValueError):
        raise ValueError("test_size must be a number.")

    if not 0 < test_size < 1:
        raise ValueError(
            "test_size must be greater than 0 and less than 1."
        )

    try:
        random_state = int(random_state)
    except (TypeError, ValueError):
        raise ValueError("random_state must be an integer.")

    try:
        cv_folds = int(cv_folds)
    except (TypeError, ValueError):
        raise ValueError("cv_folds must be an integer.")

    if cv_folds < 2:
        raise ValueError("cv_folds must be at least 2.")

    print("\n========== TRAINING CONFIGURATION ==========")
    print("Selected Models :", selected_models)
    print("Test Size       :", test_size)
    print("Random State    :", random_state)
    print("CV Folds        :", cv_folds)
    print("============================================")

    # ========================================================
    # LOAD DATASET
    # ========================================================

    if not os.path.exists(dataset_path):

        raise FileNotFoundError(

            f"Dataset not found: "
            f"{dataset_path}"

        )

    df = pd.read_csv(
        dataset_path
    )

    print(
        "\nDataset:",
        dataset_path
    )

    print(
        "Shape:",
        df.shape
    )

    # ========================================================
    # REMOVE UNNAMED INDEX COLUMN
    # ========================================================

    if "Unnamed: 0" in df.columns:

        df = df.drop(
            columns=["Unnamed: 0"]
        )

    # ========================================================
    # DETECT TARGET
    # ========================================================

    if target_column is None:

        target_column = detect_target_column(
            df
        )

    if target_column not in df.columns:

        raise ValueError(

            f"Target column "
            f"'{target_column}' "
            "not found in dataset."

        )

    print(
        "\nTarget Column:",
        target_column
    )

    # ========================================================
    # SELECT FEATURES
    # ========================================================

    if selected_features is None:

        feature_columns = [

            column

            for column in df.columns

            if column != target_column

        ]

    else:

        feature_columns = [

            column

            for column in selected_features

            if column in df.columns
            and column != target_column

        ]

    if len(feature_columns) == 0:

        raise ValueError(
            "No valid input features selected."
        )

    print(
        "\nSelected Features:"
    )

    for feature in feature_columns:

        print(
            " -",
            feature
        )

    # ========================================================
    # CREATE X AND y
    # ========================================================

    X = df[
        feature_columns
    ].copy()

    y = df[
        target_column
    ].copy()

    # ========================================================
    # DATA VALIDATION
    # ========================================================

    if y.isnull().any():

        raise ValueError(
            "Target column contains missing values."
        )

    if X.isnull().any().any():

        raise ValueError(

            "Input features contain missing values. "
            "Run preprocessing first."

        )

    non_numeric_columns = X.select_dtypes(

        exclude=["number"]

    ).columns.tolist()

    if len(non_numeric_columns) > 0:

        raise ValueError(

            "Non-numeric input features detected: "

            + ", ".join(
                non_numeric_columns
            )

            + ". Current training pipeline "
              "expects numerical manufacturing parameters."

        )

    # ========================================================
    # CLASS DISTRIBUTION
    # ========================================================

    class_counts = y.value_counts(
        dropna=False
    )

    total_samples = len(y)

    class_distribution = {}

    for label, count in class_counts.items():

        class_distribution[
            str(label)
        ] = {

            "count":
                int(count),

            "percentage":
                round(

                    (
                        count /
                        total_samples
                    ) * 100,

                    2

                )

        }

    min_class_count = int(
        class_counts.min()
    )

    max_class_count = int(
        class_counts.max()
    )

    if min_class_count > 0:

        imbalance_ratio = round(

            max_class_count /
            min_class_count,

            2

        )

    else:

        imbalance_ratio = None

    if (

        len(class_counts) > 1

        and

        min_class_count > 0

    ):

        if imbalance_ratio > 1.5:

            imbalance_status = "Imbalanced"

        else:

            imbalance_status = (
                "Relatively Balanced"
            )

    else:

        imbalance_status = (
            "Not Determined"
        )

    print(
        "\n========== CLASS DISTRIBUTION =========="
    )

    for label, info in class_distribution.items():

        print(

            f"{label}: "
            f"{info['count']} "
            f"({info['percentage']}%)"

        )

    print(
        "Imbalance Ratio:",
        imbalance_ratio
    )

    print(
        "Imbalance Status:",
        imbalance_status
    )

    # ========================================================
    # TRAIN / TEST SPLIT
    # ========================================================

    X_train_raw, X_test_raw, y_train_raw, y_test_raw = (

        train_test_split(

            X,

            y,

            test_size=test_size,

            random_state=random_state,

            stratify=y

        )

    )

    print(
        "\n========== DATA SPLIT =========="
    )

    print(
        "Train Rows:",
        len(X_train_raw)
    )

    print(
        "Test Rows:",
        len(X_test_raw)
    )

    # ========================================================
    # LABEL ENCODING
    # ========================================================

    label_encoder = LabelEncoder()

    y_train = pd.Series(

        label_encoder.fit_transform(
            y_train_raw
        ),

        index=y_train_raw.index

    )

    y_test = pd.Series(

        label_encoder.transform(
            y_test_raw
        ),

        index=y_test_raw.index

    )

    class_labels = [

        str(label)

        for label
        in label_encoder.classes_

    ]

    print(
        "\nActual Label Mapping:"
    )

    for numeric_label, original_label in enumerate(

        label_encoder.classes_

    ):

        print(

            numeric_label,
            "->",
            original_label

        )

    # ========================================================
    # STANDARD SCALER
    # ========================================================

    scaler = StandardScaler()

    X_train = pd.DataFrame(

        scaler.fit_transform(
            X_train_raw
        ),

        columns=X_train_raw.columns,

        index=X_train_raw.index

    )

    X_test = pd.DataFrame(

        scaler.transform(
            X_test_raw
        ),

        columns=X_test_raw.columns,

        index=X_test_raw.index

    )

    print(
        "\nStandardScaler fitted on training data only."
    )

    # ========================================================
    # MODEL DEFINITIONS
    # ========================================================

    models = {

        "Random Forest":

            RandomForestClassifier(

                n_estimators=200,

                random_state=random_state

            ),

        "SVM":

            SVC(

                probability=True,

                random_state=random_state

            ),

        "XGBoost":

            XGBClassifier(

                random_state=random_state,

                eval_metric="mlogloss"

            ),

        "LightGBM":

            LGBMClassifier(

                random_state=random_state,

                verbosity=-1

            )

    }

    # ========================================================
    # SELECT ONLY USER-CHOSEN MODELS
    # ========================================================

    models = {
        name: model
        for name, model in models.items()
        if name in selected_models
    }

    if len(models) == 0:
        raise ValueError("No valid models selected for training.")

    print("\nModels that will be trained:")
    for model_name in models:
        print(" -", model_name)

    # ========================================================
    # MODEL DIRECTORIES
    # ========================================================

    base_dir = os.path.dirname(
        os.path.dirname(__file__)
    )

    model_folder = os.path.join(

        base_dir,

        "trained_models"

    )

    models_folder = os.path.join(

        base_dir,

        "models"

    )

    os.makedirs(

        model_folder,

        exist_ok=True

    )

    os.makedirs(

        models_folder,

        exist_ok=True

    )

    # ========================================================
    # SAVE SCALER
    # ========================================================

    scaler_path = os.path.join(

        models_folder,

        "scaler.pkl"

    )

    joblib.dump(

        scaler,

        scaler_path

    )

    print(
        "\nScaler saved:",
        scaler_path
    )

    # ========================================================
    # SAVE LABEL ENCODER
    # ========================================================

    label_encoder_path = os.path.join(

        models_folder,

        "label_encoders.pkl"

    )

    label_encoders = {

        target_column:
            label_encoder

    }

    joblib.dump(

        label_encoders,

        label_encoder_path

    )

    print(

        "Label encoder saved:",

        label_encoder_path

    )

    # ========================================================
    # SAVE FEATURE ORDER
    # ========================================================

    feature_order_path = os.path.join(
    models_folder,
    "feature_order.pkl"
    )

    joblib.dump(
    feature_columns,
    feature_order_path
    )

    print(
    "Feature order saved:",
    feature_order_path
    )

    # ========================================================
    # 5-FOLD STRATIFIED CROSS VALIDATION
    # ========================================================

    if cv_folds > min_class_count:
        raise ValueError(
            f"cv_folds={cv_folds} is too large for the "
            f"smallest class ({min_class_count} samples). "
            f"Choose cv_folds <= {min_class_count}."
        )

    cv = StratifiedKFold(

        n_splits=cv_folds,

        shuffle=True,

        random_state=random_state

    )

    # ========================================================
    # RESEARCH-GRADE SCORING
    #
    # Macro F1:
    # Gives equal importance to every class.
    #
    # Weighted F1:
    # Takes class frequency into account.
    #
    # Balanced Accuracy:
    # Average recall across classes.
    # ========================================================

    scoring = {

        "accuracy":

            make_scorer(
                accuracy_score
            ),

        "precision_weighted":

            make_scorer(

                precision_score,

                average="weighted",

                zero_division=0

            ),

        "recall_weighted":

            make_scorer(

                recall_score,

                average="weighted",

                zero_division=0

            ),

        "f1_weighted":

            make_scorer(

                f1_score,

                average="weighted",

                zero_division=0

            ),

        "f1_macro":

            make_scorer(

                f1_score,

                average="macro",

                zero_division=0

            ),

        "balanced_accuracy":

            make_scorer(

                balanced_accuracy_score

            )

    }

    cv_results = {}

    print(
        "\n=========================================="
    )

    print(
        "5-FOLD CROSS VALIDATION"
    )

    print(
        "=========================================="
    )

    # ========================================================
    # CROSS VALIDATION
    # ========================================================

    for name, model in models.items():

        print(
            "\nCV:",
            name
        )

        # ----------------------------------------------------
        # Pipeline
        # ----------------------------------------------------

        pipeline = Pipeline([

            (

                "scaler",

                StandardScaler()

            ),

            (

                "model",

                model

            )

        ])

        try:

            cv_output = cross_validate(

                pipeline,

                X_train_raw,

                y_train,

                cv=cv,

                scoring=scoring,

                n_jobs=-1,

                return_train_score=False

            )

            # ------------------------------------------------
            # Extract CV arrays
            # ------------------------------------------------

            cv_accuracy = cv_output[
                "test_accuracy"
            ]

            cv_precision = cv_output[
                "test_precision_weighted"
            ]

            cv_recall = cv_output[
                "test_recall_weighted"
            ]

            cv_f1_weighted = cv_output[
                "test_f1_weighted"
            ]

            cv_f1_macro = cv_output[
                "test_f1_macro"
            ]

            cv_balanced_accuracy = cv_output[
                "test_balanced_accuracy"
            ]

            # ------------------------------------------------
            # Store results
            # ------------------------------------------------

            cv_results[name] = {

                "accuracy_mean":
                    round(

                        float(
                            np.mean(
                                cv_accuracy
                            )
                        ) * 100,

                        2

                    ),

                "accuracy_std":
                    round(

                        float(
                            np.std(
                                cv_accuracy
                            )
                        ) * 100,

                        2

                    ),

                "precision_mean":
                    round(

                        float(
                            np.mean(
                                cv_precision
                            )
                        ) * 100,

                        2

                    ),

                "recall_mean":
                    round(

                        float(
                            np.mean(
                                cv_recall
                            )
                        ) * 100,

                        2

                    ),

                "f1_weighted_mean":
                    round(

                        float(
                            np.mean(
                                cv_f1_weighted
                            )
                        ) * 100,

                        2

                    ),

                "f1_macro_mean":
                    round(

                        float(
                            np.mean(
                                cv_f1_macro
                            )
                        ) * 100,

                        2

                    ),

                "balanced_accuracy_mean":
                    round(

                        float(
                            np.mean(
                                cv_balanced_accuracy
                            )
                        ) * 100,

                        2

                    ),

                "f1_macro_std":
                    round(

                        float(
                            np.std(
                                cv_f1_macro
                            )
                        ) * 100,

                        2

                    ),

                "balanced_accuracy_std":
                    round(

                        float(
                            np.std(
                                cv_balanced_accuracy
                            )
                        ) * 100,

                        2

                    )

            }

            # ------------------------------------------------
            # Terminal output
            # ------------------------------------------------

            print(
                "\n",
                name,
                "CV Results"
            )

            print(

                "Accuracy:",
                cv_results[name][
                    "accuracy_mean"
                ],

                "% ±",

                cv_results[name][
                    "accuracy_std"
                ],

                "%"

            )

            print(

                "Weighted Precision:",

                cv_results[name][
                    "precision_mean"
                ],

                "%"

            )

            print(

                "Weighted Recall:",

                cv_results[name][
                    "recall_mean"
                ],

                "%"

            )

            print(

                "Weighted F1:",

                cv_results[name][
                    "f1_weighted_mean"
                ],

                "%"

            )

            print(

                "Macro F1:",

                cv_results[name][
                    "f1_macro_mean"
                ],

                "% ±",

                cv_results[name][
                    "f1_macro_std"
                ],

                "%"

            )

            print(

                "Balanced Accuracy:",

                cv_results[name][
                    "balanced_accuracy_mean"
                ],

                "% ±",

                cv_results[name][
                    "balanced_accuracy_std"
                ],

                "%"

            )

        except Exception as e:

            print(
                "\nCV FAILED:",
                name
            )

            print(
                "Error:",
                e
            )

            cv_results[name] = {

                "accuracy_mean": None,

                "accuracy_std": None,

                "precision_mean": None,

                "recall_mean": None,

                "f1_weighted_mean": None,

                "f1_macro_mean": None,

                "balanced_accuracy_mean": None,

                "f1_macro_std": None,

                "balanced_accuracy_std": None

            }

    # ========================================================
    # FINAL MODEL TRAINING
    # ========================================================

    results = {}

    all_feature_importance = {}

    best_model_name = ""

    best_model_score = -1

    best_feature_importance = []

    best_confusion_matrix = []

    best_class_metrics = {}

    best_training_time = 0

    best_prediction_time = 0

    # ========================================================
    # TRAIN EACH MODEL
    # ========================================================

    for name, model in models.items():

        print(
            "\n=========================================="
        )

        print(
            "Training:",
            name
        )

        print(
            "=========================================="
        )

        try:

            # ------------------------------------------------
            # Training Time
            # ------------------------------------------------

            training_start = time.perf_counter()

            model.fit(

                X_train,

                y_train

            )

            training_time = (

                time.perf_counter()

                - training_start

            )

            print(

                "Training Time:",

                round(
                    training_time,
                    4
                ),

                "seconds"

            )

            # ------------------------------------------------
            # Prediction Time
            # ------------------------------------------------

            prediction_start = time.perf_counter()

            prediction = model.predict(

                X_test

            )

            prediction_time = (

                time.perf_counter()

                - prediction_start

            )

            print(

                "Prediction Time:",

                round(
                    prediction_time,
                    4
                ),

                "seconds"

            )

            # ------------------------------------------------
            # Overall Metrics
            # ------------------------------------------------

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

            weighted_f1 = f1_score(

                y_test,

                prediction,

                average="weighted",

                zero_division=0

            )

            macro_f1 = f1_score(

                y_test,

                prediction,

                average="macro",

                zero_division=0

            )

            balanced_accuracy = (
                balanced_accuracy_score(

                    y_test,

                    prediction

                )
            )

            # ------------------------------------------------
            # Confusion Matrix
            # ------------------------------------------------

            cm = confusion_matrix(

                y_test,

                prediction,

                labels=list(

                    range(

                        len(
                            label_encoder.classes_
                        )

                    )

                )

            )

            # ------------------------------------------------
            # TERMINAL CONFUSION MATRIX OUTPUT
            # ------------------------------------------------
            # The confusion matrix is already calculated above,
            # so printing it here adds virtually no training time.
            print("\n==========================================")
            print(f"CONFUSION MATRIX - {name}")
            print("==========================================")

            # Header
            header = "Actual \\ Predicted"
            for label in class_labels:
                header += f"{label:>18}"
            print(header)

            # Matrix rows
            for i, actual_label in enumerate(class_labels):
                row_text = f"{actual_label:<18}"
                for j in range(len(class_labels)):
                    row_text += f"{cm[i][j]:>18}"
                print(row_text)

            print("==========================================")

            # ------------------------------------------------
            # Per-Class Metrics
            # ------------------------------------------------

            class_precision = precision_score(

                y_test,

                prediction,

                labels=list(

                    range(

                        len(
                            label_encoder.classes_
                        )

                    )

                ),

                average=None,

                zero_division=0

            )

            class_recall = recall_score(

                y_test,

                prediction,

                labels=list(

                    range(

                        len(
                            label_encoder.classes_
                        )

                    )

                ),

                average=None,

                zero_division=0

            )

            class_f1 = f1_score(

                y_test,

                prediction,

                labels=list(

                    range(

                        len(
                            label_encoder.classes_
                        )

                    )

                ),

                average=None,

                zero_division=0

            )

            class_metrics = {}

            for i, label in enumerate(

                label_encoder.classes_

            ):

                class_metrics[
                    str(label)
                ] = {

                    "precision":

                        round(

                            float(
                                class_precision[i]
                            ) * 100,

                            2

                        ),

                    "recall":

                        round(

                            float(
                                class_recall[i]
                            ) * 100,

                            2

                        ),

                    "f1":

                        round(

                            float(
                                class_f1[i]
                            ) * 100,

                            2

                        ),

                    "support":

                        int(

                            (
                                y_test == i
                            ).sum()

                        )

                }

            # ------------------------------------------------
            # Feature Importance
            # ------------------------------------------------

            feature_importance = (
                get_feature_importance(

                    model,

                    name,

                    X_test,

                    y_test,

                    random_state=random_state

                )
            )

            all_feature_importance[
                name
            ] = feature_importance

            # ------------------------------------------------
            # Save Model
            # ------------------------------------------------

            filename = (

                name.lower()
                .replace(
                    " ",
                    "_"
                )

                + ".pkl"

            )

            model_path = os.path.join(

                model_folder,

                filename

            )

            joblib.dump(

                model,

                model_path

            )

            # ------------------------------------------------
            # CV Results
            # ------------------------------------------------

            model_cv = cv_results.get(

                name,

                {}

            )

            # ------------------------------------------------
            # Store Model Results
            # ------------------------------------------------

            results[name] = {

                "accuracy":

                    round(
                        accuracy * 100,
                        2
                    ),

                "precision":

                    round(
                        precision * 100,
                        2
                    ),

                "recall":

                    round(
                        recall * 100,
                        2
                    ),

                "f1":

                    round(
                        weighted_f1 * 100,
                        2
                    ),

                "macro_f1":

                    round(
                        macro_f1 * 100,
                        2
                    ),

                "balanced_accuracy":

                    round(
                        balanced_accuracy * 100,
                        2
                    ),

                "cv_accuracy_mean":

                    model_cv.get(
                        "accuracy_mean"
                    ),

                "cv_accuracy_std":

                    model_cv.get(
                        "accuracy_std"
                    ),

                "cv_precision_mean":

                    model_cv.get(
                        "precision_mean"
                    ),

                "cv_recall_mean":

                    model_cv.get(
                        "recall_mean"
                    ),

                "cv_f1_weighted_mean":

                    model_cv.get(
                        "f1_weighted_mean"
                    ),

                "cv_f1_macro_mean":

                    model_cv.get(
                        "f1_macro_mean"
                    ),

                "cv_balanced_accuracy_mean":

                    model_cv.get(
                        "balanced_accuracy_mean"
                    ),

                "cv_f1_macro_std":

                    model_cv.get(
                        "f1_macro_std"
                    ),

                "cv_balanced_accuracy_std":

                    model_cv.get(
                        "balanced_accuracy_std"
                    ),

                "training_time":

                    round(
                        training_time,
                        4
                    ),

                "prediction_time":

                    round(
                        prediction_time,
                        4
                    ),

                "confusion_matrix":

                    cm.tolist(),

                "class_labels":

                    class_labels,

                "class_metrics":

                    class_metrics,

                "model_file":

                    filename

            }

            # ------------------------------------------------
            # Terminal Results
            # ------------------------------------------------

            print(
                "\n",
                name,
                "Results"
            )

            print(

                "Test Accuracy:",

                round(
                    accuracy * 100,
                    2
                ),

                "%"

            )

            print(

                "Test Precision:",

                round(
                    precision * 100,
                    2
                ),

                "%"

            )

            print(

                "Test Recall:",

                round(
                    recall * 100,
                    2
                ),

                "%"

            )

            print(

                "Test Weighted F1:",

                round(
                    weighted_f1 * 100,
                    2
                ),

                "%"

            )

            print(

                "Test Macro F1:",

                round(
                    macro_f1 * 100,
                    2
                ),

                "%"

            )

            print(

                "Test Balanced Accuracy:",

                round(
                    balanced_accuracy * 100,
                    2
                ),

                "%"

            )

            # ------------------------------------------------
            # Research-Oriented Best Model Selection
            #
            # PRIMARY:
            # CV Macro F1
            #
            # SECONDARY:
            # CV Balanced Accuracy
            #
            # Accuracy is NOT used as the primary criterion
            # because the dataset is highly imbalanced.
            # ------------------------------------------------

            current_macro_f1 = model_cv.get(

                "f1_macro_mean"

            )

            current_balanced_accuracy = (
                model_cv.get(

                    "balanced_accuracy_mean"

                )
            )

            if (

                current_macro_f1 is not None

                and

                current_balanced_accuracy is not None

            ):

                # Combine macro F1 and balanced accuracy.
                #
                # Both receive equal importance.

                research_score = (

                    0.5 *
                    current_macro_f1

                    +

                    0.5 *
                    current_balanced_accuracy

                )

                print(

                    "Research Score:",

                    round(
                        research_score,
                        2
                    )

                )

                if research_score > best_model_score:

                    best_model_score = (
                        research_score
                    )

                    best_model_name = name

                    best_feature_importance = (
                        feature_importance
                    )

                    best_confusion_matrix = (
                        cm.tolist()
                    )

                    best_class_metrics = (
                        class_metrics
                    )

                    best_training_time = (
                        training_time
                    )

                    best_prediction_time = (
                        prediction_time
                    )

            print(
                name,
                "SUCCESS"
            )

        except Exception as e:

            print(
                "\n",
                name,
                "FAILED"
            )

            print(
                "Error:",
                e
            )

    # ========================================================
    # FALLBACK BEST MODEL
    # ========================================================

    if best_model_name == "":

        successful_models = [

            name

            for name
            in results.keys()

        ]

        if len(successful_models) == 0:

            raise RuntimeError(

                "All model training "
                "attempts failed."

            )

        # Fallback based on macro F1

        best_model_name = max(

            successful_models,

            key=lambda name:

                results[name][
                    "macro_f1"
                ]

        )

        best_feature_importance = (

            all_feature_importance.get(

                best_model_name,

                []

            )

        )

        best_confusion_matrix = (

            results[
                best_model_name
            ][
                "confusion_matrix"
            ]

        )

        best_class_metrics = (

            results[
                best_model_name
            ][
                "class_metrics"
            ]

        )

        best_training_time = (

            results[
                best_model_name
            ][
                "training_time"
            ]

        )

        best_prediction_time = (

            results[
                best_model_name
            ][
                "prediction_time"
            ]

        )

    # ========================================================
    # BEST MODEL INFORMATION
    # ========================================================

    best_model_cv = cv_results.get(

        best_model_name,

        {}

    )

    best_model_cv_accuracy = (

        best_model_cv.get(
            "accuracy_mean"
        )

    )

    best_model_cv_macro_f1 = (

        best_model_cv.get(
            "f1_macro_mean"
        )

    )

    best_model_cv_balanced_accuracy = (

        best_model_cv.get(
            "balanced_accuracy_mean"
        )

    )

    # ========================================================
    # SAVE BEST MODEL NAME
    # ========================================================

    best_model_file = os.path.join(

        model_folder,

        "best_model.txt"

    )

    with open(

        best_model_file,

        "w"

    ) as file:

        file.write(
            best_model_name
        )

    print(
        "\n=========================================="
    )

    print(
        "BEST MODEL:",
        best_model_name
    )

    print(

        "CV Accuracy:",

        best_model_cv_accuracy,

        "%"

    )

    print(

        "CV Macro F1:",

        best_model_cv_macro_f1,

        "%"

    )

    print(

        "CV Balanced Accuracy:",

        best_model_cv_balanced_accuracy,

        "%"

    )

    print(
        "Research Score:",
        round(
            best_model_score,
            2
        )
    )

    # ========================================================
    # BEST MODEL CONFUSION MATRIX
    # ========================================================
    print("\n==========================================")
    print(f"BEST MODEL CONFUSION MATRIX - {best_model_name}")
    print("==========================================")

    best_header = "Actual \\ Predicted"
    for label in class_labels:
        best_header += f"{label:>18}"
    print(best_header)

    for i, actual_label in enumerate(class_labels):
        best_row = f"{actual_label:<18}"
        for j in range(len(class_labels)):
            best_row += f"{best_confusion_matrix[i][j]:>18}"
        print(best_row)

    print("==========================================")

    print(
        "=========================================="
    )

    # ========================================================
    # TRAIN / TEST CLASS DISTRIBUTION
    # ========================================================

    train_class_counts = (

        y_train_raw.value_counts()

    )

    test_class_counts = (

        y_test_raw.value_counts()

    )

    train_class_distribution = {}

    test_class_distribution = {}

    for original_label in (

        label_encoder.classes_

    ):

        label_key = str(
            original_label
        )

        train_count = int(

            train_class_counts.get(

                original_label,

                0

            )

        )

        test_count = int(

            test_class_counts.get(

                original_label,

                0

            )

        )

        train_class_distribution[
            label_key
        ] = {

            "count":

                train_count,

            "percentage":

                round(

                    (

                        train_count /

                        len(
                            y_train_raw
                        )

                    ) * 100,

                    2

                )

        }

        test_class_distribution[
            label_key
        ] = {

            "count":

                test_count,

            "percentage":

                round(

                    (

                        test_count /

                        len(
                            y_test_raw
                        )

                    ) * 100,

                    2

                )

        }

    # ========================================================
    # FINAL RESPONSE
    # ========================================================

    return {

        "message":

            "Training Completed Successfully",

        "rows":

            int(
                len(df)
            ),

        "columns":

            int(
                len(df.columns)
            ),

        "features":

            feature_columns,

        "target":

            target_column,

        "selected_models":

            selected_models,

        # ----------------------------------------------------
        # Dataset information
        # ----------------------------------------------------

        "class_distribution":

            class_distribution,

        "imbalance_ratio":

            imbalance_ratio,

        "imbalance_status":

            imbalance_status,

        # ----------------------------------------------------
        # Split information
        # ----------------------------------------------------

        "train_class_distribution":

            train_class_distribution,

        "test_class_distribution":

            test_class_distribution,

        "train_rows":

            int(
                len(X_train)
            ),

        "test_rows":

            int(
                len(X_test)
            ),

        # ----------------------------------------------------
        # Best model
        # ----------------------------------------------------

        "best_model":

            best_model_name,

        "best_model_cv_accuracy":

            best_model_cv_accuracy,

        "best_model_cv_macro_f1":

            best_model_cv_macro_f1,

        "best_model_cv_balanced_accuracy":

            best_model_cv_balanced_accuracy,

        "best_model_research_score":

            round(
                best_model_score,
                2
            ),

        "best_model_training_time":

            round(
                best_training_time,
                4
            ),

        "best_model_prediction_time":

            round(
                best_prediction_time,
                4
            ),

        # ----------------------------------------------------
        # All model results
        # ----------------------------------------------------

        "results":

            results,

        "cv_results":

            cv_results,

        # ----------------------------------------------------
        # Feature importance
        # ----------------------------------------------------

        "feature_importance":

            best_feature_importance,

        "all_feature_importance":

            all_feature_importance,

        # ----------------------------------------------------
        # Best model evaluation
        # ----------------------------------------------------

        "confusion_matrix":

            best_confusion_matrix,

        "class_labels":

            class_labels,

        "class_metrics":

            best_class_metrics,

        # ----------------------------------------------------
        # All confusion matrices
        # ----------------------------------------------------

        "all_confusion_matrices": {

            name:

                result[
                    "confusion_matrix"
                ]

            for name, result
            in results.items()

        },

        # ----------------------------------------------------
        # All class metrics
        # ----------------------------------------------------

        "all_class_metrics": {

            name:

                result[
                    "class_metrics"
                ]

            for name, result
            in results.items()

        },

        # ----------------------------------------------------
        # Training configuration
        # ----------------------------------------------------

        "training_configuration": {

            "selected_models":
                selected_models,

            "test_size":
                test_size,

            "train_size":
                round(
                    1 - test_size,
                    4
                ),

            "random_state":
                random_state,

            "cv_folds":
                cv_folds

        },

        # ----------------------------------------------------
        # Preprocessing information
        # ----------------------------------------------------

        "preprocessing": {

            "scaler":

                "StandardScaler",

            "scaler_fitted_on":

                "Training data only",

            "label_encoder":

                "LabelEncoder",

            "label_mapping": {

                str(label):

                    int(index)

                for index, label

                in enumerate(

                    label_encoder.classes_

                )

            }

        }

    }


# ============================================================
# MODULE END
# ============================================================

print(
    "train_model.py loaded successfully"
)