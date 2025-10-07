const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Restaurant = require('../models/Restaurant');
const Kitchen = require('../models/Kitchen');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const router = express.Router();

const generateRestaurantId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RID${timestamp}${random}`.slice(0, 9);
};

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'fastasflash_secret_key_2024',
    { expiresIn: '30d' }
  );
};

// @route   POST /api/auth/signup
// @desc    Register new restaurant
// @access  Public
router.post('/signup', async (req, res) => {
  console.log('🔵 Signup route hit!');
  console.log('🔵 Request body:', req.body);
  
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

    console.log('🔵 Extracted data:', {
      restaurantName,
      ownerName,
      location,
      establishmentYear,
      phoneNumber,
      password: password ? '[PROVIDED]' : '[MISSING]',
      documentUrl,
      selectedServices,
      planAmount
    });

    // Enhanced Validation
    if (!restaurantName || !ownerName || !location || !phoneNumber || !password) {
      console.log('🔴 Missing required fields');
      const missingFields = [];
      if (!restaurantName) missingFields.push('Restaurant Name');
      if (!ownerName) missingFields.push('Owner Name');
      if (!location) missingFields.push('Location');
      if (!phoneNumber) missingFields.push('Phone Number');
      if (!password) missingFields.push('Password');
      
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // More flexible phone number validation
    const cleanPhoneNumber = phoneNumber.toString().replace(/\D/g, '');
    if (cleanPhoneNumber.length !== 10) {
      console.log('🔴 Invalid phone number length:', cleanPhoneNumber.length);
      return res.status(400).json({
        success: false,
        message: 'Phone number must be exactly 10 digits'
      });
    }

    if (password.length < 8) {
      console.log('🔴 Password too short');
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Check if phone number already exists
    console.log('🔵 Checking if phone number exists...');
    const existingRestaurant = await Restaurant.findOne({ phoneNumber: cleanPhoneNumber });
    if (existingRestaurant) {
      console.log('🔴 Phone number already exists');
      return res.status(400).json({
        success: false,
        message: 'A restaurant with this phone number already exists'
      });
    }

    // Generate restaurant ID
    let restaurantId;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      restaurantId = generateRestaurantId();
      const existing = await Restaurant.findOne({ restaurantId });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      console.log('🔴 Failed to generate unique restaurant ID');
      return res.status(500).json({
        success: false,
        message: 'Failed to generate unique restaurant ID. Please try again.'
      });
    }

    console.log('🔵 Generated restaurant ID:', restaurantId);

    // Hash password
    console.log('🔵 Hashing password...');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new restaurant
    console.log('🔵 Creating new restaurant...');
    const newRestaurant = new Restaurant({
      restaurantId,
      restaurantName: restaurantName.trim(),
      ownerName: ownerName.trim(),
      location: location.trim(),
      establishmentYear: parseInt(establishmentYear) || new Date().getFullYear(),
      phoneNumber: cleanPhoneNumber, // Use cleaned phone number
      password: hashedPassword,
      role: 'admin',
      documentUrl: documentUrl || '',
      selectedServices: Array.isArray(selectedServices) ? selectedServices : [],
      planAmount: parseFloat(planAmount) || 0,
      isActive: true,
      createdAt: new Date()
    });

    console.log('🔵 Saving restaurant to database...');
    await newRestaurant.save();

    // Generate token
    console.log('🔵 Generating token...');
    const token = generateToken(restaurantId, 'admin');

    console.log('🟢 Restaurant created successfully!');

    res.status(201).json({
      success: true,
      message: 'Account created successfully! You can now log in with your Restaurant ID or phone number.',
      data: {
        restaurantId,
        token,
        restaurant: {
          restaurantId: newRestaurant.restaurantId,
          restaurantName: newRestaurant.restaurantName,
          ownerName: newRestaurant.ownerName,
          location: newRestaurant.location,
          phoneNumber: newRestaurant.phoneNumber,
          establishmentYear: newRestaurant.establishmentYear,
          selectedServices: newRestaurant.selectedServices,
          planAmount: newRestaurant.planAmount,
          isActive: newRestaurant.isActive,
          role: newRestaurant.role,
          createdAt: newRestaurant.createdAt
        }
      }
    });

  } catch (error) {
    console.error('🔴 Signup error:', error);
    
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `A restaurant with this ${field} already exists`
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${messages.join(', ')}`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login restaurant
// @access  Public
router.post('/login', async (req, res) => {
  console.log('🔵 Login route hit!');
  console.log('🔵 Request body:', req.body);
  
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      console.log('🔴 Missing login credentials');
      return res.status(400).json({
        success: false,
        message: 'Please provide both identifier and password'
      });
    }

    // Clean identifier (remove non-digits if it's a phone number)
    const cleanIdentifier = /^\d+$/.test(identifier) ? identifier.replace(/\D/g, '') : identifier;

    // Find restaurant by phone number or restaurant ID
    console.log('🔵 Looking for restaurant with identifier:', cleanIdentifier);
    let user = await Restaurant.findOne({
      $or: [
        { phoneNumber: cleanIdentifier },
        { restaurantId: cleanIdentifier }
      ]
    });

    let userType = 'restaurant';

    if (!user) {
      user = await Kitchen.findOne({ username: cleanIdentifier });
      userType = 'kitchen';
    }

    if (!user) {
      console.log('🔴 User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your identifier and password.'
      });
    }

    console.log('🔵 User found:', user.restaurantName || user.username);

    // Check password
    console.log('🔵 Verifying password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('🔴 Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please check your password.'
      });
    }

    // Check if restaurant is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Generate token
    console.log('🔵 Generating token...');
    const token = generateToken(
      userType === 'restaurant' ? user.restaurantId : user.username,
      user.role
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const responseData = {
      token,
      role: user.role,
      [userType]: userType === 'restaurant' ? {
        restaurantId: user.restaurantId,
        restaurantName: user.restaurantName,
        ownerName: user.ownerName,
        location: user.location,
        phoneNumber: user.phoneNumber,
        establishmentYear: user.establishmentYear,
        selectedServices: user.selectedServices,
        planAmount: user.planAmount,
        isActive: user.isActive,
        role: user.role,
        lastLogin: user.lastLogin
      } : {
        id: user._id,
        restaurantId: user.restaurantId,
        kitchenName: user.kitchenName,
        username: user.username,
        contactNumber: user.contactNumber,
        isActive: user.isActive,
        role: user.role,
        lastLogin: user.lastLogin
      }
    };

    console.log('🟢 Login successful!');

    res.json({
      success: true,
      message: 'Login successful',
      data: responseData
    });

  } catch (error) {
    console.error('🔴 Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

// @route   POST /api/auth/create-kitchen
// @desc    Create a new kitchen account
// @access  Private
router.post('/create-kitchen', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { kitchenName, username, password, contactNumber } = req.body;

    if (!kitchenName || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Kitchen name, username, and password are required'
      });
    }

    const existingKitchen = await Kitchen.findOne({ username });
    if (existingKitchen) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newKitchen = new Kitchen({
      restaurantId: req.restaurantId,
      kitchenName: kitchenName.trim(),
      username: username.trim(),
      password: hashedPassword,
      contactNumber: contactNumber ? contactNumber.trim() : undefined,
      role: 'kitchen',
      isActive: true
    });

    await newKitchen.save();

    res.status(201).json({
      success: true,
      message: 'Kitchen account created successfully',
      data: {
        id: newKitchen._id,
        restaurantId: newKitchen.restaurantId,
        kitchenName: newKitchen.kitchenName,
        username: newKitchen.username,
        contactNumber: newKitchen.contactNumber,
        role: newKitchen.role,
        isActive: newKitchen.isActive,
        createdAt: newKitchen.createdAt
      }
    });

  } catch (error) {
    console.error('Create kitchen error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during kitchen account creation'
    });
  }
});

