import { useState } from "react";
import api from "../api";

const categories = [
  "Salary",
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

function RecurringTransactionForm({ onCreated }) {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    description: "",
    frequency: "monthly",
    startDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.amount ||
      !formData.category ||
      !formData.frequency ||
      !formData.startDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/recurring-transactions",
        {
          ...formData,
          amount: Number(formData.amount),
        }
      );

      onCreated(response.data.recurringTransaction);

      setFormData({
        type: "expense",
        amount: "",
        category: "Food",
        description: "",
        frequency: "monthly",
        startDate: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create recurring transaction."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finance-card p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Add Recurring Transaction
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Automatically plan repeated income or expenses.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {/* Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Type
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="finance-input"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Amount */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Amount
          </label>

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            min="0"
            step="0.01"
            className="finance-input"
          />
        </div>

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
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Frequency */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Frequency
          </label>

          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="finance-input"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Start Date
          </label>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="finance-input"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Description
          </label>

          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="e.g. Netflix subscription"
            className="finance-input"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="finance-button w-full sm:w-auto"
          >
            {loading
              ? "Adding..."
              : "Add Recurring Transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecurringTransactionForm;