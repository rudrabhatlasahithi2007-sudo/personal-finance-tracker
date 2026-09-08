function SummaryCard({ title, amount }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className="text-2xl font-bold mt-2">
        ₹{amount.toLocaleString("en-IN")}
      </h2>
    </div>
  );
}

export default SummaryCard;