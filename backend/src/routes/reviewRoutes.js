const express = require('express');
const router = express.Router();
const { getReviews, addReview } = require('../controllers/reviewController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', getReviews);
router.post('/', optionalAuth, addReview);

module.exports = router;

