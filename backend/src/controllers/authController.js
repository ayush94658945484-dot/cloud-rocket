const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new customer
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const existingUser = await db.get('SELECT id FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await db.run(
      'INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)',
      [name.trim(), email.trim().toLowerCase(), password_hash, phone ? phone.trim() : null, 'customer']
    );

    const newUser = await db.get('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [result.lastID]);
    const token = generateToken(newUser.id, newUser.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: newUser
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
  }
};

// @desc    Login customer or admin
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await db.get('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()]);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user.id, user.role);

    res.json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

// @desc    Get Current User Profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await db.get('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', [req.user.id]);
    const addresses = await db.all('SELECT * FROM customer_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC', [req.user.id]);
    const orders = await db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC LIMIT 10', [req.user.id]);

    res.json({
      success: true,
      user,
      addresses,
      recentOrders: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error: error.message });
  }
};

// @desc    Update Profile Details
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    let query = 'UPDATE users SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP';
    const params = [name || req.user.name, phone || req.user.phone];

    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password.trim(), salt);
      query += ', password_hash = ?';
      params.push(hash);
    }

    query += ' WHERE id = ?';
    params.push(req.user.id);

    await db.run(query, params);
    const updated = await db.get('SELECT id, name, email, phone, role FROM users WHERE id = ?', [req.user.id]);

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error: error.message });
  }
};

// @desc    Add Customer Address
// @route   POST /api/auth/addresses
const addAddress = async (req, res) => {
  try {
    const { label, recipient_name, phone, address_line, landmark, city, postal_code, is_default } = req.body;

    if (!recipient_name || !phone || !address_line) {
      return res.status(400).json({ success: false, message: 'Recipient name, phone, and address line are required' });
    }

    if (is_default) {
      await db.run('UPDATE customer_addresses SET is_default = 0 WHERE user_id = ?', [req.user.id]);
    }

    const result = await db.run(
      `INSERT INTO customer_addresses 
       (user_id, label, recipient_name, phone, address_line, landmark, city, postal_code, is_default)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, label || 'Home', recipient_name, phone, address_line, landmark || null, city || 'Mumbai', postal_code || null, is_default ? 1 : 0]
    );

    const addresses = await db.all('SELECT * FROM customer_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC', [req.user.id]);
    res.status(201).json({ success: true, message: 'Address saved', addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add address', error: error.message });
  }
};

// @desc    Delete Address
// @route   DELETE /api/auth/addresses/:id
const deleteAddress = async (req, res) => {
  try {
    await db.run('DELETE FROM customer_addresses WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    const addresses = await db.all('SELECT * FROM customer_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC', [req.user.id]);
    res.json({ success: true, message: 'Address deleted', addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete address', error: error.message });
  }
};

// @desc    Admin: Get all registered customers
// @route   GET /api/auth/admin/customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await db.all(`
      SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
             COUNT(o.id) as total_orders,
             COALESCE(SUM(o.total_amount), 0) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role = 'customer'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json({ success: true, customers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch customers', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress,
  getAllCustomers
};

