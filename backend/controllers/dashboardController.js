const Donation = require('../models/Donation');
const Order = require('../models/Order');

// For Distributor: get active donations and order history
exports.getDistributorDashboard = async (req, res) => {
  try {
    const distributorId = req.params.id;
    // Active donations: only those with useBy date in the future
    const activeDonations = await Donation.find({
      distributor: distributorId,
      useBy: { $gt: new Date() },
    });
    const orderHistory = await Order.find({ distributor: distributorId });
    res.json({ success: true, activeDonations, orderHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// For Collector: get available donations and collector’s order history
exports.getCollectorDashboard = async (req, res) => {
  try {
    const collectorId = req.params.id;
    const availableDonations = await Donation.find({
      useBy: { $gt: new Date() },
    });
    const orderHistory = await Order.find({ collector: collectorId });
    res.json({ success: true, availableDonations, orderHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
