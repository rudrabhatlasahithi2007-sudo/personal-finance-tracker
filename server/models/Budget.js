const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    // User who owns this budget
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Expense category
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Monthly budget amount
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Month for which the budget is created
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    // Year for which the budget is created
    year: {
      type: Number,
      required: true,
      min: 2000,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from creating
// two budgets for the same category/month/year
budgetSchema.index(
  {
    user: 1,
    category: 1,
    month: 1,
    year: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Budget", budgetSchema);