// @route   GET /api/auth/kitchen-accounts
// @desc    Get all kitchen accounts for the restaurant
// @access  Private
router.get('/kitchen-accounts', authMiddleware, adminOnly, async (req, res) => {
  try {
    const kitchenAccounts = await Kitchen.find({ 
      restaurantId: req.restaurantId 
    }).select('-password');

    res.json({
      success: true,
      data: kitchenAccounts
    });

  } catch (error) {
    console.error('Get kitchen accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// @route   POST /api/auth/verify-token
// @desc    Verify JWT token
// @access  Private
router.post('/verify-token', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.body.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fastasflash_secret_key_2024');
    
    let user;
    if (decoded.role === 'admin') {
      user = await Restaurant.findOne({ restaurantId: decoded.userId });
    } else {
      user = await Kitchen.findOne({ username: decoded.userId });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        role: decoded.role,
        user: decoded.role === 'admin' ? {
          restaurantId: user.restaurantId,
          restaurantName: user.restaurantName,
          ownerName: user.ownerName,
          location: user.location,
          phoneNumber: user.phoneNumber,
          establishmentYear: user.establishmentYear,
          isActive: user.isActive,
          role: user.role
        } : {
          id: user._id,
          restaurantId: user.restaurantId,
          kitchenName: user.kitchenName,
          username: user.username,
          contactNumber: user.contactNumber,
          isActive: user.isActive,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current restaurant profile
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ restaurantId: req.restaurantId });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.json({
      success: true,
      data: {
        restaurant: {
          restaurantId: restaurant.restaurantId,
          restaurantName: restaurant.restaurantName,
          ownerName: restaurant.ownerName,
          location: restaurant.location,
          phoneNumber: restaurant.phoneNumber,
          establishmentYear: restaurant.establishmentYear,
          selectedServices: restaurant.selectedServices,
          planAmount: restaurant.planAmount,
          isActive: restaurant.isActive,
          createdAt: restaurant.createdAt,
          lastLogin: restaurant.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Test route
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes are working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;