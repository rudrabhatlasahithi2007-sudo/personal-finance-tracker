function GoalCard({
  goal,
  onEdit,
  onDelete,
}) {
  const target = Number(
    goal.targetAmount || 0
  );

  const current = Number(
    goal.currentAmount || 0
  );

  const percentage =
    target > 0
      ? Math.min(
          Math.round((current / target) * 100),
          100
        )
      : 0;

  const remaining = Math.max(
    target - current,
    0
  );

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;

  const formatDate = (date) => {
    if (!date) return "No deadline";

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
    <div className="finance-card p-5">

      {/* HEADER */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
            ◎
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              {goal.name}
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              {goal.deadline
                ? `Target: ${formatDate(
                    goal.deadline
                  )}`
                : "Savings goal"}
            </p>
          </div>

        </div>

        <span className="finance-badge finance-badge-info">
          {percentage}%
        </span>

      </div>

      {/* AMOUNTS */}

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div>
          <p className="text-xs text-slate-400">
            Saved
          </p>

          <p className="mt-1 text-lg font-bold text-green-600">
            {formatAmount(current)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-slate-400">
            Target
          </p>

          <p className="mt-1 text-lg font-bold text-gray-900">
            {formatAmount(target)}
          </p>
        </div>

      </div>

      {/* PROGRESS */}

      <div className="mt-5">

        <div className="finance-progress">

          <div
            className="finance-progress-bar bg-blue-500"
            style={{
              width: `${percentage}%`,
            }}
          />

        </div>

        <div className="mt-2 flex justify-between">

          <span className="text-xs text-slate-400">
            {percentage}% completed
          </span>

          <span className="text-xs font-medium text-slate-500">
            {formatAmount(remaining)} left
          </span>

        </div>

      </div>

      {/* DESCRIPTION */}

      {goal.description && (
        <p className="mt-5 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
          {goal.description}
        </p>
      )}

      {/* ACTIONS */}

      <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-4">

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

export default GoalCard;