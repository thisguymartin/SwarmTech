const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all pins for an event
router.get('/', async (req, res) => {
  try {
    const eventId = req.query.event_id || 1;

    const result = await db.query(
      `SELECT p.*, u.color, u.display_name as user_display_name
       FROM pins p
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.event_id = $1
       ORDER BY p.created_at DESC`,
      [eventId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching pins:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create or update a pin
router.post('/', async (req, res) => {
  try {
    const { username, name, latitude, longitude, description, pin_type = 'agent', event_id = 1 } = req.body;

    if (!username || !name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Username, name, latitude, and longitude are required' });
    }

    // Get user_id
    const userResult = await db.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    const userId = userResult.rows.length > 0 ? userResult.rows[0].id : null;

    // Check if pin already exists for this user
    const existingPin = await db.query(
      'SELECT id FROM pins WHERE user_id = $1 AND event_id = $2',
      [userId, event_id]
    );

    let result;
    if (existingPin.rows.length > 0) {
      // Update existing pin
      result = await db.query(
        `UPDATE pins
         SET name = $1, latitude = $2, longitude = $3, description = $4, pin_type = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [name, latitude, longitude, description, pin_type, existingPin.rows[0].id]
      );
    } else {
      // Create new pin
      result = await db.query(
        `INSERT INTO pins (event_id, user_id, name, latitude, longitude, description, pin_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [event_id, userId, name, latitude, longitude, description, pin_type]
      );
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating/updating pin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a pin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM pins WHERE id = $1', [id]);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting pin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
