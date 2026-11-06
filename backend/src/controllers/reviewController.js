const { db } = require('../config/db');

// @desc    Get reviews
// @route   GET /api/reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await db.all(`
      SELECT r.*, f.name as food_name 
      FROM reviews r
      LEFT JOIN food_items f ON r.food_item_id = f.id
      ORDER BY r.is_featured DESC, r.id DESC
      LIMIT 15
    `);
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews', error: error.message });
  }
};

// @desc    Add review
// @route   POST /api/reviews
const addReview = async (req, res) => {
  try {
    const { user_name, rating, comment, food_item_id } = req.body;
    const userId = req.user ? req.user.id : null;
    const name = (req.user ? req.user.name : user_name) || 'Happy Foodie';

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }

    const result = await db.run(`
      INSERT INTO reviews (user_id, user_name, rating, comment, food_item_id, is_featured)
      VALUES (?, ?, ?, ?, ?, 0)
    `, [userId, name.trim(), Math.min(5, Math.max(1, parseInt(rating))), comment.trim(), food_item_id || null]);

    const review = await db.get('SELECT * FROM reviews WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, message: 'Thank you for your review!', review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit review', error: error.message });
  }
};

module.exports = {
  getReviews,
  addReview
};

