import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import EditTransactionForm from "../components/EditTransactionForm";
import api from "../api";

function Transactions() {
  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [editingTransaction, setEditingTransaction] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [filter, setFilter] =
    useState("all");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/transactions"
      );

      setTransactions(
        Array.isArray(response.data)
          ? response.data
          : response.data.transactions || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this transaction?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/transactions/${id}`
      );

      fetchTransactions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete transaction."
      );
    }
  };

  const filteredTransactions =
    filter === "all"
      ? transactions
      : transactions.filter(
          (item) => item.type === filter
        );

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString(
      "en-IN"
    )}`;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  return (
    <div className="page-enter min-h-screen bg-[#f8fafc]">

      <div className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Money Management
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              Transactions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your income and expenses.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(true);
            }}
            className="finance-button"
          >
            + Add Transaction
          </button>

        </div>

        {/* FILTER */}

        <div className="mb-5 flex gap-2 overflow-x-auto">

          {[
            ["all", "All"],
            ["income", "Income"],
            ["expense", "Expenses"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() =>
                setFilter(value)
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                filter === value
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}

        </div>

        {/* FORM */}

        {showForm && (
          <div className="mb-6 finance-card p-6">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Add Transaction
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Record a new income or expense.
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

            <TransactionForm
              onTransactionAdded={() => {
                setShowForm(false);
                fetchTransactions();
              }}
            />

          </div>
        )}

        {/* EDIT */}

        {editingTransaction && (
          <div className="mb-6 finance-card p-6">

            <div className="mb-5">

              <h2 className="text-base font-semibold text-gray-900">
                Edit Transaction
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update your transaction details.
              </p>

            </div>

            <EditTransactionForm
              transaction={editingTransaction}
              onTransactionUpdated={() => {
                setEditingTransaction(null);
                fetchTransactions();
              }}
              onCancel={() =>
                setEditingTransaction(null)
              }
            />

          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* CONTENT */}

        {loading ? (

          <div className="finance-card p-10 text-center">
            <p className="text-sm text-slate-500">
              Loading transactions...
            </p>
          </div>

        ) : filteredTransactions.length === 0 ? (

          <div className="finance-card px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-400">
              ₹
            </div>

            <h2 className="mt-4 text-base font-semibold text-gray-900">
              No transactions found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add your first transaction to start tracking your finances.
            </p>

          </div>

        ) : (

          <div className="finance-card overflow-hidden">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead className="border-b border-slate-200 bg-slate-50">

                  <tr>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Transaction
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Date
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {filteredTransactions.map(
                    (transaction) => {

                      const isIncome =
                        transaction.type ===
                        "income";

                      return (
                        <tr
                          key={
                            transaction._id
                          }
                          className="transition hover:bg-slate-50"
                        >

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div
                                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                                  isIncome
                                    ? "bg-green-50 text-green-600"
                                    : "bg-red-50 text-red-600"
                                }`}
                              >
                                {isIncome
                                  ? "↗"
                                  : "↘"}
                              </div>

                              <div>

                                <p className="text-sm font-semibold text-gray-800">
                                  {transaction.description ||
                                    transaction.category}
                                </p>

                                <p className="text-xs text-slate-400">
                                  {isIncome
                                    ? "Income"
                                    : "Expense"}
                                </p>

                              </div>

                            </div>

                          </td>

                          <td className="px-5 py-4">

                            <span className="finance-badge finance-badge-info">
                              {transaction.category}
                            </span>

                          </td>

                          <td className="px-5 py-4 text-sm text-slate-500">
                            {formatDate(
                              transaction.date
                            )}
                          </td>

                          <td
                            className={`px-5 py-4 text-right text-sm font-bold ${
                              isIncome
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {isIncome
                              ? "+"
                              : "-"}
                            {formatAmount(
                              transaction.amount
                            )}
                          </td>

                          <td className="px-5 py-4">

                            <div className="flex justify-end gap-2">

                              <button
                                onClick={() =>
                                  setEditingTransaction(
                                    transaction
                                  )
                                }
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    transaction._id
                                  )
                                }
                                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                              >
                                Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Transactions;