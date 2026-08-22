import { useState } from "react";

function TrainingConfig({ onChange }) {

  const [config, setConfig] = useState({
    testSize: 0.20,
    randomState: 42,
    cvFolds: 5,
  });

  const handleChange = (field, value) => {

    const updatedConfig = {
      ...config,
      [field]: value,
    };

    setConfig(updatedConfig);

    // Send configuration to parent
    if (onChange) {
      onChange(updatedConfig);
    }
  };

  return (

    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Training Configuration
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        {/* =========================================
            TRAIN / TEST SPLIT
        ========================================== */}

        <div>

          <label className="block mb-2 font-semibold">
            Train/Test Split
          </label>

          <select
            value={config.testSize}
            onChange={(e) =>
              handleChange(
                "testSize",
                Number(e.target.value)
              )
            }
            className="
              w-full
              border
              rounded-xl
              p-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >

            <option value={0.20}>
              80 / 20
            </option>

            <option value={0.30}>
              70 / 30
            </option>

            <option value={0.10}>
              90 / 10
            </option>

          </select>

        </div>


        {/* =========================================
            RANDOM STATE
        ========================================== */}

        <div>

          <label className="block mb-2 font-semibold">
            Random State
          </label>

          <input
            type="number"
            min="0"
            value={config.randomState}
            onChange={(e) =>
              handleChange(
                "randomState",
                Number(e.target.value)
              )
            }
            className="
              w-full
              border
              rounded-xl
              p-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />

        </div>


        {/* =========================================
            CROSS VALIDATION
        ========================================== */}

        <div>

          <label className="block mb-2 font-semibold">
            Cross Validation
          </label>

          <select
            value={config.cvFolds}
            onChange={(e) =>
              handleChange(
                "cvFolds",
                Number(e.target.value)
              )
            }
            className="
              w-full
              border
              rounded-xl
              p-3
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >

            <option value={5}>
              5 Fold
            </option>

            <option value={10}>
              10 Fold
            </option>

          </select>

        </div>

      </div>


      {/* =========================================
          CONFIGURATION SUMMARY
      ========================================== */}

      <div className="
        mt-6
        bg-blue-50
        border
        border-blue-200
        rounded-xl
        p-4
      ">

        <p className="
          text-sm
          text-blue-800
        ">

          <span className="font-semibold">
            Current Configuration:
          </span>

          {" "}
          Train/Test ={" "}

          {Math.round(
            (1 - config.testSize) * 100
          )}

          /

          {Math.round(
            config.testSize * 100
          )}

          {" | "}

          Random State ={" "}

          {config.randomState}

          {" | "}

          Cross Validation ={" "}

          {config.cvFolds}

          {"-Fold"}

        </p>

      </div>

    </div>

  );
}

export default TrainingConfig;