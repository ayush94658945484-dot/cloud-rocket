const express = require('express');
const router = express.Router();
const {
  getPublicCoupons,
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public
router.get('/', getPublicCoupons);
router.post('/validate', validateCoupon);

// Admin Only
router.get('/admin/all', protect, adminOnly, getAllCoupons);
router.post('/admin', protect, adminOnly, createCoupon);
router.put('/admin/:id', protect, adminOnly, updateCoupon);
router.delete('/admin/:id', protect, adminOnly, deleteCoupon);

module.exports = router;

