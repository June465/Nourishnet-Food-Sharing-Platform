const Donation = require('../models/Donation');
const Order = require('../models/Order');
// const User = require('../models/User'); // Needed if fetching user names
// const Feedback = require('../models/Feedback'); // Needed if fetching feedback directly

// For Distributor: get active donations and order history (with feedback if possible)
exports.getDistributorDashboard = async (req, res) => {
    try {
        const distributorId = req.params.id;
        if (!distributorId) {
            return res.status(400).json({ success: false, message: 'Distributor ID is required.' });
        }

        // Active donations: only those with useBy date in the future AND quantity > 0
        const activeDonations = await Donation.find({
            distributor: distributorId,
            useBy: { $gt: new Date() },
            quantity: { $gt: 0 } // Only show donations with items left
        }).sort({ useBy: 1 }); // Sort by soonest expiry

        // Order history for this distributor
        // Populate collector details if needed (adds overhead)
        const orderHistory = await Order.find({ distributor: distributorId })
            // .populate('collector', 'name') // Example: get collector's name
            .sort({ orderDate: -1 }); // Sort newest first

        // Fetch feedback related to these orders (more efficient than fetching all feedback)
        // const orderIds = orderHistory.map(order => order._id);
        // const feedbacks = await Feedback.find({ orderId: { $in: orderIds } });

        // Combine data (or let frontend fetch feedback separately)

        res.json({ success: true, activeDonations, orderHistory }); // Send feedbacks if fetched

    } catch (err) {
        console.error("Distributor Dashboard Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching distributor dashboard data.' });
    }
};

// For Collector: get available donations and collector’s order history (with feedback status)
exports.getCollectorDashboard = async (req, res) => {
    try {
        const collectorId = req.params.id;
         if (!collectorId) {
             return res.status(400).json({ success: false, message: 'Collector ID is required.' });
         }

        // Available donations: useBy date in future AND quantity > 0
        // Consider filtering based on collector's region/preferences if implemented
        const availableDonations = await Donation.find({
            useBy: { $gt: new Date() },
            quantity: { $gt: 0 }
        }).sort({ createdAt: -1 }); // Show newest donations first

        // Collector's order history
        // Populate donation details if needed (adds overhead)
        const orderHistory = await Order.find({ collector: collectorId })
            // .populate('donationId', 'foodType location') // Example: get donation foodType
            // .populate('distributor', 'name') // Example: get distributor name
            .sort({ orderDate: -1 });

        // Fetch feedback given by THIS collector (or check feedback status for their orders)
        // const orderIds = orderHistory.map(order => order._id);
        // const feedbackGiven = await Feedback.find({ collectorId: collectorId, orderId: { $in: orderIds } });
        // const feedbackGivenMap = feedbackGiven.reduce((map, fb) => { map[fb.orderId] = true; return map; }, {});
        // Attach feedback status to each order object (or let frontend handle)

        res.json({ success: true, availableDonations, orderHistory }); // Send feedback status if determined

    } catch (err) {
        console.error("Collector Dashboard Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching collector dashboard data.' });
    }
};