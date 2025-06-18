const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new task
router.post("/tasks", async (req, res) => {

    const {
        user_id,
        title,
        description,
        category,
        start_date,
        end_date,
        repeat_is_true,
        repeat_interval,
        repeat_unit,
        repeat_ends_on,
        parent_task_id
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO tasks (
                user_id, title, description, category, start_date, end_date,
                repeat_is_true, repeat_interval, repeat_unit, repeat_ends_on, parent_task_id
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
            [
                user_id, title, description, category, start_date, end_date,
                repeat_is_true, repeat_interval, repeat_unit, repeat_ends_on, parent_task_id
            ]
        );
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error("Error creating task:", err.message);
        res.status(500).json({ error: 'Failed to create task' })
    }
});

module.exports = router;