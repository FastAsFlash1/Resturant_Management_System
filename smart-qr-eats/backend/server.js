require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
// const { sequelize } = require('./config/database');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to PostgreSQL - COMMENTED OUT FOR NOW
// const connectDB = async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('PostgreSQL Connection has been established successfully.');
    
//     // Sync database (create tables if they don't exist)
//     await sequelize.sync({ alter: true });
//     console.log('Database synchronized successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//     process.exit(1);
//   }
// };

// connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/admin', require('./routes/admin')); // Commented out - requires database

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'FastAsFlash API is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV
  });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FastAsFlash API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Database: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});