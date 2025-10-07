const express = require('express');
const Menu = require('../models/Menu');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/menu
// @desc    Add new menu item (Admin only)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, price, category, description, imageUrl } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required'
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: 'Price cannot be negative'
      });
    }

    const newMenuItem = new Menu({
      restaurantId: req.restaurantId,
      name: name.trim(),
      price: parseFloat(price),
      category: category.trim(),
      description: description ? description.trim() : '',
      imageUrl: imageUrl ? imageUrl.trim() : '',
      isActive: true
    });

    await newMenuItem.save();

    res.status(201).json({
      success: true,
      message: 'Menu item added successfully',
      data: newMenuItem
    });

  } catch (error) {
    console.error('Add menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during menu item creation'
    });
  }
});

// @route   GET /api/menu/public/:restaurantId
// @desc    Get all menu items for a restaurant (Public)
router.get('/public/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menuItems = await Menu.find({ 
      restaurantId,
      isActive: true 
    }).sort({ category: 1, name: 1 });

    res.json({
      success: true,
      data: menuItems
    });

  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   GET /api/menu
// @desc    Get all menu items for authenticated restaurant
router.get('/', authMiddleware, async (req, res) => {
  try {
    const menuItems = await Menu.find({ 
      restaurantId: req.restaurantId 
    }).sort({ category: 1, name: 1 });

    res.json({
      success: true,
      data: menuItems
    });

  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   PUT /api/menu/:id
// @desc    Update menu item (Admin only)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, imageUrl, isActive } = req.body;

    const menuItem = await Menu.findOne({ 
      _id: id, 
      restaurantId: req.restaurantId 
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    if (name) menuItem.name = name.trim();
    if (price !== undefined) menuItem.price = parseFloat(price);
    if (category) menuItem.category = category.trim();
    if (description !== undefined) menuItem.description = description.trim();
    if (imageUrl !== undefined) menuItem.imageUrl = imageUrl.trim();
    if (isActive !== undefined) menuItem.isActive = isActive;

    await menuItem.save();

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });

  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item (Admin only)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await Menu.findOne({ 
      _id: id, 
      restaurantId: req.restaurantId 
    });

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    await Menu.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });

  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;