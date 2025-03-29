const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Example route
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/changePassword', authController.changePassword);
router.post('/forgotPassword', authController.forgotPassword);
console.log('authController:', authController);

module.exports = router;
