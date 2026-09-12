function SummaryCard({ title, amount, type }) {
  const styles = {
    balance: {
      icon: "₹",
      iconBg: "bg-blue-50",
      iconText: "text-blue-600",
      amount: "text-gray-900",
    },

    income: {
      icon: "↑",
      iconBg: "bg-green-50",
      iconText: "text-green-600",
      amount: "text-green-600",
    },

    expense: {
      icon: "↓",
      iconBg: "bg-red-50",
      iconText: "text-red-600",
      amount: "text-red-600",
    },
  };

  const style = styles[type] || styles.balance;

  return (
    <div className="finance-card p-5 animate-fade-up hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h2 className={`mt-2 text-2xl font-bold ${style.amount}`}>
            ₹{Number(amount || 0).toLocaleString("en-IN")}
          </h2>
        </div>

        <div
          className={`w-11 h-11 rounded-xl ${style.iconBg} ${style.iconText} flex items-center justify-center text-xl font-bold`}
        >
          {style.icon}
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;