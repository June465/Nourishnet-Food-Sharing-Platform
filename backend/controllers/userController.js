const User = require('../models/User');

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    const updatedUser = await User.findById(req.params.id);
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    // For security, you might want to check if the user is the same as the logged-in user
    // Then update only certain fields:
    const updates = {
      name: req.body.name,
      email: req.body.email,
      contact: req.body.contact,
      categories: req.body.categories || '',
      region: req.body.region || '',
      requirements: req.body.requirements || ''
    };

    await User.findByIdAndUpdate(id, updates);
    const updatedUser = await User.findById(id);
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
