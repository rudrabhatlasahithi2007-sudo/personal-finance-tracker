import { useEffect, useState } from "react";
import api from "../api";

import SummaryCard from "../components/SummaryCard";
import ExpenseChart from "../components/ExpenseChart";
import IncomeExpenseChart from "../components/IncomeExpenseChart";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/transactions");

      const data = response.data;

      if (Array.isArray(data)) {
        setTransactions(data);
      } else if (Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalIncome = transactions
    .filter(
      (transaction) => transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const totalExpense = transactions
    .filter(
      (transaction) => transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const balance = totalIncome - totalExpense;

  const recentTransactions = [...transactions]
    .sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    )
    .slice(0, 5);

  const formatAmount = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="page-enter min-h-screen bg-[#f8fafc]">

      <div className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Personal Finance
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Welcome back
              {user?.name ? `, ${user.name}` : ""}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Here's an overview of your financial activity.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-medium text-slate-400">
              Total transactions
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
              {transactions.length}
            </p>
          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* SUMMARY CARDS */}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="finance-card h-32 animate-pulse bg-white p-5"
              />
            ))}

          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <SummaryCard
              title="Total Balance"
              amount={balance}
              icon="₹"
              type="balance"
              subtitle="Income minus expenses"
            />

            <SummaryCard
              title="Total Income"
              amount={totalIncome}
              icon="↗"
              type="income"
              subtitle="All recorded income"
            />

            <SummaryCard
              title="Total Expenses"
              amount={totalExpense}
              icon="↘"
              type="expense"
              subtitle="All recorded expenses"
            />

            <SummaryCard
              title="Transactions"
              amount={transactions.length}
              icon="↔"
              type="default"
              subtitle="Recorded activities"
            />

          </div>
        )}

        {/* CHARTS */}

        <div className="mt-6 grid gap-6 xl:grid-cols-2">

          <ExpenseChart
            transactions={transactions}
          />

          <IncomeExpenseChart
            transactions={transactions}
          />

        </div>

        {/* RECENT TRANSACTIONS */}

        <div className="finance-card mt-6 overflow-hidden">

          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:px-6">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Activity
              </p>

              <h2 className="mt-1 text-lg font-bold text-gray-900">
                Recent Transactions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest income and expenses.
              </p>
            </div>

            <button
              onClick={() =>
                (window.location.href =
                  "/transactions")
              }
              className="finance-secondary-button w-fit"
            >
              View all
            </button>

          </div>

          {loading ? (
            <div className="space-y-4 p-6">

              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-12 animate-pulse rounded-lg bg-slate-100"
                />
              ))}

            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="px-6 py-14 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                ₹
              </div>

              <h3 className="mt-4 text-sm font-semibold text-gray-800">
                No transactions yet
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                Start adding income and expenses to
                see them here.
              </p>

            </div>
          ) : (
            <div className="divide-y divide-slate-100">

              {recentTransactions.map(
                (transaction) => {

                  const isIncome =
                    transaction.type === "income";

                  return (
                    <div
                      key={transaction._id}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6"
                    >

                      <div className="flex min-w-0 items-center gap-3">

                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold ${
                            isIncome
                              ? "bg-green-50 text-green-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {isIncome ? "↗" : "↘"}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-semibold text-gray-900">
                            {transaction.category ||
                              "Other"}
                          </p>

                          <p className="mt-1 truncate text-xs text-slate-400">
                            {transaction.description ||
                              "No description"}{" "}
                            •{" "}
                            {formatDate(
                              transaction.date
                            )}
                          </p>

                        </div>

                      </div>

                      <div className="shrink-0 text-right">

                        <p
                          className={`text-sm font-bold ${
                            isIncome
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatAmount(
                            transaction.amount
                          )}
                        </p>

                        <span
                          className={`mt-1 inline-block text-[11px] font-medium ${
                            isIncome
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {isIncome
                            ? "Income"
                            : "Expense"}
                        </span>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;