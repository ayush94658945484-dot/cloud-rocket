const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress,
  getAllCustomers
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:id', protect, deleteAddress);
router.get('/admin/customers', protect, adminOnly, getAllCustomers);

module.exports = router;

