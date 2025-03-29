const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Distributor dashboard (using distributor id)
router.get('/distributor/:id', dashboardController.getDistributorDashboard);

// Collector dashboard (using collector id)
router.get('/collector/:id', dashboardController.getCollectorDashboard);

module.exports = router;
