const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  restaurantId: {
    type: String,
    required: [true, 'Restaurant ID is required'],
    unique: true,
    trim: true
  },
  restaurantName: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true,
    maxlength: [50, 'Owner name cannot exceed 50 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  establishmentYear: {
    type: Number,
    required: [true, 'Establishment year is required'],
    min: [1900, 'Establishment year must be after 1900'],
    max: [new Date().getFullYear(), 'Establishment year cannot be in the future']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^[0-9]{10}$/, 'Phone number must be exactly 10 digits']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin']
  },
  documentUrl: {
    type: String,
    default: '',
    trim: true
  },
  selectedServices: {
    type: [String],
    default: []
  },
  planAmount: {
    type: Number,
    default: 0,
    min: [0, 'Plan amount cannot be negative']
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

restaurantSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

restaurantSchema.index({ restaurantId: 1 });
restaurantSchema.index({ phoneNumber: 1 });
restaurantSchema.index({ isActive: 1 });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;