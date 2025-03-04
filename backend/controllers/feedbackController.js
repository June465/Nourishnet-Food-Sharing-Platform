const feedbacks = []; // In-memory feedback store

exports.submitFeedback = (req, res) => {
  const feedback = { id: Date.now(), ...req.body };
  feedbacks.push(feedback);
  res.json({ success: true, feedback });
};

exports.getAllFeedback = (req, res) => {
  res.json({ feedbacks });
};
