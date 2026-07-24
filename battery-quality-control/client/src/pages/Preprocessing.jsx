import { useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import { FaBroom } from "react-icons/fa";

function Preprocessing() {
  const [processing, setProcessing] = useState(false);

  const [summary, setSummary] = useState({
    rows: 0,
    columns: 0,
    missing: 0,
    duplicate: 0,
    encoded: 0,
    scaled: 0,
  });

  const handlePreprocessing = async () => {
    setProcessing(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/preprocess"
      );

      console.log("========== RESPONSE ==========");
      console.log(response.data);

      alert(response.data.message);

      const data = response.data;

      setSummary({
        rows: data.rows || 0,
        columns: data.columns || 0,
        missing: data.missing_removed || 0,
        duplicate: data.duplicate_removed || 0,
        encoded: data.encoded_columns || 0,
        scaled: data.scaled_columns || 0,
      });

      console.log("========== SUMMARY UPDATED ==========");
      console.log({
        rows: data.rows,
        columns: data.columns,
        missing: data.missing_removed,
        duplicate: data.duplicate_removed,
        encoded: data.encoded_columns,
        scaled: data.scaled_columns,
      });

    } catch (error) {
      console.error(error);

      if (error.response) {
        console.log(error.response.data);
      }

      alert("Preprocessing Failed");
    }

    setProcessing(false);
  };

  return (
    <MainLayout>

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">
          Data Preprocessing
        </h1>

        <p className="text-gray-500 mt-2">
          Clean and prepare the uploaded battery electrode dataset before
          training the Machine Learning model.
        </p>

      </div>

      {/* Dataset Information */}

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

        <h2 className="text-2xl font-bold mb-6">
          Dataset Information
        </h2>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">

          <div className="bg-blue-100 rounded-xl p-5">
            <h3 className="text-gray-600">Rows</h3>
            <p className="text-3xl font-bold">{summary.rows}</p>
          </div>

          <div className="bg-green-100 rounded-xl p-5">
            <h3 className="text-gray-600">Columns</h3>
            <p className="text-3xl font-bold">{summary.columns}</p>
          </div>

          <div className="bg-yellow-100 rounded-xl p-5">
            <h3 className="text-gray-600">Missing Values Removed</h3>
            <p className="text-3xl font-bold">{summary.missing}</p>
          </div>

          <div className="bg-red-100 rounded-xl p-5">
            <h3 className="text-gray-600">Duplicate Rows Removed</h3>
            <p className="text-3xl font-bold">{summary.duplicate}</p>
          </div>

          <div className="bg-purple-100 rounded-xl p-5">
            <h3 className="text-gray-600">Encoded Columns</h3>
            <p className="text-3xl font-bold">{summary.encoded}</p>
          </div>

          <div className="bg-cyan-100 rounded-xl p-5">
            <h3 className="text-gray-600">Scaled Columns</h3>
            <p className="text-3xl font-bold">{summary.scaled}</p>
          </div>

        </div>

      </div>

      {/* Operations */}

      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold mb-6">
          Preprocessing Operations
        </h2>

        <div className="grid md:grid-cols-2 gap-5">

          <div className="border rounded-xl p-5">
            ✅ Handle Missing Values
          </div>

          <div className="border rounded-xl p-5">
            ✅ Remove Duplicate Records
          </div>

          <div className="border rounded-xl p-5">
            ✅ Encode Categorical Columns
          </div>

          <div className="border rounded-xl p-5">
            ✅ Normalize Numerical Features
          </div>

          <div className="border rounded-xl p-5">
            ✅ Feature Scaling
          </div>

          <div className="border rounded-xl p-5">
            ✅ Data Validation
          </div>

        </div>

        <button
          onClick={handlePreprocessing}
          disabled={processing}
          className={`mt-8 px-8 py-3 rounded-xl flex items-center gap-3 text-white ${
            processing
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <FaBroom />

          {processing
            ? "Processing..."
            : "Run Preprocessing"}
        </button>

        {processing && (

          <div className="mt-6">

            <div className="w-full h-4 bg-gray-200 rounded-full">

              <div className="h-4 bg-green-500 rounded-full animate-pulse w-full"></div>

            </div>

            <p className="text-green-600 mt-3">
              Running preprocessing...
            </p>

          </div>

        )}

      </div>

      {/* Summary */}

      <div className="bg-white rounded-2xl shadow-lg mt-8 p-8">

        <h2 className="text-2xl font-bold mb-6">
          Processing Summary
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-blue-100 rounded-xl p-5">
            <h3>Total Records</h3>
            <p className="text-3xl font-bold">
              {summary.rows}
            </p>
          </div>

          <div className="bg-red-100 rounded-xl p-5">
            <h3>Missing Values Removed</h3>
            <p className="text-3xl font-bold">
              {summary.missing}
            </p>
          </div>

          <div className="bg-green-100 rounded-xl p-5">
            <h3>Duplicate Rows Removed</h3>
            <p className="text-3xl font-bold">
              {summary.duplicate}
            </p>
          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Preprocessing;


