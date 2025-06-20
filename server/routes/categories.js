const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware'); 

router.post('/', authenticateToken, async (req, res) => {
    console.log("Token user:", req.user);
        console.log("Request body:", req.body);
    
    const userId = req.user.userId;
    const { name } = req.body
    
    if (!name) {
        return res.status(400).json({ error: 'Category title is required' });
    }

    try {
        

        const result = await pool.query(
            `INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING *`, 
            [ userId, name ]
        );
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.log("Error creating category:", err.message);
        res.status(500).json({ error: 'Failed to create category' })
    }
});

module.exports = router;