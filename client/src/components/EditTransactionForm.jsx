import { useEffect, useState } from "react";
import API from "../api";

function EditTransactionForm({ transaction, onUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description || "",
        date: new Date(transaction.date).toISOString().split("T")[0],
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.put(
        `/transactions/${transaction._id}`,
        {
          ...formData,
          amount: Number(formData.amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onUpdated(response.data.transaction);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update transaction."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finance-card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Transaction
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Update transaction details.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-700 text-xl"
        >
          ×
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Type
          </label>

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="finance-input"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Amount
          </label>

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="finance-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Category
          </label>

          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="finance-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>

          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="finance-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Date
          </label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="finance-input"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="finance-button flex-1"
          >
            {loading ? "Updating..." : "Update"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="finance-secondary-button flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTransactionForm;