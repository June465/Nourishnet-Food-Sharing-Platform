const db = require('../firebase');

// For Distributor: get active donations and order history from Firestore
exports.getDistributorDashboard = async (req, res) => {
  try {
    const distributorId = req.params.id;
    const donationsRef = db.collection('donations');
    const activeQuery = await donationsRef
      .where('distributor', '==', distributorId)
      .where('useBy', '>', new Date())
      .get();
    let activeDonations = [];
    activeQuery.forEach(doc => {
      let donation = doc.data();
      donation.id = doc.id;
      activeDonations.push(donation);
    });
    const ordersRef = db.collection('orders');
    const orderQuery = await ordersRef.where('distributor', '==', distributorId).get();
    let orderHistory = [];
    orderQuery.forEach(doc => {
      let order = doc.data();
      order.id = doc.id;
      orderHistory.push(order);
    });
    res.json({ success: true, activeDonations, orderHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// For Collector: get available donations and collector’s order history from Firestore
exports.getCollectorDashboard = async (req, res) => {
  try {
    const collectorId = req.params.id;
    const donationsRef = db.collection('donations');
    const availableQuery = await donationsRef.where('useBy', '>', new Date()).get();
    let availableDonations = [];
    availableQuery.forEach(doc => {
      let donation = doc.data();
      donation.id = doc.id;
      availableDonations.push(donation);
    });
    const ordersRef = db.collection('orders');
    const orderQuery = await ordersRef.where('collector', '==', collectorId).get();
    let orderHistory = [];
    orderQuery.forEach(doc => {
      let order = doc.data();
      order.id = doc.id;
      orderHistory.push(order);
    });
    res.json({ success: true, availableDonations, orderHistory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
