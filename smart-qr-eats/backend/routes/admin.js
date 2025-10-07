const express = require('express');
const bcrypt = require('bcryptjs');
const { authMiddleware } = require('../middleware/auth');
const Restaurant = require('../models/Restaurant');
const router = express.Router();

// @route   GET /api/admin/profile
// @desc    Get restaurant profile
// @access  Private
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const restaurant = req.restaurant;
    
    res.json({
      success: true,
      data: {
        restaurantId: restaurant.restaurantId,
        restaurantName: restaurant.restaurantName,
        ownerName: restaurant.ownerName,
        phoneNumber: restaurant.phoneNumber,
        location: restaurant.location,
        establishmentYear: restaurant.establishmentYear,
        selectedServices: restaurant.selectedServices,
        planAmount: restaurant.planAmount,
        documentUrl: restaurant.documentUrl,
        createdAt: restaurant.createdAt,
        lastLogin: restaurant.lastLogin
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/admin/update-username
// @desc    Update owner name
// @access  Private
router.put('/update-username', authMiddleware, async (req, res) => {
  try {
    const { ownerName } = req.body;

    // Validation
    if (!ownerName || ownerName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Owner name is required'
      });
    }

    if (ownerName.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Owner name cannot exceed 50 characters'
      });
    }

    // Update owner name
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.restaurant._id,
      { 
        ownerName: ownerName.trim(),
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-hashedPassword');

    res.json({
      success: true,
      message: 'Username updated successfully',
      data: {
        ownerName: restaurant.ownerName
      }
    });

  } catch (error) {
    console.error('Update username error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating username'
    });
  }
});

// @route   PUT /api/admin/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long'
      });
    }

    // Get restaurant with password
    const restaurant = await Restaurant.findById(req.restaurant._id);

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, restaurant.hashedPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Check if new password is different from current password
    const isSamePassword = await bcrypt.compare(newPassword, restaurant.hashedPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    restaurant.hashedPassword = hashedNewPassword;
    restaurant.updatedAt = new Date();
    await restaurant.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
});

// @route   PUT /api/admin/update-profile
// @desc    Update restaurant profile
// @access  Private
router.put('/update-profile', authMiddleware, async (req, res) => {
  try {
    const { 
      restaurantName, 
      location, 
      establishmentYear 
    } = req.body;

    const updateData = {};

    // Validate and prepare update data
    if (restaurantName !== undefined) {
      if (!restaurantName || restaurantName.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Restaurant name cannot be empty'
        });
      }
      if (restaurantName.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Restaurant name cannot exceed 100 characters'
        });
      }
      updateData.restaurantName = restaurantName.trim();
    }

    if (location !== undefined) {
      if (location.trim().length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Location cannot exceed 100 characters'
        });
      }
      updateData.location = location.trim();
    }

    if (establishmentYear !== undefined) {
      const currentYear = new Date().getFullYear();
      if (establishmentYear < 1800 || establishmentYear > currentYear) {
        return res.status(400).json({
          success: false,
          message: `Establishment year must be between 1800 and ${currentYear}`
        });
      }
      updateData.establishmentYear = establishmentYear;
    }

    updateData.updatedAt = new Date();

    // Update restaurant
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.restaurant._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-hashedPassword');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        restaurantName: restaurant.restaurantName,
        location: restaurant.location,
        establishmentYear: restaurant.establishmentYear
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   DELETE /api/admin/delete-account
// @desc    Deactivate restaurant account
// @access  Private
router.delete('/delete-account', authMiddleware, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    // Get restaurant with password
    const restaurant = await Restaurant.findByPk(req.restaurant.id);

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, restaurant.hashedPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Deactivate account instead of deleting
    restaurant.isActive = false;
    restaurant.updatedAt = new Date();
    await restaurant.save();

    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deactivating account'
    });
  }
});

module.exports = router;