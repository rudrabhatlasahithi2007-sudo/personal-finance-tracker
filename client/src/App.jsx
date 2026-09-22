import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import MobileNavbar from "./components/MobileNavbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import RecurringTransactions from "./pages/RecurringTransactions";
import SavingsGoals from "./pages/SavingsGoals";
import Insights from "./pages/Insights";
import HealthScore from "./pages/HealthScore";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================= PROTECTED ================= */}

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-[#f8fafc]">

                <Navbar />

                <main className="lg:ml-64">
                  <Routes>

                    <Route
                      path="/dashboard"
                      element={<Dashboard />}
                    />

                    <Route
                      path="/transactions"
                      element={<Transactions />}
                    />

                    <Route
                      path="/budgets"
                      element={<Budgets />}
                    />

                    <Route
                      path="/recurring-transactions"
                      element={
                        <RecurringTransactions />
                      }
                    />

                    <Route
                      path="/savings-goals"
                      element={
                        <SavingsGoals />
                      }
                    />

                    <Route
                      path="/insights"
                      element={<Insights />}
                    />

                    <Route
                      path="/health-score"
                      element={<HealthScore />}
                    />

                    <Route
                      path="/"
                      element={
                        <Navigate
                          to="/dashboard"
                          replace
                        />
                      }
                    />

                    <Route
                      path="*"
                      element={
                        <Navigate
                          to="/dashboard"
                          replace
                        />
                      }
                    />

                  </Routes>
                </main>

                <MobileNavbar />

              </div>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;