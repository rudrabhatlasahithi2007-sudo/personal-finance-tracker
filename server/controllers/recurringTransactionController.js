const RecurringTransaction = require("../models/RecurringTransaction");

// Calculate the next occurrence based on frequency
const calculateNextDate = (date, frequency) => {
  const nextDate = new Date(date);

  if (frequency === "weekly") {
    nextDate.setDate(nextDate.getDate() + 7);
  }

  if (frequency === "monthly") {
    const originalDay = nextDate.getDate();

    // Move to the first day of the next month
    nextDate.setDate(1);
    nextDate.setMonth(nextDate.getMonth() + 1);

    // Get the last day of the new month
    const lastDay = new Date(
      nextDate.getFullYear(),
      nextDate.getMonth() + 1,
      0
    ).getDate();

    // Keep the original day if possible
    nextDate.setDate(Math.min(originalDay, lastDay));
  }

  if (frequency === "yearly") {
    const originalMonth = nextDate.getMonth();
    const originalDay = nextDate.getDate();

    nextDate.setDate(1);
    nextDate.setFullYear(nextDate.getFullYear() + 1);
    nextDate.setMonth(originalMonth);

    // Handle February 29 in non-leap years
    const lastDay = new Date(
      nextDate.getFullYear(),
      originalMonth + 1,
      0
    ).getDate();

    nextDate.setDate(Math.min(originalDay, lastDay));
  }

  return nextDate;
};

// Find the next future occurrence
const getNextOccurrence = (startDate, frequency) => {
  let nextDate = new Date(startDate);
  const today = new Date();

  while (nextDate <= today) {
    nextDate = calculateNextDate(nextDate, frequency);
  }

  return nextDate;
};

// Create recurring transaction
const createRecurringTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      category,
      description,
      frequency,
      startDate,
    } = req.body;

    if (
      !type ||
      amount === undefined ||
      !category ||
      !frequency ||
      !startDate
    ) {
      return res.status(400).json({
        message:
          "Type, amount, category, frequency and start date are required",
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        message: "Invalid transaction type",
      });
    }

    if (!["weekly", "monthly", "yearly"].includes(frequency)) {
      return res.status(400).json({
        message: "Invalid frequency",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    const nextDate = getNextOccurrence(
      new Date(startDate),
      frequency
    );

    const recurringTransaction =
      await RecurringTransaction.create({
        user: req.user._id,
        type,
        amount: Number(amount),
        category,
        description,
        frequency,
        startDate: new Date(startDate),
        nextDate,
        active: true,
      });

    res.status(201).json({
      message: "Recurring transaction created successfully",
      recurringTransaction,
    });
  } catch (error) {
    console.error(
      "Create recurring transaction error:",
      error
    );

    res.status(500).json({
      message: "Failed to create recurring transaction",
    });
  }
};

// Get user's recurring transactions
const getRecurringTransactions = async (req, res) => {
  try {
    const recurringTransactions =
      await RecurringTransaction.find({
        user: req.user._id,
      }).sort({ nextDate: 1 });

    res.status(200).json({
      recurringTransactions,
    });
  } catch (error) {
    console.error(
      "Get recurring transactions error:",
      error
    );

    res.status(500).json({
      message: "Failed to load recurring transactions",
    });
  }
};

// Update recurring transaction
const updateRecurringTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      type,
      amount,
      category,
      description,
      frequency,
      startDate,
      active,
    } = req.body;

    const recurringTransaction =
      await RecurringTransaction.findOne({
        _id: id,
        user: req.user._id,
      });

    if (!recurringTransaction) {
      return res.status(404).json({
        message: "Recurring transaction not found",
      });
    }

    if (type !== undefined) {
      if (!["income", "expense"].includes(type)) {
        return res.status(400).json({
          message: "Invalid transaction type",
        });
      }

      recurringTransaction.type = type;
    }

    if (amount !== undefined) {
      if (Number(amount) <= 0) {
        return res.status(400).json({
          message: "Amount must be greater than 0",
        });
      }

      recurringTransaction.amount = Number(amount);
    }

    if (category !== undefined) {
      recurringTransaction.category = category;
    }

    if (description !== undefined) {
      recurringTransaction.description = description;
    }

    if (frequency !== undefined) {
      if (
        !["weekly", "monthly", "yearly"].includes(
          frequency
        )
      ) {
        return res.status(400).json({
          message: "Invalid frequency",
        });
      }

      recurringTransaction.frequency = frequency;
    }

    if (startDate !== undefined) {
      recurringTransaction.startDate = new Date(startDate);
    }

    if (active !== undefined) {
      recurringTransaction.active = Boolean(active);
    }

    // Recalculate next date if schedule changed
    if (frequency !== undefined || startDate !== undefined) {
      recurringTransaction.nextDate = getNextOccurrence(
        recurringTransaction.startDate,
        recurringTransaction.frequency
      );
    }

    await recurringTransaction.save();

    res.status(200).json({
      message: "Recurring transaction updated successfully",
      recurringTransaction,
    });
  } catch (error) {
    console.error(
      "Update recurring transaction error:",
      error
    );

    res.status(500).json({
      message: "Failed to update recurring transaction",
    });
  }
};

// Delete recurring transaction
const deleteRecurringTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const recurringTransaction =
      await RecurringTransaction.findOneAndDelete({
        _id: id,
        user: req.user._id,
      });

    if (!recurringTransaction) {
      return res.status(404).json({
        message: "Recurring transaction not found",
      });
    }

    res.status(200).json({
      message: "Recurring transaction deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete recurring transaction error:",
      error
    );

    res.status(500).json({
      message: "Failed to delete recurring transaction",
    });
  }
};

module.exports = {
  createRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction,
};