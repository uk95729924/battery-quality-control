import { useState } from "react";
import axios from "axios";

import MainLayout from "../layouts/MainLayout";

import ModelSelection from "../components/train/ModelSelection";
import TrainingConfig from "../components/train/TrainingConfig";
import ProgressBar from "../components/train/ProgressBar";
import TrainingResult from "../components/train/TrainingResult";
import FeatureImportance from "../components/train/FeatureImportance";
import ModelSummary from "../components/train/ModelSummary";

function TrainModel() {

  // =====================================================
  // TRAINING STATE
  // =====================================================

  const [progress, setProgress] = useState(0);

  const [training, setTraining] = useState(false);

  const [trainingResult, setTrainingResult] =
    useState(null);


  // =====================================================
  // SELECTED MODELS
  // =====================================================

  const [selectedModels, setSelectedModels] = useState({
    xgboost: true,
    lightgbm: true,
    randomforest: true,
    svm: true,
  });


  // =====================================================
  // TRAINING CONFIGURATION
  // =====================================================

  const [trainingConfig, setTrainingConfig] = useState({
    testSize: 0.20,
    randomState: 42,
    cvFolds: 5,
  });


  // =====================================================
  // HANDLE MODEL SELECTION
  // =====================================================

  const handleModelSelection = (models) => {

    setSelectedModels(models);

    console.log(
      "Selected Models:",
      models
    );

  };


  // =====================================================
  // HANDLE TRAINING CONFIGURATION
  // =====================================================

  const handleTrainingConfig = (config) => {

    setTrainingConfig(config);

    console.log(
      "Training Configuration:",
      config
    );

  };


  // =====================================================
  // GET SELECTED MODEL NAMES
  // =====================================================

  const getSelectedModelNames = () => {

    const models = [];

    if (selectedModels.xgboost) {
      models.push("XGBoost");
    }

    if (selectedModels.lightgbm) {
      models.push("LightGBM");
    }

    if (selectedModels.randomforest) {
      models.push("Random Forest");
    }

    if (selectedModels.svm) {
      models.push("SVM");
    }

    return models;

  };


  // =====================================================
  // SAFE VALUE HELPER
  // =====================================================

  const getFirstValue = (...values) => {

    for (const value of values) {

      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        return value;
      }

    }

    return null;

  };


  // =====================================================
  // NORMALIZE PERCENTAGE
  // =====================================================

  const normalizePercentage = (value) => {

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return 0;
    }

    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return 0;
    }

    // Backend may return decimal:
    // 0.9893 -> 98.93
    if (
      numericValue >= 0 &&
      numericValue <= 1
    ) {
      return numericValue * 100;
    }

    return numericValue;

  };


  // =====================================================
  // RECURSIVE CV VALUE FINDER
  // =====================================================

  const findNestedCVValue = (
    object,
    possibleKeys
  ) => {

    if (
      object === null ||
      object === undefined
    ) {
      return null;
    }

    if (
      typeof object !== "object"
    ) {
      return null;
    }

    // ---------------------------------------------------
    // Direct keys
    // ---------------------------------------------------

    for (const key of possibleKeys) {

      if (
        Object.prototype.hasOwnProperty.call(
          object,
          key
        )
      ) {

        const value = object[key];

        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          return value;
        }

      }

    }


    // ---------------------------------------------------
    // Search nested objects / arrays
    // ---------------------------------------------------

    for (const key of Object.keys(object)) {

      const value = object[key];

      if (
        value &&
        typeof value === "object"
      ) {

        const found =
          findNestedCVValue(
            value,
            possibleKeys
          );

        if (
          found !== null &&
          found !== undefined
        ) {
          return found;
        }

      }

    }

    return null;

  };


  // =====================================================
  // GET CROSS VALIDATION DATA
  // =====================================================

  const getCrossValidationData = (
    responseData,
    bestModel,
    bestResult,
    cvResults
  ) => {

    console.log(
      "=========================================="
    );

    console.log(
      "          CROSS VALIDATION DEBUG"
    );

    console.log(
      "=========================================="
    );

    console.log(
      "Best Model:",
      bestModel
    );

    console.log(
      "Best Result:",
      bestResult
    );

    console.log(
      "CV Results:",
      cvResults
    );

    console.log(
      "Complete Backend Response:",
      responseData
    );


    // =================================================
    // MODEL CV OBJECT
    // =================================================

    let modelCV = {};

    if (
      cvResults &&
      typeof cvResults === "object"
    ) {

      const possibleModelNames = [
        bestModel,
        bestModel?.toLowerCase(),
        bestModel?.replace(/\s+/g, "_"),
        bestModel?.toLowerCase()?.replace(/\s+/g, "_"),
        bestModel?.replace(/\s+/g, "-"),
        bestModel?.toLowerCase()?.replace(/\s+/g, "-"),
      ];

      for (
        const modelName
        of possibleModelNames
      ) {

        if (
          modelName &&
          cvResults[modelName]
        ) {

          modelCV =
            cvResults[modelName];

          break;

        }

      }

    }


    console.log(
      "Best Model CV Object:",
      modelCV
    );


    // =================================================
    // CV ACCURACY
    // =================================================

    const cvAccuracyRaw =
      getFirstValue(

        // ---------------------------------------------
        // Best model result
        // ---------------------------------------------

        bestResult?.cv_accuracy,

        bestResult?.cvAccuracy,

        bestResult?.cross_validation_accuracy,

        bestResult?.crossValidationAccuracy,

        bestResult?.mean_cv_accuracy,

        bestResult?.meanCVAccuracy,

        bestResult?.cv_accuracy_mean,

        bestResult?.cvAccuracyMean,


        // ---------------------------------------------
        // Model CV object
        // ---------------------------------------------

        modelCV?.cv_accuracy,

        modelCV?.cvAccuracy,

        modelCV?.cross_validation_accuracy,

        modelCV?.crossValidationAccuracy,

        modelCV?.mean_cv_accuracy,

        modelCV?.meanCVAccuracy,

        modelCV?.cv_accuracy_mean,

        modelCV?.cvAccuracyMean,

        modelCV?.accuracy,


        // ---------------------------------------------
        // Root backend
        // ---------------------------------------------

        responseData?.cv_accuracy,

        responseData?.cvAccuracy,

        responseData?.cross_validation_accuracy,

        responseData?.crossValidationAccuracy,

        responseData?.mean_cv_accuracy,

        responseData?.meanCVAccuracy,

        responseData?.cv_accuracy_mean,

        responseData?.cvAccuracyMean,


        // ---------------------------------------------
        // Metrics
        // ---------------------------------------------

        responseData?.metrics?.cv_accuracy,

        responseData?.metrics?.cvAccuracy,

        responseData?.metrics?.cross_validation_accuracy,

        responseData?.metrics?.crossValidationAccuracy,


        // ---------------------------------------------
        // Validation
        // ---------------------------------------------

        responseData?.validation?.cv_accuracy,

        responseData?.validation?.cvAccuracy,

        responseData?.validation?.accuracy,


        // ---------------------------------------------
        // CV object
        // ---------------------------------------------

        responseData?.cv?.accuracy,

        responseData?.cv?.cv_accuracy,

        responseData?.cv?.cvAccuracy,

        responseData?.cv?.mean_accuracy,

        responseData?.cv?.meanAccuracy

      );


    // =================================================
    // CV MACRO F1
    // =================================================

    const cvMacroF1Raw =
      getFirstValue(

        // Best result
        bestResult?.cv_macro_f1,

        bestResult?.cvMacroF1,

        bestResult?.mean_cv_macro_f1,

        bestResult?.meanCVMacroF1,

        bestResult?.cv_macro_f1_mean,


        // Model CV
        modelCV?.cv_macro_f1,

        modelCV?.cvMacroF1,

        modelCV?.macro_f1,

        modelCV?.macroF1,

        modelCV?.mean_cv_macro_f1,

        modelCV?.meanCVMacroF1,


        // Root
        responseData?.cv_macro_f1,

        responseData?.cvMacroF1,

        responseData?.mean_cv_macro_f1,

        responseData?.meanCVMacroF1,


        // Metrics
        responseData?.metrics?.cv_macro_f1,

        responseData?.metrics?.cvMacroF1,

        responseData?.metrics?.macro_f1,

        responseData?.metrics?.macroF1,


        // CV object
        responseData?.cv?.macro_f1,

        responseData?.cv?.macroF1,

        responseData?.cv?.cv_macro_f1,

        responseData?.cv?.cvMacroF1

      );


    // =================================================
    // CV BALANCED ACCURACY
    // =================================================

    const cvBalancedAccuracyRaw =
      getFirstValue(

        // Best result
        bestResult?.cv_balanced_accuracy,

        bestResult?.cvBalancedAccuracy,

        bestResult?.mean_cv_balanced_accuracy,

        bestResult?.meanCVBalancedAccuracy,


        // Model CV
        modelCV?.cv_balanced_accuracy,

        modelCV?.cvBalancedAccuracy,

        modelCV?.balanced_accuracy,

        modelCV?.balancedAccuracy,

        modelCV?.mean_cv_balanced_accuracy,

        modelCV?.meanCVBalancedAccuracy,


        // Root
        responseData?.cv_balanced_accuracy,

        responseData?.cvBalancedAccuracy,

        responseData?.mean_cv_balanced_accuracy,

        responseData?.meanCVBalancedAccuracy,


        // Metrics
        responseData?.metrics?.cv_balanced_accuracy,

        responseData?.metrics?.cvBalancedAccuracy,

        responseData?.metrics?.balanced_accuracy,

        responseData?.metrics?.balancedAccuracy,


        // CV object
        responseData?.cv?.balanced_accuracy,

        responseData?.cv?.balancedAccuracy,

        responseData?.cv?.cv_balanced_accuracy,

        responseData?.cv?.cvBalancedAccuracy

      );


    // =================================================
    // RECURSIVE FALLBACK
    // =================================================

    let finalCvAccuracy =
      cvAccuracyRaw;

    let finalCvMacroF1 =
      cvMacroF1Raw;

    let finalCvBalancedAccuracy =
      cvBalancedAccuracyRaw;


    // -------------------------------------------------
    // Recursive CV Accuracy fallback
    // -------------------------------------------------

    if (
      finalCvAccuracy === null ||
      finalCvAccuracy === undefined
    ) {

      finalCvAccuracy =
        findNestedCVValue(
          cvResults,
          [
            "cv_accuracy",
            "cvAccuracy",
            "cross_validation_accuracy",
            "crossValidationAccuracy",
            "mean_cv_accuracy",
            "meanCVAccuracy",
            "cv_accuracy_mean",
            "cvAccuracyMean",
          ]
        );

    }


    // -------------------------------------------------
    // Recursive Macro F1 fallback
    // -------------------------------------------------

    if (
      finalCvMacroF1 === null ||
      finalCvMacroF1 === undefined
    ) {

      finalCvMacroF1 =
        findNestedCVValue(
          cvResults,
          [
            "cv_macro_f1",
            "cvMacroF1",
            "mean_cv_macro_f1",
            "meanCVMacroF1",
            "cv_macro_f1_mean",
          ]
        );

    }


    // -------------------------------------------------
    // Recursive Balanced Accuracy fallback
    // -------------------------------------------------

    if (
      finalCvBalancedAccuracy === null ||
      finalCvBalancedAccuracy === undefined
    ) {

      finalCvBalancedAccuracy =
        findNestedCVValue(
          cvResults,
          [
            "cv_balanced_accuracy",
            "cvBalancedAccuracy",
            "mean_cv_balanced_accuracy",
            "meanCVBalancedAccuracy",
            "cv_balanced_accuracy_mean",
          ]
        );

    }


    // =================================================
    // FINAL NORMALIZED VALUES
    // =================================================

    const result = {

      cvAccuracy:
        normalizePercentage(
          finalCvAccuracy
        ),

      cvMacroF1:
        normalizePercentage(
          finalCvMacroF1
        ),

      cvBalancedAccuracy:
        normalizePercentage(
          finalCvBalancedAccuracy
        ),

    };


    // =================================================
    // FINAL DEBUG
    // =================================================

    console.log(
      "------------------------------------------"
    );

    console.log(
      "RAW CV ACCURACY:",
      finalCvAccuracy
    );

    console.log(
      "RAW CV MACRO F1:",
      finalCvMacroF1
    );

    console.log(
      "RAW CV BALANCED ACCURACY:",
      finalCvBalancedAccuracy
    );

    console.log(
      "------------------------------------------"
    );

    console.log(
      "FINAL CV ACCURACY:",
      result.cvAccuracy
    );

    console.log(
      "FINAL CV MACRO F1:",
      result.cvMacroF1
    );

    console.log(
      "FINAL CV BALANCED ACCURACY:",
      result.cvBalancedAccuracy
    );

    console.log(
      "=========================================="
    );


    return result;

  };


  // =====================================================
  // TRAIN MODELS
  // =====================================================

  const handleTraining = async () => {

    const selectedModelNames =
      getSelectedModelNames();


    // ---------------------------------------------------
    // No model selected
    // ---------------------------------------------------

    if (
      selectedModelNames.length === 0
    ) {

      alert(
        "Please select at least one machine learning model."
      );

      return;

    }


    // ---------------------------------------------------
    // Start Training
    // ---------------------------------------------------

    setTraining(true);

    setProgress(10);

    setTrainingResult(null);


    try {

      // -------------------------------------------------
      // Training started
      // -------------------------------------------------

      setProgress(20);


      console.log(
        "\n================================="
      );

      console.log(
        "STARTING MODEL TRAINING"
      );

      console.log(
        "Selected Models:",
        selectedModelNames
      );

      console.log(
        "Test Size:",
        trainingConfig.testSize
      );

      console.log(
        "Random State:",
        trainingConfig.randomState
      );

      console.log(
        "CV Folds:",
        trainingConfig.cvFolds
      );

      console.log(
        "=================================\n"
      );


      // -------------------------------------------------
      // API REQUEST
      // -------------------------------------------------

      const response = await axios.post(

        "http://127.0.0.1:5000/train",

        {

          selected_models:
            selectedModelNames,

          test_size:
            Number(
              trainingConfig.testSize
            ),

          random_state:
            Number(
              trainingConfig.randomState
            ),

          cv_folds:
            Number(
              trainingConfig.cvFolds
            ),

        }

      );


      // -------------------------------------------------
      // Training completed
      // -------------------------------------------------

      setProgress(80);


      console.log(
        "=========================================="
      );

      console.log(
        "FULL BACKEND TRAINING RESPONSE"
      );

      console.log(
        JSON.stringify(
          response.data,
          null,
          2
        )
      );

      console.log(
        "=========================================="
      );


      // -------------------------------------------------
      // Check response
      // -------------------------------------------------

      if (
        !response.data ||
        !response.data.best_model
      ) {

        throw new Error(
          "Invalid training response received from server."
        );

      }


      const bestModel =
        response.data.best_model;


      // -------------------------------------------------
      // Best model result
      // -------------------------------------------------

      const results =
        response.data.results || {};


      const bestResult =
        results[bestModel] ||
        results[
          bestModel?.toLowerCase()
        ] ||
        results[
          bestModel?.replace(
            /\s+/g,
            "_"
          )
        ];


      if (!bestResult) {

        throw new Error(
          `Performance result not found for best model: ${bestModel}`
        );

      }


      // -------------------------------------------------
      // Feature importance
      // -------------------------------------------------

      const featureImportance =
        response.data.feature_importance || [];


      // -------------------------------------------------
      // CV Results
      // -------------------------------------------------

      const cvResults =
        response.data.cv_results || {};


      // -------------------------------------------------
      // Confusion Matrix
      // -------------------------------------------------

      const confusionMatrix =
        response.data.confusion_matrix || [];


      // -------------------------------------------------
      // Confusion Matrix Labels
      // -------------------------------------------------

      const matrixLabels =
        response.data.matrix_labels ||
        response.data.confusion_matrix_labels ||
        [
          "Good",
          "Major Defect",
          "Minor Defect"
        ];


      // -------------------------------------------------
      // Best Hyperparameters
      // -------------------------------------------------

      const bestHyperparameters =
        response.data.best_hyperparameters ||
        bestResult.best_hyperparameters ||
        response.data.hyperparameters ||
        bestResult.hyperparameters ||
        {};


      // -------------------------------------------------
      // Class Metrics
      // -------------------------------------------------

      const classMetrics =
        response.data.class_metrics || {};


      console.log(
        "Confusion Matrix:",
        confusionMatrix
      );

      console.log(
        "Matrix Labels:",
        matrixLabels
      );

      console.log(
        "Best Hyperparameters:",
        bestHyperparameters
      );


      // =================================================
      // CROSS VALIDATION EXTRACTION
      // =================================================

      const cvData =
        getCrossValidationData(
          response.data,
          bestModel,
          bestResult,
          cvResults
        );


      // =================================================
      // RESEARCH SCORE
      // =================================================

      const researchScore =
        getFirstValue(

          bestResult?.research_score,

          bestResult?.cv_research_score,

          response.data?.research_score

        );


      // =================================================
      // BUILD FRONTEND RESULT
      // =================================================

      setTrainingResult({

        // ===============================================
        // BEST MODEL
        // ===============================================

        bestModel:
          bestModel,


        // ===============================================
        // BASIC PERFORMANCE
        // ===============================================

        accuracy:
          normalizePercentage(
            bestResult.accuracy ?? 0
          ),

        precision:
          normalizePercentage(
            bestResult.precision ?? 0
          ),

        recall:
          normalizePercentage(
            bestResult.recall ?? 0
          ),

        f1:
          normalizePercentage(
            bestResult.f1 ?? 0
          ),


        // ===============================================
        // RESEARCH METRICS
        // ===============================================

        macroF1:
          normalizePercentage(
            bestResult.macro_f1 ??
            bestResult.macroF1 ??
            0
          ),

        balancedAccuracy:
          normalizePercentage(
            bestResult.balanced_accuracy ??
            bestResult.balancedAccuracy ??
            0
          ),

        researchScore:
          researchScore,


        // ===============================================
        // CROSS VALIDATION
        // ===============================================

        cvAccuracy:
          cvData.cvAccuracy,

        cvMacroF1:
          cvData.cvMacroF1,

        cvBalancedAccuracy:
          cvData.cvBalancedAccuracy,


        // ===============================================
        // FEATURE IMPORTANCE
        // ===============================================

        featureImportance:
          featureImportance,


        // ===============================================
        // ALL MODEL RESULTS
        // ===============================================

        modelResults:
          results,


        // ===============================================
        // CV RESULTS
        // ===============================================

        cvResults:
          cvResults,


        // ===============================================
        // CONFUSION MATRIX
        // ===============================================

        confusionMatrix:
          confusionMatrix,

        matrixLabels:
          matrixLabels,


        // ===============================================
        // BEST HYPERPARAMETERS
        // ===============================================

        hyperparameters:
          bestHyperparameters,

        bestHyperparameters:
          bestHyperparameters,


        // ===============================================
        // CLASS METRICS
        // ===============================================

        classMetrics:
          classMetrics,


        // ===============================================
        // TRAINING CONFIGURATION
        // ===============================================

        trainingConfig: {

          testSize:
            trainingConfig.testSize,

          randomState:
            trainingConfig.randomState,

          cvFolds:
            trainingConfig.cvFolds,

        },


        // ===============================================
        // SELECTED MODELS
        // ===============================================

        selectedModels:
          selectedModelNames,


        // ===============================================
        // COMPLETE BACKEND RESPONSE
        // ===============================================

        backendResponse:
          response.data,

      });


      // -------------------------------------------------
      // Complete
      // -------------------------------------------------

      setProgress(100);


      alert(
        response.data.message ||
        `Training completed successfully. Best Model: ${bestModel}`
      );


    } catch (error) {

      console.error(
        "Training Error:",
        error
      );


      // -------------------------------------------------
      // Backend Error
      // -------------------------------------------------

      if (
        error.response &&
        error.response.data
      ) {

        alert(
          error.response.data.message ||
          "Training Failed"
        );

      }


      // -------------------------------------------------
      // Normal Error
      // -------------------------------------------------

      else {

        alert(
          error.message ||
          "Training Failed"
        );

      }


      setProgress(0);


    } finally {

      setTraining(false);

    }

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <MainLayout>


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <h1 className="
          text-4xl
          font-bold
          text-slate-800
        ">
          Train Machine Learning Models
        </h1>


        <p className="
          text-gray-500
          mt-2
        ">
          Train and compare Random Forest, SVM,
          XGBoost and LightGBM using the processed
          battery electrode dataset with cross-validation,
          hyperparameter tuning and evaluation.
        </p>

      </div>


      {/* =================================================
          MODEL SELECTION
      ================================================= */}

      <ModelSelection
        onChange={
          handleModelSelection
        }
      />


      {/* =================================================
          TRAINING CONFIGURATION
      ================================================= */}

      <TrainingConfig
        onChange={
          handleTrainingConfig
        }
      />


      {/* =================================================
          SELECTED CONFIGURATION PREVIEW
      ================================================= */}

      <div className="
        bg-blue-50
        border
        border-blue-200
        rounded-2xl
        p-5
        mt-8
      ">

        <h3 className="
          font-bold
          text-blue-900
          mb-3
        ">
          Current Training Configuration
        </h3>


        <div className="
          grid
          md:grid-cols-4
          gap-4
          text-sm
        ">


          {/* MODELS */}

          <div>

            <p className="
              text-gray-500
            ">
              Selected Models
            </p>

            <p className="
              font-semibold
              text-blue-700
              mt-1
            ">

              {
                getSelectedModelNames().length
              }

              {" "}Models

            </p>

          </div>


          {/* SPLIT */}

          <div>

            <p className="
              text-gray-500
            ">
              Train/Test Split
            </p>

            <p className="
              font-semibold
              text-blue-700
              mt-1
            ">

              {
                Math.round(
                  (1 -
                    trainingConfig.testSize) *
                    100
                )
              }

              /

              {
                Math.round(
                  trainingConfig.testSize *
                    100
                )
              }

            </p>

          </div>


          {/* RANDOM STATE */}

          <div>

            <p className="
              text-gray-500
            ">
              Random State
            </p>

            <p className="
              font-semibold
              text-blue-700
              mt-1
            ">

              {
                trainingConfig.randomState
              }

            </p>

          </div>


          {/* CV */}

          <div>

            <p className="
              text-gray-500
            ">
              Cross Validation
            </p>

            <p className="
              font-semibold
              text-blue-700
              mt-1
            ">

              {
                trainingConfig.cvFolds
              }

              -Fold

            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          TRAIN BUTTON
      ================================================= */}

      <div className="mt-8">

        <button

          onClick={
            handleTraining
          }

          disabled={
            training
          }

          className={`
            px-8
            py-3
            rounded-xl
            text-white
            font-semibold
            transition-all
            duration-300

            ${
              training
                ? `
                  bg-gray-500
                  cursor-not-allowed
                `
                : `
                  bg-blue-600
                  hover:bg-blue-700
                  hover:scale-105
                  shadow-lg
                `
            }
          `}

        >

          {
            training
              ? "Training Models..."
              : "Train Models"
          }

        </button>

      </div>


      {/* =================================================
          PROGRESS
      ================================================= */}

      <ProgressBar
        progress={
          progress
        }
      />


      {/* =================================================
          TRAINING RESULTS
      ================================================= */}

      {
        trainingResult && (

          <>

            {/* =============================================
                TRAINING RESULT
            ============================================== */}

            <TrainingResult
              result={
                trainingResult
              }
            />


            {/* =============================================
                FEATURE IMPORTANCE
            ============================================== */}

            <FeatureImportance
              features={
                trainingResult.featureImportance
              }
            />


            {/* =============================================
                MODEL SUMMARY
            ============================================== */}

            <ModelSummary
              result={
                trainingResult
              }
            />

          </>

        )
      }


    </MainLayout>

  );

}

export default TrainModel;