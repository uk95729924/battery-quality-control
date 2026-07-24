function InfoCard({
  title,
  description,
  bgColor = "bg-white",
}) {
  return (
    <div
      className={`${bgColor} rounded-2xl shadow-md p-8 hover:shadow-lg transition`}
    >
      <h2 className="text-2xl font-bold mb-4">
        {title}
      </h2>

      <p className="text-gray-600 leading-7">
        {description}
      </p>
    </div>
  );
}

export default InfoCard;