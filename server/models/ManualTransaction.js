const mongoose = require('mongoose');

const ManualTransactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['credited', 'debited'], required: true },
  amount: { type: Number, required: true },
  note: { type: String, default: '' }, // Optional note field
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ManualTransaction', ManualTransactionSchema);
