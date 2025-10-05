const mongoose = require('mongoose');

// MongoDB connection function
const connectDB = async () => {
  try {
    // Use the MongoDB URI from environment variables
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://sourabhupadhyay899_db_user:3VdIN0egbftOPKJ2@resutrant.pypxv8g.mongodb.net/fastasflash?retryWrites=true&w=majority&appName=Resutrant';
    
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;