import { useState } from "react";
import API from "../api";

function TransactionForm({ onTransactionAdded }) {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.category || !formData.date) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.post(
        "/transactions",
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

      onTransactionAdded(response.data.transaction);

      setFormData({
        type: "expense",
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to add transaction."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finance-card p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Add Transaction
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Record your income or expense.
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Type
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, type: "income" })
              }
              className={`py-2.5 rounded-lg border text-sm font-medium transition ${
                formData.type === "income"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Income
            </button>

            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, type: "expense" })
              }
              className={`py-2.5 rounded-lg border text-sm font-medium transition ${
                formData.type === "expense"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Expense
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="finance-input"
          >
            <option value="">Select category</option>

            {formData.type === "expense" ? (
              <>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </>
            ) : (
              <>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Business">Business</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </>
            )}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>

          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional description"
            className="finance-input"
          />
        </div>

        {/* Date */}
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

        <button
          type="submit"
          disabled={loading}
          className="finance-button w-full"
        >
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
}

export default TransactionForm;