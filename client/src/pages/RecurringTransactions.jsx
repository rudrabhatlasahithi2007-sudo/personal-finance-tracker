import { useEffect, useState } from "react";
import api from "../api";

import RecurringTransactionForm from "../components/RecurringTransactionForm";
import RecurringTransactionCard from "../components/RecurringTransactionCard";

function RecurringTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingTransaction, setEditingTransaction] =
    useState(null);

  const fetchRecurringTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/recurring-transactions"
      );

      setTransactions(
        response.data.recurringTransactions
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load recurring transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringTransactions();
  }, []);

  const handleCreated = (newTransaction) => {
    setTransactions((current) => [
      newTransaction,
      ...current,
    ]);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recurring transaction?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/recurring-transactions/${id}`
      );

      setTransactions((current) =>
        current.filter(
          (transaction) => transaction._id !== id
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete recurring transaction."
      );
    }
  };

  const handleToggle = async (transaction) => {
    try {
      const response = await api.put(
        `/recurring-transactions/${transaction._id}`,
        {
          active: !transaction.active,
        }
      );

      setTransactions((current) =>
        current.map((item) =>
          item._id === transaction._id
            ? response.data.recurringTransaction
            : item
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update recurring transaction."
      );
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingTransaction) {
      return;
    }

    try {
      const response = await api.put(
        `/recurring-transactions/${editingTransaction._id}`,
        {
          type: editingTransaction.type,
          amount: Number(editingTransaction.amount),
          category: editingTransaction.category,
          description:
            editingTransaction.description,
          frequency:
            editingTransaction.frequency,
          startDate:
            editingTransaction.startDate
              ?.toString()
              .split("T")[0],
          active: editingTransaction.active,
        }
      );

      setTransactions((current) =>
        current.map((item) =>
          item._id === editingTransaction._id
            ? response.data.recurringTransaction
            : item
        )
      );

      setEditingTransaction(null);
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update recurring transaction."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Recurring Transactions
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your repeated income and expenses.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Add form */}
        <div className="mb-6">
          <RecurringTransactionForm
            onCreated={handleCreated}
          />
        </div>

        {/* Edit form */}
        {editingTransaction && (
          <div className="finance-card mb-6 p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Recurring Transaction
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your recurring transaction details.
                </p>
              </div>

              <button
                onClick={() =>
                  setEditingTransaction(null)
                }
                className="text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {/* Type */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Type
                </label>

                <select
                  value={editingTransaction.type}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      type: e.target.value,
                    })
                  }
                  className="finance-input"
                >
                  <option value="expense">
                    Expense
                  </option>
                  <option value="income">
                    Income
                  </option>
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Amount
                </label>

                <input
                  type="number"
                  value={editingTransaction.amount}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      amount: e.target.value,
                    })
                  }
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

                <input
                  type="text"
                  value={editingTransaction.category}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      category: e.target.value,
                    })
                  }
                  className="finance-input"
                />
              </div>

              {/* Frequency */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Frequency
                </label>

                <select
                  value={editingTransaction.frequency}
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      frequency: e.target.value,
                    })
                  }
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
                  value={
                    editingTransaction.startDate
                      ?.toString()
                      .split("T")[0] || ""
                  }
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      startDate: e.target.value,
                    })
                  }
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
                  value={
                    editingTransaction.description || ""
                  }
                  onChange={(e) =>
                    setEditingTransaction({
                      ...editingTransaction,
                      description: e.target.value,
                    })
                  }
                  className="finance-input"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="finance-button"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Transactions */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Your Recurring Transactions
            </h2>

            {!loading && (
              <span className="text-sm text-gray-500">
                {transactions.length}{" "}
                {transactions.length === 1
                  ? "transaction"
                  : "transactions"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="finance-card p-8 text-center text-sm text-gray-500">
              Loading recurring transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="finance-card p-8 text-center">
              <p className="font-medium text-gray-700">
                No recurring transactions yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first recurring income or expense
                above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {transactions.map((transaction) => (
                <RecurringTransactionCard
                  key={transaction._id}
                  transaction={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecurringTransactions;