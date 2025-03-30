const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, 'Name is required.'],
      trim: true
  },
  email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true, // Ensure emails are unique
      lowercase: true, // Store emails in lowercase
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'] // Basic email format validation
  },
  contact: { // Can be phone or address - consider splitting if needed
      type: String,
      required: [true, 'Contact information (phone or address) is required.'],
      trim: true
  },
  role: {
      type: String,
      required: [true, 'User role is required.'],
      enum: ['collector', 'distributor'] // Restrict roles
  },
  password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters long.']
      // select: false // Optional: Don't include password in queries by default
  },
  // Distributor specific field
  categories: {
      type: String,
      // Make required only if role is 'distributor' using a custom validator or application logic
      required: function() { return this.role === 'distributor'; },
      trim: true
  },
  // Collector specific fields
  region: {
      type: String,
      required: function() { return this.role === 'collector'; },
      trim: true
  },
  requirements: {
      type: String,
      required: function() { return this.role === 'collector'; },
      trim: true
  },
  createdAt: {
      type: Date,
      default: Date.now
  }
  // Optional: Add fields for password reset token/expiry
  // passwordResetToken: String,
  // passwordResetExpires: Date,
});


// **IMPORTANT: Add password hashing middleware before saving (using bcryptjs)**
// userSchema.pre('save', async function(next) {
//   // Only hash the password if it has been modified (or is new)
//   if (!this.isModified('password')) return next();
//
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = mongoose.model('User', userSchema);