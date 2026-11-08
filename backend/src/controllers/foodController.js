const { db } = require('../config/db');

// @desc    Get all active food items with category and filters
// @route   GET /api/food
const getFoodItems = async (req, res) => {
  try {
    const { category, search, veg, bestseller, featured, sort, minPrice, maxPrice, adminView } = req.query;

    let query = `
      SELECT f.*, c.name as category_name, c.slug as category_slug
      FROM food_items f
      LEFT JOIN categories c ON f.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    // Filter by available unless admin requests all
    if (!adminView) {
      query += ' AND f.is_available = 1';
    }

    if (category && category !== 'all') {
      query += ' AND (c.slug = ? OR c.id = ?)';
      params.push(category, category);
    }

    if (veg !== undefined && veg !== '') {
      query += ' AND f.is_veg = ?';
      params.push(veg === 'true' || veg === '1' ? 1 : 0);
    }

    if (bestseller === 'true' || bestseller === '1') {
      query += ' AND f.is_bestseller = 1';
    }

    if (featured === 'true' || featured === '1') {
      query += ' AND f.is_featured = 1';
    }

    if (minPrice) {
      query += ' AND f.price >= ?';
      params.push(Number(minPrice));
    }

    if (maxPrice) {
      query += ' AND f.price <= ?';
      params.push(Number(maxPrice));
    }

    if (search && search.trim()) {
      query += ' AND (f.name LIKE ? OR f.description LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term);
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query += ' ORDER BY f.price ASC';
        break;
      case 'price_desc':
        query += ' ORDER BY f.price DESC';
        break;
      case 'rating':
        query += ' ORDER BY f.rating DESC, f.reviews_count DESC';
        break;
      default:
        query += ' ORDER BY f.is_featured DESC, f.is_bestseller DESC, f.id ASC';
    }

    const items = await db.all(query, params);

    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error('getFoodItems Error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dishes', error: error.message });
  }
};

// @desc    AI Craving Scanner: Recommend real in-stock dishes based on craving & budget
// @route   GET /api/food/cravings
const getAICravingRecommendations = async (req, res) => {
  try {
    const { craving = 'surprise', budget, is_veg } = req.query;

    let query = `
      SELECT f.*, c.name as category_name, c.slug as category_slug
      FROM food_items f
      LEFT JOIN categories c ON f.category_id = c.id
      WHERE f.is_available = 1
    `;
    const params = [];

    if (is_veg !== undefined && is_veg !== '') {
      query += ' AND f.is_veg = ?';
      params.push(is_veg === 'true' || is_veg === '1' ? 1 : 0);
    }

    if (budget && Number(budget) > 0) {
      query += ' AND f.price <= ?';
      params.push(Number(budget));
    }

    const items = await db.all(query, params);

    // AI Craving Scoring & Match explanation
    const scoredItems = items.map((item) => {
      let score = 50;
      let reason = 'Handpicked chef specialty matching your taste.';
      const desc = (item.name + ' ' + (item.description || '')).toLowerCase();

      switch (craving.toLowerCase()) {
        case 'spicy':
          if (desc.includes('spicy') || desc.includes('pepper') || desc.includes('tandoori') || desc.includes('tikka') || desc.includes('biryani')) {
            score += 45;
            reason = 'High spice index with authentic slow-roasted chilies and tandoori heat.';
          }
          break;
        case 'crispy':
          if (desc.includes('crispy') || desc.includes('crunch') || desc.includes('wings') || desc.includes('roll') || desc.includes('burger')) {
            score += 45;
            reason = 'Clay tandoor blistered crunch with golden glazed crust.';
          }
          break;
        case 'cheesy':
          if (desc.includes('cheese') || desc.includes('paneer') || desc.includes('malai') || desc.includes('cream') || desc.includes('butter')) {
            score += 45;
            reason = 'Velvety clotted cream, molten artisanal cheese, and rich butter gravies.';
          }
          break;
        case 'affordable':
          if (item.price < 250) {
            score += 40;
            reason = 'Best value pocket-friendly gourmet delicacy under ₹250.';
          }
          break;
        case 'filling':
          if (item.calories > 550 || desc.includes('biryani') || desc.includes('combo') || desc.includes('feast')) {
            score += 45;
            reason = 'Hefty, deeply satisfying royal portion packed with high satiety.';
          }
          break;
        case 'surprise':
        default:
          score += Math.floor(Math.random() * 30);
          reason = 'Cosmic mystery drop selected by the Food Rocket Head Chef!';
          break;
      }

      if (item.is_bestseller) score += 10;
      if (item.rating >= 4.9) score += 10;

      return {
        ...item,
        ai_score: score,
        ai_match_reason: reason,
        spice_level: desc.includes('spicy') || desc.includes('pepper') ? '🔥 Hot' : desc.includes('mild') || desc.includes('malai') ? '🌱 Mild' : '⚡ Medium'
      };
    });

    scoredItems.sort((a, b) => b.ai_score - a.ai_score);
    const topMatches = scoredItems.slice(0, 6);

    res.json({
      success: true,
      craving,
      count: topMatches.length,
      recommendations: topMatches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Craving scanner failed', error: error.message });
  }
};

// @desc    Get single food item by ID
// @route   GET /api/food/:id
const getFoodById = async (req, res) => {
  try {
    const item = await db.get(`
      SELECT f.*, c.name as category_name, c.slug as category_slug
      FROM food_items f
      LEFT JOIN categories c ON f.category_id = c.id
      WHERE f.id = ?
    `, [req.params.id]);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve dish', error: error.message });
  }
};

// @desc    Get all active categories
// @route   GET /api/food/categories
const getCategories = async (req, res) => {
  try {
    const categories = await db.all(`
      SELECT c.*, COUNT(f.id) as item_count
      FROM categories c
      LEFT JOIN food_items f ON c.id = f.category_id AND f.is_available = 1
      WHERE c.is_active = 1
      GROUP BY c.id
      ORDER BY c.display_order ASC
    `);

    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};

// @desc    Admin: Create Food Item
// @route   POST /api/food
const createFoodItem = async (req, res) => {
  try {
    const {
      category_id,
      name,
      description,
      price,
      discount_price,
      is_veg,
      is_available,
      is_bestseller,
      is_featured,
      image_url,
      preparation_time,
      calories
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Dish name and price are mandatory' });
    }

    const result = await db.run(`
      INSERT INTO food_items (
        category_id, name, description, price, discount_price, is_veg,
        is_available, is_bestseller, is_featured, image_url, preparation_time, calories
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      category_id || null,
      name.trim(),
      description || null,
      Number(price),
      discount_price ? Number(discount_price) : null,
      is_veg !== undefined ? (is_veg ? 1 : 0) : 1,
      is_available !== undefined ? (is_available ? 1 : 0) : 1,
      is_bestseller ? 1 : 0,
      is_featured ? 1 : 0,
      image_url || null,
      preparation_time || '20-25 mins',
      calories ? Number(calories) : null
    ]);

    const created = await db.get('SELECT * FROM food_items WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, message: 'Dish created successfully', item: created });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create dish', error: error.message });
  }
};

