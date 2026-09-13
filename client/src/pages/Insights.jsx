import FinancialInsights from "../components/FinancialInsights";

function Insights() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Financial Insights
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Get meaningful insights from your income and spending.
          </p>
        </div>

        <FinancialInsights />
      </div>
    </div>
  );
}

export default Insights;