const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
// const { protect } = require('../middleware/authMiddleware'); // Optional: Authentication

// GET /api/feedback/all - Get all feedback entries (public or admin)
router.get('/all', feedbackController.getAllFeedback);

// POST /api/feedback/submit - Submit new feedback for an order
// Requires authentication (collector role)
router.post('/submit', /* protect, authorizeCollector, */ feedbackController.submitFeedback);

// GET /api/feedback/order/:orderId - Get feedback for a specific order (optional)
router.get('/order/:orderId', feedbackController.getFeedbackForOrder);


module.exports = router;