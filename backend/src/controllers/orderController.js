const { db } = require('../config/db');
const { generateWhatsAppOrderMessage } = require('../utils/whatsappHelper');

// Helper to get website settings as key-value object
async function getSettingsMap() {
  const settingsRows = await db.all('SELECT key, value FROM website_settings');
  const map = {};
  settingsRows.forEach(row => {
    map[row.key] = row.value;
  });
  return map;
}

// @desc    Place a new Order (WhatsApp or Online)
// @route   POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      landmark,
      special_instructions,
      items,
      coupon_code,
      payment_method
    } = req.body;

    if (!customer_name || !customer_phone || !delivery_address) {
      return res.status(400).json({ success: false, message: 'Name, phone, and delivery address are required' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    // 1. Fetch live food prices from database to prevent price tampering
    let calculatedSubtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const food = await db.get('SELECT * FROM food_items WHERE id = ?', [item.food_item_id || item.id]);
      if (!food) {
        return res.status(400).json({ success: false, message: `Dish #${item.id} is no longer available` });
      }
      if (food.is_available === 0) {
        return res.status(400).json({ success: false, message: `Dish '${food.name}' is currently sold out` });
      }

      const activePrice = food.discount_price && food.discount_price > 0 ? food.discount_price : food.price;
      const quantity = Math.max(1, parseInt(item.quantity) || 1);
      const itemTotal = activePrice * quantity;

      calculatedSubtotal += itemTotal;
      validatedItems.push({
        food_item_id: food.id,
        food_name: food.name,
        price: activePrice,
        quantity,
        total_price: itemTotal,
        is_veg: food.is_veg
      });
    }

    // 2. Fetch business settings
    const settings = await getSettingsMap();
    const minOrderVal = Number(settings.min_order_amount || 149);
    if (calculatedSubtotal < minOrderVal) {
      return res.status(400).json({ success: false, message: `Minimum order amount is ₹${minOrderVal}` });
    }

    // 3. Coupon validation
    let discountAmount = 0;
    let appliedCoupon = null;

    if (coupon_code && coupon_code.trim()) {
      const coupon = await db.get(
        'SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1',
        [coupon_code.trim()]
      );

      if (coupon) {
        const meetsMin = calculatedSubtotal >= (coupon.min_order_amount || 0);
        if (meetsMin) {
          if (coupon.discount_type === 'PERCENTAGE') {
            discountAmount = (calculatedSubtotal * coupon.discount_value) / 100;
            if (coupon.max_discount_amount) {
              discountAmount = Math.min(discountAmount, coupon.max_discount_amount);
            }
          } else {
            discountAmount = coupon.discount_value;
          }
          appliedCoupon = coupon.code;
          // Increment usage
          await db.run('UPDATE coupons SET times_used = times_used + 1 WHERE id = ?', [coupon.id]);
        }
      }
    }

    // 4. Delivery charges calculation
    const baseDeliveryFee = Number(settings.delivery_charge || 40);
    const freeDeliveryThreshold = Number(settings.free_delivery_threshold || 499);
    const deliveryFee = calculatedSubtotal >= freeDeliveryThreshold ? 0 : baseDeliveryFee;

    // 5. Taxes (Default 5% GST on Restaurant food)
    const taxRatePercent = Number(settings.tax_rate_percent || 5);
    const taxAmount = Number(((calculatedSubtotal - discountAmount) * (taxRatePercent / 100)).toFixed(2));

    const finalTotal = Number((calculatedSubtotal - discountAmount + deliveryFee + taxAmount).toFixed(2));

    // 6. Generate unique readable order number
    const orderNumber = `CR-${Date.now().toString().slice(-6)}`;

    // 7. Generate WhatsApp formatted text & URL
    const whatsappPayload = generateWhatsAppOrderMessage({
      order_number: orderNumber,
      customer_name,
      customer_phone,
      delivery_address,
      landmark,
      special_instructions,
      items: validatedItems,
      subtotal: calculatedSubtotal,
      discount_amount: discountAmount,
      delivery_fee: deliveryFee,
      tax_amount: taxAmount,
      total_amount: finalTotal,
      coupon_code: appliedCoupon
    }, settings);

    // 8. Insert Order Record
    const userId = req.user ? req.user.id : null;
    const orderInsert = await db.run(`
      INSERT INTO orders (
        order_number, user_id, customer_name, customer_email, customer_phone,
        delivery_address, landmark, special_instructions,
        subtotal, discount_amount, delivery_fee, tax_amount, total_amount,
        coupon_code, payment_method, payment_status, order_status, whatsapp_message_text
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderNumber,
      userId,
      customer_name.trim(),
      customer_email || null,
      customer_phone.trim(),
      delivery_address.trim(),
      landmark ? landmark.trim() : null,
      special_instructions ? special_instructions.trim() : null,
      calculatedSubtotal,
      discountAmount,
      deliveryFee,
      taxAmount,
      finalTotal,
      appliedCoupon,
      payment_method || 'WHATSAPP',
      payment_method === 'ONLINE' ? 'COMPLETED' : 'PENDING',
      'PENDING',
      whatsappPayload.rawMessage
    ]);

    const orderId = orderInsert.lastID;

    // 9. Insert Order Items
    for (const item of validatedItems) {
      await db.run(`
        INSERT INTO order_items (order_id, food_item_id, food_name, price, quantity, total_price, is_veg)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [orderId, item.food_item_id, item.food_name, item.price, item.quantity, item.total_price, item.is_veg]);
    }

    const createdOrder = await db.get('SELECT * FROM orders WHERE id = ?', [orderId]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: createdOrder,
      items: validatedItems,
      whatsapp: {
        url: whatsappPayload.whatsappUrl,
        message: whatsappPayload.rawMessage,
        targetPhone: whatsappPayload.targetPhone
      }
    });
  } catch (error) {
    console.error('createOrder Error:', error);
    res.status(500).json({ success: false, message: 'Order processing failed', error: error.message });
  }
};

