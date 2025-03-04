const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// For Distributor: get active donations and order history (using distributor id)
router.get('/distributor/:id', dashboardController.getDistributorDashboard);

// For Collector: get available donations and collector’s order history (using collector id)
router.get('/collector/:id', dashboardController.getCollectorDashboard);

module.exports = router;
