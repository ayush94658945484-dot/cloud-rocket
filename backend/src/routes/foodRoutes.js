const express = require('express');
const router = express.Router();
const {
  getFoodItems,
  getFoodById,
  getCategories,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  toggleAvailability
} = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public
router.get('/', getFoodItems);
router.get('/categories', getCategories);
router.get('/:id', getFoodById);

// Admin Only
router.post('/', protect, adminOnly, createFoodItem);
router.put('/:id', protect, adminOnly, updateFoodItem);
router.delete('/:id', protect, adminOnly, deleteFoodItem);
router.patch('/:id/availability', protect, adminOnly, toggleAvailability);

module.exports = router;

