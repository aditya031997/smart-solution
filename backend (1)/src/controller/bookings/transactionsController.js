// controllers/TransactionController.js

const { transactions } = require("../../model");

// Create a new transaction
exports.createTransaction = async (req, res) => {
  console.log(req.body);
  try {
    delete req.body.transaction_id;
    const transaction = await transactions.create(req.body);
    return res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const gettransactions = await transactions.findAll();
    return res.status(200).json(gettransactions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a single transaction by ID
exports.getTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    return res.status(200).json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a transaction by ID
exports.updateTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const [updatedRows] = await transactions.update(req.body, {
      where: { transaction_id: id },
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    const updatedTransaction = await transactions.findByPk(id);
    return res.status(200).json(updatedTransaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a transaction by ID
exports.deleteTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedRowCount = await transactions.destroy({
      where: { transaction_id: id },
    });

    if (deletedRowCount === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    return res.status(204).send(); // No content
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
