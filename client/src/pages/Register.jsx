import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !form.name ||
      !form.email ||
      !form.password
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (
      form.password !== confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      await api.post(
        "/auth/register",
        form
      );

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account."
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
            Start building better financial habits.
          </p>

        </div>

        {/* CARD */}

        <div className="finance-card p-6 sm:p-8">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-gray-900">
              Create your account
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your details to get started.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* NAME */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                autoComplete="name"
                className="finance-input"
              />

            </div>

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

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                autoComplete="new-password"
                className="finance-input"
              />

            </div>

            {/* CONFIRM */}

            <div>

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Repeat your password"
                autoComplete="new-password"
                className="finance-input"
              />

            </div>

            {/* ERROR */}

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="finance-button w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>

          {/* LOGIN */}

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">

            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in
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

export default Register;