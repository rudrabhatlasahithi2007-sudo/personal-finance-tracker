import { NavLink, useNavigate } from "react-router-dom";

function MobileNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex-1 text-center py-2 rounded-lg text-sm font-medium ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-gray-500 hover:text-gray-900"
    }`;

  return (
    <>
      {/* Top bar */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              ₹
            </div>

            <span className="font-bold text-gray-900">FinTrack</span>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-500 hover:text-red-600"
          >
            Sign out
          </button>
        </div>

        <div className="px-4 pb-3 flex gap-2">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/transactions" className={linkClass}>
            Transactions
          </NavLink>
          <NavLink to="/budgets" className={linkClass}>
  Budgets
</NavLink>
<NavLink
  to="/recurring-transactions"
  className={linkClass}
>
  <span className="text-lg">↻</span>
  Recurring
</NavLink>
<NavLink
  to="/savings-goals"
  className={linkClass}
>
  <span className="text-lg">◎</span>
  Savings Goals
</NavLink>
<NavLink
  to="/insights"
  className={linkClass}
>
  <span className="text-lg">✦</span>
  Insights
</NavLink>
<NavLink
  to="/health-score"
  className={linkClass}
>
  <span className="text-lg">♥</span>
  Financial Health
</NavLink>
        </div>
      </header>
    </>
  );
}

export default MobileNavbar;