function OperationCard({ title }) {
  return (
    <div className="bg-gray-100 rounded-xl p-5 hover:bg-blue-100 transition">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          defaultChecked
          className="w-5 h-5"
        />

        <span className="text-lg font-medium">
          {title}
        </span>
      </label>
    </div>
  );
}

export default OperationCard;