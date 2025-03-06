const db = require('../firebase');

// REGISTER: Save new user to Firestore (in 'users' collection)
exports.register = async (req, res) => {
  try {
    const { name, email, contact, role, password, categories, region, requirements } = req.body;
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (!snapshot.empty) {
      return res.json({ success: false, message: "User already exists." });
    }
    const newUser = { name, email, contact, role, password, categories, region, requirements, createdAt: new Date() };
    const docRef = await usersRef.add(newUser);
    newUser.id = docRef.id;
    res.json({ success: true, message: `Registered as ${role}`, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// LOGIN: Verify user credentials from Firestore
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const usersRef = db.collection('users');
    let snapshot = await usersRef.where('email', '==', identifier).where('password', '==', password).get();
    if (snapshot.empty) {
      // Try matching by contact
      snapshot = await usersRef.where('contact', '==', identifier).where('password', '==', password).get();
      if (snapshot.empty) {
        return res.json({ success: false, message: "Invalid credentials" });
      }
    }
    const userDoc = snapshot.docs[0];
    const user = userDoc.data();
    user.id = userDoc.id;
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
