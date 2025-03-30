const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register - Register a new user
router.post('/register', authController.register);

// POST /api/auth/login - Login a user
router.post('/login', authController.login);

// POST /api/auth/changePassword - Change logged-in user's password
router.post('/changePassword', authController.changePassword);

// POST /api/auth/forgotPassword - Request password reset (placeholder)
router.post('/forgotPassword', authController.forgotPassword);

// GET /api/auth/status - Optional: Check current login status (requires session/token)
// router.get('/status', authController.checkStatus);

module.exports = router;