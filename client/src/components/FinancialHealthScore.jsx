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

  const fetchHealthScore = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/health-score?month=${month}&year=${year}`
      );

      setData(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load financial health."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthScore();
  }, [month, year]);

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const getRatingStyle = (rating) => {
    switch (rating) {
      case "Excellent":
        return {
          text: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-100",
        };

      case "Good":
        return {
          text: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100",
        };

      case "Fair":
        return {
          text: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-100",
        };

      default:
        return {
          text: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-100",
        };
    }
  };

  const getFactorColor = (percentage) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-amber-500";

    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="space-y-6">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white" />

          <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white lg:col-span-2" />

        </div>

        <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />

      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6">

        <h3 className="font-semibold text-red-700">
          Unable to load financial health
        </h3>

        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>

        <button
          onClick={fetchHealthScore}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Try Again
        </button>

      </div>
    );
  }

  if (!data) return null;

  const score = Number(data.score || 0);

  const ratingStyle = getRatingStyle(
    data.rating
  );

  const factors = data.factors || [];

  return (
    <div className="space-y-6">

      {/* ================= CONTROLS ================= */}

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

      {/* ================= SCORE ================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="finance-card flex flex-col items-center justify-center p-7">

          <p className="text-sm font-semibold text-slate-500">
            Financial Health Score
          </p>

          <div className="relative mt-6 flex h-48 w-48 items-center justify-center rounded-full border-[14px] border-slate-100">

            <div className="text-center">

              <p className="finance-number text-5xl text-gray-900">
                {score}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                out of 100
              </p>

            </div>

          </div>

          <div
            className={`mt-6 rounded-full border px-5 py-2 text-sm font-bold ${ratingStyle.bg} ${ratingStyle.border} ${ratingStyle.text}`}
          >
            {data.rating || "No data"}
          </div>

        </div>

        {/* ================= SUMMARY ================= */}

        <div className="finance-card p-6 lg:col-span-2">

          <div className="mb-5">

            <h2 className="text-base font-semibold text-gray-900">
              Financial Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your financial activity for the selected month.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="rounded-xl bg-green-50 p-4">

              <p className="text-xs font-medium text-green-700">
                Income
              </p>

              <p className="mt-2 text-xl font-bold text-green-700">
                {formatAmount(
                  data.summary?.totalIncome
                )}
              </p>

            </div>

            <div className="rounded-xl bg-red-50 p-4">

              <p className="text-xs font-medium text-red-700">
                Expenses
              </p>

              <p className="mt-2 text-xl font-bold text-red-700">
                {formatAmount(
                  data.summary?.totalExpense
                )}
              </p>

            </div>

            <div className="rounded-xl bg-blue-50 p-4">

              <p className="text-xs font-medium text-blue-700">
                Savings
              </p>

              <p className="mt-2 text-xl font-bold text-blue-700">
                {formatAmount(
                  data.summary?.savings
                )}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs font-medium text-slate-600">
                Savings Rate
              </p>

              <p className="mt-2 text-xl font-bold text-slate-800">
                {data.summary?.savingsRate || 0}%
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* ================= FACTORS ================= */}

      <div className="finance-card p-6">

        <div className="mb-6">

          <h2 className="text-base font-semibold text-gray-900">
            Score Breakdown
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            See how your financial score is calculated.
          </p>

        </div>

        {factors.length === 0 ? (

          <div className="rounded-xl bg-slate-50 px-5 py-12 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-200 text-slate-500">
              i
            </div>

            <h3 className="mt-3 text-sm font-semibold text-gray-900">
              Not enough data
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add income and expense transactions to calculate your score.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {factors.map((factor, index) => {

              const maxScore =
                Number(
                  factor.maxScore ||
                    factor.maximum ||
                    factor.max ||
                    30
                );

              const factorScore =
                Number(factor.score || 0);

              const percentage =
                maxScore > 0
                  ? Math.round(
                      (factorScore /
                        maxScore) *
                        100
                    )
                  : 0;

              return (
                <div key={index}>

                  <div className="mb-2 flex items-center justify-between">

                    <div>

                      <p className="text-sm font-semibold text-gray-800">
                        {factor.name ||
                          factor.title}
                      </p>

                      {factor.description && (
                        <p className="mt-1 text-xs text-slate-400">
                          {factor.description}
                        </p>
                      )}

                    </div>

                    <span className="text-sm font-bold text-gray-700">
                      {factorScore}/{maxScore}
                    </span>

                  </div>

                  <div className="finance-progress">

                    <div
                      className={`finance-progress-bar ${getFactorColor(
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

        )}

      </div>

    </div>
  );
}

export default FinancialHealthScore;