const ManualTransaction = require('../models/ManualTransaction');

// Get all manual transactions
exports.getManualTransactions = async (req, res) => {
  try {
    const transactions = await ManualTransaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a new manual transaction
exports.addManualTransaction = async (req, res) => {
  try {
    const { type, amount, note, date } = req.body;

    if (!type || !amount) {
      return res.status(400).json({ message: 'Type and amount are required' });
    }

    const transaction = new ManualTransaction({
      type,
      amount,
      note,
      date: date || Date.now(),
    });

    const savedTransaction = await transaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};


// Update note of a manual transaction by ID
exports.updateManualTransactionNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ message: 'Note is required' });
    }

    const updatedTransaction = await ManualTransaction.findByIdAndUpdate(
      id,
      { note },
      { new: true } // return the updated document
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(updatedTransaction);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteManualTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTransaction = await ManualTransaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};