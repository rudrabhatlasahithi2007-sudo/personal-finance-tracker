import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function IncomeExpenseChart({ transactions = [] }) {
  const monthlyData = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const month = date.toLocaleString("en-IN", {
      month: "short",
    });

    if (!monthlyData[month]) {
      monthlyData[month] = {
        month,
        income: 0,
        expense: 0,
        monthIndex: date.getMonth(),
      };
    }

    if (transaction.type === "income") {
      monthlyData[month].income += Number(
        transaction.amount || 0
      );
    } else if (transaction.type === "expense") {
      monthlyData[month].expense += Number(
        transaction.amount || 0
      );
    }
  });

  const data = Object.values(monthlyData)
    .sort((a, b) => a.monthIndex - b.monthIndex)
    .map(({ month, income, expense }) => ({
      month,
      income,
      expense,
    }));

  return (
    <div className="finance-card p-5 sm:p-6">

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Cash Flow
        </p>

        <h2 className="mt-1 text-lg font-bold text-gray-900">
          Income vs Expenses
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Compare your income and spending activity.
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
              ↔
            </div>

            <p className="mt-3 text-sm font-medium text-slate-600">
              No transaction data
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Add transactions to view your cash flow.
            </p>

          </div>
        </div>
      ) : (
        <div className="h-[320px] w-full">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
              barGap={8}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#64748b",
                  fontSize: 12,
                }}
                tickFormatter={(value) =>
                  `₹${value >= 1000 ? `${value / 1000}k` : value}`
                }
              />

              <Tooltip
                cursor={{
                  fill: "#f8fafc",
                }}
                formatter={(value, name) => [
                  `₹${Number(value).toLocaleString("en-IN")}`,
                  name === "income"
                    ? "Income"
                    : "Expenses",
                ]}
              />

              <Bar
                dataKey="income"
                name="income"
                fill="#16a34a"
                radius={[5, 5, 0, 0]}
                maxBarSize={35}
              />

              <Bar
                dataKey="expense"
                name="expense"
                fill="#dc2626"
                radius={[5, 5, 0, 0]}
                maxBarSize={35}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>
      )}

      {data.length > 0 && (
        <div className="mt-4 flex justify-center gap-6 border-t border-slate-100 pt-4">

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
            <span className="text-xs font-medium text-slate-500">
              Income
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
            <span className="text-xs font-medium text-slate-500">
              Expenses
            </span>
          </div>

        </div>
      )}

    </div>
  );
}

export default IncomeExpenseChart;