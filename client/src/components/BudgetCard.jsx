function BudgetCard({ budget, onEdit, onDelete }) {
  const percentage = Math.round(
    Number(budget.percentageUsed || 0)
  );

  const spent = Number(budget.spent || 0);
  const amount = Number(budget.amount || 0);
  const remaining = Number(
    budget.remaining ?? amount - spent
  );

  const getStatus = () => {
    if (percentage >= 100) {
      return {
        label: "Exceeded",
        badge: "finance-badge-danger",
        progress: "bg-red-500",
      };
    }

    if (percentage >= 75) {
      return {
        label: "Near limit",
        badge: "finance-badge-warning",
        progress: "bg-amber-500",
      };
    }

    return {
      label: "On track",
      badge: "finance-badge-success",
      progress: "bg-green-500",
    };
  };

  const status = getStatus();

  return (
    <div className="finance-card p-5">

      {/* Header */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
            ₹
          </div>

          <div className="min-w-0">

            <h3 className="truncate text-sm font-semibold text-gray-900">
              {budget.category}
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Monthly budget
            </p>

          </div>

        </div>

        <span
          className={`finance-badge ${status.badge}`}
        >
          {status.label}
        </span>

      </div>

      {/* Amounts */}

      <div className="mt-6 grid grid-cols-3 gap-3">

        <div>
          <p className="text-xs text-slate-400">
            Budget
          </p>

          <p className="mt-1 text-sm font-bold text-gray-900">
            ₹{amount.toLocaleString("en-IN")}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Spent
          </p>

          <p className="mt-1 text-sm font-bold text-red-600">
            ₹{spent.toLocaleString("en-IN")}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Remaining
          </p>

          <p
            className={`mt-1 text-sm font-bold ${
              remaining >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            ₹{Math.abs(remaining).toLocaleString("en-IN")}
          </p>
        </div>

      </div>

      {/* Progress */}

      <div className="mt-5">

        <div className="mb-2 flex items-center justify-between">

          <span className="text-xs font-medium text-slate-500">
            Budget used
          </span>

          <span className="text-xs font-bold text-gray-700">
            {percentage}%
          </span>

        </div>

        <div className="finance-progress">

          <div
            className={`finance-progress-bar ${status.progress}`}
            style={{
              width: `${Math.min(
                percentage,
                100
              )}%`,
            }}
          />

        </div>

      </div>

      {/* Actions */}

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

export default BudgetCard;