import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "▦",
    },
    {
      name: "Transactions",
      path: "/transactions",
      icon: "↔",
    },
    {
      name: "Budgets",
      path: "/budgets",
      icon: "◫",
    },
    {
      name: "Recurring",
      path: "/recurring-transactions",
      icon: "↻",
    },
    {
      name: "Savings Goals",
      path: "/savings-goals",
      icon: "◎",
    },
    {
      name: "Insights",
      path: "/insights",
      icon: "⌁",
    },
    {
      name: "Financial Health",
      path: "/health-score",
      icon: "♥",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="finance-sidebar fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col lg:flex">

      {/* LOGO */}

      <div className="flex h-20 items-center border-b border-slate-100 px-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
            ₹
          </div>

          <div>

            <h1 className="text-base font-bold tracking-tight text-gray-900">
              FinanceFlow
            </h1>

            <p className="text-[11px] font-medium text-slate-400">
              Personal Finance
            </p>

          </div>

        </div>

      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">

        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Overview
        </p>

        <div className="space-y-1">

          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `finance-nav-item ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span className="flex h-8 w-8 items-center justify-center rounded-lg text-base">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </NavLink>
          ))}

        </div>

      </nav>

      {/* BOTTOM */}

      <div className="border-t border-slate-100 p-4">

        <div className="mb-3 rounded-xl bg-slate-50 p-3">

          <p className="text-xs font-semibold text-gray-700">
            Financial Overview
          </p>

          <p className="mt-1 text-[11px] leading-4 text-slate-500">
            Keep track of your spending and savings.
          </p>

        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >

          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            ↪
          </span>

          Logout

        </button>

      </div>

    </aside>
  );
}

export default Navbar;