import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    axios.get('/api/admin/stats').then(res => setStats(res.data));
    axios.get('/api/orders').then(res => setOrders(res.data));
    axios.get('/api/admin/users').then(res => setUsers(res.data));
  }, []);

  const updateStatus = async (orderId, status) => {
    await axios.patch(`/api/orders/${orderId}/status`, { status });
    const res = await axios.get('/api/orders');
    setOrders(res.data);
  };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#60a5fa' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: '#FF4500' },
    { label: 'Revenue', value: `£${stats.totalRevenue.toFixed(2)}`, icon: '💰', color: '#22c55e' },
    { label: 'Restaurants', value: stats.activeRestaurants, icon: '🍽️', color: '#FFB347' },
  ] : [];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontWeight: 800, fontSize: '1.75rem' }}>Admin Dashboard</h1>
          <p style={{ color: '#666' }}>Manage your Order Orbit platform</p>
        </div>
        <span style={{ background: 'rgba(255,179,71,0.2)', color: '#FFB347', padding: '0.4rem 1rem', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem' }}>👑 Admin</span>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: '2rem' }}>
        {statCards.map(card => (
          <div key={card.label} style={{ background: '#1a1a2e', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: card.color, fontFamily: 'Syne' }}>{card.value}</div>
            <div style={{ color: '#666', fontSize: '0.85rem', marginTop: 4 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
        {['overview', 'orders', 'users'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.5rem 1.25rem', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: tab === t ? '#FF4500' : '#1a1a2e',
            color: tab === t ? 'white' : '#888', fontWeight: 600, fontSize: '0.875rem',
            textTransform: 'capitalize'
          }}>{t}</button>
        ))}
      </div>

      {/* Overview - Recent Orders */}
      {tab === 'overview' && (
        <div style={{ background: '#1a1a2e', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontWeight: 700 }}>Recent Orders</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#22223a' }}>
                  {['ID', 'Customer', 'Restaurant', 'Amount', 'Status'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem' }}>#{order.id}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem' }}>{order.customer}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem' }}>{order.restaurant}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#FF4500', fontWeight: 600 }}>£{parseFloat(order.total_amount).toFixed(2)}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ background: 'rgba(255,69,0,0.1)', color: '#FF4500', padding: '0.25rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 }}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Orders */}
      {tab === 'orders' && (
        <div style={{ background: '#1a1a2e', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#22223a' }}>
                  {['ID', 'Customer', 'Restaurant', 'Amount', 'Status', 'Update Status'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem' }}>#{order.id}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem' }}>{order.customer_name}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem' }}>{order.restaurant_name}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#FF4500', fontWeight: 600 }}>£{parseFloat(order.total_amount).toFixed(2)}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem' }}>{order.status}</td>
                    <td style={{ padding: '0.5rem 1rem' }}>
                      <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)}
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div style={{ background: '#1a1a2e', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#22223a' }}>
                  {['ID', 'Name', 'Email', 'Role', 'Phone', 'Joined'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem' }}>{user.id}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#888' }}>{user.email}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ background: user.role === 'admin' ? 'rgba(255,179,71,0.2)' : 'rgba(96,165,250,0.2)', color: user.role === 'admin' ? '#FFB347' : '#60a5fa', padding: '0.25rem 0.75rem', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#888' }}>{user.phone || '-'}</td>
                    <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#888' }}>{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
