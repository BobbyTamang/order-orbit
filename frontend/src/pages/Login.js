import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/restaurants');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🚀</div>
          <h1 style={{ fontWeight: 800, fontSize: '1.75rem' }}>Welcome Back</h1>
          <p style={{ color: '#666', marginTop: 8 }}>Sign in to your Order Orbit account</p>
        </div>

        <div style={{ background: '#1a1a2e', borderRadius: 20, padding: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#ef4444', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button className="btn-primary" type="submit" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.875rem' }}>
            Don't have an account? <Link to="/register" style={{ color: '#FF4500', fontWeight: 600 }}>Sign up</Link>
          </p>
          <p style={{ textAlign: 'center', marginTop: '0.75rem', color: '#444', fontSize: '0.75rem' }}>
            Admin demo: admin@orderorbit.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
