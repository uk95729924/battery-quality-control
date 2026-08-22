import React from "react";

function FeatureImportance({ features = [] }) {
  /*
   * Current Battery Electrode Dataset Features
   *
   * These are only feature names.
   * Importance values must come from the trained ML model.
   */
  const electrodeFeatures = [
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

  /*
   * Convert backend feature format into a common format.
   *
   * Supported backend formats:
   *
   * {
   *   name: "Electrode_Thickness",
   *   value: 0.25
   * }
   *
   * OR
   *
   * {
   *   feature: "Electrode_Thickness",
   *   importance: 0.25
   * }
   */

  const normalizeFeatures = () => {
    if (!Array.isArray(features) || features.length === 0) {
      return [];
    }

    return features
      .map((item) => {
        const name =
          item.name ||
          item.feature ||
          item.feature_name;

        const rawValue =
          item.value ??
          item.importance ??
          item.score;

        if (!name || rawValue === undefined) {
          return null;
        }

        let value = Number(rawValue);

        if (Number.isNaN(value)) {
          return null;
        }

        /*
         * If backend returns:
         * 0.85 → convert to 85
         *
         * If backend returns:
         * 85 → keep 85
         */
        if (value >= 0 && value <= 1) {
          value = value * 100;
        }

        return {
          name,
          value,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.value - a.value);
  };

  const normalizedFeatures = normalizeFeatures();

  /*
   * Check whether returned features belong to the
   * current battery electrode dataset.
   */
  const validFeatures = normalizedFeatures.filter((feature) =>
    electrodeFeatures.includes(feature.name)
  );

  /*
   * Convert technical feature name into readable name.
   */
  const formatFeatureName = (name) => {
    return name
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg mt-8 p-8 border border-gray-100">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-7">

        <div>

          <h2 className="text-2xl font-bold text-gray-900">
            Feature Importance
          </h2>

          <p className="text-gray-500 mt-1">
            Relative contribution of manufacturing parameters
            to the trained Machine Learning model.
          </p>

        </div>

        <div className="mt-4 md:mt-0 bg-blue-50 text-blue-700
          px-4 py-2 rounded-lg text-sm font-semibold">

          Model Analysis

        </div>

      </div>

      {/* =====================================================
          NO DATA
      ====================================================== */}

      {validFeatures.length === 0 ? (

        <div className="border border-dashed border-gray-300
          rounded-xl p-10 text-center">

          <div className="text-4xl mb-4">
            📊
          </div>

          <h3 className="text-lg font-semibold text-gray-700">
            Feature Importance Not Available
          </h3>

          <p className="text-gray-500 mt-2 max-w-xl mx-auto">

            Train a Machine Learning model using the current
            battery electrode dataset to generate feature
            importance values.

          </p>

        </div>

      ) : (

        /* ===================================================
           FEATURE IMPORTANCE LIST
        ==================================================== */

        <div className="space-y-6">

          {validFeatures.map((feature, index) => {

            const percentage = Math.min(
              Math.max(feature.value, 0),
              100
            );

            return (

              <div
                key={`${feature.name}-${index}`}
                className="group"
              >

                {/* FEATURE NAME + VALUE */}

                <div className="flex justify-between items-center mb-2">

                  <div className="flex items-center gap-3">

                    <span className="w-7 h-7 flex items-center
                      justify-center rounded-full bg-blue-50
                      text-blue-700 text-xs font-bold">

                      {index + 1}

                    </span>

                    <span className="font-semibold text-gray-700">

                      {formatFeatureName(feature.name)}

                    </span>

                  </div>

                  <span className="font-bold text-gray-900">

                    {percentage.toFixed(2)}%

                  </span>

                </div>

                {/* PROGRESS BAR */}

                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">

                  <div
                    className="bg-blue-600 h-4 rounded-full
                    transition-all duration-700 ease-out
                    group-hover:bg-blue-700"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />

                </div>

              </div>

            );
          })}

        </div>

      )}

      {/* =====================================================
          INFORMATION BOX
      ====================================================== */}

      <div className="mt-8 bg-gray-50 border border-gray-200
        rounded-xl p-5">

        <div className="flex gap-3">

          <div className="text-blue-600 text-xl">
            ℹ
          </div>

          <div>

            <h3 className="font-semibold text-gray-800">
              Interpretation
            </h3>

            <p className="text-sm text-gray-600 mt-1 leading-relaxed">

              Higher feature importance indicates a greater
              contribution of the corresponding manufacturing
              parameter to the trained model's prediction.
              The displayed values are obtained from the
              trained Machine Learning model and are not manually
              assigned.

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default FeatureImportance;