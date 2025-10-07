const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  restaurantId: {
    type: String,
    required: [true, 'Restaurant ID is required'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
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

menuSchema.index({ restaurantId: 1 });
menuSchema.index({ category: 1 });
menuSchema.index({ isActive: 1 });

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;