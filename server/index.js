// server/index.js
const express = require('express');
const app = express();
const PORT = 3000;

const pool = require('./db'); // Import shared db connection
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working!");
});

// test db connection
app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0].now });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
