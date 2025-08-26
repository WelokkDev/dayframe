const express = require('express');
const router = express.Router();
const pool = require('../db');
const { parseTaskFromText } = require('../services/aiService');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /ai/parse-task - Parse natural language into task structure
router.post('/parse-task', async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user.id;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text input is required' });
    }

    // Parse the natural language input
    const parsedTask = await parseTaskFromText(text, userId);

    // If a category was mentioned, try to find or create it
    let categoryId = null;
    if (parsedTask.category) {
      // First try to find existing category
      const categoryResult = await pool.query(
        'SELECT id FROM categories WHERE name ILIKE $1 AND user_id = $2',
        [parsedTask.category, userId]
      );

      if (categoryResult.rows.length > 0) {
        categoryId = categoryResult.rows[0].id;
      } else {
        // Create new category if it doesn't exist
        const newCategoryResult = await pool.query(
          'INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING id',
          [parsedTask.category, userId]
        );
        categoryId = newCategoryResult.rows[0].id;
      }
    }

    // Combine due date and time if both are provided
    let dueAt = null;
    if (parsedTask.dueDate) {
      if (parsedTask.dueTime) {
        dueAt = `${parsedTask.dueDate} ${parsedTask.dueTime}:00`;
      } else {
        dueAt = `${parsedTask.dueDate} 00:00:00`;
      }
    }

    // Return the parsed task data for frontend confirmation
    res.json({
      success: true,
      task: {
        title: parsedTask.title,
        description: parsedTask.description,
        categoryId: categoryId,
        dueAt: dueAt,
        priority: parsedTask.priority,
        recurrence: parsedTask.recurrence,
        originalInstruction: parsedTask.originalInstruction
      }
    });

  } catch (error) {
    console.error('AI parse task error:', error);
    res.status(500).json({ 
      error: 'Failed to parse task',
      details: error.message 
    });
  }
});

// POST /ai/create-task - Create task from parsed data
router.post('/create-task', async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      title, 
      description, 
      categoryId, 
      dueAt, 
      priority, 
      recurrence, 
      originalInstruction 
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' });
    }

    // Start a transaction
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Insert the task
      const taskResult = await client.query(
        `INSERT INTO tasks (user_id, title, description, category_id, due_at, original_instruction) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [userId, title, description, categoryId, dueAt, originalInstruction]
      );

      const taskId = taskResult.rows[0].id;

      // Insert recurrence rules if specified
      if (recurrence && recurrence.frequency) {
        await client.query(
          `INSERT INTO recurrence_rules (
            task_id, frequency, interval_value, days_of_week, week_of_month, 
            day_of_month, preferred_time, end_date, end_after_occurrences
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [
            taskId,
            recurrence.frequency,
            recurrence.intervalValue || 1,
            recurrence.daysOfWeek ? `{${recurrence.daysOfWeek.join(',')}}` : null,
            recurrence.weekOfMonth,
            recurrence.dayOfMonth,
            recurrence.preferredTime,
            recurrence.endDate,
            recurrence.endAfterOccurrences
          ]
        );
      }

      await client.query('COMMIT');

      res.json({
        success: true,
        taskId: taskId,
        message: 'Task created successfully'
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('AI create task error:', error);
    res.status(500).json({ 
      error: 'Failed to create task',
      details: error.message 
    });
  }
});

module.exports = router;
