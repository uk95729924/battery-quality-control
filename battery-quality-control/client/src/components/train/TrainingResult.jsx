import MetricsCard from "./MetricsCard";

function TrainingResult({ result }) {
  if (!result) return null;

  // --------------------------------------------------
  // Helper: safely read values from different API formats
  // --------------------------------------------------
  const getValue = (...values) => {
    for (const value of values) {
      if (
        value !== undefined &&
        value !== null &&
        value !== ""
      ) {
        return value;
      }
    }

    return 0;
  };

  // --------------------------------------------------
  // Test Metrics
  // --------------------------------------------------
  const accuracy = getValue(
    result.accuracy,
    result.test_accuracy,
    result.testAccuracy,
    result.metrics?.accuracy,
    result.metrics?.test_accuracy
  );

  const precision = getValue(
    result.precision,
    result.test_precision,
    result.testPrecision,
    result.metrics?.precision,
    result.metrics?.test_precision
  );

  const recall = getValue(
    result.recall,
    result.test_recall,
    result.testRecall,
    result.metrics?.recall,
    result.metrics?.test_recall
  );

  const f1 = getValue(
    result.f1,
    result.test_f1,
    result.testF1,
    result.metrics?.f1,
    result.metrics?.test_f1,
    result.weighted_f1,
    result.test_weighted_f1
  );

  // --------------------------------------------------
  // Additional Research Metrics
  // --------------------------------------------------
  const macroF1 = getValue(
    result.macro_f1,
    result.macroF1,
    result.test_macro_f1,
    result.testMacroF1,
    result.metrics?.macro_f1
  );

  const balancedAccuracy = getValue(
    result.balanced_accuracy,
    result.balancedAccuracy,
    result.test_balanced_accuracy,
    result.testBalancedAccuracy,
    result.metrics?.balanced_accuracy
  );

  // --------------------------------------------------
  // IMPORTANT:
  // Backend prints CV Accuracy = 98.93%
  // Support multiple possible response structures.
  // --------------------------------------------------
  const crossValidation = getValue(
    result.cv_accuracy,
    result.cvAccuracy,
    result.cross_validation,
    result.crossValidation,
    result.cross_validation_accuracy,
    result.crossValidationAccuracy,
    result.metrics?.cv_accuracy,
    result.metrics?.cvAccuracy,
    result.validation?.accuracy,
    result.cv?.accuracy,
    result.best_model?.cv_accuracy,
    result.bestModel?.cv_accuracy
  );

  // --------------------------------------------------
  // Best Model
  // --------------------------------------------------
  const bestModel = getValue(
    result.bestModel,
    result.best_model,
    result.model,
    result.algorithm
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg mt-8 p-8">

      {/* ==================================================
          TITLE
      ================================================== */}
      <h2 className="text-2xl font-bold mb-6">
        Training Results
      </h2>

      {/* ==================================================
          MAIN TEST METRICS
      ================================================== */}
      <div className="grid md:grid-cols-4 gap-5">

        <MetricsCard
          title="Accuracy"
          value={`${Number(accuracy).toFixed(2)}%`}
          color="bg-blue-100"
        />

        <MetricsCard
          title="Precision"
          value={`${Number(precision).toFixed(2)}%`}
          color="bg-green-100"
        />

        <MetricsCard
          title="Recall"
          value={`${Number(recall).toFixed(2)}%`}
          color="bg-yellow-100"
        />

        <MetricsCard
          title="F1 Score"
          value={`${Number(f1).toFixed(2)}%`}
          color="bg-purple-100"
        />

      </div>

      {/* ==================================================
          ADDITIONAL RESEARCH METRICS
      ================================================== */}
      <div className="grid md:grid-cols-4 gap-5 mt-5">

        <MetricsCard
          title="Macro F1"
          value={`${Number(macroF1).toFixed(2)}%`}
          color="bg-indigo-100"
        />

        <MetricsCard
          title="Balanced Accuracy"
          value={`${Number(balancedAccuracy).toFixed(2)}%`}
          color="bg-cyan-100"
        />

        <MetricsCard
          title="Best Model"
          value={bestModel}
          color="bg-red-100"
        />

        <MetricsCard
          title="Cross Validation"
          value={`${Number(crossValidation).toFixed(2)}%`}
          color="bg-orange-100"
        />

      </div>

    </div>
  );
}

export default TrainingResult;