const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;

// Sign up
router.post('/signup', async (req, res) => {
    const { email, password, display_name } = req.body;
    try {
        
        // Check if user already exists
        const userCheck = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json({error: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash, display_name) VALUES ($1, $2, $3) RETURNING id, email, display_name',
            [email, hashedPassword, display_name]
        );

        res.status(201).json({ user: newUser.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Sign up failed' });
    }
})

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0]

        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, email: user.email, display_name: user.display_name }});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Login failed' })
    }
})

module.exports = router;