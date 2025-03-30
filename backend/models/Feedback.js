const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  // Link to the specific order this feedback is for
  orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      unique: true, // Ensure only one feedback per order
      index: true
  },
  // Link to the user (collector) who submitted the feedback
  collectorId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true,
       index: true
  },
   // Link to the user (distributor) who provided the donation (redundant? already in Order)
   distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
   },
  rating: {
      type: Number,
      required: [true, 'Rating is required.'],
      min: [1, 'Rating must be at least 1.'],
      max: [5, 'Rating cannot be more than 5.']
  },
  comment: {
      type: String,
      required: [true, 'Comment is required.'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters.'] // Optional length limit
  },
  createdAt: {
      type: Date,
      default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);