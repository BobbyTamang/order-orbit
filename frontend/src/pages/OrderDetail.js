import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const STEPS = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
const STEP_LABELS = { pending: 'Order Placed', confirmed: 'Confirmed', preparing: 'Preparing', out_for_delivery: 'On The Way', delivered: 'Delivered' };
const STEP_ICONS = { pending: '📋', confirmed: '✅', preparing: '👨‍🍳', out_for_delivery: '🛵', delivered: '🎉' };

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`/api/orders/${id}`).then(res => setOrder(res.data)).catch(console.error);
  }, [id]);

  if (!order) return <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>Loading... 🚀</div>;

  const currentStep = STEPS.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Order #{order.id}</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>{order.restaurant_name} • {new Date(order.created_at).toLocaleString()}</p>

      {/* Tracking */}
      {!isCancelled && (
        <div style={{ background: '#1a1a2e', borderRadius: 16, padding: '1.75rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '1.75rem' }}>🗺️ Order Tracking</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 20, left: '10%', right: '10%', height: 3, background: '#22223a', zIndex: 0 }} />
            <div style={{
              position: 'absolute', top: 20, left: '10%', height: 3, zIndex: 1,
              width: `${Math.max(0, currentStep / (STEPS.length - 1)) * 80}%`,
              background: 'linear-gradient(to right, #FF4500, #FFB347)', transition: 'width 0.5s'
            }} />
            {STEPS.map((step, i) => (
              <div key={step} style={{ textAlign: 'center', position: 'relative', zIndex: 2, flex: 1 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', margin: '0 auto 8px',
                  background: i <= currentStep ? '#FF4500' : '#22223a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', border: i === currentStep ? '3px solid #FFB347' : '3px solid transparent',
                  transition: 'all 0.3s'
                }}>{STEP_ICONS[step]}</div>
                <div style={{ fontSize: '0.7rem', color: i <= currentStep ? '#FF4500' : '#555', fontWeight: 600 }}>
                  {STEP_LABELS[step]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isCancelled && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', color: '#ef4444', fontWeight: 600 }}>
          ❌ This order was cancelled
        </div>
      )}

      {/* Order Items */}
      <div style={{ background: '#1a1a2e', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>🍽️ Items Ordered</h3>
        {order.items?.map(item => (
          <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.875rem' }}>
            <span>{item.quantity}x {item.item_name}</span>
            <span style={{ color: '#FF4500', fontWeight: 600 }}>£{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
          <span>Total Paid</span>
          <span style={{ color: '#FF4500' }}>£{parseFloat(order.total_amount).toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Info */}
      <div style={{ background: '#1a1a2e', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>📍 Delivery Info</h3>
        <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: 8 }}><strong style={{ color: '#ccc' }}>Address:</strong> {order.delivery_address}</p>
        <p style={{ color: '#888', fontSize: '0.875rem', marginBottom: 8 }}><strong style={{ color: '#ccc' }}>Payment:</strong> {order.payment_method} ({order.payment_status})</p>
        {order.notes && <p style={{ color: '#888', fontSize: '0.875rem' }}><strong style={{ color: '#ccc' }}>Notes:</strong> {order.notes}</p>}
      </div>
    </div>
  );
}
