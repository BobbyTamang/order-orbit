import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form);
      navigate('/restaurants');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌟</div>
          <h1 style={{ fontWeight: 800, fontSize: '1.75rem' }}>Create Account</h1>
          <p style={{ color: '#666', marginTop: 8 }}>Join Order Orbit today</p>
        </div>

        <div style={{ background: '#1a1a2e', borderRadius: 20, padding: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1.25rem', color: '#ef4444', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {[
              { name: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text' },
              { name: 'email', label: 'Email', placeholder: 'your@email.com', type: 'email' },
              { name: 'password', label: 'Password', placeholder: '••••••••', type: 'password' },
              { name: 'phone', label: 'Phone (optional)', placeholder: '+44 7700 000000', type: 'tel' },
              { name: 'address', label: 'Default Address (optional)', placeholder: '123 Main St, London', type: 'text' },
            ].map(field => (
              <div key={field.name} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: 6 }}>{field.label}</label>
                <input type={field.type} name={field.name} value={form[field.name]} onChange={handleChange}
                  placeholder={field.placeholder} required={!['phone', 'address'].includes(field.name)} />
              </div>
            ))}
            <button className="btn-primary" type="submit" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: 8 }} disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account 🚀'}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#666', fontSize: '0.875rem' }}>
            Already have an account? <Link to="/login" style={{ color: '#FF4500', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
