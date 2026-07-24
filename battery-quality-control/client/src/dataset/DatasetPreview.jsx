function DatasetPreview({ data }) {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 w-full overflow-hidden">

      <h2 className="text-2xl font-bold mb-5">
        Dataset Preview
      </h2>

      <div className="w-full overflow-x-auto">

        <table className="table-auto border-collapse">

          <thead className="bg-slate-900 text-white">

            <tr>

              {columns.map((column) => (
                <th
                  key={column}
                  className="border px-4 py-3 whitespace-nowrap"
                >
                  {column}
                </th>
              ))}

            </tr>

          </thead>

          <tbody>

            {data.slice(0,10).map((row,index)=>(

              <tr
                key={index}
                className="hover:bg-blue-50"
              >

                {columns.map((column)=>(

                  <td
                    key={column}
                    className="border px-4 py-2 whitespace-nowrap"
                  >
                    {row[column]}
                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default DatasetPreview;