import { useEffect, useState } from "react";
import API from "../api";

import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] =
    useState([]);

  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    type: "all",
    category: "all",
    fromDate: "",
    toDate: "",
  });

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(response.data.transactions);

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load transactions"
      );
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = [...transactions];

    // Filter by type
    if (filters.type !== "all") {
      result = result.filter(
        (transaction) =>
          transaction.type === filters.type
      );
    }

    // Filter by category
    if (filters.category !== "all") {
      result = result.filter(
        (transaction) =>
          transaction.category === filters.category
      );
    }

    // Filter by starting date
    if (filters.fromDate) {
      result = result.filter(
        (transaction) =>
          new Date(transaction.date) >=
          new Date(filters.fromDate)
      );
    }

    // Filter by ending date
    if (filters.toDate) {
      const endDate = new Date(filters.toDate);

      // Include the entire ending day
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
    setTransactions((prev) => [
      transaction,
      ...prev,
    ]);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions((prev) =>
        prev.filter(
          (transaction) =>
            transaction._id !== id
        )
      );

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete transaction"
      );
    }
  };

  const handleEdit = (transaction) => {
    console.log("Edit transaction:", transaction);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Transactions
        </h1>

        {error && (
          <p className="text-red-600 mb-4">
            {error}
          </p>
        )}

        {/* Add Transaction */}

        <TransactionForm
          onTransactionAdded={handleTransactionAdded}
        />

        {/* Filters */}

        <div className="bg-white p-6 rounded-lg shadow-md mt-6">

          <h2 className="text-xl font-bold mb-4">
            Filter Transactions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Type */}

            <div>
              <label className="block mb-1 font-medium">
                Type
              </label>

              <select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">
                  Expense
                </option>
              </select>
            </div>

            {/* Category */}

            <div>
              <label className="block mb-1 font-medium">
                Category
              </label>

              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="all">All</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">
                  Shopping
                </option>
                <option value="Bills">Bills</option>
                <option value="Entertainment">
                  Entertainment
                </option>
                <option value="Health">Health</option>
                <option value="Salary">Salary</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* From Date */}

            <div>
              <label className="block mb-1 font-medium">
                From
              </label>

              <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            {/* To Date */}

            <div>
              <label className="block mb-1 font-medium">
                To
              </label>

              <input
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

          </div>

          <button
            onClick={clearFilters}
            className="mt-4 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Clear Filters
          </button>

        </div>

        {/* Transaction List */}

        <TransactionList
          transactions={filteredTransactions}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

      </div>

    </div>
  );
}

export default Transactions;