import FinancialHealthScore from "../components/FinancialHealthScore";

function HealthScore() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Financial Health
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Track the overall health of your finances.
          </p>
        </div>

        <FinancialHealthScore />
      </div>
    </div>
  );
}

export default HealthScore;