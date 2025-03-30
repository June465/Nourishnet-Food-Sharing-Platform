const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
// const { protect } = require('../middleware/authMiddleware'); // Optional: Add authentication middleware

// GET /api/donations/active - Get all currently active donations
// No upload middleware needed here
router.get('/active', donationController.getActiveDonations);

// GET /api/donations/:id - Get details for a single donation
// No upload middleware needed here
router.get('/:id', donationController.getDonation);

// POST /api/donations/add - Add a new donation (Multer applied in server.js for this path)
// Requires authentication (e.g., protect middleware)
router.post('/add', /* protect, */ donationController.addDonation);

// POST /api/donations/order - Place an order for a donation
// Requires authentication (e.g., protect middleware)
// No upload middleware needed here
router.post('/order', /* protect, */ donationController.placeOrder);

// PUT /api/donations/:id - Update an existing donation (placeholder)
// Requires authentication and authorization (ensure user owns donation)
// No upload middleware needed unless updating image
router.put('/:id', /* protect, authorizeOwner, */ donationController.updateDonation);

// DELETE /api/donations/:id - Delete a donation (placeholder)
// Requires authentication and authorization
// No upload middleware needed here
router.delete('/:id', /* protect, authorizeOwner, */ donationController.deleteDonation);

module.exports = router;