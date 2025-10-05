const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Restaurant = require('../models/Restaurant');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Generate unique restaurant ID
const generateRestaurantId = () => {
  const prefix = 'RID';
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return prefix + randomNum;
};

// Generate JWT token
const generateToken = (restaurantId) => {
  return jwt.sign(
    { id: restaurantId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// @route   POST /api/auth/signup
// @desc    Register new restaurant
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const {
      restaurantName,
      ownerName,
      location,
      establishmentYear,
      phoneNumber,
      password,
      documentUrl,
      selectedServices,
      planAmount
    } = req.body;

    // Validation
    if (!restaurantName || !ownerName || !phoneNumber || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate phone number
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Phone number must be exactly 10 digits'
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check if restaurant with phone number already exists
    const existingRestaurant = await Restaurant.findOne({ phoneNumber });
    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: 'Restaurant with this phone number already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate unique restaurant ID
    let restaurantId;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      restaurantId = generateRestaurantId();
      const existing = await Restaurant.findOne({ restaurantId });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: 'Unable to generate unique restaurant ID. Please try again.'
      });
    }

    // Create new restaurant
    const restaurant = new Restaurant({
      restaurantId,
      restaurantName: restaurantName.trim(),
      ownerName: ownerName.trim(),
      location: location?.trim(),
      establishmentYear,
      phoneNumber,
      hashedPassword,
      documentUrl: documentUrl?.trim(),
      selectedServices: selectedServices || [],
      planAmount: planAmount || 0
    });

    await restaurant.save();

    // Generate token
    const token = generateToken(restaurant._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! You can now log in with your Restaurant ID or phone number.',
      data: {
        restaurantId,
        token,
        restaurant: {
          restaurantId: restaurant.restaurantId,
          restaurantName: restaurant.restaurantName,
          ownerName: restaurant.ownerName,
          phoneNumber: restaurant.phoneNumber
        }
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login restaurant
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Validation
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide identifier and password'
      });
    }

    // Determine if identifier is phone number or restaurant ID
    const isPhoneNumber = /^[0-9]{10}$/.test(identifier);
    const query = isPhoneNumber 
      ? { phoneNumber: identifier }
      : { restaurantId: identifier };

    // Find restaurant
    const restaurant = await Restaurant.findOne(query);
    if (!restaurant) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!restaurant.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, restaurant.hashedPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    restaurant.lastLogin = new Date();
    await restaurant.save();

    // Generate token
    const token = generateToken(restaurant._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        restaurant: {
          restaurantId: restaurant.restaurantId,
          restaurantName: restaurant.restaurantName,
          ownerName: restaurant.ownerName,
          phoneNumber: restaurant.phoneNumber,
          location: restaurant.location
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   POST /api/auth/verify-token
// @desc    Verify JWT token
// @access  Private
router.post('/verify-token', async (req, res) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const restaurant = await Restaurant.findById(decoded.id).select('-hashedPassword');
    if (!restaurant || !restaurant.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.json({
      success: true,
      data: {
        restaurant: {
          restaurantId: restaurant.restaurantId,
          restaurantName: restaurant.restaurantName,
          ownerName: restaurant.ownerName,
          phoneNumber: restaurant.phoneNumber,
          location: restaurant.location
        }
      }
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current restaurant profile
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const restaurant = req.restaurant;
    res.json({
      success: true,
      restaurant
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update restaurant profile
// @access  Private
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const restaurantId = req.restaurant._id;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated this way
    delete updateData.hashedPassword;
    delete updateData.email;
    delete updateData._id;
    delete updateData.__v;

    // Update restaurant
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      updateData,
      { new: true, runValidators: true }
    ).select('-hashedPassword');

    if (!updatedRestaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      restaurant: updatedRestaurant
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change password
// @access  Private
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
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

    // Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    restaurant.hashedPassword = hashedNewPassword;
    await restaurant.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error changing password'
    });
  }
});

module.exports = router;