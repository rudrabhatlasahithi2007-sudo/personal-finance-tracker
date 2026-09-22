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

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const months = [
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
  ];

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/insights?month=${month}&year=${year}`
      );

      setData(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to load financial insights."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [month, year]);

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const getInsightStyle = (type) => {
    if (type === "positive") {
      return {
        box: "border-green-100 bg-green-50",
        icon: "bg-green-100 text-green-600",
        title: "text-green-800",
        symbol: "✓",
      };
    }

    if (type === "warning") {
      return {
        box: "border-amber-100 bg-amber-50",
        icon: "bg-amber-100 text-amber-600",
        title: "text-amber-800",
        symbol: "!",
      };
    }

    return {
      box: "border-blue-100 bg-blue-50",
      icon: "bg-blue-100 text-blue-600",
      title: "text-blue-800",
      symbol: "i",
    };
  };

  return (
    <div className="space-y-6">

      {/* Controls */}

      <div className="finance-card p-4">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Analysis Period
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
              {months[month - 1]} {year}
            </p>
          </div>

          <div className="flex gap-2">

            <select
              value={month}
              onChange={(e) =>
                setMonth(Number(e.target.value))
              }
              className="finance-input min-w-[140px]"
            >
              {months.map((item, index) => (
                <option
                  key={item}
                  value={index + 1}
                >
                  {item}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) =>
                setYear(Number(e.target.value))
              }
              className="finance-input w-[110px]"
            >
              {[year - 2, year - 1, year, year + 1].map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

          </div>

        </div>

      </div>

      {/* Loading */}

      {loading && (

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}

        </div>

      )}

      {/* Error */}

      {!loading && error && (

        <div className="rounded-2xl border border-red-100 bg-red-50 p-5">

          <p className="text-sm font-semibold text-red-700">
            Unable to load insights
          </p>

          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>

        </div>

      )}

      {/* Data */}

      {!loading && !error && data && (

        <>
          {/* Summary */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="finance-card p-5">
              <p className="text-sm text-slate-500">
                Total Income
              </p>

              <p className="finance-number mt-2 text-2xl text-green-600">
                {formatAmount(
                  data.summary?.totalIncome
                )}
              </p>
            </div>

            <div className="finance-card p-5">
              <p className="text-sm text-slate-500">
                Total Expenses
              </p>

              <p className="finance-number mt-2 text-2xl text-red-600">
                {formatAmount(
                  data.summary?.totalExpense
                )}
              </p>
            </div>

            <div className="finance-card p-5">
              <p className="text-sm text-slate-500">
                Savings
              </p>

              <p
                className={`finance-number mt-2 text-2xl ${
                  Number(
                    data.summary?.savings
                  ) >= 0
                    ? "text-blue-600"
                    : "text-red-600"
                }`}
              >
                {formatAmount(
                  data.summary?.savings
                )}
              </p>
            </div>

            <div className="finance-card p-5">
              <p className="text-sm text-slate-500">
                Savings Rate
              </p>

              <p className="finance-number mt-2 text-2xl text-blue-600">
                {data.summary?.savingsRate || 0}%
              </p>
            </div>

          </div>

          {/* Top Category */}

          {data.summary?.topCategory && (

            <div className="finance-card p-5">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  !
                </div>

                <div className="flex-1">

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Highest Spending Category
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-3">

                    <h3 className="font-semibold text-gray-900">
                      {data.summary.topCategory.category}
                    </h3>

                    <span className="finance-badge finance-badge-warning">
                      {formatAmount(
                        data.summary.topCategory
                          .amount
                      )}
                    </span>

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* Insights */}

          <div>

            <div className="mb-4">

              <h2 className="text-base font-semibold text-gray-900">
                Financial Observations
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Automatically generated from your transactions.
              </p>

            </div>

            {data.insights?.length === 0 ? (

              <div className="finance-card px-5 py-14 text-center">

                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  i
                </div>

                <h3 className="text-sm font-semibold text-gray-900">
                  Not enough data
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add more transactions to generate useful insights.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {data.insights.map(
                  (insight, index) => {

                    const style =
                      getInsightStyle(
                        insight.type
                      );

                    return (
                      <div
                        key={index}
                        className={`rounded-2xl border p-5 ${style.box}`}
                      >

                        <div className="flex gap-4">

                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold ${style.icon}`}
                          >
                            {style.symbol}
                          </div>

                          <div>

                            <h3
                              className={`text-sm font-semibold ${style.title}`}
                            >
                              {insight.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
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