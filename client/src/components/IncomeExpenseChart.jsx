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

function IncomeExpenseChart({
  totalIncome,
  totalExpenses,
}) {
  const data = [
    {
      name: "Finance",
      Income: totalIncome,
      Expenses: totalExpenses,
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">

      <h2 className="text-xl font-bold mb-4">
        Income vs Expenses
      </h2>

      <div className="w-full h-80">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="Income"
              fill="#22c55e"
            />

            <Bar
              dataKey="Expenses"
              fill="#ef4444"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}

export default IncomeExpenseChart;