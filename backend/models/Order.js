const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Link to the specific Donation item ordered
  donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation', // Reference the 'Donation' model
      required: true,
      index: true
  },
  // Link to the User (collector) who placed the order
  collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
  },
  // Link to the User (distributor) associated with the donation
  distributor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
  },
  itemCount: {
      type: Number,
      required: [true, 'Number of items requested is required.'],
      min: [1, 'Must request at least 1 item.']
  },
  status: {
      type: String,
      enum: ['placed', 'confirmed', 'picked_up', 'cancelled'], // Example statuses
      default: 'placed'
  },
  orderDate: {
      type: Date,
      default: Date.now
  },
  // Optional: Link to feedback if submitted
  // feedbackId: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: 'Feedback',
  //     default: null
  // },
  // Optional: Flag to easily check if feedback was given
  // feedbackGiven: {
  //     type: Boolean,
  //     default: false
  // }
});

module.exports = mongoose.model('Order', orderSchema);