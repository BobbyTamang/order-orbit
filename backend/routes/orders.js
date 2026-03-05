const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Place order
router.post('/', authMiddleware, async (req, res) => {
  const { restaurant_id, items, delivery_address, payment_method, notes } = req.body;
  if (!items || !items.length) return res.status(400).json({ message: 'No items in order' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await client.query(
      'INSERT INTO orders (user_id,restaurant_id,total_amount,delivery_address,payment_method,notes) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
      [req.user.id, restaurant_id, total.toFixed(2), delivery_address, payment_method || 'card', notes || null]
    );
    const orderId = order.rows[0].id;
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id,menu_item_id,quantity,price,item_name) VALUES($1,$2,$3,$4,$5)',
        [orderId, item.menu_item_id, item.quantity, item.price, item.name]
      );
    }
    await client.query('COMMIT');
    res.status(201).json({ ...order.rows[0], items });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
});

// Get user orders
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await pool.query(
      `SELECT o.*, r.name as restaurant_name, r.image_url as restaurant_image
       FROM orders o JOIN restaurants r ON o.restaurant_id=r.id
       WHERE o.user_id=$1 ORDER BY o.created_at DESC`,
      [req.user.id]
    );
    res.json(orders.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get order detail
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await pool.query(
      `SELECT o.*, r.name as restaurant_name FROM orders o JOIN restaurants r ON o.restaurant_id=r.id WHERE o.id=$1`,
      [req.params.id]
    );
    if (!order.rows.length) return res.status(404).json({ message: 'Order not found' });
    if (order.rows[0].user_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Forbidden' });
    const items = await pool.query('SELECT * FROM order_items WHERE order_id=$1', [req.params.id]);
    res.json({ ...order.rows[0], items: items.rows });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: get all orders
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, u.name as customer_name, r.name as restaurant_name
       FROM orders o JOIN users u ON o.user_id=u.id JOIN restaurants r ON o.restaurant_id=r.id
       ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: update order status
router.patch('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });
  try {
    const result = await pool.query(
      'UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
