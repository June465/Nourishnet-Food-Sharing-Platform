// File: backend/controllers/donationController.js

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

// Get details for a single donation by its ID
exports.getDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    res.json({ success: true, donation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Place an order and decrement donation quantity
exports.placeOrder = async (req, res) => {
  try {
    const { donationId, itemCount, collector } = req.body;
    // Find the donation
    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({ success: false, message: 'Donation not found' });
    }
    // Check if there are enough servings available
    if (donation.quantity < itemCount) {
      return res.status(400).json({ success: false, message: 'Not enough servings available' });
    }
    // Create the order
    const order = new Order({
      donationId,
      collector,
      distributor: donation.distributor,
      itemCount,
      status: 'placed',
      orderDate: new Date(),
    });
    const savedOrder = await order.save();
    // Decrement the donation quantity
    donation.quantity -= itemCount;
    await donation.save();
    res.json({ success: true, orderId: savedOrder._id, updatedDonation: donation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all active donations (useBy date in future)
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
