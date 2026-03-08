import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, cartLoading, cartSubtotal, removeFromCart, updateQty, clearCart } = useCart();
  const [coupon,        setCoupon]        = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [removing,      setRemoving]      = useState(null);
  const navigate = useNavigate();

  const VALID_COUPON = 'SAVE10';
  const discount  = couponApplied ? Math.round(cartSubtotal * 0.1) : 0;
  const shipping  = cartSubtotal > 499 ? 0 : 49;
  const total     = cartSubtotal - discount + shipping;

  const handleRemove = async (id) => {
    setRemoving(id);
    await removeFromCart(id);
    setRemoving(null);
  };

  const handleUpdateQty = async (id, newQty) => {
    if (newQty < 1) { handleRemove(id); return; }
    await updateQty(id, newQty);
  };

  if (cartLoading) return (
    <div style={{minHeight:'100vh',background:'#fefcf7',display:'flex',alignItems:'center',justifyContent:'center',paddingTop:'68px',fontFamily:'Jost,sans-serif',color:'#b4a08a'}}>
      Loading cart...
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Jost:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        .cart-page{min-height:100vh;background:#fefcf7;padding-top:68px;font-family:'Jost',sans-serif}
        .cart-header{background:linear-gradient(135deg,#f5ede0,#fefcf7);padding:3rem 3rem 2.5rem;border-bottom:1px solid rgba(180,155,120,0.15)}
        .cart-header-inner{max-width:1400px;margin:0 auto;display:flex;align-items:flex-end;justify-content:space-between;gap:1rem;flex-wrap:wrap}
        .page-eyebrow{font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#c17f3a;margin-bottom:0.4rem;display:flex;align-items:center;gap:8px}
        .page-eyebrow::before{content:'';width:20px;height:1.5px;background:#c17f3a}
        .page-title{font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(1.6rem,3vw,2.4rem);color:#1a1208;letter-spacing:-0.03em}
        .item-count{font-size:0.85rem;color:#8a7a6a}
        .cart-layout{max-width:1400px;margin:0 auto;padding:2.5rem 3rem;display:grid;grid-template-columns:1fr 360px;gap:2.5rem;align-items:start}
        @media(max-width:1000px){.cart-layout{grid-template-columns:1fr;padding:1.5rem}}
        .cart-items-header{display:grid;grid-template-columns:1fr 110px 130px 110px 40px;gap:1rem;padding:0 1rem 0.75rem;font-size:0.67rem;text-transform:uppercase;letter-spacing:0.12em;color:#b4a08a;border-bottom:1px solid rgba(180,155,120,0.15);margin-bottom:0.75rem}
        @media(max-width:700px){.cart-items-header{display:none}}
        .cart-item{display:grid;grid-template-columns:1fr 110px 130px 110px 40px;gap:1rem;align-items:center;padding:1.25rem 1rem;background:#fff;border-radius:14px;border:1px solid rgba(180,155,120,0.1);margin-bottom:0.75rem;transition:all 0.2s;animation:item-in 0.4s ease both}
        @media(max-width:700px){.cart-item{grid-template-columns:1fr auto}}
        @keyframes item-in{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
        .cart-item:hover{border-color:rgba(193,127,58,0.2);box-shadow:0 4px 20px rgba(90,60,20,0.06)}
        .item-info{display:flex;align-items:center;gap:1rem}
        .item-img-box{width:64px;height:64px;background:linear-gradient(135deg,#f5e6d0,#e8d5b8);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex-shrink:0;overflow:hidden}
        .item-img-box img{width:100%;height:100%;object-fit:cover}
        .item-title{font-family:'Playfair Display',serif;font-size:0.88rem;color:#1a1208;line-height:1.3;margin-bottom:0.25rem}
        .item-meta{font-size:0.72rem;color:#b4a08a}
        .item-meta strong{color:#8a7a6a}
        .item-price{font-family:'Playfair Display',serif;font-weight:600;font-size:0.92rem;color:#1a1208}
        .qty-ctrl{display:inline-flex;align-items:center;border:1.5px solid rgba(180,155,120,0.2);border-radius:8px;overflow:hidden}
        .qty-btn{width:30px;height:30px;border:none;background:transparent;cursor:pointer;font-size:1rem;color:#5a4a3a;transition:all 0.2s;display:flex;align-items:center;justify-content:center}
        .qty-btn:hover{background:rgba(193,127,58,0.1);color:#c17f3a}
        .qty-num{width:34px;text-align:center;font-size:0.84rem;font-weight:600;color:#1a1208;border-left:1px solid rgba(180,155,120,0.2);border-right:1px solid rgba(180,155,120,0.2);padding:6px 0}
        .item-subtotal{font-family:'Playfair Display',serif;font-weight:700;font-size:0.98rem;color:#c17f3a}
        .remove-btn{background:none;border:none;cursor:pointer;color:#c0b0a0;transition:color 0.2s;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:6px}
        .remove-btn:hover{color:#e05a6a;background:rgba(224,90,106,0.06)}
        .remove-btn:disabled{opacity:0.4;cursor:not-allowed}
        .remove-btn svg{width:16px;height:16px}
        .cart-empty{text-align:center;padding:6rem 2rem}
        .empty-icon{font-size:4rem;margin-bottom:1rem}
        .empty-title{font-family:'Playfair Display',serif;font-size:1.5rem;color:#1a1208;margin-bottom:0.6rem}
        .empty-sub{font-size:0.88rem;color:#8a7a6a;margin-bottom:2rem}
        .shop-btn{background:#1a1208;color:#f5ede0;padding:13px 32px;border-radius:6px;font-family:'Jost',sans-serif;font-size:0.82rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;text-decoration:none;display:inline-block;transition:all 0.2s;border:2px solid #1a1208}
        .shop-btn:hover{background:transparent;color:#1a1208}
        .order-summary{background:#fff;border:1px solid rgba(180,155,120,0.15);border-radius:20px;padding:2rem;position:sticky;top:88px}
        .summary-title{font-family:'Playfair Display',serif;font-weight:700;font-size:1.2rem;color:#1a1208;margin-bottom:1.5rem}
        .summary-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.85rem}
        .summary-label{font-size:0.85rem;color:#6a5a4a}
        .summary-value{font-size:0.9rem;font-weight:500;color:#1a1208}
        .summary-value.green{color:#5a9e6f}
        .summary-value.free{color:#5a9e6f;font-size:0.8rem;font-weight:600}
        .summary-divider{height:1px;background:rgba(180,155,120,0.15);margin:1.25rem 0}
        .summary-total-row{display:flex;justify-content:space-between;align-items:baseline}
        .summary-total-lbl{font-family:'Playfair Display',serif;font-weight:600;font-size:1rem;color:#1a1208}
        .summary-total-val{font-family:'Playfair Display',serif;font-weight:700;font-size:1.5rem;color:#1a1208}
        .coupon-row{display:flex;gap:0.5rem;margin:1.5rem 0}
        .coupon-input{flex:1;border:1.5px solid rgba(180,155,120,0.25);border-radius:7px;padding:10px 14px;font-family:'Jost',sans-serif;font-size:0.82rem;color:#1a1208;outline:none;text-transform:uppercase;letter-spacing:0.05em;transition:border-color 0.2s}
        .coupon-input:focus{border-color:#c17f3a}
        .coupon-input.applied{border-color:#5a9e6f;background:rgba(90,158,111,0.04)}
        .coupon-btn{padding:10px 16px;background:#1a1208;color:#f5ede0;border:none;border-radius:7px;font-family:'Jost',sans-serif;font-size:0.76rem;font-weight:600;cursor:pointer;transition:all 0.2s;white-space:nowrap}
        .coupon-btn:hover{background:#c17f3a}
        .coupon-msg{font-size:0.75rem;margin-top:0.25rem}
        .coupon-msg.success{color:#5a9e6f}
        .coupon-msg.error{color:#e05a6a}
        .checkout-btn{width:100%;padding:15px;background:#c17f3a;color:#fff;font-family:'Jost',sans-serif;font-size:0.88rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;border:none;border-radius:8px;cursor:pointer;transition:all 0.25s;margin-top:1.5rem;display:block;text-align:center;text-decoration:none}
        .checkout-btn:hover{background:#a86c30;transform:translateY(-1px);box-shadow:0 8px 30px rgba(193,127,58,0.3)}
        .secure-note{text-align:center;font-size:0.72rem;color:#b4a08a;margin-top:0.75rem;display:flex;align-items:center;justify-content:center;gap:5px}
        .continue-link{display:block;text-align:center;margin-top:1rem;font-size:0.78rem;color:#c17f3a;text-decoration:none;transition:opacity 0.2s}
        .continue-link:hover{opacity:0.7}
      `}</style>

      <div className="cart-page">
        <div className="cart-header">
          <div className="cart-header-inner">
            <div>
              <div className="page-eyebrow">My Bag</div>
              <div className="page-title">Shopping Cart</div>
            </div>
            <div className="item-count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">🛍️</div>
            <div className="empty-title">Your cart is empty</div>
            <p className="empty-sub">Looks like you haven't added anything yet.</p>
            <Link className="shop-btn" to="/products">Continue Shopping →</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div>
              <div className="cart-items-header">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Subtotal</span>
                <span></span>
              </div>

              {cartItems.map((item, i) => {
                const finalPrice = item.price - (item.price * (item.discount || 0)) / 100;
                const subtotal   = finalPrice * Number(item.quantity || 1);
                return (
                  <div className="cart-item" key={item._id} style={{ animationDelay: `${i * 0.07}s` }}>
                    <div className="item-info">
                      <div className="item-img-box">
                        {item.mainImg
                          ? <img src={item.mainImg} alt={item.title} />
                          : '🛍️'}
                      </div>
                      <div>
                        <div className="item-title">{item.title}</div>
                        <div className="item-meta">
                          {item.size && <>Size: <strong>{item.size}</strong></>}
                          {item.discount > 0 && <> · <strong style={{color:'#5a9e6f'}}>−{item.discount}%</strong></>}
                        </div>
                      </div>
                    </div>

                    <div className="item-price">₹{Math.round(finalPrice).toLocaleString()}</div>

                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => handleUpdateQty(item._id, Number(item.quantity) - 1)}>−</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => handleUpdateQty(item._id, Number(item.quantity) + 1)}>+</button>
                    </div>

                    <div className="item-subtotal">₹{Math.round(subtotal).toLocaleString()}</div>

                    <button className="remove-btn" onClick={() => handleRemove(item._id)} disabled={removing === item._id}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ORDER SUMMARY */}
            <div className="order-summary">
              <div className="summary-title">Order Summary</div>

              <div className="summary-row">
                <span className="summary-label">Subtotal ({cartItems.reduce((s,i) => s + Number(i.quantity||1), 0)} items)</span>
                <span className="summary-value">₹{Math.round(cartSubtotal).toLocaleString()}</span>
              </div>

              {couponApplied && (
                <div className="summary-row">
                  <span className="summary-label">Discount (SAVE10)</span>
                  <span className="summary-value green">−₹{discount.toLocaleString()}</span>
                </div>
              )}

              <div className="summary-row">
                <span className="summary-label">Shipping</span>
                <span className={`summary-value ${shipping === 0 ? 'free' : ''}`}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>

              <div className="coupon-row">
                <input
                  className={`coupon-input ${couponApplied ? 'applied' : ''}`}
                  placeholder="Coupon code"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value.toUpperCase())}
                  disabled={couponApplied}
                />
                <button
                  className="coupon-btn"
                  onClick={() => {
                    if (coupon === VALID_COUPON) setCouponApplied(true);
                    else setCoupon('INVALID');
                  }}
                  disabled={couponApplied}
                >
                  Apply
                </button>
              </div>
              {couponApplied && <div className="coupon-msg success">✓ Coupon applied — 10% off!</div>}
              {coupon === 'INVALID' && <div className="coupon-msg error">Invalid coupon code.</div>}

              <div className="summary-divider" />

              <div className="summary-total-row">
                <span className="summary-total-lbl">Total</span>
                <span className="summary-total-val">₹{Math.round(total).toLocaleString()}</span>
              </div>

              <Link className="checkout-btn" to="/checkout">
                🔒 Proceed to Checkout
              </Link>
              <div className="secure-note">🔒 Secured by SSL encryption</div>
              <Link className="continue-link" to="/products">← Continue Shopping</Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
