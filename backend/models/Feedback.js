const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  distributorName: { type: String },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
