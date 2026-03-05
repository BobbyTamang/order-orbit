const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authMiddleware } = require('../middleware/auth');

// Add review
router.post('/', authMiddleware, async (req, res) => {
  const { restaurant_id, order_id, rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be 1-5' });
  try {
    const result = await pool.query(
      'INSERT INTO reviews (user_id,restaurant_id,order_id,rating,comment) VALUES($1,$2,$3,$4,$5) RETURNING *',
      [req.user.id, restaurant_id, order_id || null, rating, comment || null]
    );
    // Update restaurant average rating
    await pool.query(
      'UPDATE restaurants SET rating=(SELECT ROUND(AVG(rating)::numeric,1) FROM reviews WHERE restaurant_id=$1) WHERE id=$1',
      [restaurant_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
