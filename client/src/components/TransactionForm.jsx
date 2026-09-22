import { useState } from "react";
import api from "../api";

function TransactionForm({ onTransactionAdded, onSuccess }) {
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "Food",
    description: "",
    date: new Date()
      .toISOString()
      .split("T")[0],
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
    "Salary",
    "Other",
  ];

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
      setError(
        "Please enter a valid amount."
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/transactions", {
        ...form,
        amount: Number(form.amount),
      });

      setForm({
        type: "expense",
        amount: "",
        category: "Food",
        description: "",
        date: new Date()
          .toISOString()
          .split("T")[0],
      });

      if (onTransactionAdded) {
        onTransactionAdded();
      }

      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to add transaction."
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

      {/* TYPE */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Transaction Type
        </label>

        <div className="grid grid-cols-2 gap-3">

          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                type: "expense",
              })
            }
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              form.type === "expense"
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            ↘ Expense
          </button>

          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                type: "income",
              })
            }
            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
              form.type === "income"
                ? "border-green-200 bg-green-50 text-green-600"
                : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            ↗ Income
          </button>

        </div>

      </div>

      {/* AMOUNT */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Amount
        </label>

        <div className="relative">

          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
            ₹
          </span>

          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            placeholder="0.00"
            className="finance-input pl-8 text-lg font-semibold"
          />

        </div>

      </div>

      {/* CATEGORY */}

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
            <option
              key={category}
              value={category}
            >
              {category}
            </option>
          ))}
        </select>

      </div>

      {/* DESCRIPTION */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          placeholder="Add a note about this transaction..."
          className="finance-input resize-none"
        />

      </div>

      {/* DATE */}

      <div>

        <label className="mb-2 block text-sm font-medium text-gray-700">
          Date
        </label>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="finance-input"
        />

      </div>

      {/* ERROR */}

      {error && (

        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>

      )}

      {/* BUTTON */}

      <button
        type="submit"
        disabled={loading}
        className="finance-button w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Saving..."
          : "Add Transaction"}
      </button>

    </form>
  );
}

export default TransactionForm;