const express = require('express');
const router = express.Router();
const { getSettings, updateSettingsBulk } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public
router.get('/', getSettings);

// Admin Only
router.post('/admin/bulk', protect, adminOnly, updateSettingsBulk);

module.exports = router;

