const { db } = require('../config/db');

// @desc    Create a new group ordering party room
// @route   POST /api/party/create
const createPartyRoom = async (req, res) => {
  try {
    const { host_name, host_phone } = req.body;
    if (!host_name) {
      return res.status(400).json({ success: false, message: 'Host name is required' });
    }

    const roomId = 'PARTY-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    await db.run(
      'INSERT INTO party_rooms (id, host_name, host_phone, status, items_json) VALUES (?, ?, ?, ?, ?)',
      [roomId, host_name.trim(), host_phone || '', 'OPEN', '[]']
    );

    res.json({
      success: true,
      roomId,
      message: 'Group order party room created successfully!',
      shareUrl: `?party=${roomId}`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create party room', error: error.message });
  }
};

// @desc    Get party room details and group items
// @route   GET /api/party/:id
const getPartyRoom = async (req, res) => {
  try {
    const room = await db.get('SELECT * FROM party_rooms WHERE id = ?', [req.params.id]);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Party room not found' });
    }

    const items = JSON.parse(room.items_json || '[]');
    res.json({
      success: true,
      room: {
        id: room.id,
        host_name: room.host_name,
        host_phone: room.host_phone,
        status: room.status,
        created_at: room.created_at,
        items
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch party room', error: error.message });
  }
};

// @desc    Add item to party room
// @route   POST /api/party/:id/add-item
const addItemToPartyRoom = async (req, res) => {
  try {
    const { userName, foodItem, quantity = 1, customization = '' } = req.body;
    if (!userName || !foodItem) {
      return res.status(400).json({ success: false, message: 'User name and food item required' });
    }

    const room = await db.get('SELECT * FROM party_rooms WHERE id = ?', [req.params.id]);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Party room not found' });
    }

    if (room.status !== 'OPEN') {
      return res.status(400).json({ success: false, message: 'This party room is locked for checkout' });
    }

    const items = JSON.parse(room.items_json || '[]');
    items.push({
      id: Date.now() + Math.floor(Math.random() * 1000),
      userName: userName.trim(),
      foodItem,
      quantity: Number(quantity),
      customization,
      addedAt: new Date().toISOString()
    });

    await db.run(
      'UPDATE party_rooms SET items_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(items), req.params.id]
    );

    res.json({ success: true, message: 'Item added to group cart!', items });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add item to party room', error: error.message });
  }
};

module.exports = {
  createPartyRoom,
  getPartyRoom,
  addItemToPartyRoom
};
