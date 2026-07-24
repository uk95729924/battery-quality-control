import { useState } from "react";

function ModelSelection() {
  const [models, setModels] = useState({
    xgboost: true,
    lightgbm: true,
    randomforest: true,
    catboost: true,
  });

  const handleChange = (e) => {
    setModels({
      ...models,
      [e.target.name]: e.target.checked,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-5">
        Model Selection
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <label className="border rounded-xl p-4">
          <input
            type="checkbox"
            name="xgboost"
            checked={models.xgboost}
            onChange={handleChange}
            className="mr-2"
          />
          XGBoost
        </label>

        <label className="border rounded-xl p-4">
          <input
            type="checkbox"
            name="lightgbm"
            checked={models.lightgbm}
            onChange={handleChange}
            className="mr-2"
          />
          LightGBM
        </label>

        <label className="border rounded-xl p-4">
          <input
            type="checkbox"
            name="randomforest"
            checked={models.randomforest}
            onChange={handleChange}
            className="mr-2"
          />
          Random Forest
        </label>

        <label className="border rounded-xl p-4">
          <input
            type="checkbox"
            name="SVM"
            checked={models.catboost}
            onChange={handleChange}
            className="mr-2"
          />
          SVM
        </label>

      </div>

    </div>
  );
}

export default ModelSelection;