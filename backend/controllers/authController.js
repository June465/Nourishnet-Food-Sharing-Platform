const User = require('../models/User');

// REGISTER: Save new user to MongoDB
exports.register = async (req, res) => {
  try {
    const { name, email, contact, role, password, categories, region, requirements } = req.body;
    // Check if user exists (by email)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'User already exists.' });
    }
    const newUser = new User({
      name,
      email,
      contact,
      role,
      password, // In production, hash passwords before saving!
      categories,
      region,
      requirements,
      createdAt: new Date(),
    });
    const savedUser = await newUser.save();
    res.json({ success: true, message: `Registered as ${role}`, user: savedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LOGIN: Verify user credentials
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    // Try to find user by email
    let user = await User.findOne({ email: identifier, password });
    if (!user) {
      // If not, try by contact
      user = await User.findOne({ contact: identifier, password });
      if (!user) {
        return res.json({ success: false, message: 'Invalid credentials' });
      }
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { userId, oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found.' });
    }

    // Check old password
    if (user.password !== oldPassword) {
      // In production, you'd store a hashed password and compare properly
      return res.json({ success: false, message: 'Old password is incorrect.' });
    }

    // Update to new password
    user.password = newPassword; // Again, you'd hash in real code
    await user.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// In backend/controllers/authController.js

exports.forgotPassword = async (req, res) => {
  res.status(501).json({ success: false, message: "Forgot password functionality not implemented yet." });
};

