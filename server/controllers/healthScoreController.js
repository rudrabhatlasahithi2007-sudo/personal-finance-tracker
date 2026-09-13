const Transaction = require("../models/Transaction");

const getFinancialHealthScore = async (req, res) => {
  try {
    const currentDate = new Date();

    const month =
      Number(req.query.month) ||
      currentDate.getMonth() + 1;

    const year =
      Number(req.query.year) ||
      currentDate.getFullYear();

    const startDate = new Date(
      year,
      month - 1,
      1
    );

    const endDate = new Date(
      year,
      month,
      1
    );

    const transactions = await Transaction.find({
      user: req.user._id,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount);

      if (transaction.type === "income") {
        totalIncome += amount;
      }

      if (transaction.type === "expense") {
        totalExpense += amount;
      }
    });

    // No financial data
    if (totalIncome === 0 && totalExpense === 0) {
      return res.status(200).json({
        month,
        year,
        score: 0,
        rating: "No data",
        factors: [],
      });
    }

    /*
      Score is divided into 4 factors:

      1. Savings rate       → 30 points
      2. Expense control    → 30 points
      3. Income stability   → 20 points
      4. Financial surplus  → 20 points
    */

    let savingsRate = 0;

    if (totalIncome > 0) {
      savingsRate =
        ((totalIncome - totalExpense) /
          totalIncome) *
        100;
    }

    // -----------------------------
    // 1. Savings Rate — 30 points
    // -----------------------------

    let savingsScore = 0;

    if (savingsRate >= 30) {
      savingsScore = 30;
    } else if (savingsRate >= 20) {
      savingsScore = 25;
    } else if (savingsRate >= 10) {
      savingsScore = 20;
    } else if (savingsRate >= 5) {
      savingsScore = 10;
    } else if (savingsRate >= 0) {
      savingsScore = 5;
    }

    // -----------------------------
    // 2. Expense Control — 30 points
    // -----------------------------

    let expenseScore = 0;

    if (totalIncome > 0) {
      const expenseRatio =
        (totalExpense / totalIncome) *
        100;

      if (expenseRatio <= 50) {
        expenseScore = 30;
      } else if (expenseRatio <= 70) {
        expenseScore = 25;
      } else if (expenseRatio <= 80) {
        expenseScore = 20;
      } else if (expenseRatio <= 90) {
        expenseScore = 10;
      } else if (expenseRatio <= 100) {
        expenseScore = 5;
      }
    }

    // -----------------------------
    // 3. Income Stability — 20 points
    // -----------------------------

    let incomeScore = 0;

    if (totalIncome > 0) {
      incomeScore = 20;
    }

    // -----------------------------
    // 4. Financial Surplus — 20 points
    // -----------------------------

    let surplusScore = 0;

    if (totalIncome > totalExpense) {
      surplusScore = 20;
    } else if (totalIncome === totalExpense) {
      surplusScore = 5;
    }

    const score =
      savingsScore +
      expenseScore +
      incomeScore +
      surplusScore;

    // -----------------------------
    // Rating
    // -----------------------------

    let rating;

    if (score >= 80) {
      rating = "Excellent";
    } else if (score >= 65) {
      rating = "Good";
    } else if (score >= 50) {
      rating = "Fair";
    } else {
      rating = "Needs Improvement";
    }

    const factors = [
      {
        name: "Savings Rate",
        score: savingsScore,
        maxScore: 30,
        value: `${Math.round(
          savingsRate
        )}%`,
      },
      {
        name: "Expense Control",
        score: expenseScore,
        maxScore: 30,
        value:
          totalIncome > 0
            ? `${Math.round(
                (totalExpense /
                  totalIncome) *
                  100
              )}% of income`
            : "No income",
      },
      {
        name: "Income",
        score: incomeScore,
        maxScore: 20,
        value: totalIncome > 0
          ? "Recorded"
          : "No income",
      },
      {
        name: "Financial Surplus",
        score: surplusScore,
        maxScore: 20,
        value:
          totalIncome > totalExpense
            ? "Positive"
            : totalIncome === totalExpense
            ? "Balanced"
            : "Negative",
      },
    ];

    res.status(200).json({
      month,
      year,

      score,

      rating,

      summary: {
        totalIncome,
        totalExpense,
        savings:
          totalIncome - totalExpense,
        savingsRate: Math.round(
          savingsRate
        ),
      },

      factors,
    });
  } catch (error) {
    console.error(
      "Financial health score error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to calculate financial health score",
    });
  }
};

module.exports = {
  getFinancialHealthScore,
};