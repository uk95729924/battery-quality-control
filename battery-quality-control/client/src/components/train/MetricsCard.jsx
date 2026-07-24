function MetricsCard({ title, value, color }) {
  return (
    <div className={`rounded-xl p-6 shadow-lg ${color}`}>

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="text-4xl font-bold mt-3">
        {value}
      </p>

    </div>
  );
}

export default MetricsCard;