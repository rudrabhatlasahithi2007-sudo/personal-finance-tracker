const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

// Load environment variables
dotenv.config();

// ==============================
// IMPORT ROUTES
// ==============================

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const recurringTransactionRoutes = require("./routes/recurringTransactionRoutes");
const savingsGoalRoutes = require("./routes/savingsGoalRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const healthScoreRoutes = require("./routes/healthScoreRoutes");

// ==============================
// CREATE EXPRESS APP
// ==============================

const app = express();

// ==============================
// MIDDLEWARE
// ==============================

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// TEST ROUTE
// ==============================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Personal Finance API is running",
  });
});

// ==============================
// API ROUTES
// ==============================

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

// ==============================
// 404 ROUTE
// ==============================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ==============================
// ERROR HANDLER
// ==============================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

// ==============================
// DATABASE + SERVER
// ==============================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

startServer();