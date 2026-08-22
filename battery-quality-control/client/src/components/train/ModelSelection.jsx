import { useState } from "react";

function ModelSelection({ onChange }) {

  const [models, setModels] = useState({
    xgboost: true,
    lightgbm: true,
    randomforest: true,
    svm: true,
  });

  const handleChange = (e) => {

    const updatedModels = {
      ...models,
      [e.target.name]: e.target.checked,
    };

    setModels(updatedModels);

    // Parent component ko selected models bhejna
    if (onChange) {
      onChange(updatedModels);
    }
  };

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6">

      {/* ================================
          TITLE
      ================================= */}

      <h2 className="text-2xl font-bold mb-5">
        Model Selection
      </h2>


      {/* ================================
          MODEL GRID
      ================================= */}

      <div className="grid md:grid-cols-2 gap-4">


        {/* XGBOOST */}

        <label
          className={`border rounded-xl p-4 cursor-pointer
          transition-all flex items-center
          ${
            models.xgboost
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
        >

          <input
            type="checkbox"
            name="xgboost"
            checked={models.xgboost}
            onChange={handleChange}
            className="mr-3 w-4 h-4"
          />

          <div>
            <p className="font-semibold">
              XGBoost
            </p>

            <p className="text-sm text-gray-500">
              Gradient boosting classifier
            </p>
          </div>

        </label>


        {/* LIGHTGBM */}

        <label
          className={`border rounded-xl p-4 cursor-pointer
          transition-all flex items-center
          ${
            models.lightgbm
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
        >

          <input
            type="checkbox"
            name="lightgbm"
            checked={models.lightgbm}
            onChange={handleChange}
            className="mr-3 w-4 h-4"
          />

          <div>
            <p className="font-semibold">
              LightGBM
            </p>

            <p className="text-sm text-gray-500">
              Lightweight gradient boosting
            </p>
          </div>

        </label>


        {/* RANDOM FOREST */}

        <label
          className={`border rounded-xl p-4 cursor-pointer
          transition-all flex items-center
          ${
            models.randomforest
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
        >

          <input
            type="checkbox"
            name="randomforest"
            checked={models.randomforest}
            onChange={handleChange}
            className="mr-3 w-4 h-4"
          />

          <div>
            <p className="font-semibold">
              Random Forest
            </p>

            <p className="text-sm text-gray-500">
              Ensemble decision-tree classifier
            </p>
          </div>

        </label>


        {/* SVM */}

        <label
          className={`border rounded-xl p-4 cursor-pointer
          transition-all flex items-center
          ${
            models.svm
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300"
          }`}
        >

          <input
            type="checkbox"
            name="svm"
            checked={models.svm}
            onChange={handleChange}
            className="mr-3 w-4 h-4"
          />

          <div>
            <p className="font-semibold">
              SVM
            </p>

            <p className="text-sm text-gray-500">
              Support Vector Machine classifier
            </p>
          </div>

        </label>

      </div>


      {/* ================================
          SELECTED MODEL COUNT
      ================================= */}

      <div className="mt-5 text-sm text-gray-500">

        Selected Models:{" "}

        <span className="font-semibold text-blue-600">

          {Object.values(models).filter(Boolean).length}

        </span>

        {" "} / 4

      </div>

    </div>

  );
}

export default ModelSelection;