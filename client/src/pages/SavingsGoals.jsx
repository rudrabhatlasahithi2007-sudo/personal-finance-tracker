import { useEffect, useState } from "react";
import api from "../api";

import SavingsGoalForm from "../components/SavingsGoalForm";
import SavingsGoalCard from "../components/SavingsGoalCard";

function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingGoal, setEditingGoal] = useState(null);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/savings-goals");

      setGoals(response.data.goals);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load savings goals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreated = (newGoal) => {
    setGoals((current) => [newGoal, ...current]);
  };

  const handleAddSavings = async (goal) => {
    const amount = window.prompt(
      `How much would you like to add to "${goal.name}"?`
    );

    if (amount === null) {
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setError("Savings amount must be greater than 0.");
      return;
    }

    try {
      setError("");

      const response = await api.patch(
        `/savings-goals/${goal._id}/add`,
        {
          amount: Number(amount),
        }
      );

      setGoals((current) =>
        current.map((item) =>
          item._id === goal._id
            ? {
                ...response.data.goal,
                percentage:
                  response.data.goal.targetAmount > 0
                    ? Math.min(
                        Math.round(
                          (response.data.goal.currentAmount /
                            response.data.goal.targetAmount) *
                            100
                        ),
                        100
                      )
                    : 0,
                remainingAmount: Math.max(
                  response.data.goal.targetAmount -
                    response.data.goal.currentAmount,
                  0
                ),
              }
            : item
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to add savings."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this savings goal?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/savings-goals/${id}`);

      setGoals((current) =>
        current.filter((goal) => goal._id !== id)
      );
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to delete savings goal."
      );
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal({
      ...goal,
      targetDate: goal.targetDate
        ? goal.targetDate.toString().split("T")[0]
        : "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingGoal) {
      return;
    }

    if (!editingGoal.name.trim()) {
      setError("Goal name is required.");
      return;
    }

    if (
      !editingGoal.targetAmount ||
      Number(editingGoal.targetAmount) <= 0
    ) {
      setError(
        "Target amount must be greater than 0."
      );
      return;
    }

    try {
      setError("");

      const response = await api.put(
        `/savings-goals/${editingGoal._id}`,
        {
          name: editingGoal.name.trim(),
          targetAmount: Number(
            editingGoal.targetAmount
          ),
          targetDate:
            editingGoal.targetDate || "",
          description:
            editingGoal.description || "",
        }
      );

      const updatedGoal = response.data.goal;

      const percentage =
        updatedGoal.targetAmount > 0
          ? Math.min(
              Math.round(
                (updatedGoal.currentAmount /
                  updatedGoal.targetAmount) *
                  100
              ),
              100
            )
          : 0;

      const goalWithProgress = {
        ...updatedGoal,
        percentage,
        remainingAmount: Math.max(
          updatedGoal.targetAmount -
            updatedGoal.currentAmount,
          0
        ),
      };

      setGoals((current) =>
        current.map((goal) =>
          goal._id === editingGoal._id
            ? goalWithProgress
            : goal
        )
      );

      setEditingGoal(null);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update savings goal."
      );
    }
  };

  const totalTarget = goals.reduce(
    (total, goal) =>
      total + Number(goal.targetAmount),
    0
  );

  const totalSaved = goals.reduce(
    (total, goal) =>
      total + Number(goal.currentAmount),
    0
  );

  const completedGoals = goals.filter(
    (goal) => goal.completed
  ).length;

  const overallProgress =
    totalTarget > 0
      ? Math.min(
          Math.round(
            (totalSaved / totalTarget) * 100
          ),
          100
        )
      : 0;

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Savings Goals
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Set financial goals and track your progress.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="font-medium hover:text-red-800"
            >
              ×
            </button>
          </div>
        )}

        {/* Summary */}
        {!loading && goals.length > 0 && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="finance-card p-5">
              <p className="text-sm text-gray-500">
                Total Goals
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-800">
                {goals.length}
              </p>
            </div>

            <div className="finance-card p-5">
              <p className="text-sm text-gray-500">
                Total Target
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-800">
                ₹
                {totalTarget.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="finance-card p-5">
              <p className="text-sm text-gray-500">
                Total Saved
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                ₹
                {totalSaved.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="finance-card p-5">
              <p className="text-sm text-gray-500">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-600">
                {completedGoals}
              </p>
            </div>
          </div>
        )}

        {/* Overall progress */}
        {!loading && goals.length > 0 && (
          <div className="finance-card mb-6 p-5">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-800">
                  Overall Savings Progress
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  ₹
                  {totalSaved.toLocaleString("en-IN")}{" "}
                  of ₹
                  {totalTarget.toLocaleString("en-IN")}
                </p>
              </div>

              <span className="font-semibold text-blue-600">
                {overallProgress}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${overallProgress}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Create form */}
        <div className="mb-6">
          <SavingsGoalForm
            onCreated={handleCreated}
          />
        </div>

        {/* Edit form */}
        {editingGoal && (
          <div className="finance-card mb-6 p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Edit Savings Goal
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update your goal details.
                </p>
              </div>

              <button
                onClick={() => setEditingGoal(null)}
                className="text-sm font-medium text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Goal Name
                </label>

                <input
                  type="text"
                  value={editingGoal.name}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      name: e.target.value,
                    })
                  }
                  className="finance-input"
                />
              </div>

              {/* Target */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Target Amount
                </label>

                <input
                  type="number"
                  value={editingGoal.targetAmount}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      targetAmount:
                        e.target.value,
                    })
                  }
                  min="0"
                  step="0.01"
                  className="finance-input"
                />
              </div>

              {/* Target date */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Target Date
                </label>

                <input
                  type="date"
                  value={editingGoal.targetDate || ""}
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      targetDate:
                        e.target.value,
                    })
                  }
                  className="finance-input"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <input
                  type="text"
                  value={
                    editingGoal.description || ""
                  }
                  onChange={(e) =>
                    setEditingGoal({
                      ...editingGoal,
                      description:
                        e.target.value,
                    })
                  }
                  className="finance-input"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="finance-button"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Goals */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Your Goals
            </h2>

            {!loading && (
              <span className="text-sm text-gray-500">
                {goals.length}{" "}
                {goals.length === 1
                  ? "goal"
                  : "goals"}
              </span>
            )}
          </div>

          {loading ? (
            <div className="finance-card p-8 text-center text-sm text-gray-500">
              Loading savings goals...
            </div>
          ) : goals.length === 0 ? (
            <div className="finance-card p-8 text-center">
              <p className="font-medium text-gray-700">
                No savings goals yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Create your first goal above to start
                tracking your savings.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {goals.map((goal) => (
                <SavingsGoalCard
                  key={goal._id}
                  goal={goal}
                  onAddSavings={handleAddSavings}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SavingsGoals;