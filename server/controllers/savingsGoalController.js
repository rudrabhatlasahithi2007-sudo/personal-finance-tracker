const SavingsGoal = require("../models/SavingsGoal");

// Create a savings goal
const createSavingsGoal = async (req, res) => {
  try {
    const {
      name,
      targetAmount,
      currentAmount,
      targetDate,
      description,
    } = req.body;

    if (!name || targetAmount === undefined) {
      return res.status(400).json({
        message: "Name and target amount are required",
      });
    }

    if (Number(targetAmount) <= 0) {
      return res.status(400).json({
        message: "Target amount must be greater than 0",
      });
    }

    const savedAmount =
      currentAmount === undefined
        ? 0
        : Number(currentAmount);

    if (savedAmount < 0) {
      return res.status(400).json({
        message: "Current amount cannot be negative",
      });
    }

    if (savedAmount > Number(targetAmount)) {
      return res.status(400).json({
        message:
          "Current amount cannot be greater than target amount",
      });
    }

    const goal = await SavingsGoal.create({
      user: req.user._id,
      name,
      targetAmount: Number(targetAmount),
      currentAmount: savedAmount,
      targetDate: targetDate || undefined,
      description,
      completed:
        savedAmount >= Number(targetAmount),
    });

    res.status(201).json({
      message: "Savings goal created successfully",
      goal,
    });
  } catch (error) {
    console.error("Create savings goal error:", error);

    res.status(500).json({
      message: "Failed to create savings goal",
    });
  }
};

// Get all savings goals
const getSavingsGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    const goalData = goals.map((goal) => {
      const percentage =
        goal.targetAmount > 0
          ? (goal.currentAmount /
              goal.targetAmount) *
            100
          : 0;

      return {
        _id: goal._id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        targetDate: goal.targetDate,
        description: goal.description,
        completed: goal.completed,
        percentage: Math.min(
          Math.round(percentage),
          100
        ),
        remainingAmount: Math.max(
          goal.targetAmount -
            goal.currentAmount,
          0
        ),
      };
    });

    res.status(200).json({
      goals: goalData,
    });
  } catch (error) {
    console.error("Get savings goals error:", error);

    res.status(500).json({
      message: "Failed to load savings goals",
    });
  }
};

// Update a savings goal
const updateSavingsGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      targetAmount,
      targetDate,
      description,
    } = req.body;

    const goal = await SavingsGoal.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    if (name !== undefined) {
      goal.name = name;
    }

    if (targetAmount !== undefined) {
      if (Number(targetAmount) <= 0) {
        return res.status(400).json({
          message:
            "Target amount must be greater than 0",
        });
      }

      if (
        goal.currentAmount >
        Number(targetAmount)
      ) {
        return res.status(400).json({
          message:
            "Target amount cannot be less than current savings",
        });
      }

      goal.targetAmount = Number(targetAmount);
    }

    if (targetDate !== undefined) {
      goal.targetDate =
        targetDate || undefined;
    }

    if (description !== undefined) {
      goal.description = description;
    }

    goal.completed =
      goal.currentAmount >=
      goal.targetAmount;

    await goal.save();

    res.status(200).json({
      message: "Savings goal updated successfully",
      goal,
    });
  } catch (error) {
    console.error("Update savings goal error:", error);

    res.status(500).json({
      message: "Failed to update savings goal",
    });
  }
};

// Add money to a savings goal
const addSavings = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (
      amount === undefined ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const goal = await SavingsGoal.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!goal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    const newAmount =
      goal.currentAmount + Number(amount);

    if (newAmount > goal.targetAmount) {
      return res.status(400).json({
        message:
          "Savings cannot exceed the target amount",
      });
    }

    goal.currentAmount = newAmount;

    if (
      goal.currentAmount >=
      goal.targetAmount
    ) {
      goal.completed = true;
    }

    await goal.save();

    res.status(200).json({
      message: "Savings added successfully",
      goal,
    });
  } catch (error) {
    console.error("Add savings error:", error);

    res.status(500).json({
      message: "Failed to add savings",
    });
  }
};

// Delete a savings goal
const deleteSavingsGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const goal =
      await SavingsGoal.findOneAndDelete({
        _id: id,
        user: req.user._id,
      });

    if (!goal) {
      return res.status(404).json({
        message: "Savings goal not found",
      });
    }

    res.status(200).json({
      message: "Savings goal deleted successfully",
    });
  } catch (error) {
    console.error("Delete savings goal error:", error);

    res.status(500).json({
      message: "Failed to delete savings goal",
    });
  }
};

module.exports = {
  createSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  addSavings,
  deleteSavingsGoal,
};