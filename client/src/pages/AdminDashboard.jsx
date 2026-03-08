import React, { useEffect, useState } from 'react';
import {
  getDashboardStats, getAllUsers, deleteUser,
  getAllOrders, updateOrderStatus, deleteOrder,
  getAllProducts as fetchAllProducts, addProduct, updateProduct, deleteProduct,
  updateAdminData, getAdminData,
} from '../services/api';

const ORDER_STATUSES = ['order placed', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const [tab,      setTab]      = useState('overview');
  const [stats,    setStats]    = useState(null);
  const [users,    setUsers]    = useState([]);
  const [orders,   setOrders]   = useState([]);
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct,  setEditingProduct]  = useState(null);
  const [productForm,     setProductForm]     = useState({ title:'', description:'', mainImg:'', category:'', gender:'', price:'', discount:'0', sizes:'' });
  const [saving, setSaving] = useState(false);

  // Banner state
  const [banner, setBanner] = useState('');
  const [bannerSaving, setBannerSaving] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, ordersRes, productsRes, adminRes] = await Promise.allSettled([
        getDashboardStats(), getAllUsers(), getAllOrders(), fetchAllProducts(), getAdminData(),
      ]);
      if (statsRes.status    === 'fulfilled') setStats(statsRes.value.data);
      if (usersRes.status    === 'fulfilled') setUsers(usersRes.value.data);
      if (ordersRes.status   === 'fulfilled') setOrders(ordersRes.value.data.reverse());
      if (productsRes.status === 'fulfilled') setProducts(productsRes.value.data);
      if (adminRes.status    === 'fulfilled') setBanner(adminRes.value.data?.banner || '');
    } catch {}
    finally { setLoading(false); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await deleteUser(id);
    setUsers(users.filter(u => u._id !== id));
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    await deleteOrder(id);
    setOrders(orders.filter(o => o._id !== id));
  };

  const handleOrderStatus = async (id, status) => {
    const { data } = await updateOrderStatus(id, { orderStatus: status });
    setOrders(orders.map(o => o._id === id ? data : o));
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    setProducts(products.filter(p => p._id !== id));
  };

  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...productForm,
        price:    Number(productForm.price),
        discount: Number(productForm.discount),
        sizes:    productForm.sizes.split(',').map(s => s.trim()).filter(Boolean),
      };
      if (editingProduct) {
        const { data } = await updateProduct(editingProduct._id, payload);
        setProducts(products.map(p => p._id === editingProduct._id ? data : p));
      } else {
        const { data } = await addProduct(payload);
        setProducts([data, ...products]);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ title:'', description:'', mainImg:'', category:'', gender:'', price:'', discount:'0', sizes:'' });
    } catch {}
    finally { setSaving(false); }
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({ title: product.title, description: product.description||'', mainImg: product.mainImg||'', category: product.category||'', gender: product.gender||'', price: product.price, discount: product.discount||0, sizes: (product.sizes||[]).join(', ') });
    setShowProductForm(true);
  };

  const handleSaveBanner = async () => {
    setBannerSaving(true);
    await updateAdminData({ banner });
    setBannerSaving(false);
  };

  const STAT_CARDS = [
    { label:'Total Users',    value: stats?.totalUsers    || 0, icon:'👥', color:'#dbeafe' },
    { label:'Total Products', value: stats?.totalProducts || 0, icon:'🏷️', color:'#fef3c7' },
    { label:'Total Orders',   value: stats?.totalOrders   || 0, icon:'📦', color:'#dcfce7' },
    { label:'Pending Orders', value: stats?.pendingOrders || 0, icon:'⏳', color:'#fce7f3' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Jost:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        .admin-page{min-height:100vh;background:#fefcf7;padding-top:68px;font-family:'Jost',sans-serif}
        .admin-header{background:linear-gradient(120deg,#1a1208 60%,#3a2a18 100%);padding:2.5rem 3rem}
        .admin-header-inner{max-width:1400px;margin:0 auto;display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;flex-wrap:wrap}
        .admin-eyebrow{font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#c17f3a;margin-bottom:0.4rem}
        .admin-title{font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(1.5rem,2.5vw,2.2rem);color:#f5ede0;letter-spacing:-0.03em}
        .admin-sub{font-size:0.8rem;color:rgba(245,237,224,0.5);margin-top:3px}
        .admin-tabs{display:flex;gap:0;padding:0 3rem;background:#1a1208;border-bottom:1px solid rgba(255,255,255,0.06);overflow-x:auto}
        .admin-tab{padding:0.85rem 1.5rem;border:none;background:none;font-family:'Jost',sans-serif;font-size:0.78rem;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;color:rgba(245,237,224,0.45);cursor:pointer;position:relative;transition:color 0.2s;white-space:nowrap;flex-shrink:0}
        .admin-tab.active{color:#c17f3a}
        .admin-tab.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:#c17f3a}
        .admin-content{max-width:1400px;margin:0 auto;padding:2.5rem 3rem}
        @media(max-width:768px){.admin-content{padding:1.5rem}.admin-header{padding:2rem 1.5rem}.admin-tabs{padding:0 1.5rem}}
        .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2.5rem}
        .stat-card{background:#fff;border:1px solid rgba(180,155,120,0.12);border-radius:16px;padding:1.5rem;display:flex;align-items:center;gap:1rem;transition:all 0.2s;animation:stat-in 0.5s ease both}
        @keyframes stat-in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .stat-card:hover{box-shadow:0 8px 30px rgba(90,60,20,0.08);border-color:rgba(193,127,58,0.2)}
        .stat-icon-box{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0}
        .stat-lbl{font-size:0.68rem;text-transform:uppercase;letter-spacing:0.1em;color:#b4a08a;margin-bottom:0.3rem}
        .stat-val{font-family:'Playfair Display',serif;font-weight:700;font-size:1.6rem;color:#1a1208;letter-spacing:-0.03em;line-height:1}
        .section-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;gap:1rem;flex-wrap:wrap}
        .section-title{font-family:'Playfair Display',serif;font-weight:700;font-size:1.1rem;color:#1a1208}
        .add-btn{background:#c17f3a;color:#fff;border:none;padding:10px 20px;border-radius:7px;font-family:'Jost',sans-serif;font-size:0.76rem;font-weight:600;cursor:pointer;transition:all 0.2s;letter-spacing:0.06em;text-transform:uppercase}
        .add-btn:hover{background:#a86c30}
        .data-table{width:100%;border-collapse:separate;border-spacing:0 6px}
        .data-table thead th{font-size:0.66rem;text-transform:uppercase;letter-spacing:0.1em;color:#b4a08a;font-weight:400;padding:0 1rem 0.5rem;text-align:left;border-bottom:1px solid rgba(180,155,120,0.12)}
        .data-row{background:#fff;border-radius:10px;transition:all 0.2s;animation:row-in 0.4s ease both}
        @keyframes row-in{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        .data-row:hover{box-shadow:0 4px 16px rgba(90,60,20,0.07)}
        .data-row td{padding:1rem;vertical-align:middle;font-size:0.83rem;color:#5a4a3a}
        .data-row td:first-child{border-radius:10px 0 0 10px}
        .data-row td:last-child{border-radius:0 10px 10px 0;text-align:right}
        .user-avatar-cell{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#f5e6d0,#c17f3a);display:flex;align-items:center;justify-content:center;font-size:0.78rem;font-weight:700;color:#fff}
        .user-name-cell{font-weight:500;color:#1a1208}
        .role-badge{font-size:0.68rem;font-weight:600;padding:3px 10px;border-radius:20px;letter-spacing:0.04em}
        .role-admin{background:rgba(193,127,58,0.12);color:#c17f3a}
        .role-user{background:rgba(180,155,120,0.12);color:#8a7a6a}
        .action-btn{padding:5px 12px;border-radius:6px;border:1.5px solid rgba(180,155,120,0.2);background:transparent;font-family:'Jost',sans-serif;font-size:0.7rem;font-weight:600;color:#8a7a6a;cursor:pointer;transition:all 0.2s;margin-left:4px}
        .action-btn:hover{border-color:#c17f3a;color:#c17f3a}
        .action-btn.danger:hover{border-color:#e05a6a;color:#e05a6a}
        .product-row-img{width:40px;height:40px;border-radius:8px;background:linear-gradient(135deg,#f5e6d0,#e8d5b8);display:flex;align-items:center;justify-content:center;font-size:1.2rem;overflow:hidden}
        .product-row-img img{width:100%;height:100%;object-fit:cover}
        .prod-title-cell{font-weight:500;color:#1a1208;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .status-select{border:1px solid rgba(180,155,120,0.2);border-radius:6px;padding:4px 8px;font-family:'Jost',sans-serif;font-size:0.75rem;color:#5a4a3a;background:#fff;outline:none;cursor:pointer}
        .status-select:focus{border-color:#c17f3a}
        .order-id-cell{font-size:0.75rem;color:#b4a08a}
        .modal-overlay{position:fixed;inset:0;background:rgba(26,18,8,0.5);z-index:1000;display:flex;align-items:center;justify-content:center;padding:1rem}
        .modal-box{background:#fff;border-radius:20px;padding:2rem;width:100%;max-width:600px;max-height:90vh;overflow-y:auto;animation:modal-in 0.25s ease}
        @keyframes modal-in{from{opacity:0;transform:scale(0.96)}to{opacity:1;transform:scale(1)}}
        .modal-title{font-family:'Playfair Display',serif;font-weight:700;font-size:1.3rem;color:#1a1208;margin-bottom:1.5rem}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .form-grid .full{grid-column:1/-1}
        .field-label{display:block;font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#8a7a6a;margin-bottom:0.45rem}
        .field-input{width:100%;background:#fefcf7;border:1.5px solid rgba(180,155,120,0.25);border-radius:8px;padding:11px 14px;font-family:'Jost',sans-serif;font-size:0.85rem;color:#1a1208;outline:none;transition:all 0.2s}
        .field-input:focus{border-color:#c17f3a;background:#fff}
        .modal-actions{display:flex;gap:0.75rem;margin-top:1.5rem;justify-content:flex-end}
        .modal-btn{padding:10px 24px;border-radius:7px;font-family:'Jost',sans-serif;font-size:0.8rem;font-weight:600;cursor:pointer;transition:all 0.2s;letter-spacing:0.06em;text-transform:uppercase}
        .modal-btn.primary{background:#1a1208;color:#f5ede0;border:2px solid #1a1208}
        .modal-btn.primary:hover{background:transparent;color:#1a1208}
        .modal-btn.secondary{background:transparent;color:#8a7a6a;border:1.5px solid rgba(180,155,120,0.25)}
        .modal-btn.secondary:hover{border-color:#c17f3a;color:#c17f3a}
        .banner-row{display:flex;gap:0.75rem;align-items:flex-end;margin-top:1rem}
        .loading-text{text-align:center;padding:4rem;color:#b4a08a}
      `}</style>

      <div className="admin-page">
        <div className="admin-header">
          <div className="admin-header-inner">
            <div>
              <div className="admin-eyebrow">Admin Panel</div>
              <div className="admin-title">ShopEZ Dashboard</div>
              <div className="admin-sub">Manage your products, orders, and users</div>
            </div>
          </div>
        </div>

        <div className="admin-tabs">
          {['overview','products','orders','users','settings'].map(t => (
            <button key={t} className={`admin-tab ${tab===t?'active':''}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="admin-content">
          {loading && <div className="loading-text">Loading dashboard...</div>}

          {/* OVERVIEW */}
          {!loading && tab === 'overview' && (
            <>
              <div className="stats-grid">
                {STAT_CARDS.map((s, i) => (
                  <div className="stat-card" key={i} style={{animationDelay:`${i*0.07}s`}}>
                    <div className="stat-icon-box" style={{background:s.color}}>{s.icon}</div>
                    <div>
                      <div className="stat-lbl">{s.label}</div>
                      <div className="stat-val">{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="section-hdr"><div className="section-title">Recent Orders</div></div>
              <table className="data-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {orders.slice(0,5).map((o,i)=>(
                    <tr className="data-row" key={o._id} style={{animationDelay:`${i*0.06}s`}}>
                      <td><span className="order-id-cell">#{o._id.slice(-8).toUpperCase()}</span></td>
                      <td>{o.name || o.email}</td>
                      <td style={{maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.title}</td>
                      <td>₹{o.price?.toLocaleString()}</td>
                      <td><select className="status-select" value={o.orderStatus} onChange={e=>handleOrderStatus(o._id,e.target.value)}>
                        {ORDER_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                      </select></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* PRODUCTS */}
          {!loading && tab === 'products' && (
            <>
              <div className="section-hdr">
                <div className="section-title">Products ({products.length})</div>
                <button className="add-btn" onClick={() => { setEditingProduct(null); setShowProductForm(true); }}>+ Add Product</button>
              </div>
              <table className="data-table">
                <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Discount</th><th>Sizes</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map((p,i)=>(
                    <tr className="data-row" key={p._id} style={{animationDelay:`${i*0.05}s`}}>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:10}}>
                          <div className="product-row-img">{p.mainImg ? <img src={p.mainImg} alt="" /> : '🛍️'}</div>
                          <span className="prod-title-cell">{p.title}</span>
                        </div>
                      </td>
                      <td>{p.category || '—'}</td>
                      <td>₹{p.price?.toLocaleString()}</td>
                      <td>{p.discount ? `${p.discount}%` : '—'}</td>
                      <td>{p.sizes?.length ? p.sizes.slice(0,3).join(', ') : '—'}</td>
                      <td>
                        <button className="action-btn" onClick={() => openEditProduct(p)}>Edit</button>
                        <button className="action-btn danger" onClick={() => handleDeleteProduct(p._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* ORDERS */}
          {!loading && tab === 'orders' && (
            <>
              <div className="section-hdr"><div className="section-title">All Orders ({orders.length})</div></div>
              <table className="data-table">
                <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Qty</th><th>Amount</th><th>Date</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  {orders.map((o,i)=>(
                    <tr className="data-row" key={o._id} style={{animationDelay:`${i*0.04}s`}}>
                      <td><span className="order-id-cell">#{o._id.slice(-8).toUpperCase()}</span></td>
                      <td>{o.name || o.email || '—'}</td>
                      <td style={{maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{o.title}</td>
                      <td>{o.quantity}</td>
                      <td>₹{o.price?.toLocaleString()}</td>
                      <td>{o.orderDate}</td>
                      <td><select className="status-select" value={o.orderStatus} onChange={e=>handleOrderStatus(o._id,e.target.value)}>
                        {ORDER_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                      </select></td>
                      <td><button className="action-btn danger" onClick={()=>handleDeleteOrder(o._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* USERS */}
          {!loading && tab === 'users' && (
            <>
              <div className="section-hdr"><div className="section-title">All Users ({users.length})</div></div>
              <table className="data-table">
                <thead><tr><th></th><th>Username</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                <tbody>
                  {users.map((u,i)=>(
                    <tr className="data-row" key={u._id} style={{animationDelay:`${i*0.05}s`}}>
                      <td><div className="user-avatar-cell">{u.username?.[0]?.toUpperCase()}</div></td>
                      <td><span className="user-name-cell">{u.username}</span></td>
                      <td>{u.email}</td>
                      <td><span className={`role-badge ${u.usertype==='admin'?'role-admin':'role-user'}`}>{u.usertype}</span></td>
                      <td>
                        {u.usertype !== 'admin' &&
                          <button className="action-btn danger" onClick={() => handleDeleteUser(u._id)}>Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* SETTINGS */}
          {!loading && tab === 'settings' && (
            <>
              <div className="section-hdr"><div className="section-title">Site Settings</div></div>
              <div style={{background:'#fff',border:'1px solid rgba(180,155,120,0.12)',borderRadius:16,padding:'2rem',maxWidth:600}}>
                <div className="field-label">Banner Image URL</div>
                <div className="banner-row">
                  <input className="field-input" value={banner} onChange={e => setBanner(e.target.value)} placeholder="https://..." style={{flex:1}} />
                  <button className="modal-btn primary" onClick={handleSaveBanner} disabled={bannerSaving}>
                    {bannerSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
                {banner && <img src={banner} alt="Banner preview" style={{marginTop:'1rem',width:'100%',borderRadius:10,maxHeight:160,objectFit:'cover'}} onError={e => e.target.style.display='none'} />}
              </div>
            </>
          )}
        </div>
      </div>

      {/* PRODUCT MODAL */}
      {showProductForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowProductForm(false)}>
          <div className="modal-box">
            <div className="modal-title">{editingProduct ? 'Edit Product' : 'Add New Product'}</div>
            <form onSubmit={handleProductFormSubmit}>
              <div className="form-grid">
                <div className="full">
                  <label className="field-label">Title *</label>
                  <input className="field-input" value={productForm.title} onChange={e=>setProductForm({...productForm,title:e.target.value})} required />
                </div>
                <div className="full">
                  <label className="field-label">Description</label>
                  <input className="field-input" value={productForm.description} onChange={e=>setProductForm({...productForm,description:e.target.value})} />
                </div>
                <div className="full">
                  <label className="field-label">Main Image URL</label>
                  <input className="field-input" value={productForm.mainImg} onChange={e=>setProductForm({...productForm,mainImg:e.target.value})} placeholder="https://..." />
                </div>
                <div>
                  <label className="field-label">Category</label>
                  <input className="field-input" value={productForm.category} onChange={e=>setProductForm({...productForm,category:e.target.value})} placeholder="Men, Women, Electronics..." />
                </div>
                <div>
                  <label className="field-label">Gender</label>
                  <input className="field-input" value={productForm.gender} onChange={e=>setProductForm({...productForm,gender:e.target.value})} placeholder="male, female, unisex" />
                </div>
                <div>
                  <label className="field-label">Price (₹) *</label>
                  <input className="field-input" type="number" value={productForm.price} onChange={e=>setProductForm({...productForm,price:e.target.value})} required />
                </div>
                <div>
                  <label className="field-label">Discount (%)</label>
                  <input className="field-input" type="number" min="0" max="100" value={productForm.discount} onChange={e=>setProductForm({...productForm,discount:e.target.value})} />
                </div>
                <div className="full">
                  <label className="field-label">Sizes (comma-separated)</label>
                  <input className="field-input" value={productForm.sizes} onChange={e=>setProductForm({...productForm,sizes:e.target.value})} placeholder="S, M, L, XL" />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-btn secondary" onClick={() => setShowProductForm(false)}>Cancel</button>
                <button type="submit" className="modal-btn primary" disabled={saving}>{saving ? 'Saving...' : editingProduct ? 'Update' : 'Add Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
