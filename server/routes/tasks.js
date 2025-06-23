const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware'); 

// Create a new task
router.post("/", authenticateToken, async (req, res) => {

    console.log("Token user:", req.user);
    console.log("Request body:", req.body);

    const userId = req.user.userId;
    const {
        title,
        description,
        category_id,
        start_date,
        end_date,
        repeat_is_true,
        repeat_interval,
        repeat_unit,
        repeat_ends_on,
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO tasks (
                user_id, title, description, category_id, start_date, end_date,
                repeat_is_true, repeat_interval, repeat_unit, repeat_ends_on
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
            [
                userId, title, description, category_id, start_date, end_date,
                repeat_is_true, repeat_interval, repeat_unit, repeat_ends_on
            ]
        );
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error("Error creating task:", err.message);
        res.status(500).json({ error: 'Failed to create task' })
    }
});

module.exports = router;