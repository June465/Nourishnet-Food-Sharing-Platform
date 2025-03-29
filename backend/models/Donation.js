const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  distributor: { type: String, required: true },
  foodType: { type: String, required: true },
  allergy: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  pickupTime: { type: String, required: true },
  useBy: { type: Date, required: true },
  foodImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
