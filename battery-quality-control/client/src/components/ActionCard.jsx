function ActionCard({
  title,
  description,
  icon,
  color,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer p-8 hover:-translate-y-1"
    >
      <div className={`text-5xl mb-5 ${color}`}>
        {icon}
      </div>

      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <p className="text-gray-500 mt-3 text-sm">
        {description}
      </p>
    </div>
  );
}

export default ActionCard;
