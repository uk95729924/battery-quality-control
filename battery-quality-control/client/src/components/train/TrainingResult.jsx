// import MetricsCard from "./MetricsCard";

// function TrainingResult() {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg mt-8 p-8">

//       <h2 className="text-2xl font-bold mb-6">
//         Training Results
//       </h2>

//       <div className="grid md:grid-cols-5 gap-5">

//         <MetricsCard
//           title="Accuracy"
//           value="98.72%"
//           color="bg-blue-100"
//         />

//         <MetricsCard
//           title="Precision"
//           value="97.84%"
//           color="bg-green-100"
//         />

//         <MetricsCard
//           title="Recall"
//           value="98.11%"
//           color="bg-yellow-100"
//         />

//         <MetricsCard
//           title="F1 Score"
//           value="97.95%"
//           color="bg-purple-100"
//         />

//         <MetricsCard
//           title="Best Model"
//           value="XGBoost"
//           color="bg-red-100"
//         />

//       </div>

//     </div>
//   );
// }

// export default TrainingResult;




import MetricsCard from "./MetricsCard";

function TrainingResult({ result }) {
  if (!result) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg mt-8 p-8">

      <h2 className="text-2xl font-bold mb-6">
        Training Results
      </h2>

      <div className="grid md:grid-cols-5 gap-5">

        <MetricsCard
          title="Accuracy"
          value={`${result.accuracy}%`}
          color="bg-blue-100"
        />

        <MetricsCard
          title="Precision"
          value={`${result.precision}%`}
          color="bg-green-100"
        />

        <MetricsCard
          title="Recall"
          value={`${result.recall}%`}
          color="bg-yellow-100"
        />

        <MetricsCard
          title="F1 Score"
          value={`${result.f1}%`}
          color="bg-purple-100"
        />

        <MetricsCard
          title="Best Model"
          value={result.bestModel}
          color="bg-red-100"
        />

      </div>

    </div>
  );
}

export default TrainingResult;