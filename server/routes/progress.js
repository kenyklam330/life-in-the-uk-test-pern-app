import express from 'express';
import pool from '../config/database.js';
import { ensureAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Get user dashboard stats
router.get('/stats', ensureAuthenticated, async (req, res) => {
  try {
    // Get chapter completion stats
    const chapterStats = await pool.query(
      `SELECT 
         COUNT(*) as total_chapters,
         COUNT(CASE WHEN up.completed = true THEN 1 END) as completed_chapters
       FROM chapters c
       LEFT JOIN user_progress up ON c.id = up.chapter_id AND up.user_id = $1`,
      [req.user.id]
    );

    // Get test stats
    const testStats = await pool.query(
      `SELECT 
         COUNT(*) as total_tests,
         COUNT(CASE WHEN passed = true THEN 1 END) as passed_tests,
         AVG(percentage) as average_score,
         MAX(percentage) as best_score
       FROM test_results
       WHERE user_id = $1`,
      [req.user.id]
    );

    // Get recent activity
    const recentTests = await pool.query(
      `SELECT id, score, total_questions, percentage, passed, test_date
       FROM test_results
       WHERE user_id = $1
       ORDER BY test_date DESC
       LIMIT 3`,
      [req.user.id]
    );

    res.json({
      chapters: chapterStats.rows[0],
      tests: {
        ...testStats.rows[0],
        average_score: testStats.rows[0].average_score 
          ? parseFloat(testStats.rows[0].average_score).toFixed(2) 
          : null,
        best_score: testStats.rows[0].best_score 
          ? parseFloat(testStats.rows[0].best_score).toFixed(2) 
          : null,
      },
      recentTests: recentTests.rows,
    });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
});

// Get user progress
router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
         c.id,
         c.title,
         up.completed,
         up.last_accessed
       FROM chapters c
       LEFT JOIN user_progress up ON c.id = up.chapter_id AND up.user_id = $1
       ORDER BY c.order_index`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

export default router;
