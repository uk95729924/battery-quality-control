function TrainingConfig() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Training Configuration
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <div>
          <label className="block mb-2 font-semibold">
            Train/Test Split
          </label>

          <select className="w-full border rounded-xl p-3">
            <option>80 / 20</option>
            <option>70 / 30</option>
            <option>90 / 10</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Random State
          </label>

          <input
            type="number"
            defaultValue="42"
            className="w-full border rounded-xl p-3"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Cross Validation
          </label>

          <select className="w-full border rounded-xl p-3">
            <option>5 Fold</option>
            <option>10 Fold</option>
          </select>
        </div>

      </div>

    </div>
  );
}

export default TrainingConfig;