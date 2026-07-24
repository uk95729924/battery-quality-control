// import { FaCheckCircle } from "react-icons/fa";

// function ModelSummary() {
//   return (
//     <div className="bg-white rounded-2xl shadow-lg mt-8 p-8">

//       <h2 className="text-2xl font-bold mb-6">
//         Best Performing Model
//       </h2>

//       <div className="grid md:grid-cols-2 gap-6">

//         <div className="border rounded-xl p-5">
//           <p className="text-gray-500">Algorithm</p>
//           <h3 className="text-2xl font-bold mt-2">
//             XGBoost
//           </h3>
//         </div>

//         <div className="border rounded-xl p-5">
//           <p className="text-gray-500">Accuracy</p>
//           <h3 className="text-2xl font-bold mt-2">
//             98.72%
//           </h3>
//         </div>

//         <div className="border rounded-xl p-5">
//           <p className="text-gray-500">Training Time</p>
//           <h3 className="text-2xl font-bold mt-2">
//             3.24 sec
//           </h3>
//         </div>

//         <div className="border rounded-xl p-5">
//           <p className="text-gray-500">Prediction Time</p>
//           <h3 className="text-2xl font-bold mt-2">
//             0.011 sec/sample
//           </h3>
//         </div>

//         <div className="border rounded-xl p-5">
//           <p className="text-gray-500">Cross Validation</p>
//           <h3 className="text-2xl font-bold mt-2">
//             10 Fold
//           </h3>
//         </div>

//         <div className="border rounded-xl p-5 flex items-center gap-3">

//           <FaCheckCircle
//             className="text-green-600 text-3xl"
//           />

//           <div>

//             <p className="text-gray-500">
//               Status
//             </p>

//             <h3 className="text-xl font-bold">
//               Training Completed
//             </h3>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default ModelSummary;




import { FaCheckCircle } from "react-icons/fa";

function ModelSummary({ result }) {

  if (!result) return null;

  return (

    <div className="bg-white rounded-2xl shadow-lg mt-8 p-8">

      <h2 className="text-2xl font-bold mb-6">
        Best Performing Model
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="border rounded-xl p-5">

          <p className="text-gray-500">
            Algorithm
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {result.bestModel}
          </h3>

        </div>

        <div className="border rounded-xl p-5">

          <p className="text-gray-500">
            Accuracy
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {result.accuracy}%
          </h3>

        </div>

        <div className="border rounded-xl p-5">

          <p className="text-gray-500">
            Precision
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {result.precision}%
          </h3>

        </div>

        <div className="border rounded-xl p-5">

          <p className="text-gray-500">
            Recall
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {result.recall}%
          </h3>

        </div>

        <div className="border rounded-xl p-5">

          <p className="text-gray-500">
            F1 Score
          </p>

          <h3 className="text-2xl font-bold mt-2">
            {result.f1}%
          </h3>

        </div>

        <div className="border rounded-xl p-5 flex items-center gap-3">

          <FaCheckCircle
            className="text-green-600 text-3xl"
          />

          <div>

            <p className="text-gray-500">
              Status
            </p>

            <h3 className="text-xl font-bold">
              Training Completed
            </h3>

          </div>

        </div>

      </div>

    </div>

  );
}

export default ModelSummary;