const jwt = require('jsonwebtoken');
const Restaurant = require('../models/Restaurant');
const Kitchen = require('../models/Kitchen');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fastasflash_secret_key_2024');

    let user;
    if (decoded.role === 'admin') {
      user = await Restaurant.findOne({ restaurantId: decoded.userId });
      req.restaurantId = decoded.userId;
    } else if (decoded.role === 'kitchen') {
      user = await Kitchen.findOne({ username: decoded.userId });
      req.restaurantId = user?.restaurantId;
      req.kitchenId = user?._id;
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    req.user = user;
    req.role = decoded.role;
    next();

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

const kitchenOnly = (req, res, next) => {
  if (req.role !== 'kitchen') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Kitchen privileges required.'
    });
  }
  next();
};

module.exports = { authMiddleware, adminOnly, kitchenOnly };