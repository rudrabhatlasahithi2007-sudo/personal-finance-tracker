import { useEffect, useState } from "react";
import api from "../api";

function BudgetForm({
  editingBudget,
  onBudgetCreated,
  onBudgetUpdated,
  onCancel,
}) {
  const currentDate = new Date();

  const [form, setForm] = useState({
    category: "Food",
    amount: "",
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other",
  ];

  useEffect(() => {
    if (editingBudget) {
      setForm({
        category: editingBudget.category || "Food",
        amount: editingBudget.amount || "",
        month:
          editingBudget.month ||
          currentDate.getMonth() + 1,
        year:
          editingBudget.year ||
          currentDate.getFullYear(),
      });
    }
  }, [editingBudget]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.amount || Number(form.amount) <= 0) {
      setError("Please enter a valid budget amount.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        category: form.category,
        amount: Number(form.amount),
        month: Number(form.month),
        year: Number(form.year),
      };

      if (editingBudget) {
        await api.put(
          `/budgets/${editingBudget._id}`,
          payload
        );

        if (onBudgetUpdated) {
          onBudgetUpdated();
        }
      } else {
        await api.post("/budgets", payload);

        if (onBudgetCreated) {
          onBudgetCreated();
        }
      }

      setForm({
        category: "Food",
        amount: "",
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save budget."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Category
        </label>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="finance-input"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Monthly Budget
        </label>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
            ₹
          </span>

          <input
            type="number"
            name="amount"
            min="1"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="5000"
            className="finance-input pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Month
          </label>

          <select
            name="month"
            value={form.month}
            onChange={handleChange}
            className="finance-input"
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option
                key={index + 1}
                value={index + 1}
              >
                {new Date(
                  2000,
                  index,
                  1
                ).toLocaleString("en-IN", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Year
          </label>

          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="finance-input"
          >
            {[2025, 2026, 2027, 2028].map(
              (year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {editingBudget && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="finance-secondary-button flex-1"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="finance-button flex-1 disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : editingBudget
            ? "Update Budget"
            : "Create Budget"}
        </button>
      </div>
    </form>
  );
}

export default BudgetForm;