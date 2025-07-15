const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware'); 

router.post('/', authenticateToken, async (req, res) => {
    console.log("Token user:", req.user);
    console.log("Request body:", req.body);
    
    const userId = req.user.userId;
    const { name } = req.body;
    
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
        console.error("Error creating category:", err.message);
        res.status(500).json({ error: 'Failed to create category' })
    }
});

router.get("/", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    
    try {
        const result = await pool.query(
            `SELECT id, name FROM categories WHERE user_id = $1 ORDER BY id DESC`,
            [ userId ] 
        );
        res.json(result.rows);

    } catch (err) {
        console.error("Error fetching categories:", err.message);
        res.status(500).json({ error: "Failed to fetch categories" });
    }
})

// Fetch single category by ID
router.get("/:id", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const id = req.params.id;
  console.log("WHAT THE", id)

  try {
    const result = await pool.query(
      `SELECT id, name FROM categories WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching category by id:", err.message);
    res.status(500).json({ error: "Failed to fetch category" });
  }
});



router.delete("/:id", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const id = req.params.id;

  try {
    const check = await pool.query(
      `SELECT id FROM categories WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

        if (check.rows.length === 0) {
      return res.status(404).json({ error: "Category not found or not authorized" });
    }

    const categoryId = check.rows[0].id;

    // Delete the category — tasks will be auto-deleted via ON DELETE CASCADE
    await pool.query(
      `DELETE FROM categories WHERE id = $1`,
      [categoryId]
    );
    res.json({ success: true, message: "Category and associated tasks deleted" });
  } catch (err) {
    console.error("Error deleting category:", err.message);
    res.status(500).json({ error: "Failed to delete category" });
  }
})

module.exports = router;