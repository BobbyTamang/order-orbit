import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function RestaurantDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const { addToCart, removeFromCart, cart } = useCart();
  const { token } = useAuth();

  useEffect(() => {
    axios.get(`/api/restaurants/${id}`).then(res => setData(res.data)).catch(console.error);
  }, [id]);

  const submitReview = async () => {
    if (!token) return alert('Please login to leave a review');
    try {
      await axios.post('/api/reviews', { restaurant_id: id, rating: reviewRating, comment: reviewComment });
      setReviewComment('');
      const res = await axios.get(`/api/restaurants/${id}`);
      setData(res.data);
    } catch { alert('Error submitting review'); }
  };

  if (!data) return <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>Loading... 🚀</div>;

  const categories = ['All', ...new Set(data.menu?.map(i => i.category))];
  const filteredMenu = activeCategory === 'All' ? data.menu : data.menu?.filter(i => i.category === activeCategory);
  const getQty = (itemId) => cart.find(i => i.menu_item_id === itemId)?.quantity || 0;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: '2rem', height: 250 }}>
        <img src={data.image_url} alt={data.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 8 }}>{data.name}</h1>
          <div style={{ display: 'flex', gap: 16, fontSize: '0.875rem', color: '#ddd' }}>
            <span>⭐ {data.rating}</span>
            <span>🕒 {data.delivery_time}</span>
            <span className="badge badge-orange">{data.category}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        {/* Menu */}
        <div>
          <h2 style={{ fontWeight: 800, marginBottom: '1rem' }}>Menu</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                padding: '0.4rem 1rem', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: activeCategory === cat ? '#FF4500' : '#1a1a2e',
                color: activeCategory === cat ? 'white' : '#aaa',
                fontWeight: 600, fontSize: '0.8rem'
              }}>{cat}</button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredMenu?.map(item => (
              <div key={item.id} style={{
                background: '#1a1a2e', borderRadius: 14, padding: '1rem 1.25rem',
                border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ color: '#666', fontSize: '0.8rem', marginBottom: 8 }}>{item.description}</div>
                  <div style={{ color: '#FF4500', fontWeight: 700 }}>£{parseFloat(item.price).toFixed(2)}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {getQty(item.id) > 0 && (
                    <>
                      <button onClick={() => removeFromCart(item.id)} style={{
                        width: 32, height: 32, borderRadius: '50%', border: '1px solid #FF4500',
                        background: 'transparent', color: '#FF4500', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700
                      }}>−</button>
                      <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{getQty(item.id)}</span>
                    </>
                  )}
                  <button onClick={() => addToCart(item, parseInt(id))} style={{
                    width: 32, height: 32, borderRadius: '50%', background: '#FF4500',
                    border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700
                  }}>+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Reviews */}
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontWeight: 800, marginBottom: '1.5rem' }}>Reviews</h2>
            {token && (
              <div style={{ background: '#1a1a2e', borderRadius: 14, padding: '1.25rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: 8 }}>Your Rating</label>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setReviewRating(s)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem'
                      }}>{s <= reviewRating ? '⭐' : '☆'}</button>
                    ))}
                  </div>
                </div>
                <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                  placeholder="Write your review..." rows={3} style={{ marginBottom: 12, resize: 'none' }} />
                <button className="btn-primary" onClick={submitReview} style={{ padding: '0.6rem 1.5rem' }}>Submit Review</button>
              </div>
            )}
            {data.reviews?.map(rev => (
              <div key={rev.id} style={{ background: '#1a1a2e', borderRadius: 12, padding: '1rem', marginBottom: 10, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600 }}>{rev.user_name}</span>
                  <span style={{ color: '#FFB347' }}>{'⭐'.repeat(rev.rating)}</span>
                </div>
                <p style={{ color: '#888', fontSize: '0.875rem' }}>{rev.comment}</p>
              </div>
            ))}
            {!data.reviews?.length && <p style={{ color: '#666' }}>No reviews yet. Be the first!</p>}
          </div>
        </div>

        {/* Cart Sidebar */}
        <CartSidebar restaurantId={parseInt(id)} />
      </div>
    </div>
  );
}

function CartSidebar({ restaurantId }) {
  const { cart, total, clearCart, restaurantId: cartRestId } = useCart();
  const { token } = useAuth();
  const navigate = useNavigateWrapper();

  const isMyCart = cartRestId === restaurantId;
  const myItems = isMyCart ? cart : [];

  return (
    <div style={{ position: 'sticky', top: 80, height: 'fit-content' }}>
      <div style={{ background: '#1a1a2e', borderRadius: 16, padding: '1.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 style={{ fontWeight: 800, marginBottom: '1rem' }}>🛒 Your Cart</h3>
        {!myItems.length ? (
          <p style={{ color: '#666', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>Add items to start your order</p>
        ) : (
          <>
            {myItems.map(item => (
              <div key={item.menu_item_id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.875rem' }}>
                <span>{item.quantity}x {item.name}</span>
                <span style={{ color: '#FF4500', fontWeight: 600 }}>£{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12, marginTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total</span>
              <span style={{ color: '#FF4500' }}>£{total.toFixed(2)}</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginTop: 16 }}
              onClick={() => token ? navigate('/cart') : navigate('/login')}>
              {token ? 'Checkout' : 'Login to Order'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function useNavigateWrapper() {
  const { useNavigate } = require('react-router-dom');
  return useNavigate();
}
