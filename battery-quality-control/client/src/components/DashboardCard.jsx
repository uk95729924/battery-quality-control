function DashboardCard({
  title,
  value,
  subtitle,
  icon,
  bgColor = "bg-white",
}) {
  return (
    <div
      className={`${bgColor} rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>

          <h2 className="text-3xl font-bold mt-2">{value}</h2>

          <p className="text-xs text-gray-400 mt-2">
            {subtitle}
          </p>
        </div>

        <div className="text-4xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;