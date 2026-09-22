import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function ExpenseChart({ transactions = [] }) {
  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const categoryTotals = {};

  expenses.forEach((transaction) => {
    const category = transaction.category || "Other";

    categoryTotals[category] =
      (categoryTotals[category] || 0) +
      Number(transaction.amount || 0);
  });

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const colors = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#d97706",
    "#7c3aed",
    "#0891b2",
    "#db2777",
    "#64748b",
  ];

  return (
    <div className="finance-card p-5 sm:p-6">

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Spending
        </p>

        <h2 className="mt-1 text-lg font-bold text-gray-900">
          Expense Breakdown
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          See where your money is going.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex min-h-[280px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
              ₹
            </div>

            <p className="mt-3 text-sm font-medium text-slate-600">
              No expense data
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Add some expenses to see the breakdown.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid items-center gap-6 md:grid-cols-2">

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>

                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={3}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={colors[index % colors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(value).toLocaleString("en-IN")}`
                  }
                />

              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">

            {data.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-3"
              >

                <div className="flex min-w-0 items-center gap-2">

                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        colors[index % colors.length],
                    }}
                  />

                  <span className="truncate text-sm text-slate-600">
                    {item.name}
                  </span>

                </div>

                <span className="shrink-0 text-sm font-semibold text-gray-900">
                  ₹{item.value.toLocaleString("en-IN")}
                </span>

              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  );
}

export default ExpenseChart;