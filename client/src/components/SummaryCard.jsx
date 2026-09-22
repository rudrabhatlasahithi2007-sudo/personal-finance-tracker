function SummaryCard({
  title,
  amount,
  icon,
  type = "default",
  subtitle,
}) {
  const styles = {
    income: {
      icon: "bg-green-50 text-green-600",
      amount: "text-green-600",
    },

    expense: {
      icon: "bg-red-50 text-red-600",
      amount: "text-red-600",
    },

    balance: {
      icon: "bg-blue-50 text-blue-600",
      amount: "text-blue-600",
    },

    default: {
      icon: "bg-slate-100 text-slate-600",
      amount: "text-gray-900",
    },
  };

  const currentStyle = styles[type] || styles.default;

  return (
    <div className="finance-card group p-5">
      <div className="flex items-start justify-between">
        
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3
            className={`finance-number mt-3 text-2xl ${currentStyle.amount}`}
          >
            ₹{Number(amount || 0).toLocaleString("en-IN")}
          </h3>

          {subtitle && (
            <p className="mt-2 text-xs text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${currentStyle.icon}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;