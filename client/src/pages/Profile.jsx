import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { login } = useAuth();
  const [form,    setForm]    = useState({ username:'', email:'', password:'' });
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getProfile();
        setForm({ username: data.username, email: data.email, password: '' });
      } catch { setError('Failed to load profile.'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError(''); setSuccess('');
    try {
      const payload = { username: form.username, email: form.email };
      if (form.password) payload.password = form.password;
      const { data } = await updateProfile(payload);
      login(data); // refresh token + user info
      setSuccess('Profile updated successfully!');
      setForm(f => ({ ...f, password: '' }));
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{minHeight:'100vh',background:'#fefcf7',display:'flex',alignItems:'center',justifyContent:'center',paddingTop:'68px',fontFamily:'Jost,sans-serif',color:'#b4a08a'}}>
      Loading profile...
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Jost:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        .profile-page{min-height:100vh;background:#fefcf7;padding-top:68px;font-family:'Jost',sans-serif}
        .profile-header{background:linear-gradient(135deg,#f5ede0,#fefcf7);padding:3rem 3rem 2.5rem;border-bottom:1px solid rgba(180,155,120,0.15)}
        .profile-header-inner{max-width:700px;margin:0 auto}
        .page-eyebrow{font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#c17f3a;margin-bottom:0.5rem;display:flex;align-items:center;gap:8px}
        .page-eyebrow::before{content:'';width:20px;height:1.5px;background:#c17f3a}
        .page-title{font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(1.6rem,3vw,2.4rem);color:#1a1208;letter-spacing:-0.03em}
        .profile-content{max-width:700px;margin:0 auto;padding:2.5rem 3rem}
        @media(max-width:768px){.profile-content{padding:1.5rem}.profile-header{padding:2rem 1.5rem}}
        .avatar-block{display:flex;align-items:center;gap:1.5rem;margin-bottom:2.5rem}
        .big-avatar{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#f5e6d0,#c17f3a);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:#fff;flex-shrink:0}
        .avatar-name{font-family:'Playfair Display',serif;font-weight:700;font-size:1.2rem;color:#1a1208}
        .avatar-email{font-size:0.82rem;color:#b4a08a;margin-top:2px}
        .profile-form{background:#fff;border:1px solid rgba(180,155,120,0.12);border-radius:20px;padding:2rem}
        .form-title{font-family:'Playfair Display',serif;font-weight:700;font-size:1.05rem;color:#1a1208;margin-bottom:1.5rem}
        .field{margin-bottom:1.2rem}
        .field-label{display:block;font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#8a7a6a;margin-bottom:0.45rem}
        .field-input{width:100%;background:#fefcf7;border:1.5px solid rgba(180,155,120,0.25);border-radius:8px;padding:12px 16px;font-family:'Jost',sans-serif;font-size:0.88rem;color:#1a1208;outline:none;transition:all 0.2s}
        .field-input:focus{border-color:#c17f3a;background:#fff;box-shadow:0 0 0 3px rgba(193,127,58,0.08)}
        .field-hint{font-size:0.72rem;color:#b4a08a;margin-top:4px}
        .success-box{background:rgba(90,158,111,0.08);border:1px solid rgba(90,158,111,0.2);border-radius:8px;padding:10px 14px;font-size:0.8rem;color:#3a8a5a;margin-bottom:1.2rem}
        .error-box{background:rgba(224,90,106,0.06);border:1px solid rgba(224,90,106,0.2);border-radius:8px;padding:10px 14px;font-size:0.8rem;color:#c04a5a;margin-bottom:1.2rem}
        .save-btn{padding:13px 32px;background:#1a1208;color:#f5ede0;border:2px solid #1a1208;border-radius:8px;font-family:'Jost',sans-serif;font-size:0.85rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all 0.25s}
        .save-btn:hover:not(:disabled){background:transparent;color:#1a1208}
        .save-btn:disabled{opacity:0.6;cursor:not-allowed}
      `}</style>

      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-header-inner">
            <div className="page-eyebrow">Account</div>
            <div className="page-title">My Profile</div>
          </div>
        </div>

        <div className="profile-content">
          <div className="avatar-block">
            <div className="big-avatar">{form.username?.[0]?.toUpperCase() || 'U'}</div>
            <div>
              <div className="avatar-name">{form.username}</div>
              <div className="avatar-email">{form.email}</div>
            </div>
          </div>

          <div className="profile-form">
            <div className="form-title">Update Profile</div>

            {success && <div className="success-box">✓ {success}</div>}
            {error   && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label">Username</label>
                <input className="field-input" value={form.username}
                  onChange={e => setForm({...form, username: e.target.value})} required />
              </div>
              <div className="field">
                <label className="field-label">Email Address</label>
                <input className="field-input" type="email" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
              <div className="field">
                <label className="field-label">New Password</label>
                <input className="field-input" type="password" placeholder="Leave blank to keep current"
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                <div className="field-hint">Min. 8 characters. Leave blank to keep your current password.</div>
              </div>
              <button className="save-btn" type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
