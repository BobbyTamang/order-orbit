const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Dashboard stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [users, orders, revenue, restaurants] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE role=\'customer\''),
      pool.query('SELECT COUNT(*) FROM orders'),
      pool.query('SELECT COALESCE(SUM(total_amount),0) as total FROM orders WHERE payment_status=\'paid\''),
      pool.query('SELECT COUNT(*) FROM restaurants WHERE is_active=true'),
    ]);
    const recentOrders = await pool.query(
      `SELECT o.id, o.total_amount, o.status, o.created_at, u.name as customer, r.name as restaurant
       FROM orders o JOIN users u ON o.user_id=u.id JOIN restaurants r ON o.restaurant_id=r.id
       ORDER BY o.created_at DESC LIMIT 5`
    );
    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalOrders: parseInt(orders.rows[0].count),
      totalRevenue: parseFloat(revenue.rows[0].total),
      activeRestaurants: parseInt(restaurants.rows[0].count),
      recentOrders: recentOrders.rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id,name,email,role,phone,created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add menu item
router.post('/menu', authMiddleware, adminMiddleware, async (req, res) => {
  const { restaurant_id, name, description, price, image_url, category } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO menu_items (restaurant_id,name,description,price,image_url,category) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [restaurant_id, name, description, price, image_url, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
