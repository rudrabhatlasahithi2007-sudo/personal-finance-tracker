const SavingsGoal = require("../models/SavingsGoal");

// CREATE GOAL
const createSavingsGoal = async (req, res) => {
  try {
    const {
      name,
      targetAmount,
      currentAmount,
      deadline,
      description,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Goal name is required",
      });
    }

    if (!targetAmount || Number(targetAmount) <= 0) {
      return res.status(400).json({
        message: "Target amount must be greater than 0",
      });
    }

    if (
      currentAmount !== undefined &&
      Number(currentAmount) < 0
    ) {
      return res.status(400).json({
        message: "Current amount cannot be negative",
      });
    }

    if (
      currentAmount !== undefined &&
      Number(currentAmount) > Number(targetAmount)
    ) {
      return res.status(400).json({
        message:
          "Current amount cannot be greater than target amount",
      });
    }

    const goal = await SavingsGoal.create({
      user: req.user._id,
      name: name.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount || 0),
      deadline: deadline || null,
      description: description?.trim() || "",
    });

    res.status(201).json({
      message: "Savings goal created successfully",
      goal,
    });
  } catch (error) {
    console.error("Create savings goal error:", error);

    res.status(500).json({
      message: "Server error while creating savings goal",
    });
  }
};

// GET GOALS
const getSavingsGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    const formattedGoals = goals.map((goal) => {
      const target = Number(goal.targetAmount);
      const current = Number(goal.currentAmount);

      const percentage =
        target > 0
          ? Math.round((current / target) * 100)
          : 0;

      const remaining = Math.max(
        target - current,
        0
      );

      return {
        ...goal.toObject(),
        percentage: Math.min(percentage, 100),
        remaining,
        completed: current >= target,
      };
    });

    res.json(formattedGoals);
  } catch (error) {
    console.error("Get savings goals error:", error);

    res.status(500).json({
      message: "Server error while fetching savings goals",
    });
  }
};

// UPDATE GOAL
const updateSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    const {
      name,
      targetAmount,
      currentAmount,
      deadline,
      description,
    } = req.body;

    const newTarget =
      targetAmount !== undefined
        ? Number(targetAmount)
        : goal.targetAmount;

    const newCurrent =
      currentAmount !== undefined
        ? Number(currentAmount)
        : goal.currentAmount;

    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        message: "Goal name cannot be empty",
      });
    }

    if (newTarget <= 0) {
      return res.status(400).json({
        message: "Target amount must be greater than 0",
      });
    }

    if (newCurrent < 0) {
      return res.status(400).json({
        message: "Current amount cannot be negative",
      });
    }

    if (newCurrent > newTarget) {
      return res.status(400).json({
        message:
          "Current amount cannot be greater than target amount",
      });
    }

    if (name !== undefined) {
      goal.name = name.trim();
    }

    goal.targetAmount = newTarget;
    goal.currentAmount = newCurrent;

    if (deadline !== undefined) {
      goal.deadline = deadline || null;
    }

    if (description !== undefined) {
      goal.description = description.trim();
    }

    await goal.save();

    res.json({
      message: "Savings goal updated successfully",
      goal,
    });
  } catch (error) {
    console.error("Update savings goal error:", error);

    res.status(500).json({
      message: "Server error while updating savings goal",
    });
  }
};

// DELETE GOAL
const deleteSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    res.json({
      message: "Savings goal deleted successfully",
    });
  } catch (error) {
    console.error("Delete savings goal error:", error);

    res.status(500).json({
      message: "Server error while deleting savings goal",
    });
  }
};

module.exports = {
  createSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal,
};