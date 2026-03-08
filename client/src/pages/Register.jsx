import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm]       = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { login } = useAuth();
  const navigate  = useNavigate();

  const strength = (() => {
    const p = form.password; if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const strengthColors = ['','#e05a6a','#f0b429','#5ab4c1','#5a9e6f'];
  const strengthLabels = ['','Weak','Fair','Good','Strong'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await registerUser({ username: form.username, email: form.email, password: form.password });
      // data = { _id, username, email, usertype, token }
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Jost:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        .auth-page{min-height:100vh;background:#fefcf7;display:grid;grid-template-columns:1fr 1fr;font-family:'Jost',sans-serif}
        @media(max-width:768px){.auth-page{grid-template-columns:1fr}.auth-left{display:none}}
        .auth-left{background:linear-gradient(145deg,#2a1a10 0%,#c17f3a 200%);display:flex;flex-direction:column;justify-content:center;padding:4rem 3rem;position:relative;overflow:hidden}
        .auth-left::before{content:'🌟';position:absolute;font-size:18rem;right:-3rem;bottom:-3rem;opacity:0.05}
        .auth-left-brand{font-family:'Playfair Display',serif;font-weight:700;font-size:1.6rem;color:#f5ede0;text-decoration:none;margin-bottom:3rem;display:block}
        .auth-left-brand span{color:#f0b429}
        .auth-left-title{font-family:'Playfair Display',serif;font-size:2rem;color:#f5ede0;font-weight:700;line-height:1.2;letter-spacing:-0.03em;margin-bottom:1rem}
        .auth-left-sub{font-size:0.88rem;color:rgba(245,237,224,0.55);line-height:1.65}
        .auth-right{display:flex;align-items:center;justify-content:center;padding:3rem}
        .auth-form-wrap{width:100%;max-width:420px;animation:form-in 0.5s ease}
        @keyframes form-in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .auth-eyebrow{font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#c17f3a;margin-bottom:0.5rem;display:flex;align-items:center;gap:8px}
        .auth-eyebrow::before{content:'';width:20px;height:1.5px;background:#c17f3a}
        .auth-title{font-family:'Playfair Display',serif;font-weight:700;font-size:2rem;color:#1a1208;letter-spacing:-0.04em;margin-bottom:0.4rem}
        .auth-sub{font-size:0.82rem;color:#8a7a6a;margin-bottom:2rem}
        .field{margin-bottom:1.1rem}
        .field-label{display:block;font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#8a7a6a;margin-bottom:0.45rem}
        .field-input{width:100%;background:#fff;border:1.5px solid rgba(180,155,120,0.25);border-radius:8px;padding:12px 16px;font-family:'Jost',sans-serif;font-size:0.88rem;color:#1a1208;outline:none;transition:all 0.2s}
        .field-input::placeholder{color:#c0b0a0}
        .field-input:focus{border-color:#c17f3a;box-shadow:0 0 0 3px rgba(193,127,58,0.08)}
        .field-input.err{border-color:#e05a6a}
        .strength-bar{display:flex;gap:3px;margin-top:5px}
        .strength-seg{height:3px;flex:1;border-radius:2px;background:rgba(180,155,120,0.15);transition:background 0.3s}
        .strength-lbl{font-size:0.68rem;margin-top:3px}
        .error-box{background:rgba(224,90,106,0.06);border:1px solid rgba(224,90,106,0.2);border-radius:8px;padding:10px 14px;font-size:0.8rem;color:#c04a5a;margin-bottom:1.2rem}
        .submit-btn{width:100%;padding:13px;background:#1a1208;color:#f5ede0;border:2px solid #1a1208;border-radius:8px;font-family:'Jost',sans-serif;font-size:0.85rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all 0.25s;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:1rem}
        .submit-btn:hover:not(:disabled){background:transparent;color:#1a1208}
        .submit-btn:disabled{opacity:0.6;cursor:not-allowed}
        .spinner{width:16px;height:16px;border:2px solid rgba(245,237,224,0.3);border-top-color:#f5ede0;border-radius:50%;animation:spin 0.7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .terms-note{font-size:0.7rem;color:#b4a08a;text-align:center;margin-top:0.85rem;line-height:1.55}
        .terms-note a{color:#c17f3a;text-decoration:none}
        .auth-footer{text-align:center;font-size:0.8rem;color:#8a7a6a;margin-top:1.5rem}
        .auth-footer a{color:#c17f3a;text-decoration:none;font-weight:500}
      `}</style>

      <div className="auth-page">
        <div className="auth-left">
          <Link className="auth-left-brand" to="/">Shop<span>EZ</span></Link>
          <div className="auth-left-title">Join 1.2 million<br />happy shoppers</div>
          <p className="auth-left-sub">Create your free account and start exploring thousands of products with exclusive member benefits.</p>
        </div>

        <div className="auth-right">
          <div className="auth-form-wrap">
            <div className="auth-eyebrow">Get Started</div>
            <h1 className="auth-title">Create account</h1>
            <p className="auth-sub">Free account · takes under a minute</p>

            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label">Username</label>
                <input className="field-input" placeholder="priya_sharma" value={form.username}
                  onChange={e => setForm({...form, username: e.target.value})} required />
              </div>
              <div className="field">
                <label className="field-label">Email Address</label>
                <input className="field-input" type="email" placeholder="you@example.com" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="field">
                <label className="field-label">Password</label>
                <input className="field-input" type="password" placeholder="Min. 8 characters" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})} required />
                {form.password && (
                  <>
                    <div className="strength-bar">
                      {[1,2,3,4].map(i => <div key={i} className="strength-seg" style={{background: i<=strength ? strengthColors[strength] : undefined}}/>)}
                    </div>
                    <div className="strength-lbl" style={{color: strengthColors[strength]}}>{strengthLabels[strength]} password</div>
                  </>
                )}
              </div>
              <div className="field">
                <label className="field-label">Confirm Password</label>
                <input className={`field-input ${form.confirm && form.confirm !== form.password ? 'err' : ''}`}
                  type="password" placeholder="Repeat password" value={form.confirm}
                  onChange={e => setForm({...form, confirm: e.target.value})} required />
              </div>

              <button className="submit-btn" type="submit" disabled={loading}>
                {loading && <div className="spinner"/>}
                {loading ? 'Creating account...' : 'Create My Account →'}
              </button>
              <p className="terms-note">By registering you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a></p>
            </form>

            <div className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></div>
          </div>
        </div>
      </div>
    </>
  );
}
