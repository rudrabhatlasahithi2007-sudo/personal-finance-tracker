import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ExpenseChart({ transactions }) {
  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const categoryTotals = {};

  expenses.forEach((transaction) => {
    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = 0;
    }

    categoryTotals[transaction.category] += Number(transaction.amount);
  });

  const data = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  const colors = [
    "#2563EB",
    "#DC2626",
    "#16A34A",
    "#D97706",
    "#7C3AED",
    "#0891B2",
    "#64748B",
    "#DB2777",
  ];

  return (
    <div className="finance-card p-6 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Spending by Category
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          See where your money is going.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="h-72 flex items-center justify-center text-sm text-gray-500">
          No expense data available.
        </div>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
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

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default ExpenseChart;