const express = require("express");

const {
  getFinancialInsights,
} = require("../controllers/insightsController");

const protect = require("../middleware/auth");

const router = express.Router();

// All insight routes require authentication
router.use(protect);

// Get financial insights
router.get("/", getFinancialInsights);

module.exports = router;