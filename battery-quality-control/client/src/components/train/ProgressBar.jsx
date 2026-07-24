// function ProgressBar({ progress }) {
//   return (
//     <div className="mt-8">

//       <div className="flex justify-between mb-2">

//         <span className="font-semibold">
//           Training Progress
//         </span>

//         <span>
//           {progress}%
//         </span>

//       </div>

//       <div className="w-full bg-gray-200 rounded-full h-4">

//         <div
//           className="bg-blue-600 h-4 rounded-full transition-all duration-500"
//           style={{
//             width: `${progress}%`,
//           }}
//         ></div>

//       </div>

//     </div>
//   );
// }

// export default ProgressBar;



function ProgressBar({ progress }) {
  return (
    <div className="mt-8">

      <div className="flex justify-between items-center mb-2">

        <span className="font-semibold text-gray-700">
          Training Progress
        </span>

        <span className="font-bold text-blue-600">
          {progress}%
        </span>

      </div>

      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">

        <div
          className={`h-4 rounded-full transition-all duration-700 ${
            progress === 100
              ? "bg-green-600"
              : "bg-blue-600"
          }`}
          style={{
            width: `${progress}%`,
          }}
        ></div>

      </div>

      {progress === 100 && (
        <p className="mt-3 text-green-600 font-semibold">
          ✅ Training Completed Successfully
        </p>
      )}

    </div>
  );
}

export default ProgressBar;