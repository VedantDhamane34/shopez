import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';

export default function Checkout() {
  const { cartItems, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.username || '',
    email: user?.email || '',
    mobile: '',
    address: '',
    pincode: '',
    paymentMethod: 'COD',
  });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [step,     setStep]     = useState(1); // 1=details 2=payment 3=success

  const shipping = cartSubtotal > 499 ? 0 : 49;
  const total    = cartSubtotal + shipping;

  const handlePlaceOrder = async () => {
    setLoading(true); setError('');
    try {
      const today    = new Date();
      const delivery = new Date(today); delivery.setDate(delivery.getDate() + 5);

      // Place one order per cart item (backend schema is per-item)
      for (const item of cartItems) {
        const finalPrice = item.price - (item.price * (item.discount || 0)) / 100;
        await placeOrder({
          ...form,
          title:       item.title,
          description: item.description || '',
          mainImg:     item.mainImg || '',
          size:        item.size || '',
          quantity:    Number(item.quantity || 1),
          price:       Math.round(finalPrice),
          discount:    item.discount || 0,
          orderDate:   today.toLocaleDateString('en-IN'),
          deliveryDate: delivery.toLocaleDateString('en-IN'),
        });
      }
      await clearCart();
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Jost:wght@400;500;600&display=swap');
        *{box-sizing:border-box}
        .success-page{min-height:100vh;background:#fefcf7;display:flex;align-items:center;justify-content:center;padding:2rem;font-family:'Jost',sans-serif}
        .success-card{text-align:center;background:#fff;border:1px solid rgba(180,155,120,0.15);border-radius:24px;padding:4rem 3rem;max-width:460px;width:100%;animation:pop-in 0.5s ease}
        @keyframes pop-in{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        .success-icon{font-size:4rem;margin-bottom:1.25rem}
        .success-title{font-family:'Playfair Display',serif;font-size:1.8rem;color:#1a1208;margin-bottom:0.5rem}
        .success-sub{font-size:0.88rem;color:#8a7a6a;margin-bottom:2rem;line-height:1.6}
        .success-cta{background:#c17f3a;color:#fff;padding:13px 32px;border-radius:7px;font-family:'Jost',sans-serif;font-size:0.85rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;display:inline-block;transition:all 0.2s;margin:0 0.4rem}
        .success-cta:hover{background:#a86c30}
        .success-cta.outline{background:transparent;color:#1a1208;border:2px solid #1a1208}
        .success-cta.outline:hover{background:#1a1208;color:#f5ede0}
      `}</style>
      <div className="success-page">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <div className="success-title">Order Placed!</div>
          <p className="success-sub">Thank you, {form.name}! Your order has been confirmed and will be delivered in 3–5 business days.</p>
          <div>
            <a className="success-cta" href="/orders">Track Orders</a>
            <a className="success-cta outline" href="/">Continue Shopping</a>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Jost:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        .checkout-page{min-height:100vh;background:#fefcf7;padding-top:68px;font-family:'Jost',sans-serif}
        .checkout-header{background:linear-gradient(135deg,#f5ede0,#fefcf7);padding:3rem 3rem 2.5rem;border-bottom:1px solid rgba(180,155,120,0.15)}
        .checkout-header-inner{max-width:1100px;margin:0 auto}
        .page-eyebrow{font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#c17f3a;margin-bottom:0.4rem;display:flex;align-items:center;gap:8px}
        .page-eyebrow::before{content:'';width:20px;height:1.5px;background:#c17f3a}
        .page-title{font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(1.6rem,3vw,2.4rem);color:#1a1208;letter-spacing:-0.03em}
        .steps-bar{display:flex;gap:0;margin-top:1.5rem}
        .step-item{display:flex;align-items:center;gap:8px;font-size:0.78rem;font-weight:500;color:#b4a08a;padding:8px 0;margin-right:2rem}
        .step-item.active{color:#c17f3a}
        .step-item.done{color:#5a9e6f}
        .step-num{width:24px;height:24px;border-radius:50%;border:1.5px solid currentColor;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0}
        .step-item.done .step-num{background:#5a9e6f;border-color:#5a9e6f;color:#fff}
        .checkout-layout{max-width:1100px;margin:0 auto;padding:2.5rem 3rem;display:grid;grid-template-columns:1fr 360px;gap:2.5rem;align-items:start}
        @media(max-width:900px){.checkout-layout{grid-template-columns:1fr;padding:1.5rem}}
        .form-section{background:#fff;border:1px solid rgba(180,155,120,0.12);border-radius:20px;padding:2rem;margin-bottom:1.25rem}
        .form-section-title{font-family:'Playfair Display',serif;font-weight:700;font-size:1rem;color:#1a1208;margin-bottom:1.5rem;display:flex;align-items:center;gap:8px}
        .form-section-title span{font-size:0.8rem;font-weight:400;color:#b4a08a;font-family:'Jost',sans-serif}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        @media(max-width:600px){.form-grid{grid-template-columns:1fr}}
        .form-grid .full{grid-column:1/-1}
        .field-label{display:block;font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#8a7a6a;margin-bottom:0.45rem}
        .field-input{width:100%;background:#fefcf7;border:1.5px solid rgba(180,155,120,0.25);border-radius:8px;padding:12px 14px;font-family:'Jost',sans-serif;font-size:0.88rem;color:#1a1208;outline:none;transition:all 0.2s}
        .field-input:focus{border-color:#c17f3a;background:#fff;box-shadow:0 0 0 3px rgba(193,127,58,0.08)}
        .field-input::placeholder{color:#c0b0a0}
        .payment-methods{display:flex;flex-direction:column;gap:0.75rem}
        .payment-option{display:flex;align-items:center;gap:12px;padding:14px 16px;border:1.5px solid rgba(180,155,120,0.2);border-radius:10px;cursor:pointer;transition:all 0.2s}
        .payment-option:hover{border-color:rgba(193,127,58,0.3)}
        .payment-option.selected{border-color:#c17f3a;background:rgba(193,127,58,0.04)}
        .payment-option input{accent-color:#c17f3a}
        .payment-icon{font-size:1.4rem}
        .payment-label{font-size:0.88rem;font-weight:500;color:#1a1208}
        .payment-desc{font-size:0.72rem;color:#b4a08a;margin-top:2px}
        .error-box{background:rgba(224,90,106,0.06);border:1px solid rgba(224,90,106,0.2);border-radius:8px;padding:10px 14px;font-size:0.8rem;color:#c04a5a;margin-bottom:1rem}
        .place-btn{width:100%;padding:15px;background:#c17f3a;color:#fff;font-family:'Jost',sans-serif;font-size:0.9rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;border:none;border-radius:10px;cursor:pointer;transition:all 0.25s;display:flex;align-items:center;justify-content:center;gap:8px}
        .place-btn:hover:not(:disabled){background:#a86c30;transform:translateY(-1px);box-shadow:0 8px 30px rgba(193,127,58,0.3)}
        .place-btn:disabled{opacity:0.6;cursor:not-allowed}
        .spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;border-radius:50%;animation:spin 0.7s linear infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
        .order-summary-box{background:#fff;border:1px solid rgba(180,155,120,0.12);border-radius:20px;padding:1.75rem;position:sticky;top:88px}
        .summary-title{font-family:'Playfair Display',serif;font-weight:700;font-size:1.05rem;color:#1a1208;margin-bottom:1.25rem}
        .order-item-row{display:flex;align-items:center;gap:10px;margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid rgba(180,155,120,0.1)}
        .order-item-row:last-of-type{border-bottom:none}
        .oi-img{width:46px;height:46px;background:linear-gradient(135deg,#f5e6d0,#e8d5b8);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;overflow:hidden;flex-shrink:0}
        .oi-img img{width:100%;height:100%;object-fit:cover}
        .oi-name{font-size:0.82rem;font-weight:500;color:#1a1208;line-height:1.3;flex:1}
        .oi-qty{font-size:0.72rem;color:#b4a08a}
        .oi-price{font-size:0.85rem;font-weight:600;color:#1a1208;white-space:nowrap}
        .sum-row{display:flex;justify-content:space-between;margin-bottom:0.7rem;font-size:0.85rem}
        .sum-lbl{color:#6a5a4a}
        .sum-val{font-weight:500;color:#1a1208}
        .sum-val.free{color:#5a9e6f;font-weight:600}
        .sum-divider{height:1px;background:rgba(180,155,120,0.15);margin:1rem 0}
        .sum-total-row{display:flex;justify-content:space-between;align-items:baseline}
        .sum-total-lbl{font-family:'Playfair Display',serif;font-weight:600;font-size:0.95rem;color:#1a1208}
        .sum-total-val{font-family:'Playfair Display',serif;font-weight:700;font-size:1.4rem;color:#1a1208}
      `}</style>

      <div className="checkout-page">
        <div className="checkout-header">
          <div className="checkout-header-inner">
            <div className="page-eyebrow">Checkout</div>
            <div className="page-title">Complete Your Order</div>
            <div className="steps-bar">
              {['Delivery Details', 'Payment', 'Confirmation'].map((s, i) => (
                <div key={i} className={`step-item ${step === i+1 ? 'active' : step > i+1 ? 'done' : ''}`}>
                  <div className="step-num">{step > i+1 ? '✓' : i+1}</div>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="checkout-layout">
          <div>
            {error && <div className="error-box">{error}</div>}

            {/* DELIVERY DETAILS */}
            <div className="form-section">
              <div className="form-section-title">Delivery Details <span>All fields required</span></div>
              <div className="form-grid">
                <div>
                  <label className="field-label">Full Name</label>
                  <input className="field-input" placeholder="Priya Sharma" value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="field-label">Mobile</label>
                  <input className="field-input" placeholder="10-digit number" value={form.mobile}
                    onChange={e => setForm({...form, mobile: e.target.value})} />
                </div>
                <div>
                  <label className="field-label">Email</label>
                  <input className="field-input" type="email" placeholder="you@example.com" value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div>
                  <label className="field-label">Pincode</label>
                  <input className="field-input" placeholder="6-digit PIN" value={form.pincode}
                    onChange={e => setForm({...form, pincode: e.target.value})} />
                </div>
                <div className="full">
                  <label className="field-label">Full Address</label>
                  <input className="field-input" placeholder="House / Flat no., Street, City, State" value={form.address}
                    onChange={e => setForm({...form, address: e.target.value})} />
                </div>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="form-section">
              <div className="form-section-title">Payment Method</div>
              <div className="payment-methods">
                {[
                  { val:'COD',   icon:'💵', label:'Cash on Delivery', desc:'Pay when your order arrives' },
                  { val:'UPI',   icon:'📱', label:'UPI',              desc:'Pay via any UPI app' },
                  { val:'Card',  icon:'💳', label:'Credit / Debit Card', desc:'Visa, Mastercard, RuPay' },
                ].map(opt => (
                  <label className={`payment-option ${form.paymentMethod === opt.val ? 'selected' : ''}`} key={opt.val}>
                    <input type="radio" name="payment" value={opt.val} checked={form.paymentMethod === opt.val}
                      onChange={() => setForm({...form, paymentMethod: opt.val})} />
                    <span className="payment-icon">{opt.icon}</span>
                    <div>
                      <div className="payment-label">{opt.label}</div>
                      <div className="payment-desc">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button className="place-btn" onClick={handlePlaceOrder} disabled={loading || cartItems.length === 0}>
              {loading && <div className="spinner"/>}
              {loading ? 'Placing Order...' : `Place Order · ₹${Math.round(total).toLocaleString()}`}
            </button>
          </div>

          {/* ORDER SUMMARY */}
          <div className="order-summary-box">
            <div className="summary-title">Order Summary ({cartItems.length} items)</div>

            {cartItems.map(item => {
              const fp = item.price - (item.price * (item.discount||0))/100;
              return (
                <div className="order-item-row" key={item._id}>
                  <div className="oi-img">
                    {item.mainImg ? <img src={item.mainImg} alt="" /> : '🛍️'}
                  </div>
                  <div className="oi-name">
                    {item.title}
                    <div className="oi-qty">Qty: {item.quantity}{item.size && ` · ${item.size}`}</div>
                  </div>
                  <div className="oi-price">₹{Math.round(fp * Number(item.quantity||1)).toLocaleString()}</div>
                </div>
              );
            })}

            <div className="sum-row"><span className="sum-lbl">Subtotal</span><span className="sum-val">₹{Math.round(cartSubtotal).toLocaleString()}</span></div>
            <div className="sum-row"><span className="sum-lbl">Shipping</span><span className={`sum-val ${shipping === 0 ? 'free' : ''}`}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className="sum-divider"/>
            <div className="sum-total-row">
              <span className="sum-total-lbl">Total</span>
              <span className="sum-total-val">₹{Math.round(total).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
