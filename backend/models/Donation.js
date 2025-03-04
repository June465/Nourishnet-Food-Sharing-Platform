const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  distributor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  foodType: { type: String, enum: ['veg', 'nonveg'], required: true },
  allergy: { type: String },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  pickupTime: { type: String, required: true },
  useBy: { type: Date, required: true },
  // Store the image as a URL or file path
  foodImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', DonationSchema);
