import { useEffect, useState } from "react";
import API from "../api";

import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import BudgetForm from "../components/BudgetForm";
import BudgetCard from "../components/BudgetCard";

function Budgets() {
  const currentDate = new Date();

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [selectedYear, setSelectedYear] = useState(
    currentDate.getFullYear()
  );

  const [editingBudget, setEditingBudget] = useState(null);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.get(
        `/budgets?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBudgets(response.data.budgets || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load budgets."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, [selectedMonth, selectedYear]);

  const handleBudgetAdded = (newBudget) => {
    // If the newly created budget belongs to
    // the currently selected month/year,
    // refresh the list so spent/status values are included.
    if (
      Number(newBudget.month) === Number(selectedMonth) &&
      Number(newBudget.year) === Number(selectedYear)
    ) {
      fetchBudgets();
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingBudget) return;

    try {
      setError("");

      const token = localStorage.getItem("token");

      await API.put(
        `/budgets/${editingBudget._id}`,
        {
          category: editingBudget.category,
          amount: Number(editingBudget.amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingBudget(null);

      fetchBudgets();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update budget."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

      const token = localStorage.getItem("token");

      await API.delete(`/budgets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBudgets((prev) =>
        prev.filter((budget) => budget._id !== id)
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete budget."
      );
    }
  };

  const totalBudget = budgets.reduce(
    (total, budget) => total + Number(budget.amount),
    0
  );

  const totalSpent = budgets.reduce(
    (total, budget) => total + Number(budget.spent),
    0
  );

  const totalRemaining = totalBudget - totalSpent;

  const overallPercentage =
    totalBudget > 0
      ? Math.round((totalSpent / totalBudget) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar />
      <MobileNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Monthly Budgets
            </h1>

            <p className="mt-1 text-gray-500">
              Set spending limits and keep your expenses under control.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Month Selector */}
          <div className="finance-card p-5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Budget Period
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Select the month you want to manage.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedMonth}
                  onChange={(e) =>
                    setSelectedMonth(Number(e.target.value))
                  }
                  className="finance-input sm:w-40"
                >
                  {months.map((month) => (
                    <option
                      key={month.value}
                      value={month.value}
                    >
                      {month.label}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedYear}
                  onChange={(e) =>
                    setSelectedYear(Number(e.target.value))
                  }
                  className="finance-input sm:w-32"
                >
                  {Array.from(
                    { length: 5 },
                    (_, index) =>
                      currentDate.getFullYear() - 2 + index
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Summary */}
          {!loading && budgets.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
              <div className="finance-card p-5">
                <p className="text-sm text-gray-500">
                  Total Budget
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  ₹{totalBudget.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="finance-card p-5">
                <p className="text-sm text-gray-500">
                  Total Spent
                </p>

                <p className="mt-2 text-2xl font-bold text-red-600">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </p>
              </div>

              <div className="finance-card p-5">
                <p className="text-sm text-gray-500">
                  Remaining
                </p>

                <p
                  className={`mt-2 text-2xl font-bold ${
                    totalRemaining >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {totalRemaining >= 0 ? "" : "-"}₹
                  {Math.abs(totalRemaining).toLocaleString("en-IN")}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {overallPercentage}% of budget used
                </p>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Budget Form / Edit Form */}
            <div className="xl:col-span-1">
              {editingBudget ? (
                <div className="finance-card p-6">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Edit Budget
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        Update your monthly limit.
                      </p>
                    </div>

                    <button
                      onClick={() => setEditingBudget(null)}
                      className="text-xl text-gray-400 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>

                  <form
                    onSubmit={handleUpdate}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Category
                      </label>

                      <input
                        type="text"
                        value={editingBudget.category}
                        onChange={(e) =>
                          setEditingBudget({
                            ...editingBudget,
                            category: e.target.value,
                          })
                        }
                        className="finance-input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Monthly limit
                      </label>

                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          ₹
                        </span>

                        <input
                          type="number"
                          value={editingBudget.amount}
                          onChange={(e) =>
                            setEditingBudget({
                              ...editingBudget,
                              amount: e.target.value,
                            })
                          }
                          min="1"
                          step="0.01"
                          className="finance-input pl-8"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="finance-button flex-1"
                      >
                        Save Changes
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingBudget(null)
                        }
                        className="finance-secondary-button flex-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <BudgetForm
                  onBudgetAdded={handleBudgetAdded}
                />
              )}
            </div>

            {/* Budget Cards */}
            <div className="xl:col-span-2">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {months.find(
                    (month) =>
                      month.value === Number(selectedMonth)
                  )?.label}{" "}
                  {selectedYear} Budgets
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Track your spending against each category.
                </p>
              </div>

              {loading ? (
                <div className="finance-card p-10 text-center text-gray-500">
                  Loading budgets...
                </div>
              ) : budgets.length === 0 ? (
                <div className="finance-card p-10 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-semibold">
                    ₹
                  </div>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    No budgets for this month
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Create a budget to start tracking your
                    spending.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {budgets.map((budget) => (
                    <BudgetCard
                      key={budget._id}
                      budget={budget}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Budgets;