import os
import joblib
import pandas as pd

from sklearn.preprocessing import LabelEncoder, StandardScaler


def preprocess_dataset(file_path):

    # ==========================================
    # Load Dataset
    # ==========================================

    df = pd.read_csv(file_path)
    print("\n========== DATASET CHECK ==========")
    print("File :", file_path)
    print("Shape :", df.shape)
    print("Rows :", len(df))
    print("Columns :", len(df.columns))

    total_rows = len(df)
    total_columns = len(df.columns)

    # ==========================================
    # Missing Values Before
    # ==========================================

    missing_before = df.isnull().sum().sum()

    # ==========================================
    # Duplicate Rows Before
    # ==========================================

    duplicate_before = df.duplicated().sum()

    df = df.drop_duplicates()

    # ==========================================
    # Fill Missing Values
    # ==========================================

    for column in df.columns:

        if df[column].dtype == "object":

            df[column] = df[column].fillna(
                df[column].mode()[0]
            )

        else:

            df[column] = df[column].fillna(
                df[column].mean()
            )

    missing_after = df.isnull().sum().sum()

    # ==========================================
    # Detect Target Column
    # ==========================================

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

    print("Target Column :", target_column)

    # ==========================================
    # Label Encoding
    # ==========================================

    encoders = {}

    encoded_columns = 0

    for column in df.select_dtypes(include=["object"]).columns:

        encoder = LabelEncoder()

        df[column] = encoder.fit_transform(
            df[column]
        )

        encoders[column] = encoder

        encoded_columns += 1

    # ==========================================
    # Feature Scaling
    # (Target Column Excluded)
    # ==========================================

    scaler = StandardScaler()

    numerical_columns = df.select_dtypes(
        include=["int64", "float64"]
    ).columns.tolist()

    if target_column in numerical_columns:

        numerical_columns.remove(target_column)

    print("Scaling Columns :")

    print(numerical_columns)

    df[numerical_columns] = scaler.fit_transform(
        df[numerical_columns]
    )

    scaled_columns = len(numerical_columns)

    # ==========================================
    # Save Scaler & Encoders
    # ==========================================

    base_dir = os.path.dirname(
        os.path.dirname(__file__)
    )

    model_folder = os.path.join(
        base_dir,
        "models"
    )

    os.makedirs(
        model_folder,
        exist_ok=True
    )

    joblib.dump(

        scaler,

        os.path.join(

            model_folder,

            "scaler.pkl"

        )

    )

    joblib.dump(

        encoders,

        os.path.join(

            model_folder,

            "label_encoders.pkl"

        )

    )

    print("Scaler Saved")

    print("Label Encoders Saved")

    # ==========================================
    # Summary
    # ==========================================

    summary = {

        "rows": total_rows,

        "columns": total_columns,

        "missing_removed":
            int(missing_before - missing_after),

        "duplicate_removed":
            int(duplicate_before),

        "encoded_columns":
            encoded_columns,

        "scaled_columns":
            scaled_columns,

        "target_column":
            target_column

    }

    return df, summary


print("preprocess.py loaded")