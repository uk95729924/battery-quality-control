import { useState, useEffect } from "react";

function FeatureSelection({ data }) {
  const [columns, setColumns] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [targetColumn, setTargetColumn] = useState("");

  useEffect(() => {
    if (data.length > 0) {
      const cols = Object.keys(data[0]);
      setColumns(cols);
      setSelectedFeatures(cols);
    }
  }, [data]);

  const handleFeatureChange = (column) => {
    if (selectedFeatures.includes(column)) {
      setSelectedFeatures(
        selectedFeatures.filter((item) => item !== column)
      );
    } else {
      setSelectedFeatures([...selectedFeatures, column]);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg mt-8 p-6">

      <h2 className="text-2xl font-bold mb-6">
        Feature Selection
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        {columns.map((column) => (

          <label
            key={column}
            className="flex items-center gap-3 bg-gray-100 rounded-lg p-3 cursor-pointer"
          >

            <input
              type="checkbox"
              checked={selectedFeatures.includes(column)}
              onChange={() => handleFeatureChange(column)}
            />

            {column}

          </label>

        ))}

      </div>

      <div className="mt-8">

        <h3 className="text-xl font-bold mb-3">
          Target Column
        </h3>

        <select
          className="border rounded-lg p-3 w-full"
          value={targetColumn}
          onChange={(e) => setTargetColumn(e.target.value)}
        >
          <option value="">Select Target Column</option>

          {columns.map((column) => (
            <option
              key={column}
              value={column}
            >
              {column}
            </option>
          ))}

        </select>

      </div>

      <div className="mt-6 bg-blue-50 rounded-lg p-4">

        <h4 className="font-bold">
          Selected Features
        </h4>

        <p className="mt-2">
          {selectedFeatures.join(", ")}
        </p>

        <h4 className="font-bold mt-4">
          Target
        </h4>

        <p>
          {targetColumn || "Not Selected"}
        </p>

      </div>

    </div>
  );
}

export default FeatureSelection;