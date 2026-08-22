import os
import joblib
import pandas as pd

from sklearn.preprocessing import LabelEncoder


# ============================================================
# PREPROCESS DATASET
# ============================================================

def preprocess_dataset(file_path):

    # ========================================================
    # LOAD DATASET
    # ========================================================

    if not os.path.exists(file_path):

        raise FileNotFoundError(
            f"Dataset not found: {file_path}"
        )

    # --------------------------------------------------------
    # Support CSV and XLSX
    # --------------------------------------------------------

    if file_path.lower().endswith(".csv"):

        df = pd.read_csv(file_path)

    elif file_path.lower().endswith(".xlsx"):

        df = pd.read_excel(file_path)

    else:

        raise ValueError(
            "Only CSV and XLSX files are supported."
        )

    print(
        "\n========== DATASET CHECK =========="
    )

    print(
        "File:",
        file_path
    )

    print(
        "Shape:",
        df.shape
    )

    print(
        "Rows:",
        len(df)
    )

    print(
        "Columns:",
        len(df.columns)
    )

    # ========================================================
    # REMOVE UNNAMED INDEX COLUMN
    # ========================================================

    unnamed_columns = [

        column

        for column in df.columns

        if str(column).startswith(
            "Unnamed:"
        )

    ]

    if unnamed_columns:

        print(
            "\nRemoving index columns:",
            unnamed_columns
        )

        df = df.drop(
            columns=unnamed_columns
        )

    # ========================================================
    # BASIC INFORMATION
    # ========================================================

    total_rows = len(df)

    total_columns = len(df.columns)

    # ========================================================
    # MISSING VALUES BEFORE
    # ========================================================

    missing_before = int(

        df.isnull()
        .sum()
        .sum()

    )

    print(
        "\nMissing values before:",
        missing_before
    )

    # ========================================================
    # DUPLICATES BEFORE
    # ========================================================

    duplicate_before = int(

        df.duplicated()
        .sum()

    )

    print(
        "Duplicate rows:",
        duplicate_before
    )

    # ========================================================
    # REMOVE DUPLICATES
    # ========================================================

    if duplicate_before > 0:

        df = df.drop_duplicates()

    # ========================================================
    # HANDLE MISSING VALUES
    # ========================================================

    missing_filled = 0

    for column in df.columns:

        missing_count = int(
            df[column].isnull().sum()
        )

        if missing_count == 0:

            continue

        # ----------------------------------------------------
        # Categorical column
        # ----------------------------------------------------

        if df[column].dtype == "object":

            mode_values = (
                df[column]
                .mode()
            )

            if len(mode_values) > 0:

                fill_value = mode_values.iloc[0]

            else:

                fill_value = "Unknown"

            df[column] = df[column].fillna(
                fill_value
            )

        # ----------------------------------------------------
        # Numerical column
        # ----------------------------------------------------

        else:

            fill_value = df[column].mean()

            df[column] = df[column].fillna(
                fill_value
            )

        missing_filled += missing_count

    # ========================================================
    # MISSING VALUES AFTER
    # ========================================================

    missing_after = int(

        df.isnull()
        .sum()
        .sum()

    )

    print(
        "Missing values after:",
        missing_after
    )

    print(
        "Missing values handled:",
        missing_filled
    )

    # ========================================================
    # DETECT TARGET COLUMN
    # ========================================================

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

    for column in possible_targets:

        if column in df.columns:

            target_column = column

            break

    # --------------------------------------------------------
    # Fallback: Last column
    # --------------------------------------------------------

    if target_column is None:

        target_column = df.columns[-1]

    print(
        "\nTarget Column:",
        target_column
    )

    # ========================================================
    # LABEL ENCODING
    # ========================================================

    encoders = {}

    encoded_columns = 0

    object_columns = (

        df.select_dtypes(
            include=["object"]
        )
        .columns
        .tolist()

    )

    print(
        "\nCategorical Columns:"
    )

    print(
        object_columns
    )

    for column in object_columns:

        encoder = LabelEncoder()

        df[column] = encoder.fit_transform(

            df[column].astype(str)

        )

        encoders[column] = encoder

        encoded_columns += 1

        print(
            f"{column}:"
        )

        for index, label in enumerate(
            encoder.classes_
        ):

            print(
                f"    {index} -> {label}"
            )

    # ========================================================
    # IMPORTANT
    #
    # NO FEATURE SCALING HERE
    #
    # Scaling is intentionally performed in
    # train_model.py AFTER train/test split.
    #
    # This prevents data leakage.
    # ========================================================

    print(
        "\n========== FEATURE SCALING =========="
    )

    print(
        "Scaling skipped during preprocessing."
    )

    print(
        "StandardScaler will be fitted only "
        "on training data inside train_model.py."
    )

    scaled_columns = 0

    # ========================================================
    # SAVE LABEL ENCODERS
    # ========================================================

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

    encoder_path = os.path.join(

        model_folder,

        "label_encoders.pkl"

    )

    joblib.dump(

        encoders,

        encoder_path

    )

    print(
        "\nLabel Encoders Saved:"
    )

    print(
        encoder_path
    )

    # ========================================================
    # TARGET ENCODER INFORMATION
    # ========================================================

    target_mapping = {}

    if target_column in encoders:

        target_encoder = encoders[
            target_column
        ]

        for index, label in enumerate(

            target_encoder.classes_

        ):

            target_mapping[
                str(index)
            ] = str(label)

    # ========================================================
    # FINAL DATA CHECK
    # ========================================================

    print(
        "\n========== FINAL DATASET CHECK =========="
    )

    print(
        "Final Shape:",
        df.shape
    )

    print(
        "Target:",
        target_column
    )

    print(
        "Remaining Missing:",
        int(
            df.isnull()
            .sum()
            .sum()
        )
    )

    print(
        "=========================================\n"
    )

    # ========================================================
    # SUMMARY
    # ========================================================

    summary = {

        "rows":

            total_rows,

        "columns":

            total_columns,

        "final_rows":

            int(
                len(df)
            ),

        "final_columns":

            int(
                len(df.columns)
            ),

        "missing_removed":

            int(
                missing_filled
            ),

        "duplicate_removed":

            int(
                duplicate_before
            ),

        "encoded_columns":

            int(
                encoded_columns
            ),

        "scaled_columns":

            int(
                scaled_columns
            ),

        "target_column":

            target_column,

        "target_mapping":

            target_mapping

    }

    return df, summary


# ============================================================
# MODULE LOADED
# ============================================================

print(
    "preprocess.py loaded successfully"
)