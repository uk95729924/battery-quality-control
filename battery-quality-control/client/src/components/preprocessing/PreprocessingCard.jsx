import OperationCard from "./OperationCard";

function PreprocessingCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <h2 className="text-2xl font-bold mb-6">
        Preprocessing Operations
      </h2>

      <div className="grid md:grid-cols-2 gap-5">

        <OperationCard title="Remove Missing Values" />

        <OperationCard title="Remove Duplicate Records" />

        <OperationCard title="Encode Categorical Columns" />

        <OperationCard title="Normalize Numerical Features" />

        <OperationCard title="Feature Scaling" />

        <OperationCard title="Data Validation" />

      </div>

      <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl">
        Run Preprocessing
      </button>

    </div>
  );
}

export default PreprocessingCard;