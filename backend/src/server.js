const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDatabase } = require('./config/db');
const { seedData } = require('./seed');

const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads if needed
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/reviews', reviewRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'Food Rocket Kitchen API',
    timestamp: new Date().toISOString()
  });
});

// Global 404 Handler
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(404).json({ success: false, message: `API Route not found: ${req.originalUrl}` });
  }
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start Server and Seed Database
async function startServer() {
  try {
    await initDatabase();
    await seedData();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Food Rocket Kitchen Server running on port ${PORT}`);
      console.log(`📡 API Health Check: http://localhost:${PORT}/api/health`);
      console.log(`👑 Admin Credentials: admin@foodrocket.com / admin123`);
      console.log(`👤 Customer Demo: customer@gmail.com / customer123`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Critical Server Startup Failure:', error);
    process.exit(1);
  }
}

startServer();
