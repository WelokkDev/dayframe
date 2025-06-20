const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// Token generators
function generateAccessToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken(userId) {
    return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

// Sign up
router.post('/signup', async (req, res) => {
    const { email, password, display_name } = req.body;
    try {
        
        // Check if user already exists
        const userCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email] );
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

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true, // Use secure in production
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000  // 15 minutes
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Send user data
        res.json({user: { id: user.id, email: user.email, display_name: user.display_name }});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Login failed' })
    }
})

// Refresh
router.post('/refresh', async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired refresh token" });
        }

        // Create new access token
        const accessToken = jwt.sign(
            { userId: user.userId, role: "user" },
            JWT_SECRET,
            { expiresIn: "15m" }
        );

        // Set new access token cookie
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 
        });

        res.json({ message: "Token refreshed successfully" })

    });
})

router.post("/logout", (req, res) => {
    // Clear both cookies
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/refresh" });

    res.json({ message: "Logged out succesfully" })
})


router.get('/me', (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json({ error: "Not authenticated" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });

        const userId = decoded.userId;
        pool.query("SELECT id, email, display_name FROM users WHERE id = $1", [userId])
            .then(result => {
                if (result.rows.length === 0) {
                    return res.status(404).json({ error: "User not found" });
                }
                res.json({ user: result.rows[0] });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ error: "Internal server error" });
            });
    });
});


module.exports = router;