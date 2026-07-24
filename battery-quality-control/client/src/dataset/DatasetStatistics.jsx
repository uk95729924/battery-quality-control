function DatasetStatistics({ data }) {
  if (!data || data.length === 0) return null;

  const totalRows = data.length;
  const totalColumns = Object.keys(data[0]).length;

  let missingValues = 0;

  data.forEach((row) => {
    Object.values(row).forEach((value) => {
      if (value === "" || value === null || value === undefined) {
        missingValues++;
      }
    });
  });

  const duplicateRows =
    totalRows -
    new Set(data.map((row) => JSON.stringify(row))).size;

  const firstRow = data[0];

  const numericColumns = Object.values(firstRow).filter(
    (value) => !isNaN(value) && value !== ""
  ).length;

  const categoricalColumns = totalColumns - numericColumns;

  return (
    <div className="bg-white shadow-lg rounded-2xl mt-8 p-6">

      <h2 className="text-2xl font-bold mb-6">
        Dataset Statistics
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

        <div className="bg-blue-100 rounded-xl p-5">
          <h3 className="text-gray-600">Rows</h3>
          <p className="text-3xl font-bold">{totalRows}</p>
        </div>

        <div className="bg-green-100 rounded-xl p-5">
          <h3 className="text-gray-600">Columns</h3>
          <p className="text-3xl font-bold">{totalColumns}</p>
        </div>

        <div className="bg-red-100 rounded-xl p-5">
          <h3 className="text-gray-600">Missing Values</h3>
          <p className="text-3xl font-bold">{missingValues}</p>
        </div>

        <div className="bg-yellow-100 rounded-xl p-5">
          <h3 className="text-gray-600">Duplicate Rows</h3>
          <p className="text-3xl font-bold">{duplicateRows}</p>
        </div>

        <div className="bg-purple-100 rounded-xl p-5">
          <h3 className="text-gray-600">Numeric Columns</h3>
          <p className="text-3xl font-bold">{numericColumns}</p>
        </div>

        <div className="bg-cyan-100 rounded-xl p-5">
          <h3 className="text-gray-600">Categorical Columns</h3>
          <p className="text-3xl font-bold">{categoricalColumns}</p>
        </div>

      </div>

    </div>
  );
}

export default DatasetStatistics;
