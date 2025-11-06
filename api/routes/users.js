const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get or create user
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Check if user exists
    let result = await db.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    let user;
    if (result.rows.length === 0) {
      // Create new user
      const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      result = await db.query(
        'INSERT INTO users (username, display_name, color) VALUES ($1, $2, $3) RETURNING *',
        [username, username, randomColor]
      );
      user = result.rows[0];
    } else {
      user = result.rows[0];
      // Update last_seen
      await db.query(
        'UPDATE users SET last_seen = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );
    }

    res.json(user);
  } catch (error) {
    console.error('Error in /login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, display_name, color, last_seen FROM users ORDER BY last_seen DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
