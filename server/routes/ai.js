const express = require('express');
const router = express.Router();
const { parseAndCreateTasks, generateNextTaskInstance } = require('../services/aiService');
const authenticateToken = require('../middleware/authMiddleware');
const pool = require('../db');

// Apply auth middleware to all routes
router.use(authenticateToken);

// POST /ai/generate-tasks - Generate and create tasks from natural language
router.post('/generate-tasks', async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.userId; // Note: using req.user.userId based on your auth middleware

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text input is required' });
    }

    // Parse and create tasks in one operation
    const result = await parseAndCreateTasks(userId, text);

    res.json({
      success: true,
      tasks: result.tasks,
      interpretation: result.interpretation,
      originalInstruction: result.originalInstruction
    });

  } catch (error) {
    console.error('AI generate tasks error:', error);
    
    // Handle specific error types
    if (error.message.includes('Please provide more specific details')) {
      return res.status(400).json({ 
        error: error.message,
        type: 'clarification_needed'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate tasks',
      details: error.message 
    });
  }
});

// POST /ai/test-recurrence - Test the recurrence algorithm
router.post('/test-recurrence', async (req, res) => {
  try {
    const { recurrence } = req.body;
    const userId = req.user.userId;

    if (!recurrence || !recurrence.frequency) {
      return res.status(400).json({ error: 'Recurrence data is required' });
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create a test task
      const taskResult = await client.query(
        `INSERT INTO tasks (user_id, title, category_id, original_instruction) 
        VALUES ($1, $2, $3, $4) RETURNING *`,
        [userId, 'Test Task', null, 'Test recurrence algorithm']
      );
      
      const task = taskResult.rows[0];
      
      // Create recurrence rule
      const recurrenceResult = await client.query(
        `INSERT INTO recurrence_rules (
          task_id, frequency, interval_value, occurrences_per_period, days_of_week, week_of_month, 
          day_of_month, preferred_time, time_range_start, time_range_end, end_date, end_after_occurrences
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
        [
          task.id,
          recurrence.frequency,
          recurrence.interval_value || 1,
          recurrence.occurrences_per_period || null,
          recurrence.days_of_week ? `{${recurrence.days_of_week.join(',')}}` : null,
          recurrence.week_of_month || null,
          recurrence.day_of_month || null,
          recurrence.preferred_time || null,
          recurrence.time_range_start || null,
          recurrence.time_range_end || null,
          recurrence.end_date || null,
          recurrence.end_after_occurrences || null
        ]
      );
      
      // Test the algorithm
      const nextInstanceTime = await generateNextTaskInstance(task.id, recurrence, client);
      
      // Get the created instance
      const instanceResult = await client.query(
        `SELECT * FROM task_instances WHERE task_id = $1 ORDER BY scheduled_at`,
        [task.id]
      );
      
      await client.query('COMMIT');
      
      res.json({
        success: true,
        task: task,
        recurrence: recurrenceResult.rows[0],
        nextInstanceTime: nextInstanceTime,
        instances: instanceResult.rows
      });
      
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Test recurrence error:', error);
    res.status(500).json({ 
      error: 'Failed to test recurrence',
      details: error.message 
    });
  }
});

module.exports = router;
