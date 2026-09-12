import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function IncomeExpenseChart({ transactions }) {
  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const data = [
    {
      name: "Overview",
      Income: income,
      Expenses: expense,
    },
  ];

  return (
    <div className="finance-card p-6 h-full">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Income vs Expenses
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Compare your total money in and money out.
        </p>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

            <XAxis dataKey="name" stroke="#6B7280" />

            <YAxis
              stroke="#6B7280"
              tickFormatter={(value) => `₹${value}`}
            />

            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toLocaleString("en-IN")}`
              }
            />

            <Legend />

            <Bar
              dataKey="Income"
              fill="#16A34A"
              radius={[5, 5, 0, 0]}
            />

            <Bar
              dataKey="Expenses"
              fill="#DC2626"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default IncomeExpenseChart;