function TransactionList({
  transactions,
  onDelete,
  onEdit,
}) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <p className="text-gray-500 text-center">
          No transactions yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">

      <h2 className="text-xl font-bold mb-4">
        Your Transactions
      </h2>

      <div className="space-y-3">

        {transactions.map((transaction) => (

          <div
            key={transaction._id}
            className="border border-gray-200 rounded-md p-4 flex justify-between items-center"
          >

            <div>

              <p className="font-semibold">
                {transaction.category}
              </p>

              <p className="text-sm text-gray-500">
                {transaction.description || "No description"}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(transaction.date).toLocaleDateString()}
              </p>

            </div>

            <div className="text-right">

              <p className="font-bold">
                ₹{transaction.amount}
              </p>

              <p className="text-sm">
                {transaction.type}
              </p>

              <div className="mt-2 space-x-2">

                <button
                  onClick={() => onEdit(transaction)}
                  className="text-blue-600 font-medium"
                >
                  Edit
                </button>

                <button
                  onClick={() => onDelete(transaction._id)}
                  className="text-red-600 font-medium"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default TransactionList;