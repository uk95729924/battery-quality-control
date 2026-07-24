function PreprocessingSummary() {
  return (
    <div className="bg-white rounded-2xl shadow-lg mt-8 p-8">

      <h2 className="text-2xl font-bold mb-6">
        Processing Summary
      </h2>

      <div className="grid md:grid-cols-4 gap-5">

        <div className="bg-blue-100 rounded-xl p-5">
          <h3>Total Rows</h3>
          <p className="text-3xl font-bold">--</p>
        </div>

        <div className="bg-green-100 rounded-xl p-5">
          <h3>Missing Removed</h3>
          <p className="text-3xl font-bold">--</p>
        </div>

        <div className="bg-red-100 rounded-xl p-5">
          <h3>Duplicates Removed</h3>
          <p className="text-3xl font-bold">--</p>
        </div>

        <div className="bg-purple-100 rounded-xl p-5">
          <h3>Status</h3>
          <p className="text-3xl font-bold">Ready</p>
        </div>

      </div>

    </div>
  );
}

export default PreprocessingSummary;