const mongoose = require('mongoose');

const kitchenSchema = new mongoose.Schema({
  restaurantId: {
    type: String,
    required: [true, 'Restaurant ID is required'],
    trim: true
  },
  kitchenName: {
    type: String,
    required: [true, 'Kitchen name is required'],
    trim: true,
    maxlength: [50, 'Kitchen name cannot exceed 50 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  contactNumber: {
    type: String,
    trim: true,
    match: [/^[0-9]{10}$/, 'Contact number must be exactly 10 digits']
  },
  role: {
    type: String,
    default: 'kitchen',
    enum: ['kitchen']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

kitchenSchema.index({ restaurantId: 1 });
kitchenSchema.index({ username: 1 });
kitchenSchema.index({ isActive: 1 });

const Kitchen = mongoose.model('Kitchen', kitchenSchema);

module.exports = Kitchen;