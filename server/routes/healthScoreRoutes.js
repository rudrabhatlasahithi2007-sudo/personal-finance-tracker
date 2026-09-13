const express = require("express");

const {
  getFinancialHealthScore,
} = require("../controllers/healthScoreController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// All health score routes require authentication
router.use(protect);

// Get financial health score
router.get("/", getFinancialHealthScore);

module.exports = router;