function SavingsGoalCard({
  goal,
  onAddSavings,
  onEdit,
  onDelete,
}) {
  const formattedTarget = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(goal.targetAmount);

  const formattedCurrent = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(goal.currentAmount);

  const formattedRemaining = new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }
  ).format(goal.remainingAmount);

  const formattedTargetDate = goal.targetDate
    ? new Date(goal.targetDate).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "No target date";

  return (
    <div className="finance-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {goal.name}
          </h3>

          {goal.description && (
            <p className="mt-1 text-sm text-gray-500">
              {goal.description}
            </p>
          )}
        </div>

        {goal.completed && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            Completed
          </span>
        )}
      </div>

      {/* Amount */}
      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-400">
            Saved
          </p>

          <p className="mt-1 text-2xl font-bold text-gray-800">
            {formattedCurrent}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400">
            Target
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-700">
            {formattedTarget}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">
            Progress
          </span>

          <span className="text-sm font-semibold text-blue-600">
            {goal.percentage}%
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              goal.completed
                ? "bg-green-500"
                : "bg-blue-600"
            }`}
            style={{
              width: `${goal.percentage}%`,
            }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
        <div>
          <p className="text-xs text-gray-400">
            Remaining
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-700">
            {formattedRemaining}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">
            Target Date
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-700">
            {formattedTargetDate}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        {!goal.completed && (
          <button
            onClick={() => onAddSavings(goal)}
            className="finance-button"
          >
            + Add Savings
          </button>
        )}

        <button
          onClick={() => onEdit(goal)}
          className="finance-secondary-button"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(goal._id)}
          className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default SavingsGoalCard;