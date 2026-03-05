const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM restaurants WHERE is_active=true';
    const params = [];
    if (category) { params.push(category); query += ` AND category=$${params.length}`; }
    if (search) { params.push(`%${search}%`); query += ` AND name ILIKE $${params.length}`; }
    query += ' ORDER BY rating DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single restaurant with menu
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await pool.query('SELECT * FROM restaurants WHERE id=$1', [req.params.id]);
    if (!restaurant.rows.length) return res.status(404).json({ message: 'Restaurant not found' });
    const menu = await pool.query('SELECT * FROM menu_items WHERE restaurant_id=$1 AND is_available=true ORDER BY category', [req.params.id]);
    const reviews = await pool.query(
      'SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id=u.id WHERE r.restaurant_id=$1 ORDER BY r.created_at DESC LIMIT 10',
      [req.params.id]
    );
    res.json({ ...restaurant.rows[0], menu: menu.rows, reviews: reviews.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: add restaurant
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, image_url, category, delivery_time, min_order } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO restaurants (name,description,image_url,category,delivery_time,min_order) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, description, image_url, category, delivery_time, min_order]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update restaurant
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, description, image_url, category, delivery_time, min_order, is_active } = req.body;
  try {
    const result = await pool.query(
      'UPDATE restaurants SET name=$1,description=$2,image_url=$3,category=$4,delivery_time=$5,min_order=$6,is_active=$7 WHERE id=$8 RETURNING *',
      [name, description, image_url, category, delivery_time, min_order, is_active, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
