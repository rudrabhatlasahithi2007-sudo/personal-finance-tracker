import { useEffect, useState } from "react";
import API from "../api";

import SummaryCard from "../components/SummaryCard";
import ExpenseChart from "../components/ExpenseChart";
import IncomeExpenseChart from "../components/IncomeExpenseChart";
import Navbar from "../components/Navbar";
function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [balance, setBalance] = useState(0);

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
        "Failed to load dashboard"
      );
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        income += Number(transaction.amount);
      }

      if (transaction.type === "expense") {
        expenses += Number(transaction.amount);
      }
    });

    setTotalIncome(income);
    setTotalExpenses(expenses);
    setBalance(income - expenses);

  }, [transactions]);

  return (
  <>
    <Navbar />

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">
          Dashboard
        </h1>

        {error && (
          <p className="text-red-600 mb-4">
            {error}
          </p>
        )}

        {/* Summary Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <SummaryCard
            title="Total Balance"
            amount={balance}
          />

          <SummaryCard
            title="Total Income"
            amount={totalIncome}
          />

          <SummaryCard
            title="Total Expenses"
            amount={totalExpenses}
          />

        </div>

        {/* Charts */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

          <ExpenseChart
            transactions={transactions}
          />

          <IncomeExpenseChart
            totalIncome={totalIncome}
            totalExpenses={totalExpenses}
          />

        </div>

        {/* Recent Transactions */}

        <div className="bg-white p-6 rounded-lg shadow-md mt-8">

          <h2 className="text-xl font-bold mb-4">
            Recent Transactions
          </h2>

          {transactions.length === 0 ? (
            <p className="text-gray-500">
              No transactions yet.
            </p>
          ) : (
            <div className="space-y-4">

              {transactions
                .slice(0, 5)
                .map((transaction) => (

                  <div
                    key={transaction._id}
                    className="flex justify-between items-center border-b pb-3"
                  >

                    <div>
                      <p className="font-semibold">
                        {transaction.category}
                      </p>

                      <p className="text-sm text-gray-500">
                        {transaction.description ||
                          "No description"}
                      </p>
                    </div>

                    <div className="text-right">

                      <p className="font-bold">
                        {transaction.type === "income"
                          ? "+"
                          : "-"}
                        ₹
                        {Number(
                          transaction.amount
                        ).toLocaleString("en-IN")}
                      </p>

                      <p className="text-sm text-gray-500">
                        {new Date(
                          transaction.date
                        ).toLocaleDateString()}
                      </p>

                    </div>

                  </div>

                ))}

            </div>
          )}

        </div>

      </div>

    </div>
  </>
);
}

export default Dashboard;