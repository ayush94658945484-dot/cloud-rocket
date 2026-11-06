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
        query += ' ORDER BY f.rating DESC';
        break;
      case 'popular':
        query += ' ORDER BY f.is_bestseller DESC, f.rating DESC';
        break;
      default:
        query += ' ORDER BY f.is_featured DESC, f.is_bestseller DESC, f.id ASC';
        break;
    }

    const items = await db.all(query, params);
    res.json({ success: true, count: items.length, items });
  } catch (error) {
    console.error('getFoodItems error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve food items', error: error.message });
  }
};

// @desc    Get single food item details
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

    const reviews = await db.all('SELECT * FROM reviews WHERE food_item_id = ? ORDER BY id DESC', [req.params.id]);

    res.json({ success: true, item, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving food item', error: error.message });
  }
};

// @desc    Get all categories
// @route   GET /api/food/categories
const getCategories = async (req, res) => {
  try {
    const categories = await db.all(`
      SELECT c.*, COUNT(f.id) as item_count 
      FROM categories c
      LEFT JOIN food_items f ON c.id = f.category_id AND f.is_available = 1
      WHERE c.is_active = 1
      GROUP BY c.id
      ORDER BY c.display_order ASC, c.id ASC
    `);
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};

// @desc    Admin: Create Food Item
// @route   POST /api/food
const createFoodItem = async (req, res) => {
  try {
    const { category_id, name, description, price, discount_price, is_veg, is_available, is_bestseller, is_featured, image_url, preparation_time, calories } = req.body;

    if (!name || price === undefined || !category_id) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    }

    const result = await db.run(`
      INSERT INTO food_items 
      (category_id, name, description, price, discount_price, is_veg, is_available, is_bestseller, is_featured, image_url, preparation_time, calories)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      category_id,
      name.trim(),
      description || '',
      Number(price),
      discount_price ? Number(discount_price) : null,
      is_veg ? 1 : 0,
      is_available !== undefined ? (is_available ? 1 : 0) : 1,
      is_bestseller ? 1 : 0,
      is_featured ? 1 : 0,
      image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
      preparation_time || '20-25 mins',
      calories ? Number(calories) : null
    ]);

    const newItem = await db.get('SELECT * FROM food_items WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, message: 'Dish added to menu', item: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add dish', error: error.message });
  }
};

// @desc    Admin: Update Food Item
// @route   PUT /api/food/:id
const updateFoodItem = async (req, res) => {
  try {
    const { category_id, name, description, price, discount_price, is_veg, is_available, is_bestseller, is_featured, image_url, preparation_time, calories } = req.body;

    const existing = await db.get('SELECT * FROM food_items WHERE id = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    await db.run(`
      UPDATE food_items SET
        category_id = ?,
        name = ?,
        description = ?,
        price = ?,
        discount_price = ?,
        is_veg = ?,
        is_available = ?,
        is_bestseller = ?,
        is_featured = ?,
        image_url = ?,
        preparation_time = ?,
        calories = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      category_id !== undefined ? category_id : existing.category_id,
      name !== undefined ? name.trim() : existing.name,
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
  getFoodById,
  getCategories,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  toggleAvailability
};

