import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { cart, restaurantId, total, clearCart, addToCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    if (!address) return alert('Please enter a delivery address');
    if (!cart.length) return alert('Cart is empty');
    setLoading(true);
    try {
      const res = await axios.post('/api/orders', {
        restaurant_id: restaurantId,
        items: cart,
        delivery_address: address,
        payment_method: paymentMethod,
        notes
      });
      clearCart();
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) return (
    <div style={{ maxWidth: 600, margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
      <h2 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Your cart is empty</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Add some delicious food first!</p>
      <button className="btn-primary" onClick={() => navigate('/restaurants')}>Browse Restaurants</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontWeight: 800, marginBottom: '2rem' }}>Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem' }}>
        {/* Left - Delivery details */}
        <div>
          <div style={{ background: '#1a1a2e', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>📍 Delivery Details</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: 6 }}>Delivery Address *</label>
              <textarea value={address} onChange={e => setAddress(e.target.value)}
                placeholder="Enter your full delivery address..." rows={3} style={{ resize: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: 6 }}>Special Instructions</label>
              <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="E.g. Ring the bell, leave at door..." />
            </div>
          </div>

          <div style={{ background: '#1a1a2e', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>💳 Payment Method</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              {['card', 'cash', 'wallet'].map(method => (
                <button key={method} onClick={() => setPaymentMethod(method)} style={{
                  flex: 1, padding: '0.75rem', borderRadius: 10, cursor: 'pointer',
                  border: paymentMethod === method ? '2px solid #FF4500' : '1px solid rgba(255,255,255,0.08)',
                  background: paymentMethod === method ? 'rgba(255,69,0,0.1)' : '#22223a',
                  color: paymentMethod === method ? '#FF4500' : '#aaa',
                  fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s'
                }}>
                  {method === 'card' ? '💳 Card' : method === 'cash' ? '💵 Cash' : '👛 Wallet'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Order Summary */}
        <div>
          <div style={{ background: '#1a1a2e', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 80 }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h3>
            {cart.map(item => (
              <div key={item.menu_item_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>£{item.price.toFixed(2)} each</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => removeFromCart(item.menu_item_id)} style={{ background: '#22223a', border: 'none', color: '#FF4500', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', fontWeight: 700 }}>−</button>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.quantity}</span>
                  <button onClick={() => addToCart({ id: item.menu_item_id, name: item.name, price: item.price }, restaurantId)} style={{ background: '#FF4500', border: 'none', color: 'white', width: 24, height: 24, borderRadius: '50%', cursor: 'pointer', fontWeight: 700 }}>+</button>
                </div>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, marginTop: 4 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem', color: '#888' }}>
                <span>Subtotal</span><span>£{total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem', color: '#888' }}>
                <span>Delivery Fee</span><span style={{ color: '#22c55e' }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginTop: 8 }}>
                <span>Total</span><span style={{ color: '#FF4500' }}>£{total.toFixed(2)}</span>
              </div>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: 20, fontSize: '1rem', padding: '0.9rem' }}
              onClick={placeOrder} disabled={loading}>
              {loading ? 'Placing Order...' : '🚀 Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
