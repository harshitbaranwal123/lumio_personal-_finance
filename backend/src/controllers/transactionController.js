const Transaction = require("../models/Transaction");

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, date, category, payment, notes } = req.body;

    // Validate required fields
    if (!type || !amount || !date || !category) {
      return res.status(400).json({ 
        message: "Please provide all required fields: type, amount, date, category" 
      });
    }

    // Validate amount
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    // Validate type
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Type must be 'income' or 'expense'" });
    }

    const transaction = await Transaction.create({
      userId: req.userId,
      type,
      amount: parseFloat(amount),
      date: new Date(date),
      category,
      payment: payment || "Cash",
      notes: notes || "",
    });

    res.status(201).json({
      message: "Transaction created successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all transactions for a user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
    res.json({
      message: "Transactions retrieved successfully",
      transactions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single transaction
exports.getTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      message: "Transaction retrieved successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { type, amount, date, category, payment, notes } = req.body;

    // Validate amount if provided
    if (amount && amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId,
      },
      {
        type: type || undefined,
        amount: amount ? parseFloat(amount) : undefined,
        date: date ? new Date(date) : undefined,
        category: category || undefined,
        payment: payment || undefined,
        notes: notes || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      message: "Transaction updated successfully",
      transaction,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
