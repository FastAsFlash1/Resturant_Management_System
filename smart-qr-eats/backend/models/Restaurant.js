const { sequelize, DataTypes } = require('../config/database');
const validator = require('validator');

const Restaurant = sequelize.define('Restaurant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  restaurantId: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Restaurant ID is required'
      },
      len: {
        args: [3, 20],
        msg: 'Restaurant ID must be between 3 and 20 characters'
      }
    }
  },
  restaurantName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Restaurant name is required'
      },
      len: {
        args: [1, 100],
        msg: 'Restaurant name cannot exceed 100 characters'
      }
    }
  },
  ownerName: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Owner name is required'
      },
      len: {
        args: [1, 50],
        msg: 'Owner name cannot exceed 50 characters'
      }
    }
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'Location cannot exceed 100 characters'
      }
    }
  },
  establishmentYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: [1800],
        msg: 'Establishment year must be after 1800'
      },
      max: {
        args: [new Date().getFullYear()],
        msg: 'Establishment year cannot be in the future'
      }
    }
  },
  phoneNumber: {
    type: DataTypes.STRING(10),
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Phone number is required'
      },
      is: {
        args: /^[0-9]{10}$/,
        msg: 'Phone number must be exactly 10 digits'
      }
    }
  },
  hashedPassword: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Password is required'
      }
    }
  },
  documentUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  selectedServices: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  planAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: {
        args: [0],
        msg: 'Plan amount cannot be negative'
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'restaurants',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['restaurantId']
    },
    {
      unique: true,
      fields: ['phoneNumber']
    },
    {
      fields: ['isActive']
    }
  ],
  hooks: {
    beforeUpdate: (restaurant, options) => {
      restaurant.updatedAt = new Date();
    }
  }
});

module.exports = Restaurant;