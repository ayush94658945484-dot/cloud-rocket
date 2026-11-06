const { db } = require('../config/db');

// @desc    Get all active public offers/coupons
// @route   GET /api/coupons
const getPublicCoupons = async (req, res) => {
  try {
    const coupons = await db.all(`
      SELECT id, code, description, discount_type, discount_value, min_order_amount, max_discount_amount, valid_until
      FROM coupons
      WHERE is_active = 1
      ORDER BY id ASC
    `);
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch offers', error: error.message });
  }
};

// @desc    Validate a Coupon against cart total
// @route   POST /api/coupons/validate
const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    const orderAmount = Number(subtotal || 0);
    const coupon = await db.get(
      'SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1',
      [code.trim()]
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (orderAmount < (coupon.min_order_amount || 0)) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum cart value of ₹${coupon.min_order_amount}`
      });
    }

    let discount = 0;
    if (coupon.discount_type === 'PERCENTAGE') {
      discount = (orderAmount * coupon.discount_value) / 100;
      if (coupon.max_discount_amount) {
        discount = Math.min(discount, coupon.max_discount_amount);
      }
    } else {
      discount = coupon.discount_value;
    }

    // Ensure discount does not exceed subtotal
    discount = Math.min(discount, orderAmount);

    res.json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        calculated_discount: Number(discount.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error validating coupon', error: error.message });
  }
};

// @desc    Admin: Get all coupons (including inactive)
// @route   GET /api/coupons/admin/all
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await db.all('SELECT * FROM coupons ORDER BY id DESC');
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch coupons', error: error.message });
  }
};

// @desc    Admin: Create coupon
// @route   POST /api/coupons/admin
const createCoupon = async (req, res) => {
  try {
    const { code, description, discount_type, discount_value, min_order_amount, max_discount_amount, is_active } = req.body;

    if (!code || !discount_type || discount_value === undefined) {
      return res.status(400).json({ success: false, message: 'Code, type, and value are required' });
    }

    const existing = await db.get('SELECT id FROM coupons WHERE UPPER(code) = UPPER(?)', [code.trim()]);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const result = await db.run(`
      INSERT INTO coupons 
      (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      code.trim().toUpperCase(),
      description || '',
      discount_type.toUpperCase(),
      Number(discount_value),
      Number(min_order_amount || 0),
      max_discount_amount ? Number(max_discount_amount) : null,
      is_active !== undefined ? (is_active ? 1 : 0) : 1
    ]);

    const created = await db.get('SELECT * FROM coupons WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, message: 'Coupon created', coupon: created });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create coupon', error: error.message });
  }
};

// @desc    Admin: Update coupon
// @route   PUT /api/coupons/admin/:id
const updateCoupon = async (req, res) => {
  try {
    const { code, description, discount_type, discount_value, min_order_amount, max_discount_amount, is_active } = req.body;

    const existing = await db.get('SELECT * FROM coupons WHERE id = ?', [req.params.id]);
    if (!existing) return res.status(404).json({ success: false, message: 'Coupon not found' });

    await db.run(`
      UPDATE coupons SET
        code = ?,
        description = ?,
        discount_type = ?,
        discount_value = ?,
        min_order_amount = ?,
        max_discount_amount = ?,
        is_active = ?
      WHERE id = ?
    `, [
      code ? code.trim().toUpperCase() : existing.code,
      description !== undefined ? description : existing.description,
      discount_type ? discount_type.toUpperCase() : existing.discount_type,
      discount_value !== undefined ? Number(discount_value) : existing.discount_value,
      min_order_amount !== undefined ? Number(min_order_amount) : existing.min_order_amount,
      max_discount_amount !== undefined ? (max_discount_amount ? Number(max_discount_amount) : null) : existing.max_discount_amount,
      is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active,
      req.params.id
    ]);

    const updated = await db.get('SELECT * FROM coupons WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Coupon updated', coupon: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update coupon', error: error.message });
  }
};

// @desc    Admin: Delete coupon
// @route   DELETE /api/coupons/admin/:id
const deleteCoupon = async (req, res) => {
  try {
    await db.run('DELETE FROM coupons WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete coupon', error: error.message });
  }
};

module.exports = {
  getPublicCoupons,
  validateCoupon,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
};

