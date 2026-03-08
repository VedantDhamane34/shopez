import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id }  = useParams();
  const [product,  setProduct]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [selSize,  setSelSize]  = useState('');
  const [qty,      setQty]      = useState(1);
  const [activeImg,setActiveImg]= useState(0);
  const [activeTab,setActiveTab]= useState('description');
  const [adding,   setAdding]   = useState(false);
  const [added,    setAdded]    = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await getProductById(id);
        setProduct(data);
        if (data.sizes?.length > 0) setSelSize(data.sizes[0]);
      } catch {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <div style={{minHeight:'100vh',background:'#fefcf7',display:'flex',alignItems:'center',justifyContent:'center',paddingTop:'68px',fontFamily:'Jost,sans-serif',color:'#b4a08a'}}>Loading product...</div>;
  if (error || !product) return <div style={{minHeight:'100vh',background:'#fefcf7',display:'flex',alignItems:'center',justifyContent:'center',paddingTop:'68px',fontFamily:'Jost,sans-serif',color:'#e05a6a'}}>{error || 'Product not found'}</div>;

  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const hasDiscount = product.discount > 0;
  const allImages = [product.mainImg, ...(product.carousel || [])].filter(Boolean);

  const handleAddToCart = async () => {
    if (!user) { window.location.href = '/login'; return; }
    if (product.sizes?.length > 0 && !selSize) { alert('Please select a size'); return; }
    setAdding(true);
    try {
      await addToCart({ title: product.title, description: product.description || '', mainImg: product.mainImg || '', size: selSize, quantity: String(qty), price: product.price, discount: product.discount || 0 });
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    } catch (e) { alert(e.response?.data?.message || 'Failed to add to cart'); }
    finally { setAdding(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        .detail-page{min-height:100vh;background:#fefcf7;padding-top:68px;font-family:'Jost',sans-serif}
        .breadcrumb{max-width:1400px;margin:0 auto;padding:1.5rem 3rem 0;display:flex;align-items:center;gap:8px;font-size:0.78rem;color:#b4a08a}
        .breadcrumb a{color:#b4a08a;text-decoration:none;transition:color 0.2s}
        .breadcrumb a:hover{color:#c17f3a}
        .breadcrumb-sep{color:rgba(180,155,120,0.4)}
        .detail-layout{max-width:1400px;margin:0 auto;padding:2rem 3rem 4rem;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:start}
        @media(max-width:900px){.detail-layout{grid-template-columns:1fr;gap:2rem;padding:2rem 1.5rem}}
        .img-panel{position:sticky;top:90px}
        .main-img{background:linear-gradient(135deg,#f5e6d0,#e8d5b8);border-radius:20px;height:460px;display:flex;align-items:center;justify-content:center;font-size:9rem;margin-bottom:1rem;border:1px solid rgba(180,155,120,0.15);overflow:hidden;position:relative}
        .main-img img{width:100%;height:100%;object-fit:cover}
        .disc-tag{position:absolute;top:16px;left:16px;background:#c17f3a;color:#fff;font-size:0.72rem;font-weight:700;padding:5px 12px;border-radius:20px}
        .thumb-row{display:flex;gap:0.75rem}
        .thumb{width:72px;height:72px;background:linear-gradient(135deg,#f5e6d0,#e8d5b8);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;cursor:pointer;border:2px solid transparent;transition:all 0.2s;overflow:hidden}
        .thumb img{width:100%;height:100%;object-fit:cover}
        .thumb:hover,.thumb.active{border-color:#c17f3a}
        .info-cat{font-size:0.7rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#c17f3a;margin-bottom:0.6rem}
        .info-name{font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(1.4rem,2.5vw,2rem);color:#1a1208;letter-spacing:-0.03em;line-height:1.25;margin-bottom:0.75rem}
        .gender-tag{display:inline-block;font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:capitalize;padding:3px 10px;background:rgba(180,155,120,0.12);border-radius:20px;color:#8a7a6a;margin-bottom:1.25rem}
        .price-block{margin-bottom:1.75rem}
        .price-main{font-family:'Playfair Display',serif;font-weight:700;font-size:2.2rem;color:#1a1208;letter-spacing:-0.04em;line-height:1}
        .price-original{font-size:1rem;color:#c0b0a0;text-decoration:line-through;margin-left:0.75rem}
        .price-savings{display:inline-block;background:rgba(90,158,111,0.12);color:#3a8a5a;font-size:0.78rem;font-weight:600;padding:3px 10px;border-radius:20px;margin-top:0.5rem}
        .divider{height:1px;background:rgba(180,155,120,0.15);margin:1.5rem 0}
        .option-lbl{font-size:0.7rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#8a7a6a;margin-bottom:0.75rem}
        .size-row{display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.5rem}
        .size-btn{padding:7px 16px;border-radius:6px;border:1.5px solid rgba(180,155,120,0.25);background:transparent;font-family:'Jost',sans-serif;font-size:0.82rem;color:#5a4a3a;cursor:pointer;transition:all 0.2s}
        .size-btn:hover{border-color:#c17f3a;color:#c17f3a}
        .size-btn.selected{border-color:#1a1208;background:#1a1208;color:#f5ede0}
        .qty-row{display:flex;align-items:center;gap:1.5rem;margin-bottom:1.5rem;flex-wrap:wrap}
        .qty-ctrl{display:flex;align-items:center;border:1.5px solid rgba(180,155,120,0.25);border-radius:8px;overflow:hidden}
        .qty-btn{width:36px;height:36px;border:none;background:transparent;cursor:pointer;font-size:1.1rem;color:#5a4a3a;transition:all 0.2s;display:flex;align-items:center;justify-content:center}
        .qty-btn:hover{background:rgba(193,127,58,0.08);color:#c17f3a}
        .qty-display{width:42px;text-align:center;font-size:0.9rem;font-weight:600;color:#1a1208;border-left:1px solid rgba(180,155,120,0.2);border-right:1px solid rgba(180,155,120,0.2);padding:8px 0;background:transparent;border-top:none;border-bottom:none;outline:none;font-family:'Jost',sans-serif}
        .cta-row{display:flex;gap:0.75rem;flex-wrap:wrap}
        .btn-cart{flex:1;min-width:160px;padding:14px 28px;background:#1a1208;color:#f5ede0;font-family:'Jost',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;border:2px solid #1a1208;border-radius:6px;cursor:pointer;transition:all 0.25s}
        .btn-cart:hover,.btn-cart.success{background:#5a9e6f;border-color:#5a9e6f}
        .btn-cart.loading{opacity:0.7;cursor:not-allowed}
        .btn-buy{flex:1;min-width:160px;padding:14px 28px;background:#c17f3a;color:#fff;font-family:'Jost',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;border:2px solid #c17f3a;border-radius:6px;cursor:pointer;transition:all 0.25s;text-decoration:none;display:flex;align-items:center;justify-content:center}
        .btn-buy:hover{background:transparent;color:#c17f3a}
        .perks-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-top:1.75rem}
        .perk-item{display:flex;align-items:center;gap:8px;font-size:0.78rem;color:#6a5a4a}
        .perk-icon{font-size:1rem}
        .detail-tabs{max-width:1400px;margin:0 auto;padding:0 3rem 5rem}
        @media(max-width:768px){.detail-tabs{padding:0 1.5rem 3rem}}
        .tab-bar{display:flex;border-bottom:2px solid rgba(180,155,120,0.15);margin-bottom:2rem}
        .tab-btn{padding:0.85rem 1.75rem;border:none;background:none;font-family:'Jost',sans-serif;font-size:0.82rem;font-weight:500;text-transform:uppercase;letter-spacing:0.08em;color:#b4a08a;cursor:pointer;position:relative;transition:color 0.2s}
        .tab-btn.active{color:#c17f3a}
        .tab-btn.active::after{content:'';position:absolute;bottom:-2px;left:0;right:0;height:2px;background:#c17f3a;border-radius:2px}
        .tab-content{animation:fade-in 0.3s ease}
        @keyframes fade-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .desc-text{font-size:0.92rem;color:#5a4a3a;line-height:1.75;max-width:680px}
        .specs-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0.75rem}
        .spec-item{display:flex;align-items:center;gap:10px;padding:0.85rem 1.25rem;background:#fff;border-radius:10px;border:1px solid rgba(180,155,120,0.15);font-size:0.82rem;color:#5a4a3a}
        .spec-dot{width:6px;height:6px;background:#c17f3a;border-radius:50%;flex-shrink:0}
      `}</style>

      <div className="detail-page">
        <div className="breadcrumb">
          <Link to="/">Home</Link><span className="breadcrumb-sep">›</span>
          <Link to="/products">Shop</Link><span className="breadcrumb-sep">›</span>
          {product.category && <><Link to={`/products?category=${product.category}`}>{product.category}</Link><span className="breadcrumb-sep">›</span></>}
          <span style={{color:'#5a4a3a',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',maxWidth:200}}>{product.title}</span>
        </div>

        <div className="detail-layout">
          {/* IMAGE PANEL */}
          <div className="img-panel">
            <div className="main-img">
              {hasDiscount && <div className="disc-tag">−{product.discount}% OFF</div>}
              {allImages[activeImg]
                ? <img src={allImages[activeImg]} alt={product.title} />
                : '🛍️'}
            </div>
            {allImages.length > 1 && (
              <div className="thumb-row">
                {allImages.map((img, i) => (
                  <div key={i} className={`thumb ${i===activeImg?'active':''}`} onClick={()=>setActiveImg(i)}>
                    {img ? <img src={img} alt="" /> : '🛍️'}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* INFO PANEL */}
          <div>
            <div className="info-cat">{product.category}</div>
            <h1 className="info-name">{product.title}</h1>
            {product.gender && <div className="gender-tag">{product.gender}</div>}

            <div className="price-block">
              <div>
                <span className="price-main">₹{Math.round(discountedPrice).toLocaleString()}</span>
                {hasDiscount && <span className="price-original">₹{product.price.toLocaleString()}</span>}
              </div>
              {hasDiscount && <div className="price-savings">You save ₹{Math.round(product.price - discountedPrice).toLocaleString()} ({product.discount}% off)</div>}
            </div>

            <div className="divider"/>

            {product.sizes?.length > 0 && (
              <>
                <div className="option-lbl">Size — <span style={{color:'#c17f3a',fontWeight:'normal'}}>{selSize}</span></div>
                <div className="size-row">
                  {product.sizes.map((s,i)=>(
                    <button key={i} className={`size-btn ${selSize===s?'selected':''}`} onClick={()=>setSelSize(s)}>{s}</button>
                  ))}
                </div>
              </>
            )}

            <div className="qty-row">
              <div>
                <div className="option-lbl">Quantity</div>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={()=>setQty(Math.max(1,qty-1))}>−</button>
                  <input className="qty-display" type="number" value={qty} readOnly />
                  <button className="qty-btn" onClick={()=>setQty(qty+1)}>+</button>
                </div>
              </div>
              <div style={{fontSize:'0.78rem',color:'#5a9e6f',fontWeight:500}}>✓ In Stock</div>
            </div>

            <div className="cta-row">
              <button className={`btn-cart ${added?'success':''} ${adding?'loading':''}`} onClick={handleAddToCart} disabled={adding}>
                {added ? '✓ Added to Cart!' : adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <Link className="btn-buy" to="/cart">Buy Now</Link>
            </div>

            <div className="perks-grid">
              {[{i:'🚚',t:'Free Delivery'},{i:'🔄',t:'30-Day Returns'},{i:'🔒',t:'Secure Checkout'},{i:'✅',t:'Genuine Product'}].map((p,i)=>(
                <div className="perk-item" key={i}><span className="perk-icon">{p.i}</span>{p.t}</div>
              ))}
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="detail-tabs">
          <div className="tab-bar">
            {['description','specifications'].map(t=>(
              <button key={t} className={`tab-btn ${activeTab===t?'active':''}`} onClick={()=>setActiveTab(t)}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>
          <div className="tab-content">
            {activeTab==='description' && <p className="desc-text">{product.description || 'No description available.'}</p>}
            {activeTab==='specifications' && (
              <div className="specs-grid">
                {[
                  product.category && {k:'Category', v:product.category},
                  product.gender   && {k:'Gender',   v:product.gender},
                  product.sizes?.length && {k:'Available Sizes', v:product.sizes.join(', ')},
                  {k:'Price',    v:`₹${product.price}`},
                  product.discount && {k:'Discount', v:`${product.discount}%`},
                ].filter(Boolean).map((spec,i)=>(
                  <div className="spec-item" key={i}>
                    <span className="spec-dot"/>
                    <strong>{spec.k}:</strong>&nbsp;{spec.v}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
