const Transaction = require("../models/Transaction");

const createTransaction = async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

if (!type || amount === undefined || !category) {
  return res.status(400).json({
    message: "Please provide type, amount and category",
  });
}

if (!["income", "expense"].includes(type)) {
  return res.status(400).json({
    message: "Invalid transaction type",
  });
}

if (Number(amount) <= 0) {
  return res.status(400).json({
    message: "Amount must be greater than 0",
  });
}

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      description,
      date,
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    }).sort({ date: -1 });

    res.status(200).json({
      transactions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    const { type, amount, category, description, date } = req.body;

    transaction.type = type ?? transaction.type;
    transaction.amount = amount ?? transaction.amount;
    transaction.category = category ?? transaction.category;
    transaction.description = description ?? transaction.description;
    transaction.date = date ?? transaction.date;

    await transaction.save();

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};