// @desc    Admin: Update Food Item
// @route   PUT /api/food/:id
const updateFoodItem = async (req, res) => {
  try {
    const existing = await db.get('SELECT * FROM food_items WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    const {
      category_id,
      name,
      description,
      price,
      discount_price,
      is_veg,
      is_available,
      is_bestseller,
      is_featured,
      image_url,
      preparation_time,
      calories
    } = req.body;

    await db.run(`
      UPDATE food_items SET
        category_id = ?, name = ?, description = ?, price = ?, discount_price = ?,
        is_veg = ?, is_available = ?, is_bestseller = ?, is_featured = ?,
        image_url = ?, preparation_time = ?, calories = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      category_id !== undefined ? category_id : existing.category_id,
      name ? name.trim() : existing.name,
      description !== undefined ? description : existing.description,
      price !== undefined ? Number(price) : existing.price,
      discount_price !== undefined ? (discount_price ? Number(discount_price) : null) : existing.discount_price,
      is_veg !== undefined ? (is_veg ? 1 : 0) : existing.is_veg,
      is_available !== undefined ? (is_available ? 1 : 0) : existing.is_available,
      is_bestseller !== undefined ? (is_bestseller ? 1 : 0) : existing.is_bestseller,
      is_featured !== undefined ? (is_featured ? 1 : 0) : existing.is_featured,
      image_url !== undefined ? image_url : existing.image_url,
      preparation_time !== undefined ? preparation_time : existing.preparation_time,
      calories !== undefined ? (calories ? Number(calories) : null) : existing.calories,
      req.params.id
    ]);

    const updated = await db.get('SELECT * FROM food_items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Dish updated successfully', item: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update dish', error: error.message });
  }
};

// @desc    Admin: Delete Food Item
// @route   DELETE /api/food/:id
const deleteFoodItem = async (req, res) => {
  try {
    await db.run('DELETE FROM food_items WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Dish removed from menu' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete dish', error: error.message });
  }
};

// @desc    Admin: Toggle availability quickly
// @route   PATCH /api/food/:id/availability
const toggleAvailability = async (req, res) => {
  try {
    const item = await db.get('SELECT is_available FROM food_items WHERE id = ?', [req.params.id]);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const newStatus = item.is_available === 1 ? 0 : 1;
    await db.run('UPDATE food_items SET is_available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [newStatus, req.params.id]);
    res.json({ success: true, is_available: newStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle availability', error: error.message });
  }
};

module.exports = {
  getFoodItems,
  getAICravingRecommendations,
  getFoodById,
  getCategories,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  toggleAvailability
};
