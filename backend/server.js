
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
require('dotenv').config(); // Ensure dotenv is configured early

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nourishnet'; // Default URI

// --- Database Connection ---
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch((err) => {
      console.error('MongoDB connection error:', err);
      process.exit(1); // Exit if DB connection fails
  });

// --- Middleware ---
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// --- File Upload (Multer) Setup ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      // Ensure the uploads directory exists relative to the project root
      const uploadPath = path.join(__dirname, '..', 'uploads'); // Go up one level from 'backend'
      // Check if directory exists, create if not (basic check)
      // require('fs').mkdirSync(uploadPath, { recursive: true }); // Use fs module if needed
      cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
      // Create a unique filename: timestamp + original extension
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const imageFileFilter = (req, file, cb) => {
  // Accept only common image types
  if (file.mimetype.startsWith('image/')) {
      cb(null, true);
  } else {
      cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

// --- Static File Serving ---
// Serve frontend files (HTML, CSS, JS, images) from the project root ('Web' folder)
app.use(express.static(path.join(__dirname, '..'))); // Serve from 'Web' directory

// Serve uploaded images from the 'uploads' folder
// The URL path will be '/uploads/filename.jpg'
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- API Routes ---
app.use('/api/auth', require('./routes/auth'));
// Apply multer middleware specifically to the route that needs file upload
app.use('/api/donations', upload.single('foodImage'), require('./routes/donations')); // Multer processes 'foodImage' field
app.use('/api/users', require('./routes/user'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/feedback', require('./routes/feedback'));

// --- Basic Error Handling Middleware ---
// Multer error handling
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error("Multer Error:", err);
      return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
  } else if (err) {
      // An unknown error occurred when uploading.
       console.error("File Upload Unknown Error:", err);
       // Handle specific errors like 'Not an image!' from fileFilter
      if (err.message.includes('Not an image')) {
          return res.status(400).json({ success: false, message: err.message });
      }
       return res.status(500).json({ success: false, message: 'An unexpected error occurred during file processing.' });
  }
  // Everything went fine, proceed.
  next();
});

// General 404 for API routes not found
app.use('/api/*', (req, res) => {
   res.status(404).json({ success: false, message: 'API endpoint not found.' });
});


// --- Server Startup ---
app.listen(PORT, () => {
  console.log(`Server running successfully on http://localhost:${PORT}`);
});