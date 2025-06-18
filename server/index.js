// server/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const pool = require('./db'); // Import shared db connection
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

app.use(cors());
app.use(express.json());

app.use('/', authRoutes);
app.use('/', taskRoutes);

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



