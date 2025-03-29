const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  try {
    const feedback = new Feedback({
      ...req.body,
      createdAt: new Date(),
    });
    const savedFeedback = await feedback.save();
    res.json({ success: true, feedback: savedFeedback });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json({ feedbacks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
