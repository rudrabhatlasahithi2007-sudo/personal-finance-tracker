const express = require("express");

const {
  createSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal,
  deleteSavingsGoal,
} = require("../controllers/savingsGoalController");

const protect = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", createSavingsGoal);

router.get("/", getSavingsGoals);

router.put("/:id", updateSavingsGoal);

router.delete("/:id", deleteSavingsGoal);

module.exports = router;