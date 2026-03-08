import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await loginUser(form);
      // data = { _id, username, email, usertype, token }
      login(data);
      navigate(data.usertype === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Jost:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        .auth-page{min-height:100vh;background:#fefcf7;display:grid;grid-template-columns:1fr 1fr;font-family:'Jost',sans-serif}
        @media(max-width:768px){.auth-page{grid-template-columns:1fr}.auth-left{display:none}}
        .auth-left{background:linear-gradient(145deg,#1a1208 0%,#3a2010 100%);display:flex;flex-direction:column;justify-content:space-between;padding:3rem;position:relative;overflow:hidden}
        .auth-left::before{content:'🛍️';position:absolute;font-size:20rem;right:-4rem;bottom:-4rem;opacity:0.05;line-height:1}
        .auth-left-brand{font-family:'Playfair Display',serif;font-weight:700;font-size:1.6rem;color:#f5ede0;text-decoration:none}
        .auth-left-brand span{color:#c17f3a}
        .auth-left-title{font-family:'Playfair Display',serif;font-size:2.2rem;color:#f5ede0;font-weight:700;line-height:1.2;letter-spacing:-0.03em;margin-bottom:1rem}
        .auth-left-sub{font-size:0.88rem;color:rgba(245,237,224,0.5);line-height:1.65;max-width:320px}
        .auth-perks{display:flex;flex-direction:column;gap:0.75rem}
        .auth-perk{display:flex;align-items:center;gap:10px;font-size:0.82rem;color:rgba(245,237,224,0.6)}
        .perk-dot{width:6px;height:6px;background:#c17f3a;border-radius:50%;flex-shrink:0}
        .auth-right{display:flex;align-items:center;justify-content:center;padding:3rem}
        .auth-form-wrap{width:100%;max-width:420px;animation:form-in 0.6s ease}
        @keyframes form-in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .auth-eyebrow{font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#c17f3a;margin-bottom:0.5rem;display:flex;align-items:center;gap:8px}
        .auth-eyebrow::before{content:'';width:20px;height:1.5px;background:#c17f3a}
        .auth-title{font-family:'Playfair Display',serif;font-weight:700;font-size:2rem;color:#1a1208;letter-spacing:-0.04em;margin-bottom:0.4rem}
        .auth-sub{font-size:0.82rem;color:#8a7a6a;margin-bottom:2rem}
        .field{margin-bottom:1.2rem}
        .field-label{display:block;font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#8a7a6a;margin-bottom:0.45rem}
        .field-input{width:100%;background:#fff;border:1.5px solid rgba(180,155,120,0.25);border-radius:8px;padding:12px 16px;font-family:'Jost',sans-serif;font-size:0.88rem;color:#1a1208;outline:none;transition:all 0.2s}
        .field-input::placeholder{color:#c0b0a0}
        .field-input:focus{border-color:#c17f3a;box-shadow:0 0 0 3px rgba(193,127,58,0.08)}
        .form-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}
        .forgot{font-size:0.78rem;color:#c17f3a;text-decoration:none}
        .error-box{background:rgba(224,90,106,0.06);border:1px solid rgba(224,90,106,0.2);border-radius:8px;padding:10px 14px;font-size:0.8rem;color:#c04a5a;margin-bottom:1.2rem}
        .submit-btn{width:100%;padding:13px;background:#1a1208;color:#f5ede0;border:2px solid #1a1208;border-radius:8px;font-family:'Jost',sans-serif;font-size:0.85rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all 0.25s;display:flex;align-items:center;justify-content:center;gap:8px}
        .submit-btn:hover:not(:disabled){background:transparent;color:#1a1208}
        .submit-btn:disabled{opacity:0.6;cursor:not-allowed}
        .spinner{width:16px;height:16px;border:2px solid rgba(245,237,224,0.3);border-top-color:#f5ede0;border-radius:50%;animation:spin 0.7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .auth-footer{text-align:center;font-size:0.8rem;color:#8a7a6a;margin-top:1.5rem}
        .auth-footer a{color:#c17f3a;text-decoration:none;font-weight:500}
      `}</style>

      <div className="auth-page">
        <div className="auth-left">
          <Link className="auth-left-brand" to="/">Shop<span>EZ</span></Link>
          <div>
            <div className="auth-left-title">Your favourite<br />shop awaits</div>
            <p className="auth-left-sub">Sign in to access your orders, cart, and exclusive member deals.</p>
          </div>
          <div className="auth-perks">
            {['50,000+ products across all categories','Free delivery on orders above ₹499','30-day hassle-free returns','Secure checkout with JWT authentication'].map((p, i) => (
              <div className="auth-perk" key={i}><span className="perk-dot"/>{p}</div>
            ))}
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-wrap">
            <div className="auth-eyebrow">Sign In</div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-sub">Enter your credentials to continue shopping</p>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label">Email Address</label>
                <input className="field-input" type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="field">
                <label className="field-label">Password</label>
                <input className="field-input" type="password" placeholder="Your password"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              </div>
              <div className="form-row">
                <span />
                <a href="#" className="forgot">Forgot password?</a>
              </div>
              <button className="submit-btn" type="submit" disabled={loading}>
                {loading && <div className="spinner"/>}
                {loading ? 'Signing in...' : 'Sign In →'}
              </button>
            </form>

            <div className="auth-footer">
              New to ShopEZ? <Link to="/register">Create an account</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
