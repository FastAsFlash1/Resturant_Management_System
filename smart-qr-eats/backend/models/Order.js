const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  customization: {
    spiceLevel: String,
    notes: String,
    extras: [String],
    removals: [String]
  },
  subtotal: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  restaurantId: {
    type: String,
    required: true,
    index: true
  },
  tableId: {
    type: String,
    required: true
  },
  customerInfo: {
    name: String,
    phone: String,
    email: String
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentType: {
    type: String,
    enum: ['cash', 'upi', 'razorpay', 'card'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  estimatedTime: {
    type: Number, // in minutes
    default: 30
  },
  actualPrepTime: Number,
  notes: String,
  assignedTo: {
    type: String, // Kitchen ID
    default: null
  },
  completedAt: Date,
  cancelledAt: Date,
  cancelReason: String
}, {
  timestamps: true
});

// Index for efficient queries
orderSchema.index({ restaurantId: 1, status: 1 });
orderSchema.index({ restaurantId: 1, createdAt: -1 });
orderSchema.index({ tableId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

// Generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments({ restaurantId: this.restaurantId });
    this.orderNumber = `${this.restaurantId}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Method to update status
orderSchema.methods.updateStatus = function(status, assignedTo = null) {
  this.status = status;
  if (assignedTo) this.assignedTo = assignedTo;
  if (status === 'completed') this.completedAt = new Date();
  if (status === 'cancelled') this.cancelledAt = new Date();
  return this.save();
};

module.exports = mongoose.model('Order', orderSchema);