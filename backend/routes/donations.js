// File: backend/routes/donations.js

const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.get('/:id', donationController.getDonation);
router.post('/add', donationController.addDonation);
router.post('/order', donationController.placeOrder);
router.get('/active', donationController.getActiveDonations);

module.exports = router;
