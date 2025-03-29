const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  donationId: { type: String },
  collector: { type: String },
  distributor: { type: String },
  itemCount: { type: Number, required: true },
  status: { type: String, default: 'placed' },
  orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
