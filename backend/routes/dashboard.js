const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// GET /api/dashboard/distributor/:id - Distributor dashboard data
router.get('/distributor/:id', dashboardController.getDistributorDashboard);

// GET /api/dashboard/collector/:id - Collector dashboard data
router.get('/collector/:id', dashboardController.getCollectorDashboard);

module.exports = router;