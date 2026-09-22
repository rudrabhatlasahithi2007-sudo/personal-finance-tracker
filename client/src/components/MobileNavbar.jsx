import { NavLink } from "react-router-dom";

function MobileNavbar() {
  const items = [
    {
      name: "Home",
      path: "/dashboard",
      icon: "⌂",
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
      name: "Goals",
      path: "/savings-goals",
      icon: "◎",
    },
    {
      name: "Insights",
      path: "/insights",
      icon: "⌁",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">

      <div className="mx-auto flex max-w-md items-center justify-around">

        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex min-w-[58px] flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-medium transition ${
                isActive
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-400 hover:text-slate-600"
              }`
            }
          >
            <span className="text-lg">
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>
          </NavLink>
        ))}

      </div>

    </nav>
  );
}

export default MobileNavbar;