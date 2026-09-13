const express = require("express");

const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} = require("../controllers/budgetController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All budget routes require authentication
router.use(protect);

// Create budget
router.post("/", createBudget);

// Get budgets
router.get("/", getBudgets);

// Update budget
router.put("/:id", updateBudget);

// Delete budget
router.delete("/:id", deleteBudget);

module.exports = router;