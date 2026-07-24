import { FaCloudUploadAlt } from "react-icons/fa";

function UploadBox({ onFileSelect }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-10 mt-8">

      <div className="flex flex-col items-center">

        <FaCloudUploadAlt className="text-7xl text-blue-600 mb-6" />

        <h2 className="text-4xl font-bold mb-3">
          Upload Battery Dataset
        </h2>

        <p className="text-gray-500 text-lg mb-8">
          Upload CSV or XLSX Battery Electrode Dataset
        </p>

        <label
          htmlFor="dataset-upload"
          className="w-full max-w-xl border-2 border-dashed border-blue-400 rounded-2xl p-10 cursor-pointer hover:bg-blue-50 transition"
        >

          <div className="text-center">

            <p className="text-lg font-semibold">
              📂 Click here to choose a dataset
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Supported formats: CSV, XLSX
            </p>

          </div>

          <input
            id="dataset-upload"
            type="file"
            accept=".csv,.xlsx"
            className="hidden"
            onChange={(e) => onFileSelect(e.target.files[0])}
          />

        </label>

      </div>

    </div>
  );
}

export default UploadBox;