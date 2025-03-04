const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  collector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Optionally, you can link distributor here via donation or store it separately
  itemCount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  status: { type: String, default: 'placed' }
});

module.exports = mongoose.model('Order', OrderSchema);
