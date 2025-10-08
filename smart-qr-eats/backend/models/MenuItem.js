const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizers', 'mains', 'desserts', 'beverages', 'snacks'],
    lowercase: true
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'
  },
  available: {
    type: Boolean,
    default: true
  },
  restaurantId: {
    type: String,
    required: true,
    index: true
  },
  createdBy: {
    type: String, // Admin who created this item
    required: true
  },
  nutritionInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  allergens: [{
    type: String,
    enum: ['nuts', 'dairy', 'gluten', 'eggs', 'soy', 'seafood', 'shellfish']
  }],
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'very-hot'],
    default: 'mild'
  },
  preparationTime: {
    type: Number, // in minutes
    default: 15
  },
  isVeg: {
    type: Boolean,
    default: true
  },
  tags: [String],
  popularity: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
menuItemSchema.index({ restaurantId: 1, available: 1 });
menuItemSchema.index({ restaurantId: 1, category: 1 });
menuItemSchema.index({ restaurantId: 1, popularity: -1 });

// Virtual for formatted price
menuItemSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toLocaleString('en-IN')}`;
});

// Method to update popularity
menuItemSchema.methods.incrementPopularity = function() {
  this.popularity += 1;
  this.totalOrders += 1;
  return this.save();
};

module.exports = mongoose.model('MenuItem', menuItemSchema);