const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
// const { protect } = require('../middleware/authMiddleware'); // Optional: Authentication

// GET /api/users/:id - Get a specific user's profile (public info only, exclude password)
router.get('/:id', userController.getUserById);

// PUT /api/users/:id - Update the logged-in user's profile
// Requires authentication and authorization (user must be updating their own profile)
router.put('/:id', /* protect, authorizeSelf, */ userController.updateUser);

// GET /api/users/ - Get all users (ADMIN ONLY - requires strict authorization)
// router.get('/', /* protect, authorizeAdmin, */ userController.getAllUsers);


module.exports = router;