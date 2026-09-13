import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex-col z-40">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            ₹
          </div>

          <div>
            <h1 className="font-bold text-gray-900">FinTrack</h1>
            <p className="text-xs text-gray-500">Personal Finance</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
          Menu
        </p>

        <div className="space-y-1">
          <NavLink to="/dashboard" className={linkClass}>
            <span className="text-lg">⌂</span>
            Dashboard
          </NavLink>

          <NavLink to="/transactions" className={linkClass}>
            <span className="text-lg">↔</span>
            Transactions
          </NavLink>
          <NavLink to="/budgets" className={linkClass}>
  <span className="text-lg">₹</span>
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
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-gray-500 truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default Navbar;