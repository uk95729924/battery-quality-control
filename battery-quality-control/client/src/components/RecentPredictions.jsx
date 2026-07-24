function RecentPredictions() {
  const predictions = [
    {
      date: "24-06-2026",
      dataset: "Battery_A.csv",
      model: "Random Forest",
      result: "Good",
      confidence: "97.45%",
      status: "Completed",
    },
    {
      date: "24-06-2026",
      dataset: "Battery_B.csv",
      model: "XGBoost",
      result: "Medium",
      confidence: "94.82%",
      status: "Completed",
    },
    {
      date: "24-06-2026",
      dataset: "Battery_C.csv",
      model: "SVM",
      result: "Defective",
      confidence: "91.33%",
      status: "Completed",
    },
    {
      date: "23-06-2026",
      dataset: "Battery_D.csv",
      model: "Random Forest",
      result: "Good",
      confidence: "98.20%",
      status: "Completed",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md mt-12 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Recent Predictions
        </h2>

        <button className="text-blue-600 font-semibold hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">

          <thead>
            <tr className="bg-slate-900 text-white">

              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-left">Dataset</th>

              <th className="p-4 text-left">Model</th>

              <th className="p-4 text-left">Prediction</th>

              <th className="p-4 text-left">Confidence</th>

              <th className="p-4 text-left">Status</th>

            </tr>
          </thead>

          <tbody>

            {predictions.map((item, index) => (

              <tr
                key={index}
                className="border-b hover:bg-gray-100"
              >

                <td className="p-4">{item.date}</td>

                <td className="p-4">{item.dataset}</td>

                <td className="p-4">{item.model}</td>

                <td className="p-4 font-semibold">
                  {item.result}
                </td>

                <td className="p-4">
                  {item.confidence}
                </td>

                <td className="p-4 text-green-600 font-semibold">
                  {item.status}
                </td>

              </tr>

            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
}

export default RecentPredictions;