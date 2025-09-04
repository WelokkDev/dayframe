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
    const date = req.query.date; // For calendar view
    
    try {
        // Note: Auto-fail logic has been removed in favor of user accountability popups
        // The frontend will now handle missed deadlines with importance-based modals

        // 2. Build main query to return task instances with task and recurrence info
        let baseQuery = `
            SELECT 
                ti.id as instance_id,
                ti.scheduled_at,
                ti.completed_at,
                ti.cancelled_at,
                ti.failure_reason,
                ti.created_at as instance_created_at,
                t.id as task_id,
                t.title,
                t.category_id,
                t.importance,
                t.original_instruction,
                t.created_at as task_created_at,
                c.name as category_name,
                r.frequency,
                r.interval_value,
                r.occurrences_per_period,
                r.days_of_week,
                r.week_of_month,
                r.day_of_month,
                r.preferred_time,
                r.time_range_start,
                r.time_range_end,
                r.end_date,
                r.end_after_occurrences
            FROM task_instances ti
            JOIN tasks t ON ti.task_id = t.id
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN recurrence_rules r ON t.id = r.task_id
            WHERE t.user_id = $1
        `;
        const queryParams = [userId];

        if (categoryId) {
            baseQuery += ` AND t.category_id = $2`;
            queryParams.push(categoryId);
        }

        if (status === "completed") {
            baseQuery += ` AND ti.completed_at IS NOT NULL AND ti.cancelled_at = FALSE`;
        } else if (status === "incomplete") {
            baseQuery += ` AND ti.completed_at IS NULL AND ti.cancelled_at = FALSE`;
        } else if (status === "failed") {
            baseQuery += ` AND ti.cancelled_at = TRUE`;
        }

        if (dueToday) {
            baseQuery += ` AND DATE(ti.scheduled_at) = CURRENT_DATE`;
        }

        if (date) {
            baseQuery += ` AND DATE(ti.scheduled_at) = $${queryParams.length + 1}`;
            queryParams.push(date);
        }

        baseQuery += ` ORDER BY ti.scheduled_at ASC`;

        const result = await pool.query(baseQuery, queryParams);
        
        // Transform the data to match the expected format
        const taskInstances = result.rows.map(row => ({
            id: row.instance_id, // Use instance ID as primary ID
            task_id: row.task_id,
            user_id: userId,
            title: row.title,
            category_id: row.category_id,
            category_name: row.category_name,
            importance: row.importance,
            scheduled_at: row.scheduled_at,
            due_at: row.scheduled_at, // For compatibility with existing components
            due_date: row.scheduled_at ? new Date(row.scheduled_at).toISOString().split('T')[0] : null,
            completed_at: row.completed_at,
            cancelled: row.cancelled_at,
            failure_reason: row.failure_reason,
            original_instruction: row.original_instruction,
            created_at: row.task_created_at,
            instance_created_at: row.instance_created_at,
            // Recurrence info
            repeat_is_true: !!row.frequency,
            recurrence: row.frequency ? {
                frequency: row.frequency,
                interval_value: row.interval_value,
                occurrences_per_period: row.occurrences_per_period,
                days_of_week: row.days_of_week,
                week_of_month: row.week_of_month,
                day_of_month: row.day_of_month,
                preferred_time: row.preferred_time,
                time_range_start: row.time_range_start,
                time_range_end: row.time_range_end,
                end_date: row.end_date,
                end_after_occurrences: row.end_after_occurrences
            } : null
        }));

        res.json(taskInstances);

    } catch (err) {
        console.log("Error fetching task instances:", err.message);
        res.status(500).json({ error: "Failed to fetch task instances" });
    }
});



router.patch("/:id", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const instanceId = req.params.id;
    const { completed_at, cancelled, failure_reason } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // First verify the task instance belongs to the user and get task info
        const verifyResult = await client.query(
            `SELECT ti.*, t.id as task_id, r.frequency, r.interval_value, r.occurrences_per_period, 
                    r.days_of_week, r.week_of_month, r.day_of_month, r.preferred_time, 
                    r.time_range_start, r.time_range_end, r.end_date, r.end_after_occurrences
             FROM task_instances ti
             JOIN tasks t ON ti.task_id = t.id
             LEFT JOIN recurrence_rules r ON t.id = r.task_id
             WHERE ti.id = $1 AND t.user_id = $2`,
            [instanceId, userId]
        );

        if (verifyResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Task instance not found" });
        }

        const taskInstance = verifyResult.rows[0];

        // Update the task instance
        const result = await client.query(
            `UPDATE task_instances
            SET completed_at = $1,
                cancelled_at = $2,
                failure_reason = $3
            WHERE id = $4
            RETURNING *`,
            [completed_at, cancelled, failure_reason, instanceId]
        );

        // If this is a recurring task and it was completed, generate the next instance
        if (taskInstance.frequency && completed_at && !cancelled) {
            const recurrence = {
                frequency: taskInstance.frequency,
                interval_value: taskInstance.interval_value,
                occurrences_per_period: taskInstance.occurrences_per_period,
                days_of_week: taskInstance.days_of_week,
                week_of_month: taskInstance.week_of_month,
                day_of_month: taskInstance.day_of_month,
                preferred_time: taskInstance.preferred_time,
                time_range_start: taskInstance.time_range_start,
                time_range_end: taskInstance.time_range_end,
                end_date: taskInstance.end_date,
                end_after_occurrences: taskInstance.end_after_occurrences
            };

            // Import the function from aiService
            const { generateNextTaskInstance } = require('../services/aiService');
            const nextInstanceTime = await generateNextTaskInstance(taskInstance.task_id, recurrence, client);
            console.log(`Generated next instance for task ${taskInstance.task_id} at ${nextInstanceTime}`);
        }

        await client.query('COMMIT');
        res.json(result.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error updating task instance:", err.message);
        res.status(500).json({ error: "Failed to update task instance"});
    } finally {
        client.release();
    }
});

// Get recurrence rules for calendar display (doesn't create instances)
router.get("/recurrence-rules", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    
    try {
        const result = await pool.query(
            `SELECT 
                t.id as task_id,
                t.title,
                t.category_id,
                c.name as category_name,
                r.frequency,
                r.interval_value,
                r.occurrences_per_period,
                r.days_of_week,
                r.week_of_month,
                r.day_of_month,
                r.preferred_time,
                r.time_range_start,
                r.time_range_end,
                r.end_date,
                r.end_after_occurrences
            FROM tasks t
            LEFT JOIN categories c ON t.category_id = c.id
            LEFT JOIN recurrence_rules r ON t.id = r.task_id
            WHERE t.user_id = $1 AND r.id IS NOT NULL
            ORDER BY t.created_at DESC`,
            [userId]
        );

        res.json(result.rows);

    } catch (err) {
        console.log("Error fetching recurrence rules:", err.message);
        res.status(500).json({ error: "Failed to fetch recurrence rules" });
    }
});

module.exports = router;