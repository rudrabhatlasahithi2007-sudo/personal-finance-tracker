const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    currentAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    targetDate: {
      type: Date,
    },

    description: {
      type: String,
      trim: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SavingsGoal",
  savingsGoalSchema
);