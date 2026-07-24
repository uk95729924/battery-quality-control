// import { useState } from "react";
// import MainLayout from "../layouts/MainLayout";

// import ModelSelection from "../components/train/ModelSelection";
// import TrainingConfig from "../components/train/TrainingConfig";
// import ProgressBar from "../components/train/ProgressBar";

// import TrainingResult from "../components/train/TrainingResult";

// import FeatureImportance from "../components/train/FeatureImportance";

// import ModelSummary from "../components/train/ModelSummary";

// function TrainModel() {

//   const [progress, setProgress] = useState(0);
//   const [training, setTraining] = useState(false);

//   const handleTraining = () => {

//     setTraining(true);
//     setProgress(0);

//     let value = 0;

//     const interval = setInterval(() => {

//       value += 10;

//       setProgress(value);

//       if (value >= 100) {

//         clearInterval(interval);

//         setTraining(false);

//       }

//     }, 300);

//   };

//   return (

//     <MainLayout>

//       {/* Header */}

//       <div className="mb-8">

//         <h1 className="text-4xl font-bold">
//           Train Machine Learning Model
//         </h1>

//         <p className="text-gray-500 mt-2">
//           Select machine learning algorithms and configure training parameters.
//         </p>

//       </div>

//       {/* Model Selection */}

//       <ModelSelection />

//       {/* Training Configuration */}

//       <TrainingConfig />

//       {/* Train Button */}

//       <div className="mt-8">

//         <button
//           onClick={handleTraining}
//           disabled={training}
//           className={`px-8 py-3 rounded-xl text-white font-semibold transition-all
//           ${
//             training
//               ? "bg-gray-500 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {training ? "Training..." : "Train Models"}
//         </button>

//       </div>

//       {/* Progress Bar */}

//       <ProgressBar progress={progress} />
     
//       <TrainingResult />
//       <FeatureImportance />
//       <ModelSummary />

//     </MainLayout>

//   );
// }

// export default TrainModel;



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

  const [progress, setProgress] = useState(0);

  const [training, setTraining] = useState(false);

  const [trainingResult, setTrainingResult] = useState(null);

  const handleTraining = async () => {

    setTraining(true);

    setProgress(10);

    try {

      setProgress(25);

      const response = await axios.post(
        "http://127.0.0.1:5000/train"
      );

      setProgress(80);

      console.log(response.data);

      alert(response.data.message);

      const bestModel = response.data.best_model;

      const bestResult =
        response.data.results[bestModel];

      setTrainingResult({

        bestModel: bestModel,

        accuracy: bestResult.accuracy,

        precision: bestResult.precision,

        recall: bestResult.recall,

        f1: bestResult.f1

      });

      setProgress(100);

    }

    catch (error) {

      console.log(error);

      if (error.response) {

        alert(error.response.data.message);

      }

      else {

        alert("Training Failed");

      }

    }

    finally {

      setTraining(false);

    }

  };

  return (

    <MainLayout>

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          Train Machine Learning Models

        </h1>

        <p className="text-gray-500 mt-2">

          Train Random Forest, SVM, XGBoost and LightGBM
          using the processed battery electrode dataset.

        </p>

      </div>

      {/* Model Selection */}

      <ModelSelection />

      {/* Training Config */}

      <TrainingConfig />

      {/* Button */}

      <div className="mt-8">

        <button

          onClick={handleTraining}

          disabled={training}

          className={`px-8 py-3 rounded-xl text-white font-semibold transition-all

          ${training

            ? "bg-gray-500 cursor-not-allowed"

            : "bg-blue-600 hover:bg-blue-700"

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

      {/* Progress */}

      <ProgressBar progress={progress} />

      {/* Results */}

      {

        trainingResult && (

          <>

            <TrainingResult

              result={trainingResult}

            />

            <FeatureImportance />

            <ModelSummary

              result={trainingResult}

            />

          </>

        )

      }

    </MainLayout>

  );

}

export default TrainModel;