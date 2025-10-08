const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const Order = require('../models/Order');
const Menu = require('../models/Menu');

// @route   POST /api/orders
// @desc    Place a new order (Public)
router.post('/', async (req, res) => {
  try {
    const {
      restaurantId,
      tableId,
      items,
      paymentType,
      customerInfo,
      notes
    } = req.body;

    // Validate required fields
    if (!restaurantId || !tableId || !items || !items.length || !paymentType) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant ID, table ID, items, and payment type are required'
      });
    }

    // Validate and calculate order
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItemId);
      if (!menuItem || !menuItem.isActive) {
        return res.status(400).json({
          success: false,
          message: `Menu item ${item.name || 'unknown'} is not available`
        });
      }

      const itemSubtotal = menuItem.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        customization: item.customization,
        subtotal: itemSubtotal
      });
    }

    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + tax;

    const order = new Order({
      restaurantId,
      tableId,
      customerInfo,
      items: orderItems,
      paymentType,
      subtotal,
      tax,
      total,
      notes
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      errors: [error.message]
    });
  }
});

// @route   GET /api/orders
// @desc    Get orders (Admin/Kitchen only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status, tableId, limit = 50 } = req.query;
    
    let filter = { restaurantId: req.restaurantId };
    if (status) filter.status = status;
    if (tableId) filter.tableId = tableId;
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('items.menuItemId', 'name category');
    
    res.json({
      success: true,
      message: 'Orders fetched successfully',
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      errors: [error.message]
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (Admin/Kitchen only)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    
    const order = await Order.findOne({
      _id: req.params.id,
      restaurantId: req.restaurantId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await order.updateStatus(status, assignedTo);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      errors: [error.message]
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order (Admin/Kitchen only)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      restaurantId: req.restaurantId
    }).populate('items.menuItemId', 'name category imageUrl');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order fetched successfully',
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      errors: [error.message]
    });
  }
});

module.exports = router;