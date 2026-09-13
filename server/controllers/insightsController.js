const Transaction = require("../models/Transaction");

const getFinancialInsights = async (req, res) => {
  try {
    const currentDate = new Date();

    const currentMonth =
      Number(req.query.month) ||
      currentDate.getMonth() + 1;

    const currentYear =
      Number(req.query.year) ||
      currentDate.getFullYear();

    const startDate = new Date(
      currentYear,
      currentMonth - 1,
      1
    );

    const endDate = new Date(
      currentYear,
      currentMonth,
      1
    );

    const transactions = await Transaction.find({
      user: req.user._id,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    if (transactions.length === 0) {
      return res.status(200).json({
        month: currentMonth,
        year: currentYear,
        insights: [],
        summary: {
          totalIncome: 0,
          totalExpense: 0,
          savings: 0,
          savingsRate: 0,
          topCategory: null,
        },
      });
    }

    let totalIncome = 0;
    let totalExpense = 0;

    const categoryExpenses = {};

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount);

      if (transaction.type === "income") {
        totalIncome += amount;
      }

      if (transaction.type === "expense") {
        totalExpense += amount;

        const category = transaction.category;

        if (!categoryExpenses[category]) {
          categoryExpenses[category] = 0;
        }

        categoryExpenses[category] += amount;
      }
    });

    const savings = totalIncome - totalExpense;

    const savingsRate =
      totalIncome > 0
        ? (savings / totalIncome) * 100
        : 0;

    // Find highest spending category
    let topCategory = null;

    Object.entries(categoryExpenses).forEach(
      ([category, amount]) => {
        if (
          !topCategory ||
          amount > topCategory.amount
        ) {
          topCategory = {
            category,
            amount,
          };
        }
      }
    );

    const insights = [];

    // Insight 1: income vs expenses
    if (totalExpense > totalIncome) {
      insights.push({
        type: "warning",
        title: "Expenses are higher than income",
        message:
          "You spent more than you earned this month. Consider reviewing your expenses.",
      });
    } else if (totalIncome > totalExpense) {
      insights.push({
        type: "positive",
        title: "Your income is higher than expenses",
        message:
          "Good job! You are spending less than you earn this month.",
      });
    }

    // Insight 2: savings rate
    if (savingsRate >= 20) {
      insights.push({
        type: "positive",
        title: "Strong savings rate",
        message:
          `You saved ${Math.round(
            savingsRate
          )}% of your income this month.`,
      });
    } else if (
      savingsRate >= 0 &&
      savingsRate < 10
    ) {
      insights.push({
        type: "warning",
        title: "Low savings rate",
        message:
          "Your savings rate is below 10%. Consider reducing unnecessary expenses.",
      });
    }

    // Insight 3: highest expense category
    if (topCategory) {
      const categoryPercentage =
        totalExpense > 0
          ? (topCategory.amount /
              totalExpense) *
            100
          : 0;

      insights.push({
        type:
          categoryPercentage >= 40
            ? "warning"
            : "info",
        title: "Highest spending category",
        message:
          `${topCategory.category} is your highest expense category at ₹${topCategory.amount.toLocaleString(
            "en-IN"
          )}, representing ${Math.round(
            categoryPercentage
          )}% of your expenses.`,
      });
    }

    // Insight 4: large expenses
    const largeExpenses = transactions.filter(
      (transaction) =>
        transaction.type === "expense" &&
        Number(transaction.amount) >= 5000
    );

    if (largeExpenses.length > 0) {
      insights.push({
        type: "info",
        title: "Large expenses detected",
        message:
          `You have ${largeExpenses.length} expense${
            largeExpenses.length > 1
              ? "s"
              : ""
          } of ₹5,000 or more this month.`,
      });
    }

    res.status(200).json({
      month: currentMonth,
      year: currentYear,

      summary: {
        totalIncome,
        totalExpense,
        savings,
        savingsRate: Math.round(
          savingsRate
        ),
        topCategory,
      },

      insights,
    });
  } catch (error) {
    console.error(
      "Get financial insights error:",
      error
    );

    res.status(500).json({
      message: "Failed to generate financial insights",
    });
  }
};

module.exports = {
  getFinancialInsights,
};