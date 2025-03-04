const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  role: { type: String, enum: ['collector', 'distributor'], required: true },
  password: { type: String, required: true },
  // For distributors: food categories
  categories: { type: String },
  // For collectors: region and food requirements
  region: { type: String },
  requirements: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
