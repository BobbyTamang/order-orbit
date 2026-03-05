import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout, token } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      background: 'rgba(15,15,26,0.95)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky', top: 0, zIndex: 1000, padding: '0 1.5rem'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>🚀</span>
          <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: '1.25rem', color: '#FF4500' }}>Order Orbit</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/restaurants" style={{ color: '#aaa', fontWeight: 500, fontSize: '0.9rem' }}>Restaurants</Link>
          {token && (
            <Link to="/orders" style={{ color: '#aaa', fontWeight: 500, fontSize: '0.9rem' }}>My Orders</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" style={{ color: '#FFB347', fontWeight: 600, fontSize: '0.9rem' }}>Admin</Link>
          )}
          {token ? (
            <>
              <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: 20 }}>🛒</span>
                {itemCount > 0 && (
                  <span style={{
                    position: 'absolute', top: -8, right: -8,
                    background: '#FF4500', color: 'white', borderRadius: '50%',
                    width: 18, height: 18, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700
                  }}>{itemCount}</span>
                )}
              </Link>
              <button onClick={handleLogout} style={{
                background: 'rgba(255,69,0,0.1)', color: '#FF4500', border: '1px solid rgba(255,69,0,0.3)',
                padding: '0.4rem 1rem', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem'
              }}>Logout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login"><button className="btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Login</button></Link>
              <Link to="/register"><button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Sign Up</button></Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
