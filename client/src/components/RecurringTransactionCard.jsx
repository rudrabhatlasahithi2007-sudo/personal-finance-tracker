function RecurringTransactionCard({
  transaction,
  onEdit,
  onDelete,
  onToggle,
}) {
  const isIncome =
    transaction.type === "income";

  const amount = Number(
    transaction.amount || 0
  );

  const frequency =
    transaction.frequency || "monthly";

  const formattedFrequency =
    frequency.charAt(0).toUpperCase() +
    frequency.slice(1);

  const formatDate = (date) => {
    if (!date) return "Not set";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div
      className={`finance-card p-5 ${
        !transaction.active
          ? "opacity-70"
          : ""
      }`}
    >

      {/* Header */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
              isIncome
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            {isIncome ? "↗" : "↘"}
          </div>

          <div className="min-w-0">

            <h3 className="truncate text-sm font-semibold text-gray-900">
              {transaction.category}
            </h3>

            <p className="mt-1 truncate text-xs text-slate-400">
              {transaction.description ||
                "Recurring transaction"}
            </p>

          </div>

        </div>

        <span
          className={`finance-badge ${
            transaction.active
              ? "finance-badge-success"
              : "finance-badge-warning"
          }`}
        >
          {transaction.active
            ? "Active"
            : "Paused"}
        </span>

      </div>

      {/* Amount */}

      <div className="mt-6 flex items-end justify-between">

        <div>

          <p className="text-xs text-slate-400">
            Amount
          </p>

          <p
            className={`finance-number mt-1 text-2xl ${
              isIncome
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {isIncome ? "+" : "-"}₹
            {amount.toLocaleString("en-IN")}
          </p>

        </div>

        <div className="text-right">

          <p className="text-xs text-slate-400">
            Frequency
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-800">
            {formattedFrequency}
          </p>

        </div>

      </div>

      {/* Dates */}

      <div className="mt-5 grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-slate-50 p-3">

          <p className="text-[11px] font-medium text-slate-400">
            Start Date
          </p>

          <p className="mt-1 text-xs font-semibold text-gray-700">
            {formatDate(
              transaction.startDate
            )}
          </p>

        </div>

        <div className="rounded-xl bg-blue-50 p-3">

          <p className="text-[11px] font-medium text-blue-500">
            Next Date
          </p>

          <p className="mt-1 text-xs font-semibold text-blue-700">
            {formatDate(
              transaction.nextDate
            )}
          </p>

        </div>

      </div>

      {/* Actions */}

      <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">

        <button
          onClick={onToggle}
          className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
            transaction.active
              ? "border-amber-200 text-amber-600 hover:bg-amber-50"
              : "border-green-200 text-green-600 hover:bg-green-50"
          }`}
        >
          {transaction.active
            ? "Pause"
            : "Activate"}
        </button>

        <button
          onClick={onEdit}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
        >
          Edit
        </button>

        <button
          onClick={onDelete}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default RecurringTransactionCard;