import express from 'express';
import pool from '../config/database.js';
import { ensureAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Get all chapters
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, 
              COALESCE(up.completed, false) as completed,
              up.last_accessed
       FROM chapters c
       LEFT JOIN user_progress up ON c.id = up.chapter_id AND up.user_id = $1
       ORDER BY c.order_index`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching chapters:', err);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

// Get single chapter by ID
router.get('/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT c.*, 
              COALESCE(up.completed, false) as completed,
              up.last_accessed
       FROM chapters c
       LEFT JOIN user_progress up ON c.id = up.chapter_id AND up.user_id = $1
       WHERE c.id = $2`,
      [req.user.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Chapter not found' });
    }

    // Update last accessed
    await pool.query(
      `INSERT INTO user_progress (user_id, chapter_id, last_accessed)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, chapter_id)
       DO UPDATE SET last_accessed = CURRENT_TIMESTAMP`,
      [req.user.id, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching chapter:', err);
    res.status(500).json({ error: 'Failed to fetch chapter' });
  }
});

// Mark chapter as completed
router.post('/:id/complete', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      `INSERT INTO user_progress (user_id, chapter_id, completed, last_accessed)
       VALUES ($1, $2, true, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, chapter_id)
       DO UPDATE SET completed = true, last_accessed = CURRENT_TIMESTAMP`,
      [req.user.id, id]
    );
    res.json({ message: 'Chapter marked as completed' });
  } catch (err) {
    console.error('Error marking chapter complete:', err);
    res.status(500).json({ error: 'Failed to mark chapter as completed' });
  }
});

export default router;
