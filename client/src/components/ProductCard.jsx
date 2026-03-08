import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product, index = 0 }) {
  const [adding, setAdding] = useState(false);
  const [added,  setAdded]  = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  // Backend schema: title, mainImg, price, discount, category, gender, sizes
  const discountedPrice = product.price - (product.price * (product.discount || 0)) / 100;
  const hasDiscount     = product.discount > 0;

  const GRADIENT_BG = [
    'linear-gradient(135deg,#f5e6d0,#e8d5b8)',
    'linear-gradient(135deg,#d0e8f5,#b0d0e8)',
    'linear-gradient(135deg,#d0f5e8,#b0e8d0)',
    'linear-gradient(135deg,#f5d0e8,#e8b0d0)',
    'linear-gradient(135deg,#e8d0f5,#d0b0e8)',
  ];
  const bg = GRADIENT_BG[index % GRADIENT_BG.length];

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { window.location.href = '/login'; return; }
    setAdding(true);
    try {
      await addToCart({
        title:       product.title,
        description: product.description || '',
        mainImg:     product.mainImg || '',
        size:        product.sizes?.[0] || '',
        quantity:    '1',
        price:       product.price,
        discount:    product.discount || 0,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Jost:wght@400;500;600&display=swap');
        .pcard{background:#fff;border-radius:16px;overflow:hidden;transition:all 0.35s ease;animation:card-rise 0.5s ease both;animation-delay:calc(var(--i,0)*0.07s);border:1px solid rgba(180,155,120,0.12);text-decoration:none;display:block;color:inherit}
        @keyframes card-rise{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        .pcard:hover{transform:translateY(-6px);box-shadow:0 24px 60px rgba(90,60,20,0.14);border-color:rgba(193,127,58,0.25)}
        .pcard-img{position:relative;height:220px;overflow:hidden}
        .pcard-img-bg{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3.5rem;transition:transform 0.4s ease}
        .pcard:hover .pcard-img-bg{transform:scale(1.06)}
        .pcard-overlay{position:absolute;inset:0;background:rgba(26,18,8,0);transition:background 0.3s;display:flex;align-items:center;justify-content:center;gap:0.5rem;opacity:0}
        .pcard:hover .pcard-overlay{background:rgba(26,18,8,0.15);opacity:1}
        .overlay-btn{background:#fff;border:none;border-radius:50px;padding:9px 20px;font-family:'Jost',sans-serif;font-size:0.74rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#1a1208;cursor:pointer;transition:all 0.25s;transform:translateY(8px);text-decoration:none;display:inline-block}
        .pcard:hover .overlay-btn{transform:translateY(0)}
        .overlay-btn:hover,.overlay-btn.added{background:#5a9e6f;color:#fff}
        .overlay-btn.loading{background:#c17f3a;color:#fff}
        .disc-badge{position:absolute;top:12px;left:12px;background:#c17f3a;color:#fff;font-family:'Jost',sans-serif;font-size:0.67rem;font-weight:700;letter-spacing:0.04em;padding:3px 9px;border-radius:20px;z-index:2}
        .gender-badge{position:absolute;top:12px;right:12px;background:rgba(26,18,8,0.65);color:#f5ede0;font-family:'Jost',sans-serif;font-size:0.62rem;font-weight:500;letter-spacing:0.06em;padding:2px 8px;border-radius:20px;z-index:2;text-transform:capitalize}
        .pcard-body{padding:1.1rem 1.2rem 1.3rem}
        .pcard-cat{font-family:'Jost',sans-serif;font-size:0.65rem;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#c17f3a;margin-bottom:0.35rem}
        .pcard-title{font-family:'Playfair Display',serif;font-weight:600;font-size:1rem;color:#1a1208;line-height:1.35;margin-bottom:0.7rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .pcard-sizes{display:flex;gap:4px;flex-wrap:wrap;margin-bottom:0.7rem}
        .size-dot{font-family:'Jost',sans-serif;font-size:0.62rem;font-weight:500;border:1px solid rgba(180,155,120,0.3);border-radius:4px;padding:2px 6px;color:#8a7a6a}
        .pcard-price-row{display:flex;align-items:baseline;gap:0.5rem}
        .pcard-price{font-family:'Jost',sans-serif;font-weight:700;font-size:1.1rem;color:#1a1208}
        .pcard-original{font-family:'Jost',sans-serif;font-size:0.8rem;color:#c0b0a0;text-decoration:line-through}
      `}</style>

      <div className="pcard" style={{ '--i': index }}>
        <div className="pcard-img">
          <div className="pcard-img-bg" style={{ background: bg }}>
            {product.mainImg
              ? <img src={product.mainImg} alt={product.title} style={{ width:'100%',height:'100%',objectFit:'cover' }} />
              : '🛍️'}
          </div>

          {hasDiscount && <div className="disc-badge">−{product.discount}%</div>}
          {product.gender && <div className="gender-badge">{product.gender}</div>}

          <div className="pcard-overlay">
            <button
              className={`overlay-btn ${added ? 'added' : adding ? 'loading' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? '✓ Added!' : adding ? 'Adding...' : 'Add to Cart'}
            </button>
            <Link className="overlay-btn" to={`/product/${product._id}`}>View</Link>
          </div>
        </div>

        <div className="pcard-body">
          <div className="pcard-cat">{product.category}</div>
          <div className="pcard-title">{product.title}</div>

          {product.sizes?.length > 0 && (
            <div className="pcard-sizes">
              {product.sizes.slice(0, 4).map((s, i) => (
                <span className="size-dot" key={i}>{s}</span>
              ))}
              {product.sizes.length > 4 && <span className="size-dot">+{product.sizes.length - 4}</span>}
            </div>
          )}

          <div className="pcard-price-row">
            <span className="pcard-price">₹{Math.round(discountedPrice).toLocaleString()}</span>
            {hasDiscount && <span className="pcard-original">₹{product.price.toLocaleString()}</span>}
          </div>
        </div>
      </div>
    </>
  );
}
