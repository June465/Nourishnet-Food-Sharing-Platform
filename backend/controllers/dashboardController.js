const Donation = require('../models/Donation');
const Order = require('../models/Order');

exports.getDistributorDashboard = async (req, res) => {
  try {
    const distributorId = req.params.id;
    // Fetch active donations for this distributor (useBy date in the future)
    const activeDonations = await Donation.find({
      distributor: distributorId,
      useBy: { $gt: new Date() }
    });
    // Fetch order history (orders linked to this distributor via the donation)
    const orderHistory = await Order.find({ distributor: distributorId });
    res.json({ success: true, activeDonations, orderHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCollectorDashboard = async (req, res) => {
  try {
    const collectorId = req.params.id;
    // Fetch available donations (active donations with useBy in future)
    const availableDonations = await Donation.find({
      useBy: { $gt: new Date() }
    });
    // Fetch collector's order history
    const orderHistory = await Order.find({ collector: collectorId });
    res.json({ success: true, availableDonations, orderHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
