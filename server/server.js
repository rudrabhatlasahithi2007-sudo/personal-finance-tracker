require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const recurringTransactionRoutes = require("./routes/recurringTransactionRoutes");
const savingsGoalRoutes = require("./routes/savingsGoalRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const healthScoreRoutes = require("./routes/healthScoreRoutes");
const savingsGoalRoutes = require("./routes/savingsGoalRoutes");
const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use(
  "/api/recurring-transactions",
  recurringTransactionRoutes
);
app.use("/api/savings-goals", savingsGoalRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/health-score", healthScoreRoutes);

app.get("/", (req, res) => {
  res.send("Personal Finance API is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});