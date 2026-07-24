import MainLayout from "../layouts/MainLayout";
import {
  FaFilePdf,
  FaDownload,
  FaChartBar,
  FaDatabase,
} from "react-icons/fa";

function Reports() {
  const reportSummary = {
    totalPredictions: 152,
    good: 118,
    medium: 24,
    defective: 10,
    bestModel: "LightGBM",
    accuracy: "99.34%",
  };

  const predictionHistory = [
    {
      id: 1,
      date: "14 Jul 2026",
      quality: "Good",
      score: "99.34%",
      model: "LightGBM",
    },
    {
      id: 2,
      date: "13 Jul 2026",
      quality: "Medium",
      score: "95.62%",
      model: "XGBoost",
    },
    {
      id: 3,
      date: "12 Jul 2026",
      quality: "Good",
      score: "98.72%",
      model: "Random Forest",
    },
    {
      id: 4,
      date: "11 Jul 2026",
      quality: "Defective",
      score: "82.50%",
      model: "SVM",
    },
  ];

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-800">
          Quality Reports Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Analyze prediction reports, model performance and quality statistics.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
          <FaChartBar className="text-blue-600 text-4xl mb-4" />
          <p className="text-gray-500">Total Predictions</p>
          <h2 className="text-4xl font-bold mt-2">
            {reportSummary.totalPredictions}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
          <FaDatabase className="text-green-600 text-4xl mb-4" />
          <p className="text-gray-500">Good Quality</p>
          <h2 className="text-4xl font-bold mt-2">
            {reportSummary.good}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
          <FaChartBar className="text-purple-600 text-4xl mb-4" />
          <p className="text-gray-500">Model Accuracy</p>
          <h2 className="text-4xl font-bold mt-2">
            {reportSummary.accuracy}
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6">
          <FaDatabase className="text-orange-500 text-4xl mb-4" />
          <p className="text-gray-500">Best Model</p>
          <h2 className="text-3xl font-bold mt-2">
            {reportSummary.bestModel}
          </h2>
        </div>

      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mt-10">

        <button className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg transition">
          <FaFilePdf />
          Download PDF
        </button>

        <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg transition">
          <FaDownload />
          Export CSV
        </button>

      </div>

      {/* Prediction History */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 mt-10">

        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Prediction History
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="bg-slate-100 border-b">

                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Quality</th>
                <th className="p-4 text-left">Confidence</th>
                <th className="p-4 text-left">Model</th>

              </tr>

            </thead>

            <tbody>

              {predictionHistory.map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-slate-50 transition"
                >

                  <td className="p-4">{item.date}</td>

                  <td className="p-4 font-medium">
                    {item.quality}
                  </td>

                  <td className="p-4">
                    {item.score}
                  </td>

                  <td className="p-4">
                    {item.model}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </MainLayout>
  );
}

export default Reports;