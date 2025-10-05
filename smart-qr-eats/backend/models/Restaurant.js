const mongoose = require('mongoose');
const validator = require('validator');

const restaurantSchema = new mongoose.Schema({
  restaurantId: {
    type: String,
    required: [true, 'Restaurant ID is required'],
    unique: true,
    trim: true,
    minlength: [6, 'Restaurant ID must be at least 6 characters'],
    maxlength: [20, 'Restaurant ID cannot exceed 20 characters']
  },
  restaurantName: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    minlength: [2, 'Restaurant name must be at least 2 characters'],
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
  },
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true,
    minlength: [2, 'Owner name must be at least 2 characters'],
    maxlength: [100, 'Owner name cannot exceed 100 characters']
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return !email || validator.isEmail(email);
      },
      message: 'Invalid email format'
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    validate: {
      validator: function(phone) {
        return /^[0-9]{10}$/.test(phone);
      },
      message: 'Phone number must be exactly 10 digits'
    }
  },
  hashedPassword: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  establishmentYear: {
    type: Number,
    min: [1800, 'Establishment year must be after 1800'],
    max: [new Date().getFullYear(), 'Establishment year cannot be in the future']
  },
  documentUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(url) {
        return !url || validator.isURL(url);
      },
      message: 'Document URL must be a valid URL'
    }
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
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isPhoneVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  profileCompleteness: {
    type: Number,
    default: 0,
    min: [0, 'Profile completeness cannot be negative'],
    max: [100, 'Profile completeness cannot exceed 100%']
  },
  subscriptionStatus: {
    type: String,
    enum: ['trial', 'active', 'suspended', 'cancelled'],
    default: 'trial'
  },
  subscriptionEndDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes
restaurantSchema.index({ restaurantId: 1 }, { unique: true });
restaurantSchema.index({ phoneNumber: 1 }, { unique: true });
restaurantSchema.index({ email: 1 }, { unique: true, sparse: true });
restaurantSchema.index({ isActive: 1 });
restaurantSchema.index({ subscriptionStatus: 1 });
restaurantSchema.index({ createdAt: 1 });

// Pre-save middleware to calculate profile completeness
restaurantSchema.pre('save', function(next) {
  let completeness = 0;
  const fields = ['restaurantName', 'ownerName', 'phoneNumber', 'location', 'establishmentYear'];
  
  fields.forEach(field => {
    if (this[field]) completeness += 20;
  });
  
  this.profileCompleteness = completeness;
  next();
});

// Instance method to update profile completeness
restaurantSchema.methods.updateProfileCompleteness = function() {
  let completeness = 0;
  const fields = ['restaurantName', 'ownerName', 'phoneNumber', 'location', 'establishmentYear'];
  
  fields.forEach(field => {
    if (this[field]) completeness += 20;
  });
  
  this.profileCompleteness = completeness;
  return this.save();
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;