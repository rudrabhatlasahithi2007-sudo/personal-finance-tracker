const express = require("express");

const {
  createSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  addSavings,
  deleteSavingsGoal,
} = require("../controllers/savingsGoalController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All savings goal routes require authentication
router.use(protect);

// Create a goal
router.post("/", createSavingsGoal);

// Get user's goals
router.get("/", getSavingsGoals);

// Update a goal
router.put("/:id", updateSavingsGoal);

// Add money to a goal
router.patch("/:id/add", addSavings);

// Delete a goal
router.delete("/:id", deleteSavingsGoal);

module.exports = router;