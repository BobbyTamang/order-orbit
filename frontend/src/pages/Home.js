import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Burgers', emoji: '🍔' }, { name: 'Pizza', emoji: '🍕' },
  { name: 'Japanese', emoji: '🍣' }, { name: 'Mexican', emoji: '🌮' },
  { name: 'Indian', emoji: '🍛' }, { name: 'Chinese', emoji: '🥡' },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0f0f1a 0%, #1a0a0a 50%, #0f0f1a 100%)',
        padding: '5rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(255,69,0,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: '1rem', color: '#FF4500', fontWeight: 600, letterSpacing: 3, marginBottom: '1rem', textTransform: 'uppercase' }}>
            🚀 Food Delivery Platform
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Orbit Around<br />
            <span style={{ color: '#FF4500' }}>Amazing Food</span>
          </h1>
          <p style={{ color: '#888', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Discover the best restaurants in your area and get your favourite meals delivered fast.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/restaurants">
              <button className="btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
                Order Now 🍽️
              </button>
            </Link>
            <Link to="/register">
              <button className="btn-outline" style={{ fontSize: '1rem', padding: '0.9rem 2rem' }}>
                Sign Up Free
              </button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '4rem', flexWrap: 'wrap' }}>
          {[['500+', 'Menu Items'], ['5', 'Restaurants'], ['30min', 'Avg Delivery'], ['4.5★', 'Rating']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FF4500', fontFamily: 'Syne' }}>{val}</div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '4rem 1.5rem', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Browse by Category</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>What are you craving today?</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
          {categories.map(cat => (
            <Link to={`/restaurants?category=${cat.name}`} key={cat.name}>
              <div style={{
                background: '#1a1a2e', borderRadius: 16, padding: '1.5rem', textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#FF4500'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{cat.emoji}</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '4rem 1.5rem', background: '#1a1a2e' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>How It Works</h2>
          <p style={{ color: '#666', marginBottom: '3rem' }}>Three simple steps to delicious food</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { step: '01', icon: '🔍', title: 'Browse Restaurants', desc: 'Explore our curated list of top restaurants near you' },
              { step: '02', icon: '🛒', title: 'Choose Your Food', desc: 'Pick your favourite dishes and add them to your cart' },
              { step: '03', icon: '🚀', title: 'Fast Delivery', desc: 'Sit back and track your order in real-time' },
            ].map(item => (
              <div key={item.step} style={{ padding: '2rem', background: '#0f0f1a', borderRadius: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{item.icon}</div>
                <div style={{ color: '#FF4500', fontWeight: 800, fontSize: '0.8rem', letterSpacing: 2, marginBottom: 8 }}>STEP {item.step}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
