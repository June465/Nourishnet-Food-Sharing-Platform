const Donation = require('../models/Donation');
const Order = require('../models/Order');

// Add Donation (handles image upload via multer)
exports.addDonation = async (req, res) => {
  try {
    let foodImageUrl = '';
    if (req.file) {
      // Save file path relative to server
      foodImageUrl = `/uploads/${req.file.filename}`;
    }
    const donation = new Donation({
      distributor: req.body.distributor,
      foodType: req.body.foodType,
      allergy: req.body.allergy,
      quantity: req.body.quantity,
      location: req.body.location,
      pickupTime: req.body.pickupTime,
      useBy: new Date(req.body.useBy),
      foodImage: foodImageUrl,
      createdAt: new Date(),
    });
    const savedDonation = await donation.save();
    res.json({ success: true, donation: savedDonation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      status: 'placed',
      orderDate: new Date(),
    });
    const savedOrder = await order.save();
    res.json({ success: true, orderId: savedOrder._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getActiveDonations = async (req, res) => {
  try {
    const activeDonations = await Donation.find({
      useBy: { $gt: new Date() },
    });
    res.json({ donations: activeDonations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