// @desc    Track Order by Order Number (Public)
// @route   GET /api/orders/track/:order_number
const trackOrder = async (req, res) => {
  try {
    const order = await db.get('SELECT * FROM orders WHERE order_number = ?', [req.params.order_number]);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const items = await db.all('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
    res.json({ success: true, order, items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to track order', error: error.message });
  }
};

// @desc    Get Current Customer's Orders
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
    
    // Attach items to each order
    const populated = await Promise.all(orders.map(async (o) => {
      const items = await db.all('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
      return { ...o, items };
    }));

    res.json({ success: true, count: populated.length, orders: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve orders', error: error.message });
  }
};

// @desc    Admin: Get all orders with filtering & pagination
// @route   GET /api/orders/admin/all
const getAllOrders = async (req, res) => {
  try {
    const { status, search, limit = 50, offset = 0 } = req.query;
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      sql += ' AND order_status = ?';
      params.push(status.toUpperCase());
    }

    if (search && search.trim()) {
      sql += ' AND (order_number LIKE ? OR customer_name LIKE ? OR customer_phone LIKE ?)';
      const t = `%${search.trim()}%`;
      params.push(t, t, t);
    }

    sql += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const orders = await db.all(sql, params);

    const populated = await Promise.all(orders.map(async (o) => {
      const items = await db.all('SELECT * FROM order_items WHERE order_id = ?', [o.id]);
      return { ...o, items };
    }));

    res.json({ success: true, count: populated.length, orders: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin orders', error: error.message });
  }
};

// @desc    Admin: Update Order Status
// @route   PATCH /api/orders/admin/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { order_status, payment_status } = req.body;
    const order = await db.get('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    let sql = 'UPDATE orders SET updated_at = CURRENT_TIMESTAMP';
    const params = [];

    if (order_status) {
      sql += ', order_status = ?';
      params.push(order_status.toUpperCase());
    }
    if (payment_status) {
      sql += ', payment_status = ?';
      params.push(payment_status.toUpperCase());
    }

    sql += ' WHERE id = ?';
    params.push(req.params.id);

    await db.run(sql, params);
    const updated = await db.get('SELECT * FROM orders WHERE id = ?', [req.params.id]);

    res.json({ success: true, message: 'Order status updated', order: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order', error: error.message });
  }
};

// @desc    Admin: Analytics & Overview Stats
// @route   GET /api/orders/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const totalOrdersRow = await db.get('SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue FROM orders WHERE order_status != "CANCELLED"');
    
    // Today's stats
    const todayRow = await db.get(`
      SELECT COUNT(*) as count, COALESCE(SUM(total_amount), 0) as revenue 
      FROM orders 
      WHERE DATE(created_at) = DATE('now', 'localtime') AND order_status != "CANCELLED"
    `);

    // Pending vs Active vs Completed
    const statusCounts = await db.all(`
      SELECT order_status, COUNT(*) as count 
      FROM orders 
      GROUP BY order_status
    `);

    // Top selling dishes
    const topDishes = await db.all(`
      SELECT oi.food_name, oi.is_veg, SUM(oi.quantity) as total_quantity, SUM(oi.total_price) as total_sales
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.order_status != "CANCELLED"
      GROUP BY oi.food_name
      ORDER BY total_quantity DESC
      LIMIT 6
    `);

    const customerCount = await db.get('SELECT COUNT(*) as count FROM users WHERE role = "customer"');

    res.json({
      success: true,
      stats: {
        totalOrders: totalOrdersRow.count,
        totalRevenue: totalOrdersRow.revenue,
        todayOrders: todayRow.count,
        todayRevenue: todayRow.revenue,
        totalCustomers: customerCount.count,
        statusDistribution: statusCounts,
        topDishes
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

module.exports = {
  createOrder,
  trackOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getAdminStats
};

