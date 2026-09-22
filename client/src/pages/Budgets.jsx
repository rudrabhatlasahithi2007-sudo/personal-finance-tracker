import { useEffect, useState } from "react";
import BudgetForm from "../components/BudgetForm";
import BudgetCard from "../components/BudgetCard";
import api from "../api";

function Budgets() {
  const currentDate = new Date();

  const [month, setMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [year, setYear] = useState(
    currentDate.getFullYear()
  );

  const [budgets, setBudgets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingBudget, setEditingBudget] =
    useState(null);

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

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/budgets?month=${month}&year=${year}`
      );

      setBudgets(
        Array.isArray(response.data)
          ? response.data
          : response.data.budgets || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load budgets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this budget?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/budgets/${id}`
      );

      fetchBudgets();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete budget."
      );
    }
  };

  const totalBudget = budgets.reduce(
    (sum, item) =>
      sum + Number(item.amount || 0),
    0
  );

  const totalSpent = budgets.reduce(
    (sum, item) =>
      sum + Number(item.spent || 0),
    0
  );

  const totalRemaining =
    totalBudget - totalSpent;

  return (
    <div className="page-enter min-h-screen bg-[#f8fafc]">

      <div className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Spending Control
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              Monthly Budgets
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Set spending limits and monitor your progress.
            </p>

          </div>

          <button
            onClick={() => {
              setEditingBudget(null);
              setShowForm(true);
            }}
            className="finance-button"
          >
            + Create Budget
          </button>

        </div>

        {/* PERIOD */}

        <div className="finance-card mb-6 p-4">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Selected Month
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {months[month - 1]} {year}
              </p>

            </div>

            <div className="flex gap-2">

              <select
                value={month}
                onChange={(e) =>
                  setMonth(
                    Number(e.target.value)
                  )
                }
                className="finance-input min-w-[140px]"
              >
                {months.map(
                  (item, index) => (
                    <option
                      key={item}
                      value={index + 1}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

              <select
                value={year}
                onChange={(e) =>
                  setYear(
                    Number(e.target.value)
                  )
                }
                className="finance-input w-[110px]"
              >
                {[2025, 2026, 2027, 2028].map(
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

        {/* FORM */}

        {showForm && (

          <div className="finance-card mb-6 p-6">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-base font-semibold text-gray-900">
                  {editingBudget
                    ? "Edit Budget"
                    : "Create Budget"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Define a spending limit for a category.
                </p>

              </div>

              <button
                onClick={() =>
                  setShowForm(false)
                }
                className="text-xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            <BudgetForm
              editingBudget={editingBudget}
              onBudgetCreated={() => {
                setShowForm(false);
                fetchBudgets();
              }}
              onBudgetUpdated={() => {
                setShowForm(false);
                setEditingBudget(null);
                fetchBudgets();
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingBudget(null);
              }}
            />

          </div>

        )}

        {/* ERROR */}

        {error && (

          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>

        )}

        {/* SUMMARY */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          <div className="finance-card p-5">

            <p className="text-sm text-slate-500">
              Total Budget
            </p>

            <p className="finance-number mt-2 text-2xl text-blue-600">
              ₹{totalBudget.toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

          <div className="finance-card p-5">

            <p className="text-sm text-slate-500">
              Total Spent
            </p>

            <p className="finance-number mt-2 text-2xl text-red-600">
              ₹{totalSpent.toLocaleString(
                "en-IN"
              )}
            </p>

          </div>

          <div className="finance-card p-5">

            <p className="text-sm text-slate-500">
              Remaining
            </p>

            <p
              className={`finance-number mt-2 text-2xl ${
                totalRemaining >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              ₹{Math.abs(
                totalRemaining
              ).toLocaleString("en-IN")}
            </p>

          </div>

        </div>

        {/* BUDGETS */}

        {loading ? (

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white"
                />
              )
            )}

          </div>

        ) : budgets.length === 0 ? (

          <div className="finance-card px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
              ₹
            </div>

            <h2 className="mt-4 text-base font-semibold text-gray-900">
              No budgets yet
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Create a monthly budget to start monitoring your spending.
            </p>

            <button
              onClick={() =>
                setShowForm(true)
              }
              className="finance-button mt-5"
            >
              Create Your First Budget
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {budgets.map((budget) => (

              <BudgetCard
                key={budget._id}
                budget={budget}
                onEdit={() => {
                  setEditingBudget(
                    budget
                  );
                  setShowForm(true);
                }}
                onDelete={() =>
                  handleDelete(
                    budget._id
                  )
                }
              />

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default Budgets;