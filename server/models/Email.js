const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  subject: String,
  from: String,
  date: { type: Date, unique: true, index: true }, // Ensure uniqueness
  read: { type: Boolean, default: false }, 
  note: { type: String, default: '' } // New field for notes
});

module.exports = mongoose.model('Email', emailSchema);
