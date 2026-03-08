import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const isActive = (p) => location.pathname === p;

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Jost:wght@300;400;500;600&display=swap');
        .ez-nav{position:fixed;top:0;left:0;right:0;z-index:1000;height:68px;display:flex;align-items:center;padding:0 2.5rem;transition:all 0.4s ease;background:${scrolled?'rgba(254,252,247,0.97)':'transparent'};backdrop-filter:${scrolled?'blur(20px)':'none'};border-bottom:1px solid ${scrolled?'rgba(180,155,120,0.2)':'transparent'}}
        .ez-nav-inner{width:100%;max-width:1400px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
        .ez-brand{text-decoration:none;display:flex;flex-direction:column;line-height:1}
        .ez-brand-main{font-family:'Playfair Display',serif;font-weight:700;font-size:1.5rem;color:#1a1208;letter-spacing:-0.02em}
        .ez-brand-main span{color:#c17f3a}
        .ez-brand-sub{font-family:'Jost',sans-serif;font-size:0.56rem;font-weight:500;letter-spacing:0.28em;text-transform:uppercase;color:#b4a08a;margin-top:1px}
        .ez-nav-center{display:flex;align-items:center;gap:0.25rem}
        .ez-nav-link{font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;padding:8px 16px;border-radius:4px;text-decoration:none;color:#5a4a3a;transition:all 0.2s;position:relative}
        .ez-nav-link::after{content:'';position:absolute;bottom:2px;left:16px;right:16px;height:1.5px;background:#c17f3a;transform:scaleX(0);transition:transform 0.25s ease}
        .ez-nav-link:hover{color:#1a1208}
        .ez-nav-link:hover::after,.ez-nav-link.active::after{transform:scaleX(1)}
        .ez-nav-link.active{color:#c17f3a}
        .ez-nav-actions{display:flex;align-items:center;gap:0.5rem}
        .icon-btn{width:38px;height:38px;border-radius:50%;border:none;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#5a4a3a;transition:all 0.2s;position:relative;text-decoration:none}
        .icon-btn:hover{background:rgba(193,127,58,0.1);color:#c17f3a}
        .icon-btn svg{width:20px;height:20px}
        .cart-badge{position:absolute;top:3px;right:3px;width:17px;height:17px;background:#c17f3a;border-radius:50%;font-family:'Jost',sans-serif;font-size:0.58rem;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center}
        .nav-divider{width:1px;height:18px;background:rgba(180,155,120,0.3);margin:0 0.25rem}
        .nav-cta{font-family:'Jost',sans-serif;font-size:0.76rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:9px 20px;background:#1a1208;color:#f5ede0;border-radius:4px;text-decoration:none;transition:all 0.25s;border:1.5px solid #1a1208;cursor:pointer}
        .nav-cta:hover{background:transparent;color:#1a1208}
        .user-menu{position:relative}
        .user-btn{display:flex;align-items:center;gap:8px;font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:500;color:#5a4a3a;background:transparent;border:none;cursor:pointer;padding:6px 10px;border-radius:6px;transition:all 0.2s}
        .user-btn:hover{background:rgba(193,127,58,0.08);color:#c17f3a}
        .user-avatar{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#f5e6d0,#c17f3a);display:flex;align-items:center;justify-content:center;font-size:0.78rem;font-weight:700;color:#fff}
        .user-dropdown{position:absolute;top:calc(100% + 8px);right:0;background:#fff;border:1px solid rgba(180,155,120,0.2);border-radius:12px;padding:0.5rem;min-width:180px;box-shadow:0 12px 40px rgba(90,60,20,0.12);animation:dd-in 0.2s ease}
        @keyframes dd-in{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
        .dd-item{display:block;padding:9px 14px;font-family:'Jost',sans-serif;font-size:0.8rem;color:#5a4a3a;text-decoration:none;border-radius:7px;transition:all 0.15s;cursor:pointer;background:transparent;border:none;width:100%;text-align:left}
        .dd-item:hover{background:rgba(193,127,58,0.08);color:#c17f3a}
        .dd-divider{height:1px;background:rgba(180,155,120,0.15);margin:0.35rem 0}
        .dd-logout{color:#e05a6a}
        .dd-logout:hover{background:rgba(224,90,106,0.07);color:#e05a6a}
        @media(max-width:768px){.ez-nav{padding:0 1.25rem}.ez-nav-center{display:none}}
      `}</style>

      <nav className="ez-nav">
        <div className="ez-nav-inner">
          <Link className="ez-brand" to="/">
            <span className="ez-brand-main">Shop<span>EZ</span></span>
            <span className="ez-brand-sub">Premium Marketplace</span>
          </Link>

          <div className="ez-nav-center">
            <Link className={`ez-nav-link ${isActive('/')?'active':''}`} to="/">Home</Link>
            <Link className={`ez-nav-link ${isActive('/products')?'active':''}`} to="/products">Shop</Link>
            {user && <Link className={`ez-nav-link ${isActive('/orders')?'active':''}`} to="/orders">My Orders</Link>}
            {isAdmin && <Link className={`ez-nav-link ${isActive('/admin')?'active':''}`} to="/admin">Admin</Link>}
          </div>

          <div className="ez-nav-actions">
            <Link className="icon-btn" to="/cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            <div className="nav-divider" />

            {user ? (
              <UserMenu user={user} isAdmin={isAdmin} onLogout={handleLogout} />
            ) : (
              <Link className="nav-cta" to="/login">Sign In</Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

function UserMenu({ user, isAdmin, onLogout }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const close = (e) => { if (!e.target.closest('.user-menu')) setOpen(false); };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <div className="user-menu">
      <button className="user-btn" onClick={() => setOpen(!open)}>
        <div className="user-avatar">{user.username?.[0]?.toUpperCase() || 'U'}</div>
        {user.username}
      </button>
      {open && (
        <div className="user-dropdown">
          <Link className="dd-item" to="/profile" onClick={() => setOpen(false)}>My Profile</Link>
          <Link className="dd-item" to="/orders"  onClick={() => setOpen(false)}>My Orders</Link>
          <Link className="dd-item" to="/cart"    onClick={() => setOpen(false)}>Cart</Link>
          {isAdmin && <><div className="dd-divider"/><Link className="dd-item" to="/admin" onClick={() => setOpen(false)}>Admin Panel</Link></>}
          <div className="dd-divider"/>
          <button className="dd-item dd-logout" onClick={() => { onLogout(); setOpen(false); }}>Sign Out</button>
        </div>
      )}
    </div>
  );
}
