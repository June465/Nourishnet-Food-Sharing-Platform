const db = require('../firebase');

exports.submitFeedback = async (req, res) => {
  try {
    const feedback = { ...req.body, createdAt: new Date() };
    const docRef = await db.collection('feedback').add(feedback);
    feedback.id = docRef.id;
    res.json({ success: true, feedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const snapshot = await db.collection('feedback').get();
    let feedbacks = [];
    snapshot.forEach(doc => {
      let fb = doc.data();
      fb.id = doc.id;
      feedbacks.push(fb);
    });
    res.json({ feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
