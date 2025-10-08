// Test script to create a demo restaurant account
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Restaurant = require('./models/Restaurant');

const createDemoAccount = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
    
    // Check if demo account already exists
    const existingRestaurant = await Restaurant.findOne({ 
      $or: [
        { restaurantId: 'RID537904' },
        { phoneNumber: '9876543210' }
      ]
    });
    
    if (existingRestaurant) {
      console.log('✅ Demo account already exists!');
      console.log('🔑 Login Credentials:');
      console.log('   Restaurant ID:', existingRestaurant.restaurantId);
      console.log('   Phone:', existingRestaurant.phoneNumber);
      console.log('   Password: demo123');
      await mongoose.connection.close();
      return;
    }
    
    // Create demo restaurant
    const hashedPassword = await bcrypt.hash('demo123', 12);
    
    const demoRestaurant = new Restaurant({
      restaurantId: 'RID537904',
      restaurantName: 'FastAsFlash Demo Restaurant',
      ownerName: 'Demo Owner',
      location: 'Demo City, Demo State',
      establishmentYear: 2023,
      phoneNumber: '9876543210',
      password: hashedPassword,
      role: 'admin',
      documentUrl: '',
      selectedServices: ['basic-menu', 'advanced-pos', 'analytics'],
      planAmount: 15000,
      isActive: true,
      createdAt: new Date()
    });
    
    await demoRestaurant.save();
    
    console.log('✅ Demo restaurant account created successfully!');
    console.log('🔑 Login Credentials:');
    console.log('   Restaurant ID: RID537904');
    console.log('   OR Phone: 9876543210');
    console.log('   Password: demo123');
    
    await mongoose.connection.close();
    console.log('🍽️ You can now login with these credentials!');
    
  } catch (error) {
    console.error('❌ Error creating demo account:', error);
    await mongoose.connection.close();
  }
};

if (require.main === module) {
  createDemoAccount();
}

module.exports = createDemoAccount;