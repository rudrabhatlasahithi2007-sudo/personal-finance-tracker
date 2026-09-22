import { useEffect, useState } from "react";
import api from "../api";
import RecurringTransactionForm from "../components/RecurringTransactionForm";
import RecurringTransactionCard from "../components/RecurringTransactionCard";

function RecurringTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
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
        Array.isArray(response.data)
          ? response.data
          : response.data.transactions || []
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load recurring transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Delete this recurring transaction?"
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `/recurring-transactions/${id}`
      );

      fetchRecurringTransactions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete recurring transaction."
      );
    }
  };

  const handleToggle = async (transaction) => {
    try {
      await api.put(
        `/recurring-transactions/${transaction._id}`,
        {
          active: !transaction.active,
        }
      );

      fetchRecurringTransactions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update transaction."
      );
    }
  };

  return (
    <div className="page-enter min-h-screen bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">

        {/* HEADER */}

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Automation
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
              Recurring Transactions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage bills, subscriptions and recurring income.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(true);
            }}
            className="finance-button"
          >
            + Add Recurring
          </button>

        </div>

        {/* FORM */}

        {showForm && (
          <div className="finance-card mb-6 p-6">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {editingTransaction
                    ? "Edit Recurring Transaction"
                    : "Create Recurring Transaction"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Set up a transaction that repeats automatically.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingTransaction(null);
                }}
                className="text-xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            <RecurringTransactionForm
              editingTransaction={editingTransaction}
              onSuccess={() => {
                setShowForm(false);
                setEditingTransaction(null);
                fetchRecurringTransactions();
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingTransaction(null);
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

        {/* CONTENT */}

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white"
              />
            ))}

          </div>
        ) : transactions.length === 0 ? (

          <div className="finance-card px-6 py-16 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
              ↻
            </div>

            <h2 className="mt-4 text-base font-semibold text-gray-900">
              No recurring transactions
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Add subscriptions, bills or recurring income to keep track of them.
            </p>

            <button
              onClick={() => setShowForm(true)}
              className="finance-button mt-5"
            >
              Add Recurring Transaction
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {transactions.map((transaction) => (
              <RecurringTransactionCard
                key={transaction._id}
                transaction={transaction}
                onEdit={() => {
                  setEditingTransaction(
                    transaction
                  );
                  setShowForm(true);
                }}
                onDelete={() =>
                  handleDelete(transaction._id)
                }
                onToggle={() =>
                  handleToggle(transaction)
                }
              />
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default RecurringTransactions;