function TransactionList({ transactions, onEdit, onDelete }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="finance-card p-10 text-center">
        <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xl">
          ₹
        </div>

        <h3 className="mt-4 font-semibold text-gray-900">
          No transactions found
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Add a transaction to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="finance-card overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">
          Recent Transactions
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {transactions.length} transaction
          {transactions.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {transactions.map((transaction) => (
          <div
            key={transaction._id}
            className="px-5 py-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Left */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
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

                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                    <span>
                      {new Date(transaction.date).toLocaleDateString(
                        "en-IN",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>

                    {transaction.description && (
                      <>
                        <span>•</span>
                        <span className="truncate">
                          {transaction.description}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex items-center gap-4">
                <span
                  className={`font-semibold whitespace-nowrap ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : "-"}₹
                  {Number(transaction.amount).toLocaleString("en-IN")}
                </span>

                <div className="hidden sm:flex gap-2">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(transaction._id)}
                    className="px-3 py-1.5 rounded-md text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile buttons */}
            <div className="flex sm:hidden gap-2 mt-3 ml-13">
              <button
                onClick={() => onEdit(transaction)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-blue-600 bg-blue-50"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(transaction._id)}
                className="px-3 py-1.5 rounded-md text-xs font-medium text-red-600 bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionList;