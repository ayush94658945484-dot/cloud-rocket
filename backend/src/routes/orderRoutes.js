const express = require('express');
const router = express.Router();
const {
  createOrder,
  trackOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getAdminStats
} = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public / Customer
router.post('/', optionalAuth, createOrder);
router.get('/track/:order_number', trackOrder);
router.get('/my-orders', protect, getMyOrders);

// Admin Only
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.get('/admin/stats', protect, adminOnly, getAdminStats);
router.patch('/admin/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;

