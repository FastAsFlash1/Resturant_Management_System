const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
// const Restaurant = require('../models/Restaurant');
// const authMiddleware = require('../middleware/auth');
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
// @desc    Register new restaurant (MOCK - DATABASE DISABLED)
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

    // MOCK RESPONSE - DATABASE DISABLED
    const restaurantId = generateRestaurantId();
    const token = generateToken('mock-id-' + Date.now());

    res.status(201).json({
      success: true,
      message: 'Account created successfully! (Mock response - database disabled)',
      data: {
        restaurantId,
        token,
        restaurant: {
          restaurantId: restaurantId,
          restaurantName: restaurantName.trim(),
          ownerName: ownerName.trim(),
          phoneNumber: phoneNumber
        }
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login restaurant (MOCK - DATABASE DISABLED)
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

    // MOCK RESPONSE - DATABASE DISABLED
    const token = generateToken('mock-id-' + Date.now());

    res.json({
      success: true,
      message: 'Login successful (Mock response - database disabled)',
      data: {
        token,
        restaurant: {
          restaurantId: 'RID123456',
          restaurantName: 'Mock Restaurant',
          ownerName: 'Mock Owner',
          phoneNumber: identifier.length === 10 ? identifier : '1234567890',
          location: 'Mock Location'
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
// @desc    Verify JWT token (MOCK - DATABASE DISABLED)
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

    // MOCK RESPONSE - DATABASE DISABLED
    res.json({
      success: true,
      data: {
        restaurant: {
          restaurantId: 'RID123456',
          restaurantName: 'Mock Restaurant',
          ownerName: 'Mock Owner',
          phoneNumber: '1234567890',
          location: 'Mock Location'
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

// DATABASE-DEPENDENT ROUTES COMMENTED OUT
// Uncomment these when PostgreSQL is set up

// // @route   GET /api/auth/me
// // @desc    Get current restaurant profile
// // @access  Private
// router.get('/me', authMiddleware, async (req, res) => {
//   try {
//     const restaurant = req.restaurant;
//     res.json({
//       success: true,
//       restaurant
//     });
//   } catch (error) {
//     console.error('Get profile error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching profile'
//     });
//   }
// });

// // @route   PUT /api/auth/profile
// // @desc    Update restaurant profile
// // @access  Private
// router.put('/profile', authMiddleware, async (req, res) => {
//   // Implementation commented out - requires database
// });

// // @route   PUT /api/auth/change-password
// // @desc    Change password
// // @access  Private
// router.put('/change-password', authMiddleware, async (req, res) => {
//   // Implementation commented out - requires database
// });

module.exports = router;