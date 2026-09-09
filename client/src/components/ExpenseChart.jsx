import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ExpenseChart({ transactions }) {
  const expenseData = {};

  transactions.forEach((transaction) => {
    if (transaction.type === "expense") {
      if (!expenseData[transaction.category]) {
        expenseData[transaction.category] = 0;
      }

      expenseData[transaction.category] += Number(
        transaction.amount
      );
    }
  });

  const chartData = Object.entries(expenseData).map(
    ([category, amount]) => ({
      name: category,
      value: amount,
    })
  );

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">
          Expenses by Category
        </h2>

        <p className="text-gray-500 text-center py-10">
          No expense data available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">

      <h2 className="text-xl font-bold mb-4">
        Expenses by Category
      </h2>

      <div className="w-full h-80">

        <ResponsiveContainer width="100%" height="100%">

          <PieChart>

            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >

              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default ExpenseChart;