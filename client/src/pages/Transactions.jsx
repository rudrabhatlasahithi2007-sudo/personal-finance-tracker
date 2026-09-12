import { useEffect, useState } from "react";
import API from "../api";

import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import TransactionForm from "../components/TransactionForm";
import EditTransactionForm from "../components/EditTransactionForm";
import TransactionList from "../components/TransactionList";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    fromDate: "",
    toDate: "",
  });

  const fetchTransactions = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.get("/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(response.data.transactions || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = [...transactions];

    if (filters.type !== "all") {
      result = result.filter(
        (transaction) => transaction.type === filters.type
      );
    }

    if (filters.category !== "all") {
      result = result.filter(
        (transaction) => transaction.category === filters.category
      );
    }

    if (filters.fromDate) {
      result = result.filter(
        (transaction) =>
          new Date(transaction.date) >=
          new Date(filters.fromDate)
      );
    }

    if (filters.toDate) {
      const endDate = new Date(filters.toDate);

      endDate.setHours(23, 59, 59, 999);

      result = result.filter(
        (transaction) =>
          new Date(transaction.date) <= endDate
      );
    }

    setFilteredTransactions(result);
  }, [transactions, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      type: "all",
      category: "all",
      fromDate: "",
      toDate: "",
    });
  };

  const handleTransactionAdded = (transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleTransactionUpdated = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction._id === updatedTransaction._id
          ? updatedTransaction
          : transaction
      )
    );

    setEditingTransaction(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    try {
      setError("");

      const token = localStorage.getItem("token");

      await API.delete(`/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions((prev) =>
        prev.filter((transaction) => transaction._id !== id)
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete transaction."
      );
    }
  };

  const categories = [
    ...new Set(transactions.map((transaction) => transaction.category)),
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar />
      <MobileNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Transactions
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your income and expenses.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Forms */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            <div className="xl:col-span-1">
              {editingTransaction ? (
                <EditTransactionForm
                  transaction={editingTransaction}
                  onUpdated={handleTransactionUpdated}
                  onCancel={() => setEditingTransaction(null)}
                />
              ) : (
                <TransactionForm
                  onTransactionAdded={handleTransactionAdded}
                />
              )}
            </div>

            {/* Filters */}
            <div className="xl:col-span-2 finance-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filter Transactions
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Find transactions quickly.
                  </p>
                </div>

                <button
                  onClick={clearFilters}
                  className="finance-secondary-button text-sm"
                >
                  Clear filters
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Type
                  </label>

                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="finance-input"
                  >
                    <option value="all">All types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category
                  </label>

                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="finance-input"
                  >
                    <option value="all">All categories</option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    From date
                  </label>

                  <input
                    type="date"
                    name="fromDate"
                    value={filters.fromDate}
                    onChange={handleFilterChange}
                    className="finance-input"
                  />
                </div>

                {/* To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    To date
                  </label>

                  <input
                    type="date"
                    name="toDate"
                    value={filters.toDate}
                    onChange={handleFilterChange}
                    className="finance-input"
                  />
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredTransactions.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {transactions.length}
                </span>{" "}
                transactions
              </div>
            </div>
          </div>

          {/* Transaction list */}
          {loading ? (
            <div className="finance-card p-10 text-center text-gray-500">
              Loading transactions...
            </div>
          ) : (
            <TransactionList
              transactions={filteredTransactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Transactions;