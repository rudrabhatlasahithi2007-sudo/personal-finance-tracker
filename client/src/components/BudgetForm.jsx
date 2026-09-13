import { useState } from "react";
import API from "../api";

function BudgetForm({ onBudgetAdded }) {
  const currentDate = new Date();

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const expenseCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other",
  ];

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Budget amount must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await API.post(
        "/budgets",
        {
          category: formData.category,
          amount: Number(formData.amount),
          month: Number(formData.month),
          year: Number(formData.year),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onBudgetAdded(response.data.budget);

      setFormData({
        category: "",
        amount: "",
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create budget."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finance-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Set Monthly Budget
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Set a spending limit for an expense category.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="finance-input"
          >
            <option value="">Select category</option>

            {expenseCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Monthly limit
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              ₹
            </span>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="5000"
              min="1"
              step="0.01"
              className="finance-input pl-8"
            />
          </div>
        </div>

        {/* Month */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Month
          </label>

          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            className="finance-input"
          >
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Year
          </label>

          <input
            type="number"
            name="year"
            value={formData.year}
            onChange={handleChange}
            min="2000"
            className="finance-input"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="finance-button w-full"
        >
          {loading ? "Creating..." : "Create Budget"}
        </button>
      </form>
    </div>
  );
}

export default BudgetForm;