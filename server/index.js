// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

const pool = require('./db'); // Import shared db connection
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', "PATCH"],
  allowedHeaders: ['Content-Type', 'X-CSRF-TOKEN']
}));
app.use(cookieParser());
app.use(express.json());

app.use('/', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/tasks', taskRoutes);
app.use('/ai', aiRoutes);





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



