const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Restaurant = require('./models/Restaurant');
const Kitchen = require('./models/Kitchen');

// Load environment variables
require('dotenv').config();

const createDemoUsers = async () => {
  try {
    console.log('🔍 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Create demo restaurant account
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    const demoRestaurant = {
      restaurantName: 'Demo Restaurant',
      ownerName: 'Demo Owner',
      location: 'Demo City, Demo State',
      establishmentYear: 2023,
      phoneNumber: '9876543210',
      password: hashedPassword,
      restaurantId: 'RID537904',
      isActive: true,
      planAmount: 15000,
      selectedServices: ['basic-menu', 'advanced-pos'],
      createdAt: new Date(),
      lastLogin: new Date()
    };

    // Check if restaurant already exists
    const existingRestaurant = await Restaurant.findOne({ 
      $or: [
        { restaurantId: 'RID537904' },
        { phoneNumber: '9876543210' }
      ]
    });

    if (existingRestaurant) {
      console.log('🟡 Demo restaurant already exists');
      console.log('📋 Login credentials:');
      console.log('   - Restaurant ID: RID537904');
      console.log('   - Phone: 9876543210');
      console.log('   - Password: demo123');
    } else {
      const restaurant = new Restaurant(demoRestaurant);
      await restaurant.save();
      console.log('✅ Demo restaurant created successfully!');
      console.log('📋 Login credentials:');
      console.log('   - Restaurant ID: RID537904');
      console.log('   - Phone: 9876543210');
      console.log('   - Password: demo123');
    }

    // Create demo kitchen account
    const kitchenPassword = await bcrypt.hash('kitchen123', 10);
    
    const demoKitchen = {
      username: 'kitchen_main',
      kitchenName: 'Main Kitchen',
      password: kitchenPassword,
      restaurantId: 'RID537904',
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    const existingKitchen = await Kitchen.findOne({ username: 'kitchen_main' });
    
    if (existingKitchen) {
      console.log('🟡 Demo kitchen already exists');
      console.log('📋 Kitchen login credentials:');
      console.log('   - Username: kitchen_main');
      console.log('   - Password: kitchen123');
    } else {
      const kitchen = new Kitchen(demoKitchen);
      await kitchen.save();
      console.log('✅ Demo kitchen created successfully!');
      console.log('📋 Kitchen login credentials:');
      console.log('   - Username: kitchen_main');
      console.log('   - Password: kitchen123');
    }

    console.log('\n🎉 Demo accounts ready!');
    console.log('🔗 You can now login at: http://localhost:5173/login');

  } catch (error) {
    console.error('❌ Error creating demo users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
};

createDemoUsers();