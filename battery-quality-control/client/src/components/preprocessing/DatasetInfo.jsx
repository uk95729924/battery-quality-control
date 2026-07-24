function DatasetInfo({
  rows,
  columns,
  missing,
  duplicates,
  target,
  selectedFeatures,
}) {
  const cards = [
    {
      title: "Total Rows",
      value: rows,
      color: "bg-blue-100",
    },
    {
      title: "Total Columns",
      value: columns,
      color: "bg-green-100",
    },
    {
      title: "Missing Values",
      value: missing,
      color: "bg-yellow-100",
    },
    {
      title: "Duplicate Rows",
      value: duplicates,
      color: "bg-red-100",
    },
    {
      title: "Target Column",
      value: target,
      color: "bg-purple-100",
    },
    {
      title: "Selected Features",
      value: selectedFeatures,
      color: "bg-cyan-100",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

      <h2 className="text-2xl font-bold mb-6">
        Dataset Information
      </h2>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">

        {cards.map((card) => (

          <div
            key={card.title}
            className={`${card.color} rounded-xl p-5`}
          >
            <p className="text-gray-600">
              {card.title}
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {card.value}
            </h2>

          </div>

        ))}

      </div>

    </div>
  );
}

export default DatasetInfo;