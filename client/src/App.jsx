import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import RecurringTransactions from "./pages/RecurringTransactions";
import SavingsGoals from "./pages/SavingsGoals";
import ProtectedRoute from "./components/ProtectedRoute";
import Insights from "./pages/Insights";
import HealthScore from "./pages/HealthScore";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <Budgets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recurring-transactions"
          element={
            <ProtectedRoute>
              <RecurringTransactions />
            </ProtectedRoute>
          }
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
        <Route
  path="/savings-goals"
  element={
    <ProtectedRoute>
      <SavingsGoals />
    </ProtectedRoute>
  }
/>
<Route
  path="/insights"
  element={
    <ProtectedRoute>
      <Insights />
    </ProtectedRoute>
  }
/>
<Route
  path="/health-score"
  element={
    <ProtectedRoute>
      <HealthScore />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;