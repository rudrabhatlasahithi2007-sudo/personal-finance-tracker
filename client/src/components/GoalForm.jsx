import { useEffect, useState } from "react";
import api from "../api";

function GoalForm({
  editingGoal,
  onGoalCreated,
  onGoalUpdated,
  onCancel,
}) {
  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingGoal) {
      setForm({
        name: editingGoal.name || "",
        targetAmount:
          editingGoal.targetAmount || "",
        currentAmount:
          editingGoal.currentAmount || "",
        deadline: editingGoal.deadline
          ? new Date(editingGoal.deadline)
              .toISOString()
              .split("T")[0]
          : "",
        description:
          editingGoal.description || "",
      });
    }
  }, [editingGoal]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter a goal name.");
      return;
    }

    if (
      !form.targetAmount ||
      Number(form.targetAmount) <= 0
    ) {
      setError(
        "Please enter a valid target amount."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name.trim(),
        targetAmount: Number(
          form.targetAmount
        ),
        currentAmount: Number(
          form.currentAmount || 0
        ),
        deadline: form.deadline || null,
        description:
          form.description.trim(),
      };

      if (editingGoal) {
        await api.put(
          `/savings-goals/${editingGoal._id}`,
          payload
        );

        if (onGoalUpdated) {
          onGoalUpdated();
        }
      } else {
        await api.post(
          "/savings-goals",
          payload
        );

        if (onGoalCreated) {
          onGoalCreated();
        }
      }

      setForm({
        name: "",
        targetAmount: "",
        currentAmount: "",
        deadline: "",
        description: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save savings goal."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Goal Name
        </label>

        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Example: New Laptop"
          className="finance-input"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Target Amount
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
              ₹
            </span>

            <input
              type="number"
              name="targetAmount"
              min="1"
              step="0.01"
              value={form.targetAmount}
              onChange={handleChange}
              placeholder="50000"
              className="finance-input pl-8"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Already Saved
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-semibold text-slate-400">
              ₹
            </span>

            <input
              type="number"
              name="currentAmount"
              min="0"
              step="0.01"
              value={form.currentAmount}
              onChange={handleChange}
              placeholder="0"
              className="finance-input pl-8"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Deadline
        </label>

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="finance-input"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="3"
          placeholder="What are you saving for?"
          className="finance-input resize-none"
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        {editingGoal && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="finance-secondary-button flex-1"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="finance-button flex-1 disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : editingGoal
            ? "Update Goal"
            : "Create Goal"}
        </button>
      </div>
    </form>
  );
}

export default GoalForm;