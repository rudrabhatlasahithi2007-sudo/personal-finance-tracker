import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        form
      );

      const token =
        response.data.token;

      const user =
        response.data.user;

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-4 py-8">

      <div className="w-full max-w-md">

        {/* BRAND */}

        <div className="mb-8 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-bold text-white shadow-sm">
            ₹
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
            FinanceFlow
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your money with confidence.
          </p>

        </div>

        {/* CARD */}

        <div className="finance-card p-6 sm:p-8">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-gray-900">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sign in to access your dashboard.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                className="finance-input"
              />

            </div>

            {/* PASSWORD */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

              </div>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="finance-input"
              />

            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="finance-button w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

          {/* REGISTER */}

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create one
              </Link>
            </p>

          </div>

        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Personal Finance Tracker
        </p>

      </div>

    </div>
  );
}

export default Login;