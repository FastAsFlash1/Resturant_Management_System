const jwt = require('jsonwebtoken');
const Restaurant = require('../models/Restaurant');

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided or invalid format'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find restaurant by ID (using Sequelize)
    const restaurant = await Restaurant.findByPk(decoded.id, {
      attributes: { exclude: ['hashedPassword'] }
    });
    
    if (!restaurant) {
      return res.status(401).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    if (!restaurant.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Add restaurant to request object
    req.restaurant = restaurant;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

module.exports = authMiddleware;