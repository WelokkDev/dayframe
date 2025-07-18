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
        due_date,
        repeat_is_true,
        repeat_interval,
        repeat_unit,
        repeat_ends_on,
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO tasks (
                user_id, title, description, category_id, due_date,
                repeat_is_true, repeat_interval, repeat_unit, repeat_ends_on
            ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [
                userId, title, description, category_id, due_date,
                repeat_is_true, repeat_interval, repeat_unit, repeat_ends_on
            ]
        );
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error("Error creating task:", err.message);
        res.status(500).json({ error: 'Failed to create task' })
    }
});

router.get("/", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const categoryId = req.query.categoryId;
    const status = req.query.status;
    const dueToday = req.query.dueToday === "true";
    
    try {

        // 1. Auto-cancel any overdue tasks
        await pool.query(
            `
                UPDATE tasks
                SET cancelled = TRUE, failure_reason = COALESCE(failure_reason, 'Missed deadline')
                WHERE completed_at IS NULL AND cancelled = FALSE AND due_date < CURRENT_DATE
            `
        )

        // 2. Auto-generate next tasks based on the user given repeat logic
        await pool.query(
            `
                WITH to_spawn AS (
                SELECT
                    id AS src_id,
                    user_id,
                    title,
                    description,
                    category_id,
                    repeat_is_true,
                    repeat_interval,
                    repeat_unit,
                    repeat_ends_on,
                    CASE repeat_unit
                    WHEN 'day'   THEN due_date + (repeat_interval::text || ' day')::interval
                    WHEN 'week'  THEN due_date + (repeat_interval::text || ' week')::interval
                    WHEN 'month' THEN due_date + (repeat_interval::text || ' month')::interval
                    END AS next_due
                FROM tasks
                WHERE user_id = $1
                    AND repeat_is_true = TRUE
                    AND due_date < CURRENT_DATE
                    AND (repeat_ends_on IS NULL OR
                        (CASE repeat_unit
                            WHEN 'day'   THEN due_date + (repeat_interval::text || ' day')::interval
                            WHEN 'week'  THEN due_date + (repeat_interval::text || ' week')::interval
                            WHEN 'month' THEN due_date + (repeat_interval::text || ' month')::interval
                        END) <= repeat_ends_on)
                ),
                inserted AS (
                INSERT INTO tasks (
                    user_id, title, description, category_id, due_date,
                    repeat_is_true, repeat_interval, repeat_unit, repeat_ends_on
                )
                SELECT
                    user_id, title, description, category_id, next_due,
                    repeat_is_true, repeat_interval, repeat_unit, repeat_ends_on
                FROM to_spawn
                RETURNING id
                )
                UPDATE tasks
                SET repeat_is_true = FALSE
                WHERE id IN (SELECT src_id FROM to_spawn);
            `,
            [userId]
        );


        // 3. Build main query to return tasks
        let baseQuery = `SELECT * FROM tasks where user_id = $1`;
        const queryParams = [userId];

        if (categoryId) {
            baseQuery += ` AND category_id = $2`;
            queryParams.push(categoryId);
        }

        if (status == "completed") {
            baseQuery += ` AND completed_at IS NOT NULL AND cancelled = FALSE`;
        } else if (status == "incomplete") {
            baseQuery += ` AND completed_at IS NULL AND cancelled = FALSE`;
        } else if (status == "failed") {
            baseQuery += ` AND cancelled = TRUE`;
        }

        if (dueToday) {
            baseQuery += ` AND due_date = CURRENT_DATE`;
        }

        baseQuery += ` ORDER BY created_at DESC`;

        const result = await pool.query(baseQuery, queryParams)
        res.json(result.rows);

    } catch (err) {
        console.log("Error fetching tasks:", err.message);
        res.status(500).json({ error: "Failed to fetch tasks" })
    }
})



router.patch("/:id", authenticateToken, async (req, res) => {
    console.log("MORE TESTSS")
    const userId = req.user.userId;
    const taskId = req.params.id;
    const { completed_at, cancelled, failure_reason } = req.body;

    try {
        const result = await pool.query(
            `UPDATE tasks
            SET completed_at = $1,
                cancelled = $2,
                failure_reason = $3
            where id = $4 AND user_id = $5
            RETURNING *`,
            [completed_at, cancelled, failure_reason, taskId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.json(result.rows[0]);

    } catch (err) {
        console.error("Error updating task:", err.message);
        res.status(500).json({ error: "Failed to update task"});
    }
})

module.exports = router;