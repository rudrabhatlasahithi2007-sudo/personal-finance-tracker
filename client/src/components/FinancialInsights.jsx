import { useEffect, useState } from "react";
import api from "../api";

function FinancialInsights() {
  const currentDate = new Date();

  const [month, setMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [year, setYear] = useState(
    currentDate.getFullYear()
  );

  const [data, setData] = useState({
    summary: {
      totalIncome: 0,
      totalExpense: 0,
      savings: 0,
      savingsRate: 0,
      topCategory: null,
    },
    insights: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/insights?month=${month}&year=${year}`
      );

      setData(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load financial insights."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [month, year]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInsightStyle = (type) => {
    if (type === "positive") {
      return {
        container:
          "border-green-200 bg-green-50",
        icon: "✓",
        iconStyle:
          "bg-green-100 text-green-700",
        titleStyle: "text-green-800",
        messageStyle: "text-green-700",
      };
    }

    if (type === "warning") {
      return {
        container:
          "border-amber-200 bg-amber-50",
        icon: "!",
        iconStyle:
          "bg-amber-100 text-amber-700",
        titleStyle: "text-amber-800",
        messageStyle: "text-amber-700",
      };
    }

    return {
      container:
        "border-blue-200 bg-blue-50",
      icon: "i",
      iconStyle:
        "bg-blue-100 text-blue-700",
      titleStyle: "text-blue-800",
      messageStyle: "text-blue-700",
    };
  };

  return (
    <div className="finance-card p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Financial Insights
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Understand your spending and saving patterns.
          </p>
        </div>

        {/* Month and year */}
        <div className="flex gap-2">
          <select
            value={month}
            onChange={(e) =>
              setMonth(Number(e.target.value))
            }
            className="finance-input w-auto"
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((name, index) => (
              <option
                key={index + 1}
                value={index + 1}
              >
                {name}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) =>
              setYear(Number(e.target.value))
            }
            className="finance-input w-auto"
          >
            {Array.from(
              {
                length: 5,
              },
              (_, index) =>
                currentDate.getFullYear() -
                2 +
                index
            ).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-10 text-center text-sm text-gray-500">
          Analyzing your finances...
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Income
              </p>

              <p className="mt-2 text-xl font-bold text-green-600">
                {formatCurrency(
                  data.summary.totalIncome
                )}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Expenses
              </p>

              <p className="mt-2 text-xl font-bold text-red-600">
                {formatCurrency(
                  data.summary.totalExpense
                )}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Savings
              </p>

              <p
                className={`mt-2 text-xl font-bold ${
                  data.summary.savings >= 0
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                {formatCurrency(
                  data.summary.savings
                )}
              </p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-sm text-gray-500">
                Savings Rate
              </p>

              <p className="mt-2 text-xl font-bold text-blue-600">
                {data.summary.savingsRate}%
              </p>
            </div>
          </div>

          {/* Top category */}
          {data.summary.topCategory && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">
                Highest Spending Category
              </p>

              <div className="mt-2 flex items-center justify-between gap-4">
                <p className="font-semibold text-gray-800">
                  {data.summary.topCategory.category}
                </p>

                <p className="font-bold text-gray-800">
                  {formatCurrency(
                    data.summary.topCategory.amount
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Insights */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              What your finances tell you
            </h3>

            {data.insights.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-center">
                <p className="font-medium text-gray-700">
                  Not enough data yet
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Add some transactions to generate
                  financial insights.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.insights.map(
                  (insight, index) => {
                    const style =
                      getInsightStyle(
                        insight.type
                      );

                    return (
                      <div
                        key={index}
                        className={`rounded-xl border p-4 ${style.container}`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${style.iconStyle}`}
                          >
                            {style.icon}
                          </div>

                          <div>
                            <h4
                              className={`font-semibold ${style.titleStyle}`}
                            >
                              {insight.title}
                            </h4>

                            <p
                              className={`mt-1 text-sm ${style.messageStyle}`}
                            >
                              {insight.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default FinancialInsights;