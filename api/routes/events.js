const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all events
router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM events ORDER BY created_at DESC'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      'SELECT * FROM events WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    const { name, description, event_type = 'drill', status = 'active' } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Event name is required' });
    }

    const result = await db.query(
      'INSERT INTO events (name, description, event_type, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, event_type, status]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
