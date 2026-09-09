import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">

      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        <Link
          to="/dashboard"
          className="text-xl font-bold"
        >
          Personal Finance
        </Link>

        <div className="flex items-center gap-6">

          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-blue-600"
          >
            Dashboard
          </Link>

          <Link
            to="/transactions"
            className="text-gray-700 hover:text-blue-600"
          >
            Transactions
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;