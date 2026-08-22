import { useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

function Diagnosis() {
  // =========================================================
  // FORM DATA
  // =========================================================

  const initialFormData = {
    Electrode_Thickness: "",
    Coating_Weight: "",
    Coating_Uniformity: "",
    Slurry_Viscosity: "",
    Drying_Temperature: "",
    Drying_Time: "",
    Calender_Pressure: "",
    Roller_Speed: "",
    Electrode_Density: "",
    Moisture_Content: "",
    Surface_Roughness: "",
    Adhesion_Strength: "",
    Ambient_Humidity: "",
    Ambient_Temperature: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SAMPLE DATA
  // =========================================================

  const loadSampleData = () => {
    setFormData({
      Electrode_Thickness: 92,
      Coating_Weight: 18,
      Coating_Uniformity: 98,
      Slurry_Viscosity: 1200,
      Drying_Temperature: 110,
      Drying_Time: 12,
      Calender_Pressure: 80,
      Roller_Speed: 45,
      Electrode_Density: 3.5,
      Moisture_Content: 0.8,
      Surface_Roughness: 1.2,
      Adhesion_Strength: 3.8,
      Ambient_Humidity: 50,
      Ambient_Temperature: 25,
    });

    setResult(null);
  };

  // =========================================================
  // CLEAR FORM
  // =========================================================

  const clearForm = () => {
    setFormData(initialFormData);
    setResult(null);
  };

  // =========================================================
  // FEATURE LIST
  // =========================================================

  const fields = [
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
    "Ambient_Temperature",
  ];

  // =========================================================
  // DATASET-DERIVED REFERENCE RANGES
  // =========================================================

  const recommendedRanges = {
    Electrode_Thickness: {
      min: 86.07,
      max: 99.31,
      unit: "",
    },

    Coating_Weight: {
      min: 14.32,
      max: 20.06,
      unit: "",
    },

    Coating_Uniformity: {
      min: 87.35,
      max: 99.56,
      unit: "%",
    },

    Slurry_Viscosity: {
      min: 935.17,
      max: 1474.56,
      unit: "",
    },

    Drying_Temperature: {
      min: 99.89,
      max: 119.93,
      unit: "°C",
    },

    Drying_Time: {
      min: 5.73,
      max: 19.49,
      unit: "min",
    },

    Calender_Pressure: {
      min: 44.07,
      max: 111.66,
      unit: "",
    },

    Roller_Speed: {
      min: 23.14,
      max: 76.0,
      unit: "",
    },

    Electrode_Density: {
      min: 2.87,
      max: 4.10,
      unit: "",
    },

    Moisture_Content: {
      min: 0.15,
      max: 1.66,
      unit: "%",
    },

    Surface_Roughness: {
      min: 0.40,
      max: 2.93,
      unit: "",
    },

    Adhesion_Strength: {
      min: 2.63,
      max: 4.92,
      unit: "",
    },

    Ambient_Humidity: {
      min: 32.40,
      max: 68.33,
      unit: "%",
    },

    Ambient_Temperature: {
      min: 19.05,
      max: 33.88,
      unit: "°C",
    },
  };

  // =========================================================
  // PARAMETER STATUS
  // =========================================================

  const getParameterStatus = (field) => {
    const value = Number(formData[field]);
    const range = recommendedRanges[field];

    if (formData[field] === "" || !range) {
      return {
        status: "Not Available",
        action: "Enter Value",
        color: "text-gray-500",
        bg: "bg-gray-100",
      };
    }

    if (value < range.min) {
      return {
        status: "Below Range",
        action: "Review Process",
        color: "text-orange-600",
        bg: "bg-orange-50",
      };
    }

    if (value > range.max) {
      return {
        status: "Above Range",
        action: "Review Process",
        color: "text-red-600",
        bg: "bg-red-50",
      };
    }

    return {
      status: "Within Range",
      action: "Maintain",
      color: "text-green-600",
      bg: "bg-green-50",
    };
  };

  // =========================================================
  // QUALITY COLOR
  // =========================================================

  const getQualityColor = (quality) => {
    const value = String(quality || "").toLowerCase();

    if (
      value.includes("good") ||
      value.includes("high quality")
    ) {
      return "text-green-600";
    }

    if (
      value.includes("minor") ||
      value.includes("medium")
    ) {
      return "text-yellow-600";
    }

    if (
      value.includes("major") ||
      value.includes("defective") ||
      value.includes("low quality")
    ) {
      return "text-red-600";
    }

    return "text-blue-600";
  };

  // =========================================================
  // RISK COLOR
  // =========================================================

  const getRiskColor = (risk) => {
    const value = String(risk || "").toLowerCase();

    if (value.includes("low")) {
      return "text-green-600";
    }

    if (value.includes("medium")) {
      return "text-yellow-600";
    }

    if (value.includes("high")) {
      return "text-red-600";
    }

    return "text-gray-800";
  };


  // =========================================================
  // SHAP CONTRIBUTION COLOR
  // =========================================================

  const getShapColor = (value) => {
    const impact = Number(value) || 0;

    if (impact > 0) {
      return {
        text: "text-green-600",
        bg: "bg-green-500",
        label: "Positive Impact",
      };
    }

    if (impact < 0) {
      return {
        text: "text-red-600",
        bg: "bg-red-500",
        label: "Negative Impact",
      };
    }

    return {
      text: "text-gray-500",
      bg: "bg-gray-400",
      label: "Neutral Impact",
    };
  };

  // =========================================================
  // SHAP DATA
  // =========================================================

  const shapFeatures = Array.isArray(result?.shap_explanation)
    ? result.shap_explanation
    : [];

  const topShapFeatures = (
    Array.isArray(result?.top_features)
      ? result.top_features
      : shapFeatures
  )
    .slice()
    .sort(
      (a, b) =>
        Math.abs(Number(b?.impact ?? b?.value ?? 0)) -
        Math.abs(Number(a?.impact ?? a?.value ?? 0))
    )
    .slice(0, 5);

  const maxShapImpact = Math.max(
    ...shapFeatures.map((item) =>
      Math.abs(Number(item?.impact ?? item?.value ?? 0))
    ),
    1
  );

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    for (const field of fields) {
      if (
        formData[field] === "" ||
        formData[field] === null ||
        formData[field] === undefined
      ) {
        alert(
          `Please enter ${field.replaceAll("_", " ")}`
        );

        return false;
      }

      if (!Number.isFinite(Number(formData[field]))) {
        alert(
          `${field.replaceAll("_", " ")} must be a valid number`
        );

        return false;
      }
    }

    return true;
  };

  // =========================================================
  // DIAGNOSIS API
  // =========================================================

  const handleDiagnosis = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Convert all input values to numbers
      const numericData = {};

      fields.forEach((field) => {
        numericData[field] = Number(formData[field]);
      });

      console.log("Diagnosis Input:", numericData);

      const response = await axios.post(
        "http://127.0.0.1:5000/diagnosis",
        numericData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Diagnosis Response:", response.data);

      setResult(response.data);
    } catch (error) {
      console.error("Diagnosis Error:", error);

      const message =
        error?.response?.data?.message ||
        "Diagnosis failed. Please check the Flask server.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CONFIDENCE VALUE
  // =========================================================

  const confidence = Math.min(
    Math.max(Number(result?.quality_score) || 0, 0),
    100
  );

  // =========================================================
  // UI
  // =========================================================

  return (
    <MainLayout>

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-gray-900">
          Electrode Quality Diagnosis
        </h1>

        <p className="text-gray-500 mt-2 text-base">
          Enter electrode manufacturing parameters to assess
          current electrode quality using Machine Learning.
        </p>

      </div>


      {/* =====================================================
          INPUT CARD
      ====================================================== */}

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-7">

          <div>

            <h2 className="text-2xl font-bold text-gray-900">
              Manufacturing Parameters
            </h2>

            <p className="text-gray-500 mt-1">
              Provide numerical process parameters for quality assessment.
            </p>

          </div>

          <div className="mt-4 md:mt-0 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
            ML Quality Analysis
          </div>

        </div>


        {/* =====================================================
            INPUT FIELDS
        ====================================================== */}

        <div className="grid md:grid-cols-2 gap-6">

          {fields.map((field) => (

            <div key={field}>

              <label className="block mb-2 font-semibold text-gray-700">
                {field.replaceAll("_", " ")}
              </label>

              <input
                type="number"
                step="any"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter ${field.replaceAll("_", " ")}`}
                className="w-full border border-gray-300 rounded-xl p-3.5
                focus:outline-none focus:ring-2 focus:ring-blue-500
                focus:border-blue-500 transition"
              />

            </div>

          ))}

        </div>


        {/* =====================================================
            BUTTONS
        ====================================================== */}

        <div className="mt-8 flex flex-wrap gap-4">

          <button
            onClick={loadSampleData}
            type="button"
            className="bg-green-600 hover:bg-green-700
            text-white px-8 py-3 rounded-xl
            font-semibold transition shadow-sm"
          >
            Load Sample Data
          </button>


          <button
            onClick={handleDiagnosis}
            type="button"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700
            disabled:bg-blue-400 disabled:cursor-not-allowed
            text-white px-8 py-3 rounded-xl
            font-semibold transition shadow-sm"
          >
            {loading ? "Analysing..." : "Predict Quality"}
          </button>


          <button
            onClick={clearForm}
            type="button"
            className="bg-gray-600 hover:bg-gray-700
            text-white px-8 py-3 rounded-xl
            font-semibold transition shadow-sm"
          >
            Clear
          </button>

        </div>

      </div>


      {/* =====================================================
          RESULTS
      ====================================================== */}

      {result && (

        <div className="mt-8 space-y-6">


          {/* =================================================
              QUALITY ASSESSMENT
          ================================================== */}

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">

            <div className="flex flex-col md:flex-row
              md:items-center md:justify-between mb-7">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Electrode Quality Assessment
                </h2>

                <p className="text-gray-500 mt-1">
                  Machine Learning-based assessment of current electrode quality.
                </p>

              </div>

              <div className="mt-4 md:mt-0 bg-blue-50
                text-blue-700 px-4 py-2 rounded-lg
                text-sm font-semibold">

                Diagnosis Result

              </div>

            </div>


            {/* =================================================
                RESULT CARDS
            ================================================== */}

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">


              {/* QUALITY */}

              <div className="border rounded-xl p-5 bg-gray-50">

                <p className="text-gray-500 text-sm mb-2">
                  Quality Status
                </p>

                <h3
                  className={`text-2xl font-bold ${getQualityColor(
                    result.quality
                  )}`}
                >
                  {result.quality || "Unknown"}
                </h3>

                {result.quality_label && (
                  <p className="text-sm text-gray-500 mt-2">
                    Class: {result.quality_label}
                  </p>
                )}

              </div>


              {/* CONFIDENCE */}

              <div className="border rounded-xl p-5 bg-gray-50">

                <p className="text-gray-500 text-sm mb-2">
                  Prediction Confidence
                </p>

                <h3 className="text-2xl font-bold text-gray-900">
                  {confidence.toFixed(2)}%
                </h3>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">

                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${confidence}%`,
                    }}
                  />

                </div>

              </div>


              {/* RISK */}

              <div className="border rounded-xl p-5 bg-gray-50">

                <p className="text-gray-500 text-sm mb-2">
                  Risk Level
                </p>

                <h3
                  className={`text-2xl font-bold ${getRiskColor(
                    result.risk
                  )}`}
                >
                  {result.risk || "Unknown Risk"}
                </h3>

              </div>


              {/* MODEL */}

              <div className="border rounded-xl p-5 bg-gray-50">

                <p className="text-gray-500 text-sm mb-2">
                  Model Used
                </p>

                <h3 className="text-xl font-bold text-gray-900">
                  {result.model || "Unknown"}
                </h3>

                <p className="text-xs text-gray-500 mt-2">
                  Machine Learning Classification
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              PREDICTION PROBABILITY
          ================================================== */}

          {result.probabilities && (

            <div className="bg-white rounded-2xl shadow-lg
              p-8 border border-gray-100">

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Prediction Probability
              </h2>

              <p className="text-gray-500 mb-6">
                Probability distribution across electrode quality classes.
              </p>


              <div className="space-y-5">

                {Object.entries(result.probabilities).map(
                  ([label, value]) => {

                    const probability = Math.min(
                      Math.max(Number(value) || 0, 0),
                      100
                    );

                    return (

                      <div key={label}>

                        <div className="flex justify-between mb-2">

                          <span className="font-semibold text-gray-700">
                            {label}
                          </span>

                          <span className="font-bold text-gray-900">
                            {probability.toFixed(2)}%
                          </span>

                        </div>


                        <div className="w-full bg-gray-200 rounded-full h-3">

                          <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${probability}%`,
                            }}
                          />

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            </div>

          )}



          {/* =================================================
              SHAP EXPLAINABILITY
          ================================================== */}

          {shapFeatures.length > 0 && (

            <div className="bg-white rounded-2xl shadow-lg
              p-8 border border-gray-100">

              <div className="flex flex-col md:flex-row
                md:items-center md:justify-between mb-7">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    SHAP Explainability
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Explainable AI analysis showing how manufacturing
                    parameters contributed to the diagnosis.
                  </p>

                </div>

                <div className="mt-4 md:mt-0 bg-purple-50
                  text-purple-700 px-4 py-2 rounded-lg
                  text-sm font-semibold">

                  Explainable AI

                </div>

              </div>


              {/* TOP SHAP FEATURES */}

              <div className="space-y-5">

                {topShapFeatures.map((feature, index) => {

                  const value = Number(
                    feature?.impact ?? feature?.value ?? 0
                  );

                  const absoluteValue = Math.abs(value);

                  const percentage =
                    (absoluteValue / maxShapImpact) * 100;

                  const shapColor = getShapColor(value);

                  return (

                    <div key={feature?.name || index}>

                      <div className="flex items-center
                        justify-between mb-2">

                        <div className="flex items-center gap-3">

                          <span className="flex items-center
                            justify-center w-7 h-7 rounded-full
                            bg-blue-50 text-blue-600
                            text-sm font-bold">

                            {index + 1}

                          </span>

                          <span className="font-semibold text-gray-800">

                            {String(feature?.name || "Unknown Feature")
                              .replaceAll("_", " ")}

                          </span>

                        </div>

                        <span
                          className={`font-bold ${shapColor.text}`}
                        >
                          {value > 0 ? "+" : ""}
                          {value.toFixed(3)}
                        </span>

                      </div>


                      <div className="w-full bg-gray-200
                        rounded-full h-3">

                        <div
                          className={`${shapColor.bg}
                            h-3 rounded-full
                            transition-all duration-700`}
                          style={{
                            width: `${Math.min(
                              percentage,
                              100
                            )}%`,
                          }}
                        />

                      </div>


                      <div className="flex justify-between
                        mt-1 text-xs">

                        <span className={shapColor.text}>
                          {shapColor.label}
                        </span>

                        <span className="text-gray-500">
                          SHAP Impact
                        </span>

                      </div>

                    </div>

                  );

                })}

              </div>


              {/* ALL FEATURES */}

              {shapFeatures.length > 5 && (

                <details className="mt-7">

                  <summary className="cursor-pointer
                    text-blue-600 font-semibold
                    hover:text-blue-700">

                    View all {shapFeatures.length} feature contributions

                  </summary>

                  <div className="mt-5 space-y-4">

                    {shapFeatures
                      .slice()
                      .sort(
                        (a, b) =>
                          Math.abs(
                            Number(b?.impact ?? b?.value ?? 0)
                          ) -
                          Math.abs(
                            Number(a?.impact ?? a?.value ?? 0)
                          )
                      )
                      .map((feature, index) => {

                        const value = Number(
                          feature?.impact ?? feature?.value ?? 0
                        );

                        const absoluteValue = Math.abs(value);

                        const percentage =
                          (absoluteValue / maxShapImpact) * 100;

                        const shapColor = getShapColor(value);

                        return (

                          <div
                            key={`all-${feature?.name || index}`}
                            className="border-b pb-4 last:border-b-0"
                          >

                            <div className="flex justify-between
                              items-center mb-2">

                              <span className="font-medium
                                text-gray-700">

                                {String(
                                  feature?.name || "Unknown Feature"
                                ).replaceAll("_", " ")}

                              </span>

                              <span
                                className={`font-semibold
                                  ${shapColor.text}`}
                              >
                                {value > 0 ? "+" : ""}
                                {value.toFixed(4)}
                              </span>

                            </div>

                            <div className="w-full bg-gray-200
                              rounded-full h-2">

                              <div
                                className={`${shapColor.bg}
                                  h-2 rounded-full`}
                                style={{
                                  width: `${Math.min(
                                    percentage,
                                    100
                                  )}%`,
                                }}
                              />

                            </div>

                          </div>

                        );

                      })}

                  </div>

                </details>

              )}


              {/* INTERPRETATION */}

              <div className="mt-7 bg-purple-50
                border-l-4 border-purple-500
                rounded-lg p-5">

                <h3 className="font-bold text-purple-900 mb-2">
                  How to Interpret
                </h3>

                <p className="text-sm text-purple-800 leading-relaxed">
                  Positive SHAP values indicate that the corresponding
                  manufacturing parameter contributed positively toward
                  the model's predicted class, while negative values
                  indicate an opposing contribution. A larger absolute
                  SHAP value indicates greater influence on the prediction.
                </p>

              </div>

            </div>

          )}


          {/* =================================================
              PARAMETER QUALITY ASSESSMENT
          ================================================== */}

          <div className="bg-white rounded-2xl shadow-lg
            p-8 border border-gray-100">

            <div className="flex flex-col md:flex-row
              md:items-center md:justify-between mb-6">

              <div>

                <h2 className="text-2xl font-bold text-gray-900">
                  Parameter Quality Assessment
                </h2>

                <p className="text-gray-500 mt-1">
                  Comparison of input manufacturing parameters
                  with dataset-derived reference ranges.
                </p>

              </div>

              <div className="mt-4 md:mt-0 bg-yellow-50
                text-yellow-700 px-4 py-2 rounded-lg
                text-sm font-semibold">

                Process Monitoring

              </div>

            </div>


            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>

                  <tr className="bg-slate-900 text-white">

                    <th className="text-left p-4">
                      Parameter
                    </th>

                    <th className="text-left p-4">
                      Current Value
                    </th>

                    <th className="text-left p-4">
                      Dataset Range
                    </th>

                    <th className="text-left p-4">
                      Status
                    </th>

                    <th className="text-left p-4">
                      Recommended Action
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {fields.map((field) => {

                    const range = recommendedRanges[field];

                    const assessment =
                      getParameterStatus(field);

                    const currentValue =
                      formData[field] !== ""
                        ? formData[field]
                        : "—";

                    const recommendedRange =
                      `${range.min} - ${range.max} ${range.unit}`;

                    return (

                      <tr
                        key={field}
                        className="border-b hover:bg-gray-50 transition"
                      >

                        <td className="p-4 font-semibold text-gray-700">
                          {field.replaceAll("_", " ")}
                        </td>

                        <td className="p-4 font-semibold text-gray-900">
                          {currentValue}
                        </td>

                        <td className="p-4 text-gray-600 font-medium">
                          {recommendedRange}
                        </td>

                        <td className="p-4">

                          <span
                            className={`inline-flex px-3 py-1
                            rounded-full text-sm font-semibold
                            ${assessment.color}
                            ${assessment.bg}`}
                          >
                            {assessment.status}
                          </span>

                        </td>

                        <td
                          className={`p-4 font-semibold
                          ${assessment.color}`}
                        >
                          {assessment.action}
                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>


            {/* INFORMATION NOTE */}

            <div className="mt-6 bg-blue-50
              border-l-4 border-blue-500 rounded-lg p-4">

              <p className="text-sm text-blue-800 leading-relaxed">

                <strong>Note:</strong> The displayed ranges are
                dataset-derived reference ranges for quality
                assessment. They should not be interpreted as
                universal manufacturing limits.

              </p>

            </div>

          </div>


          {/* =================================================
              QUALITY RECOMMENDATION
          ================================================== */}

          <div className="bg-white rounded-2xl shadow-lg
            p-8 border border-gray-100">

            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Quality Recommendation
            </h2>

            <div className="bg-blue-50 border-l-4 border-blue-600
              rounded-lg p-5">

              <p className="text-gray-800 leading-relaxed">
                {result.recommendation ||
                  "No recommendation available."}
              </p>

            </div>

          </div>


          {/* =================================================
              MODEL EXPLANATION
          ================================================== */}

          <div className="bg-white rounded-2xl shadow-lg
            p-8 border border-gray-100">

            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Model Explanation
            </h2>

            <div className="bg-gray-50 rounded-lg p-5">

              <p className="text-gray-700 leading-relaxed">
                {result.explanation ||
                  "No model explanation available."}
              </p>

            </div>

          </div>


        </div>

      )}

    </MainLayout>
  );
}

export default Diagnosis;