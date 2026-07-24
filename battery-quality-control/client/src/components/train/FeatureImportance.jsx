function FeatureImportance() {
  const features = [
    { name: "Internal Resistance", value: 95 },
    { name: "Electrolyte Volume", value: 82 },
    { name: "Ambient Temperature", value: 75 },
    { name: "Capacity", value: 68 },
    { name: "Voltage", value: 54 },
    { name: "QC Grade", value: 40 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg mt-8 p-8">

      <h2 className="text-2xl font-bold mb-6">
        Feature Importance
      </h2>

      {features.map((feature) => (

        <div key={feature.name} className="mb-5">

          <div className="flex justify-between mb-2">

            <span className="font-medium">
              {feature.name}
            </span>

            <span className="font-bold">
              {feature.value}%
            </span>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">

            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${feature.value}%` }}
            ></div>

          </div>

        </div>

      ))}

    </div>
  );
}

export default FeatureImportance;