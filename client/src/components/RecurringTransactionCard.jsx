function RecurringTransactionCard({
  transaction,
  onEdit,
  onDelete,
  onToggle,
}) {
  const isIncome = transaction.type === "income";

  const formattedAmount = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(transaction.amount);

  const formattedNextDate = new Date(
    transaction.nextDate
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedStartDate = new Date(
    transaction.startDate
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const frequencyText =
    transaction.frequency.charAt(0).toUpperCase() +
    transaction.frequency.slice(1);

  return (
    <div
      className={`finance-card p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
        transaction.active ? "" : "opacity-70"
      }`}
    >
      {/* Top section */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg font-semibold ${
              isIncome
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {isIncome ? "↑" : "↓"}
          </div>

          <div>
            <h3 className="font-semibold text-gray-800">
              {transaction.category}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {transaction.description ||
                "Recurring transaction"}
            </p>
          </div>
        </div>

        {/* Status */}
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            transaction.active
              ? "bg-green-50 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {transaction.active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Amount */}
      <div className="mt-5">
        <p
          className={`text-xl font-bold ${
            isIncome
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formattedAmount}
        </p>
      </div>

      {/* Details */}
      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-400">
            Frequency
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700">
            {frequencyText}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">
            Next Date
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700">
            {formattedNextDate}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">
            Start Date
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700">
            {formattedStartDate}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">
            Type
          </p>

          <p className="mt-1 text-sm font-medium capitalize text-gray-700">
            {transaction.type}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        <button
          onClick={() => onToggle(transaction)}
          className="finance-secondary-button"
        >
          {transaction.active
            ? "Pause"
            : "Activate"}
        </button>

        <button
          onClick={() => onEdit(transaction)}
          className="finance-secondary-button"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(transaction._id)}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default RecurringTransactionCard;