const User = require('../models/User');
const mongoose = require('mongoose');

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
             return res.status(400).json({ success: false, message: 'Invalid User ID format.' });
         }

        // Exclude password from the result
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, user });

    } catch (err) {
        console.error("Get User By ID Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching user.' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
         if (!mongoose.Types.ObjectId.isValid(userId)) {
              return res.status(400).json({ success: false, message: 'Invalid User ID format.' });
          }

        // Specify allowed fields to update to prevent unwanted changes (like role or password)
        const allowedUpdates = ['name', 'contact', 'categories', 'region', 'requirements', 'email'];
        const updates = {};
        let emailChanged = false;

         // Find the existing user to check the role
         const existingUser = await User.findById(userId);
         if (!existingUser) {
             return res.status(404).json({ success: false, message: 'User not found.' });
         }


        for (const key in req.body) {
            if (allowedUpdates.includes(key)) {
                // Trim string values
                updates[key] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];

                // Check if email is being changed and validate format
                 if (key === 'email') {
                     updates[key] = updates[key].toLowerCase(); // Store email lowercase
                      if (updates[key] !== existingUser.email) {
                          // Basic email format check
                          if (!/\S+@\S+\.\S+/.test(updates[key])) {
                               return res.status(400).json({ success: false, message: 'Invalid email format.' });
                           }
                          // Check if the new email is already taken by ANOTHER user
                           const emailExists = await User.findOne({ email: updates[key], _id: { $ne: userId } });
                           if (emailExists) {
                               return res.status(400).json({ success: false, message: 'This email address is already in use by another account.' });
                           }
                           emailChanged = true; // Flag that email is changing
                      }
                  }


                 // Validate required fields based on role (ensure they are not empty if being updated)
                  if (existingUser.role === 'distributor' && key === 'categories' && !updates[key]) {
                      return res.status(400).json({ success: false, message: 'Categories field cannot be empty for distributors.' });
                  }
                  if (existingUser.role === 'collector') {
                       if (key === 'region' && !updates[key]) return res.status(400).json({ success: false, message: 'Region field cannot be empty for collectors.' });
                       if (key === 'requirements' && !updates[key]) return res.status(400).json({ success: false, message: 'Requirements field cannot be empty for collectors.' });
                   }

            }
        }

        // Perform the update
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates }, // Use $set to update only specified fields
            { new: true, runValidators: true } // Return updated doc, run schema validators
        ).select('-password'); // Exclude password

        if (!updatedUser) {
            // Should not happen if the user exists check passed, but handle defensively
            return res.status(404).json({ success: false, message: 'User not found during update.' });
        }

        res.json({ success: true, message: 'Profile updated successfully.', user: updatedUser });

    } catch (err) {
        console.error("Update User Error:", err);
         if (err.name === 'ValidationError') {
             return res.status(400).json({ success: false, message: `Validation Error: ${err.message}` });
         }
          if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
              // Handle unique constraint violation for email during update (race condition, though checked above)
              return res.status(400).json({ success: false, message: 'Email address is already in use.' });
          }
        res.status(500).json({ success: false, message: 'Server error updating user profile.' });
    }
};


// GET all users (Potentially for Admin - USE WITH CAUTION)
exports.getAllUsers = async (req, res) => {
    try {
        // Exclude passwords from the result
        const users = await User.find().select('-password');
        res.json({ success: true, users });
    } catch (err) {
        console.error("Get All Users Error:", err);
        res.status(500).json({ success: false, message: 'Server error fetching users.' });
    }
};