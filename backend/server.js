const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and handle file uploads if needed
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '../')));

// Import routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/users', require('./routes/users'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/feedback', require('./routes/feedback'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
