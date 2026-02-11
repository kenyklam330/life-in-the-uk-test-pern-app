import express from 'express';
import pool from '../config/database.js';
import { ensureAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// Get random questions for a test
router.get('/start', ensureAuthenticated, async (req, res) => {
  try {
    const { count = 24 } = req.query; // Default 24 questions like real test
    
    const result = await pool.query(
      `SELECT id, question_text, option_a, option_b, option_c, option_d, difficulty
       FROM questions
       ORDER BY RANDOM()
       LIMIT $1`,
      [count]
    );

    res.json({
      questions: result.rows,
      totalQuestions: result.rows.length,
    });
  } catch (err) {
    console.error('Error generating test:', err);
    res.status(500).json({ error: 'Failed to generate test' });
  }
});

// Submit test answers and get results
router.post('/submit', ensureAuthenticated, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { answers, timeTaken } = req.body; // answers: [{questionId, userAnswer}]
    
    await client.query('BEGIN');

    // Get correct answers
    const questionIds = answers.map(a => a.questionId);
    const questionsResult = await client.query(
      'SELECT id, correct_answer FROM questions WHERE id = ANY($1)',
      [questionIds]
    );

    const correctAnswers = {};
    questionsResult.rows.forEach(q => {
      correctAnswers[q.id] = q.correct_answer;
    });

    // Calculate score
    let correctCount = 0;
    const detailedResults = answers.map(answer => {
      const isCorrect = correctAnswers[answer.questionId] === answer.userAnswer;
      if (isCorrect) correctCount++;
      
      return {
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        correctAnswer: correctAnswers[answer.questionId],
        isCorrect,
      };
    });

    const totalQuestions = answers.length;
    const percentage = (correctCount / totalQuestions) * 100;
    const passed = percentage >= 75; // 75% pass mark

    // Save test result
    const testResult = await client.query(
      `INSERT INTO test_results (user_id, score, total_questions, percentage, passed, time_taken)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [req.user.id, correctCount, totalQuestions, percentage, passed, timeTaken]
    );

    const testResultId = testResult.rows[0].id;

    // Save individual question results
    for (const result of detailedResults) {
      await client.query(
        `INSERT INTO test_questions (test_result_id, question_id, user_answer, is_correct)
         VALUES ($1, $2, $3, $4)`,
        [testResultId, result.questionId, result.userAnswer, result.isCorrect]
      );
    }

    await client.query('COMMIT');

    res.json({
      testResultId,
      score: correctCount,
      totalQuestions,
      percentage: percentage.toFixed(2),
      passed,
      results: detailedResults,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error submitting test:', err);
    res.status(500).json({ error: 'Failed to submit test' });
  } finally {
    client.release();
  }
});

// Get test history for user
router.get('/history', ensureAuthenticated, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, score, total_questions, percentage, passed, time_taken, test_date
       FROM test_results
       WHERE user_id = $1
       ORDER BY test_date DESC
       LIMIT 10`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching test history:', err);
    res.status(500).json({ error: 'Failed to fetch test history' });
  }
});

// Get detailed results for a specific test
router.get('/:testId/results', ensureAuthenticated, async (req, res) => {
  try {
    const { testId } = req.params;

    // Verify test belongs to user
    const testCheck = await pool.query(
      'SELECT * FROM test_results WHERE id = $1 AND user_id = $2',
      [testId, req.user.id]
    );

    if (testCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Test not found' });
    }

    // Get detailed question results
    const results = await pool.query(
      `SELECT 
         tq.question_id,
         tq.user_answer,
         tq.is_correct,
         q.question_text,
         q.option_a,
         q.option_b,
         q.option_c,
         q.option_d,
         q.correct_answer,
         q.explanation
       FROM test_questions tq
       JOIN questions q ON tq.question_id = q.id
       WHERE tq.test_result_id = $1`,
      [testId]
    );

    res.json({
      test: testCheck.rows[0],
      questions: results.rows,
    });
  } catch (err) {
    console.error('Error fetching test results:', err);
    res.status(500).json({ error: 'Failed to fetch test results' });
  }
});

// Get practice questions by chapter
router.get('/practice/:chapterId', ensureAuthenticated, async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { count = 10 } = req.query;

    const result = await pool.query(
      `SELECT id, question_text, option_a, option_b, option_c, option_d, difficulty
       FROM questions
       WHERE chapter_id = $1
       ORDER BY RANDOM()
       LIMIT $2`,
      [chapterId, count]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching practice questions:', err);
    res.status(500).json({ error: 'Failed to fetch practice questions' });
  }
});

export default router;
