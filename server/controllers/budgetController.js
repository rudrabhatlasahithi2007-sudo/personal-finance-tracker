const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// Create a new budget
const createBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || amount === undefined || !month || !year) {
      return res.status(400).json({
        message: "Category, amount, month and year are required",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "Budget amount must be greater than 0",
      });
    }

    const existingBudget = await Budget.findOne({
      user: req.user._id,
      category,
      month,
      year,
    });

    if (existingBudget) {
      return res.status(400).json({
        message: "Budget already exists for this category and month",
      });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      amount: Number(amount),
      month: Number(month),
      year: Number(year),
    });

    res.status(201).json({
      message: "Budget created successfully",
      budget,
    });
  } catch (error) {
    console.error("Create budget error:", error);

    res.status(500).json({
      message: "Failed to create budget",
    });
  }
};

// Get budgets for a particular month/year
const getBudgets = async (req, res) => {
  try {
    const currentDate = new Date();

    const month = Number(
      req.query.month || currentDate.getMonth() + 1
    );

    const year = Number(
      req.query.year || currentDate.getFullYear()
    );

    const budgets = await Budget.find({
      user: req.user._id,
      month,
      year,
    }).sort({ category: 1 });

    const startDate = new Date(year, month - 1, 1);

    const endDate = new Date(year, month, 1);

    const transactions = await Transaction.find({
      user: req.user._id,
      type: "expense",
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    const budgetData = budgets.map((budget) => {
      const spent = transactions
        .filter(
          (transaction) =>
            transaction.category.toLowerCase() ===
            budget.category.toLowerCase()
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount),
          0
        );

      const remaining = Number(budget.amount) - spent;

      const percentageUsed =
        budget.amount > 0
          ? (spent / Number(budget.amount)) * 100
          : 0;

      let status = "on-track";

      if (percentageUsed >= 100) {
        status = "exceeded";
      } else if (percentageUsed >= 75) {
        status = "near-limit";
      }

      return {
        _id: budget._id,
        category: budget.category,
        amount: budget.amount,
        month: budget.month,
        year: budget.year,
        spent,
        remaining,
        percentageUsed: Math.round(percentageUsed),
        status,
      };
    });

    res.status(200).json({
      month,
      year,
      budgets: budgetData,
    });
  } catch (error) {
    console.error("Get budgets error:", error);

    res.status(500).json({
      message: "Failed to load budgets",
    });
  }
};

// Update a budget
const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount } = req.body;

    const budget = await Budget.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    if (amount !== undefined && Number(amount) <= 0) {
      return res.status(400).json({
        message: "Budget amount must be greater than 0",
      });
    }

    if (category) {
      budget.category = category;
    }

    if (amount !== undefined) {
      budget.amount = Number(amount);
    }

    await budget.save();

    res.status(200).json({
      message: "Budget updated successfully",
      budget,
    });
  } catch (error) {
    console.error("Update budget error:", error);

    res.status(500).json({
      message: "Failed to update budget",
    });
  }
};

// Delete a budget
const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    res.status(200).json({
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Delete budget error:", error);

    res.status(500).json({
      message: "Failed to delete budget",
    });
  }
};

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
};