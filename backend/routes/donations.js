const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/add', donationController.addDonation);
router.post('/order', donationController.placeOrder);
router.get('/active', donationController.getActiveDonations);

module.exports = router;
