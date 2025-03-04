const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET a specific user by id
router.get('/:id', userController.getUserById);

// UPDATE a user (e.g., update profile)
router.put('/:id', userController.updateUser);

// GET all users (for admin or debugging)
router.get('/', userController.getAllUsers);

module.exports = router;
