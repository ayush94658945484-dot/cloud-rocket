const { db } = require('../config/db');

// @desc    Get all public website settings
// @route   GET /api/settings
const getSettings = async (req, res) => {
  try {
    const rows = await db.all('SELECT key, value, description FROM website_settings');
    const settings = {};
    rows.forEach(r => {
      settings[r.key] = r.value;
    });

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch settings', error: error.message });
  }
};

// @desc    Admin: Update bulk settings
// @route   POST /api/settings/admin/bulk
const updateSettingsBulk = async (req, res) => {
  try {
    const settingsObject = req.body; // e.g. { whatsapp_number: '919876543210', business_name: 'Royal Zaika' }

    if (!settingsObject || typeof settingsObject !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    for (const [key, value] of Object.entries(settingsObject)) {
      await db.run(`
        INSERT INTO website_settings (key, value, updated_at) 
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `, [key, String(value)]);
    }

    const rows = await db.all('SELECT key, value FROM website_settings');
    const updated = {};
    rows.forEach(r => {
      updated[r.key] = r.value;
    });

    res.json({ success: true, message: 'Business settings saved successfully!', settings: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettingsBulk
};

