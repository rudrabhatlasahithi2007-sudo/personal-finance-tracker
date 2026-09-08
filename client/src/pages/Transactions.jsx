import { useEffect, useState } from "react";
import API from "../api";

import TransactionForm from "../components/TransactionForm";
import TransactionList from "../components/TransactionList";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await API.get(
        "/transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      await API.delete(
        `/transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Transactions
        </h1>

        {error && (
          <p className="text-red-600 mb-4">
            {error}
          </p>
        )}

        <TransactionForm
          onTransactionAdded={handleTransactionAdded}
        />

        <TransactionList
          transactions={transactions}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />

      </div>

    </div>
  );
}

export default Transactions;