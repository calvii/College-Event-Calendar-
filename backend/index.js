// backend/index.js
const express = require('express');
const cors = require('cors');
const db = require('./db'); // your MySQL connection
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test DB connection
(async () => {
  try {
    await db.query('SELECT 1');
    console.log('Database connected ✅');
  } catch (err) {
    console.error('Database connection failed ❌', err);
  }
})();

// Test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// GET /events → fetch all events
app.get('/events', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events ORDER BY id DESC');

    const events = rows.map(r => {
      const dateObj = new Date(r.date);      // JS Date from MySQL DATE
      dateObj.setDate(dateObj.getDate() + 1); // Add 1 day to fix timezone shift
      return {
        ...r,
        date: dateObj.toISOString().split('T')[0] // Convert to YYYY-MM-DD
      };
    });

    res.json({ events });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /events → add a new event
app.post('/events', async (req, res) => {
  const { title, date, start_time, end_time, location, description, event_type } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO events (title, date, start_time, end_time, location, description, event_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, date, start_time || null, end_time || null, location || null, description || null, event_type || 'academic']
    );

    res.json({
      id: result.insertId,
      title,
      date,
      start_time: start_time || null,
      end_time: end_time || null,
      location: location || null,
      description: description || null,
      event_type: event_type || 'academic'
    });
  } catch (err) {
    console.error('Error adding event:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /events → update an event
app.put('/events', async (req, res) => {
  const { id, title, date, start_time, end_time, location, description, event_type } = req.body;

  if (!id || !title || !date) {
    return res.status(400).json({ error: 'ID, title, and date are required' });
  }

  try {
    await db.query(
      `UPDATE events SET title = ?, date = ?, start_time = ?, end_time = ?, location = ?, description = ?, event_type = ?
       WHERE id = ?`,
      [title, date, start_time || null, end_time || null, location || null, description || null, event_type || 'academic', id]
    );

    res.json({ message: 'Event updated successfully' });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /events → delete an event
app.delete('/events', async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    await db.query('DELETE FROM events WHERE id = ?', [id]);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
