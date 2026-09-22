const express = require("express");

const {
  createRecurringTransaction,
  getRecurringTransactions,
  updateRecurringTransaction,
  deleteRecurringTransaction,
} = require("../controllers/recurringTransactionController");

const protect = require("../middleware/auth");

const router = express.Router();

// All recurring transaction routes require login
router.use(protect);

// Create recurring transaction
router.post("/", createRecurringTransaction);

// Get user's recurring transactions
router.get("/", getRecurringTransactions);

// Update recurring transaction
router.put("/:id", updateRecurringTransaction);

// Delete recurring transaction
router.delete("/:id", deleteRecurringTransaction);

module.exports = router;