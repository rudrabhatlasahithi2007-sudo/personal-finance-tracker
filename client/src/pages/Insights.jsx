import FinancialInsights from "../components/FinancialInsights";

function Insights() {
  return (
    <div className="page-enter min-h-screen bg-[#f8fafc]">

      <div className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">

        {/* HEADER */}

        <div className="mb-6">

          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Smart Analysis
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
            Financial Insights
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Understand your spending patterns and discover useful financial observations.
          </p>

        </div>

        <FinancialInsights />

      </div>

    </div>
  );
}

export default Insights;