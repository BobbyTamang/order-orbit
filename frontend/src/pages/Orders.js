import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const STATUS_COLORS = {
  pending: '#FFB347', confirmed: '#60a5fa', preparing: '#a78bfa',
  out_for_delivery: '#34d399', delivered: '#22c55e', cancelled: '#ef4444'
};

const STATUS_ICONS = {
  pending: '⏳', confirmed: '✅', preparing: '👨‍🍳',
  out_for_delivery: '🛵', delivered: '🎉', cancelled: '❌'
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/orders/my').then(res => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>Loading orders... 🚀</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontWeight: 800, marginBottom: '2rem' }}>My Orders</h1>
      {!orders.length ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
          <p>No orders yet. Go order something delicious!</p>
          <Link to="/restaurants"><button className="btn-primary" style={{ marginTop: '1.5rem' }}>Browse Restaurants</button></Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {orders.map(order => (
            <Link to={`/orders/${order.id}`} key={order.id}>
              <div style={{
                background: '#1a1a2e', borderRadius: 16, padding: '1.25rem 1.5rem',
                border: '1px solid rgba(255,255,255,0.08)', display: 'flex',
                justifyContent: 'space-between', alignItems: 'center',
                transition: 'all 0.2s', cursor: 'pointer'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#FF4500'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <img src={order.restaurant_image} alt="" style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{order.restaurant_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#FF4500', fontWeight: 600, marginTop: 4 }}>
                      £{parseFloat(order.total_amount).toFixed(2)}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '0.35rem 0.9rem', borderRadius: 999,
                    background: `${STATUS_COLORS[order.status]}20`,
                    color: STATUS_COLORS[order.status], fontWeight: 600, fontSize: '0.8rem'
                  }}>
                    {STATUS_ICONS[order.status]} {order.status.replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
