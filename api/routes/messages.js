const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get messages for an event
router.get('/', async (req, res) => {
  try {
    const eventId = req.query.event_id || 1; // Default to first event
    const limit = req.query.limit || 100;

    const result = await db.query(
      `SELECT m.*, u.color
       FROM messages m
       LEFT JOIN users u ON m.user_id = u.id
       WHERE m.event_id = $1
       ORDER BY m.created_at DESC
       LIMIT $2`,
      [eventId, limit]
    );

    res.json(result.rows.reverse()); // Reverse to show oldest first
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Post a new message
router.post('/', async (req, res) => {
  try {
    const { username, message, event_id = 1 } = req.body;

    if (!username || !message) {
      return res.status(400).json({ error: 'Username and message are required' });
    }

    // Get user_id
    const userResult = await db.query(
      'SELECT id FROM users WHERE username = $1',
      [username]
    );

    const userId = userResult.rows.length > 0 ? userResult.rows[0].id : null;

    const result = await db.query(
      'INSERT INTO messages (event_id, user_id, username, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [event_id, userId, username, message]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
