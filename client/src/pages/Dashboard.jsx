import { useEffect, useState } from "react";
import API from "../api";

import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import SummaryCard from "../components/SummaryCard";
import ExpenseChart from "../components/ExpenseChart";
import IncomeExpenseChart from "../components/IncomeExpenseChart";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
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
            "Failed to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const income = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const balance = income - expenses;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <Navbar />
      <MobileNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-up">
            <p className="text-sm text-gray-500 mb-1">
              Welcome back,
            </p>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {user?.name || "User"}'s Dashboard
                </h1>

                <p className="mt-1 text-gray-500">
                  Here's an overview of your finances.
                </p>
              </div>

              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="finance-card p-10 text-center text-gray-500">
              Loading dashboard...
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-6">
                <SummaryCard
                  title="Current Balance"
                  amount={balance}
                  type="balance"
                />

                <SummaryCard
                  title="Total Income"
                  amount={income}
                  type="income"
                />

                <SummaryCard
                  title="Total Expenses"
                  amount={expenses}
                  type="expense"
                />
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <IncomeExpenseChart transactions={transactions} />

                <ExpenseChart transactions={transactions} />
              </div>

              {/* Recent transactions */}
              <div className="finance-card overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Recent Transactions
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Your latest financial activity.
                    </p>
                  </div>

                  <a
                    href="/transactions"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View all
                  </a>
                </div>

                {recentTransactions.length === 0 ? (
                  <div className="p-10 text-center">
                    <p className="text-gray-500 text-sm">
                      No transactions yet.
                    </p>

                    <a
                      href="/transactions"
                      className="inline-block mt-3 text-sm font-medium text-blue-600"
                    >
                      Add your first transaction
                    </a>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction._id}
                        className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
                              transaction.type === "income"
                                ? "bg-green-50 text-green-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "↑" : "↓"}
                          </div>

                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {transaction.category}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(
                                transaction.date
                              ).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                        </div>

                        <p
                          className={`font-semibold whitespace-nowrap ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}₹
                          {Number(
                            transaction.amount
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;