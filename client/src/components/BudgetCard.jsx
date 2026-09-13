function BudgetCard({ budget, onEdit, onDelete }) {
  const {
    category,
    amount,
    spent,
    remaining,
    percentageUsed,
    status,
  } = budget;

  const getStatusDetails = () => {
    if (status === "exceeded") {
      return {
        label: "Budget exceeded",
        badge: "bg-red-50 text-red-700",
        progress: "bg-red-500",
      };
    }

    if (status === "near-limit") {
      return {
        label: "Near limit",
        badge: "bg-amber-50 text-amber-700",
        progress: "bg-amber-500",
      };
    }

    return {
      label: "On track",
      badge: "bg-green-50 text-green-700",
      progress: "bg-green-500",
    };
  };

  const statusDetails = getStatusDetails();

  // Keep progress bar visually inside 100%
  const progressWidth = Math.min(percentageUsed, 100);

  return (
    <div className="finance-card p-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-semibold">
            ₹
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              {category}
            </h3>

            <p className="text-xs text-gray-500 mt-0.5">
              Monthly budget
            </p>
          </div>
        </div>

        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusDetails.badge}`}
        >
          {statusDetails.label}
        </span>
      </div>

      {/* Amount */}
      <div className="mt-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">
              Spent
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
              ₹{Number(spent).toLocaleString("en-IN")}
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">
              Budget
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-700">
              ₹{Number(amount).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${statusDetails.progress}`}
            style={{
              width: `${progressWidth}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">
            {percentageUsed}% used
          </span>

          <span
            className={
              remaining < 0
                ? "font-medium text-red-600"
                : "font-medium text-gray-600"
            }
          >
            {remaining >= 0
              ? `₹${Number(remaining).toLocaleString("en-IN")} remaining`
              : `₹${Math.abs(
                  Number(remaining)
                ).toLocaleString("en-IN")} over`}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => onEdit(budget)}
          className="flex-1 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(budget._id)}
          className="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BudgetCard;