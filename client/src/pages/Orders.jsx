import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/api';

const STATUS_STYLE = {
  'order placed': { color:'#6a5ac1', bg:'rgba(106,90,193,0.1)',  label:'Order Placed' },
  'processing':   { color:'#c17f3a', bg:'rgba(193,127,58,0.1)',  label:'Processing'   },
  'shipped':      { color:'#5ab4c1', bg:'rgba(90,180,193,0.1)',  label:'Shipped'      },
  'delivered':    { color:'#5a9e6f', bg:'rgba(90,158,111,0.1)',  label:'Delivered'    },
  'cancelled':    { color:'#e05a6a', bg:'rgba(224,90,106,0.1)',  label:'Cancelled'    },
};

const STATUS_TABS = ['All', 'order placed', 'shipped', 'delivered', 'cancelled'];

export default function Orders() {
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getMyOrders();
        // Newest first
        setOrders(data.reverse());
      } catch {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filtered = activeTab === 'All' ? orders : orders.filter(o => o.orderStatus === activeTab);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Jost:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        .orders-page{min-height:100vh;background:#fefcf7;padding-top:68px;font-family:'Jost',sans-serif}
        .orders-header{background:linear-gradient(135deg,#f5ede0,#fefcf7);padding:3rem 3rem 0;border-bottom:1px solid rgba(180,155,120,0.15)}
        .orders-header-inner{max-width:1000px;margin:0 auto}
        .page-eyebrow{font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#c17f3a;margin-bottom:0.5rem;display:flex;align-items:center;gap:8px}
        .page-eyebrow::before{content:'';width:20px;height:1.5px;background:#c17f3a}
        .page-title{font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(1.6rem,3vw,2.4rem);color:#1a1208;letter-spacing:-0.03em}
        .orders-tabs{display:flex;gap:0;margin-top:1.5rem;overflow-x:auto}
        .order-tab{padding:0.75rem 1.5rem;border:none;background:none;font-family:'Jost',sans-serif;font-size:0.78rem;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;color:#b4a08a;cursor:pointer;position:relative;transition:color 0.2s;white-space:nowrap;flex-shrink:0}
        .order-tab.active{color:#c17f3a}
        .order-tab.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:#c17f3a;border-radius:2px 2px 0 0}
        .orders-content{max-width:1000px;margin:0 auto;padding:2rem 3rem}
        @media(max-width:768px){.orders-content{padding:1.5rem}.orders-header{padding:2rem 1.5rem 0}}
        .order-card{background:#fff;border:1px solid rgba(180,155,120,0.12);border-radius:16px;padding:1.5rem;margin-bottom:1rem;transition:all 0.2s;animation:card-in 0.4s ease both}
        @keyframes card-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .order-card:hover{border-color:rgba(193,127,58,0.2);box-shadow:0 4px 20px rgba(90,60,20,0.07)}
        .order-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem}
        .order-id{font-family:'Playfair Display',serif;font-weight:600;font-size:0.95rem;color:#1a1208}
        .order-date{font-size:0.75rem;color:#b4a08a;margin-top:2px}
        .order-status{font-size:0.72rem;font-weight:600;letter-spacing:0.06em;padding:4px 12px;border-radius:20px}
        .order-product-row{display:flex;align-items:center;gap:12px;padding:0.85rem 0;border-bottom:1px solid rgba(180,155,120,0.08)}
        .order-product-row:last-of-type{border-bottom:none}
        .op-img{width:48px;height:48px;background:linear-gradient(135deg,#f5e6d0,#e8d5b8);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;overflow:hidden}
        .op-img img{width:100%;height:100%;object-fit:cover}
        .op-title{font-size:0.85rem;font-weight:500;color:#1a1208;line-height:1.3;flex:1}
        .op-meta{font-size:0.72rem;color:#b4a08a;margin-top:2px}
        .op-price{font-size:0.88rem;font-weight:600;color:#1a1208;white-space:nowrap}
        .order-footer{display:flex;justify-content:space-between;align-items:center;padding-top:1rem;margin-top:0.5rem;border-top:1px solid rgba(180,155,120,0.1);flex-wrap:wrap;gap:0.5rem}
        .order-total{font-family:'Playfair Display',serif;font-weight:700;font-size:1.05rem;color:#1a1208}
        .order-total span{font-family:'Jost',sans-serif;font-size:0.75rem;color:#b4a08a;font-weight:400;margin-right:4px}
        .order-info-grid{display:flex;flex-wrap:wrap;gap:0.5rem 1.5rem;margin-bottom:1rem}
        .order-info-item{font-size:0.75rem;color:#8a7a6a}
        .order-info-item strong{color:#5a4a3a}
        .order-delivery{font-size:0.78rem;color:#5a9e6f;font-weight:500}
        .empty-state{text-align:center;padding:5rem 2rem;color:#b4a08a}
        .empty-icon{font-size:3rem;margin-bottom:1rem}
        .empty-title{font-family:'Playfair Display',serif;font-size:1.2rem;color:#5a4a3a;margin-bottom:0.5rem}
        .shop-link{color:#c17f3a;text-decoration:none;font-size:0.85rem;font-weight:500}
        .error-banner{background:rgba(224,90,106,0.07);border:1px solid rgba(224,90,106,0.2);border-radius:12px;padding:1rem;text-align:center;color:#c04a5a;font-size:0.88rem}
        .loading-text{text-align:center;padding:4rem 2rem;color:#b4a08a;font-size:0.88rem}
      `}</style>

      <div className="orders-page">
        <div className="orders-header">
          <div className="orders-header-inner">
            <div className="page-eyebrow">Account</div>
            <div className="page-title">My Orders</div>
            <div className="orders-tabs">
              {STATUS_TABS.map(t => (
                <button key={t} className={`order-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                  {t === 'All' ? 'All Orders' : STATUS_STYLE[t]?.label || t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="orders-content">
          {loading && <div className="loading-text">Loading your orders...</div>}
          {error   && <div className="error-banner">{error}</div>}

          {!loading && !error && filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <div className="empty-title">No orders found</div>
              <Link className="shop-link" to="/products">Start Shopping →</Link>
            </div>
          )}

          {!loading && filtered.map((order, i) => {
            const st = STATUS_STYLE[order.orderStatus] || STATUS_STYLE['order placed'];
            return (
              <div className="order-card" key={order._id} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="order-top">
                  <div>
                    <div className="order-id">Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div className="order-date">Ordered: {order.orderDate}</div>
                  </div>
                  <span className="order-status" style={{ color: st.color, background: st.bg }}>{st.label}</span>
                </div>

                <div className="order-product-row">
                  <div className="op-img">
                    {order.mainImg ? <img src={order.mainImg} alt="" /> : '🛍️'}
                  </div>
                  <div style={{flex:1}}>
                    <div className="op-title">{order.title}</div>
                    <div className="op-meta">
                      Qty: {order.quantity}
                      {order.size && ` · Size: ${order.size}`}
                      {order.discount > 0 && ` · ${order.discount}% off applied`}
                    </div>
                  </div>
                  <div className="op-price">₹{order.price?.toLocaleString()}</div>
                </div>

                <div className="order-info-grid" style={{marginTop:'0.75rem'}}>
                  <div className="order-info-item">Payment: <strong>{order.paymentMethod}</strong></div>
                  {order.deliveryDate && <div className="order-info-item">Expected: <strong>{order.deliveryDate}</strong></div>}
                  {order.address && <div className="order-info-item">Deliver to: <strong>{order.address}, {order.pincode}</strong></div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
