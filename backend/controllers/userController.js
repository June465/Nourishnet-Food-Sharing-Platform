const db = require('../firebase');

exports.getUserById = async (req, res) => {
  try {
    const doc = await db.collection('users').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    let user = doc.data();
    user.id = doc.id;
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).update(req.body);
    const doc = await db.collection('users').doc(req.params.id).get();
    let user = doc.data();
    user.id = doc.id;
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    let users = [];
    snapshot.forEach(doc => {
      let user = doc.data();
      user.id = doc.id;
      users.push(user);
    });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
