import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['All', 'Burgers', 'Pizza', 'Japanese', 'Mexican', 'Indian'];

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const fetchRestaurants = async () => {
    try {
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (search) params.search = search;
      const res = await axios.get('/api/restaurants', { params });
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRestaurants(); }, [activeCategory, search]);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Restaurants</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Find your next favourite meal</p>

      {/* Search */}
      <input
        placeholder="Search restaurants..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: '1.5rem', maxWidth: 400 }}
      />

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '2rem' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
            style={{
              padding: '0.5rem 1.25rem', borderRadius: 999, border: 'none', cursor: 'pointer',
              background: activeCategory === cat ? '#FF4500' : '#1a1a2e',
              color: activeCategory === cat ? 'white' : '#aaa',
              fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s'
            }}>
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '4rem' }}>Loading restaurants... 🚀</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {restaurants.map(r => (
            <Link to={`/restaurants/${r.id}`} key={r.id}>
              <div className="card">
                <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                  <img src={r.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'}
                    alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(0,0,0,0.7)', borderRadius: 8, padding: '4px 10px',
                    fontSize: '0.8rem', fontWeight: 700, color: '#FFB347'
                  }}>⭐ {r.rating}</div>
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{r.name}</h3>
                    <span className="badge badge-orange">{r.category}</span>
                  </div>
                  <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: 12, lineHeight: 1.5 }}>{r.description}</p>
                  <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: '#888' }}>
                    <span>🕒 {r.delivery_time}</span>
                    <span>💳 Min £{r.min_order}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && !restaurants.length && (
        <div style={{ textAlign: 'center', color: '#666', padding: '4rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍽️</div>
          <p>No restaurants found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}
