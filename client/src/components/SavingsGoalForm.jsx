import { useState } from "react";
import api from "../api";

function SavingsGoalForm({ onCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Please enter a goal name.");
      return;
    }

    if (
      !formData.targetAmount ||
      Number(formData.targetAmount) <= 0
    ) {
      setError("Target amount must be greater than 0.");
      return;
    }

    if (
      formData.currentAmount !== "" &&
      Number(formData.currentAmount) < 0
    ) {
      setError("Current savings cannot be negative.");
      return;
    }

    if (
      formData.currentAmount !== "" &&
      Number(formData.currentAmount) >
        Number(formData.targetAmount)
    ) {
      setError(
        "Current savings cannot be greater than the target."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/savings-goals", {
        name: formData.name.trim(),
        targetAmount: Number(formData.targetAmount),
        currentAmount:
          formData.currentAmount === ""
            ? 0
            : Number(formData.currentAmount),
        targetDate: formData.targetDate || undefined,
        description: formData.description.trim(),
      });

      onCreated(response.data.goal);

      setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "",
        targetDate: "",
        description: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create savings goal."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="finance-card p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Create Savings Goal
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Set a target and track your progress over time.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {/* Goal Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Goal Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Emergency Fund"
            className="finance-input"
          />
        </div>

        {/* Target Amount */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Target Amount
          </label>

          <input
            type="number"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            placeholder="e.g. 50000"
            min="0"
            step="0.01"
            className="finance-input"
          />
        </div>

        {/* Current Amount */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Already Saved
          </label>

          <input
            type="number"
            name="currentAmount"
            value={formData.currentAmount}
            onChange={handleChange}
            placeholder="e.g. 10000"
            min="0"
            step="0.01"
            className="finance-input"
          />
        </div>

        {/* Target Date */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Target Date
          </label>

          <input
            type="date"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            className="finance-input"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What are you saving for?"
            rows="3"
            className="finance-input resize-none"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="finance-button w-full sm:w-auto"
          >
            {loading ? "Creating..." : "Create Savings Goal"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SavingsGoalForm;