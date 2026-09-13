import { useEffect, useState } from "react";
import api from "../api";

function FinancialHealthScore() {
  const currentDate = new Date();

  const [month, setMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [year, setYear] = useState(
    currentDate.getFullYear()
  );

  const [data, setData] = useState({
    score: 0,
    rating: "No data",
    summary: {
      totalIncome: 0,
      totalExpense: 0,
      savings: 0,
      savingsRate: 0,
    },
    factors: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchHealthScore = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/health-score?month=${month}&year=${year}`
      );

      setData(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load financial health score."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthScore();
  }, [month, year]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRatingStyle = (rating) => {
    if (rating === "Excellent") {
      return "text-green-600";
    }

    if (rating === "Good") {
      return "text-blue-600";
    }

    if (rating === "Fair") {
      return "text-amber-600";
    }

    return "text-red-600";
  };

  const getProgressStyle = (percentage) => {
    if (percentage >= 80) {
      return "bg-green-500";
    }

    if (percentage >= 60) {
      return "bg-blue-500";
    }

    if (percentage >= 40) {
      return "bg-amber-500";
    }

    return "bg-red-500";
  };

  return (
    <div className="finance-card p-5 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Financial Health Score
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            See how healthy your finances are this month.
          </p>
        </div>

        {/* Month / Year */}
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
              { length: 5 },
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
          Calculating your financial health...
        </div>
      ) : (
        <>
          {/* Score */}
          <div className="mt-8 flex flex-col items-center">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-gray-100">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-800">
                  {data.score}
                </p>

                <p className="text-sm text-gray-400">
                  / 100
                </p>
              </div>
            </div>

            <h3
              className={`mt-4 text-xl font-bold ${getRatingStyle(
                data.rating
              )}`}
            >
              {data.rating}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Financial health rating
            </p>
          </div>

          {/* Summary */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

              <p className="mt-2 text-xl font-bold text-blue-600">
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

          {/* Score Factors */}
          {data.factors.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
                Score Breakdown
              </h3>

              <div className="space-y-5">
                {data.factors.map((factor) => {
                  const percentage =
                    factor.maxScore > 0
                      ? (factor.score /
                          factor.maxScore) *
                        100
                      : 0;

                  return (
                    <div key={factor.name}>
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {factor.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {factor.value}
                          </p>
                        </div>

                        <span className="text-sm font-semibold text-gray-700">
                          {factor.score}/
                          {factor.maxScore}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${getProgressStyle(
                            percentage
                          )}`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No data */}
          {data.score === 0 &&
            data.factors.length === 0 && (
              <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6 text-center">
                <p className="font-medium text-gray-700">
                  Not enough financial data
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Add income and expense transactions
                  to calculate your health score.
                </p>
              </div>
            )}
        </>
      )}
    </div>
  );
}

export default FinancialHealthScore;