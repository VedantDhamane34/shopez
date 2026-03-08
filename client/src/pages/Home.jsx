import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getAllProducts, getAdminData } from '../services/api';

const CATEGORIES = [
  { name: 'Men',        emoji: '👔', color: '#dbeafe' },
  { name: 'Women',      emoji: '👗', color: '#fce7f3' },
  { name: 'Kids',       emoji: '🧸', color: '#dcfce7' },
  { name: 'Electronics',emoji: '💻', color: '#fef3c7' },
  { name: 'Home',       emoji: '🏡', color: '#ede9fe' },
  { name: 'Sports',     emoji: '⚽', color: '#ffedd5' },
];

export default function Home() {
  const [products,   setProducts]   = useState([]);
  const [banner,     setBanner]     = useState('');
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, adminRes] = await Promise.allSettled([getAllProducts(), getAdminData()]);
        if (prodRes.status  === 'fulfilled') setProducts(prodRes.value.data);
        if (adminRes.status === 'fulfilled') setBanner(adminRes.value.data?.banner || '');
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const featured = products.slice(0, 4);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Jost:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        .home-page{min-height:100vh;background:#fefcf7;font-family:'Jost',sans-serif}
        .hero{min-height:100vh;background:linear-gradient(135deg,#f9f2e8 60%,#f0e8d8);display:flex;align-items:center;padding:80px 3rem 4rem;position:relative;overflow:hidden}
        .hero::before{content:'';position:absolute;top:-20%;right:-10%;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(193,127,58,0.1),transparent 70%);pointer-events:none}
        .hero-inner{max-width:1400px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
        @media(max-width:900px){.hero-inner{grid-template-columns:1fr}.hero-visual{display:none}.hero{padding:100px 1.5rem 3rem}}
        .hero-tag{display:inline-flex;align-items:center;gap:8px;font-size:0.72rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#c17f3a;margin-bottom:1.25rem}
        .hero-tag::before{content:'';width:32px;height:1.5px;background:#c17f3a}
        .hero-title{font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(2.5rem,5vw,4.2rem);color:#1a1208;letter-spacing:-0.03em;line-height:1.12;margin-bottom:1.5rem;animation:hero-in 0.7s ease both}
        @keyframes hero-in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .hero-sub{font-size:1rem;color:#6a5a4a;line-height:1.7;max-width:440px;margin-bottom:2.5rem;animation:hero-in 0.7s ease 0.15s both}
        .hero-actions{display:flex;gap:1rem;align-items:center;animation:hero-in 0.7s ease 0.25s both}
        .btn-dark{background:#1a1208;color:#f5ede0;font-family:'Jost',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:14px 34px;border-radius:4px;text-decoration:none;border:2px solid #1a1208;transition:all 0.25s;display:inline-block}
        .btn-dark:hover{background:transparent;color:#1a1208}
        .hero-stats{display:flex;gap:2rem;margin-top:3rem;padding-top:2rem;border-top:1px solid rgba(180,155,120,0.25);animation:hero-in 0.7s ease 0.35s both}
        .hero-stat-val{font-family:'Playfair Display',serif;font-weight:700;font-size:1.6rem;color:#1a1208;letter-spacing:-0.03em;line-height:1}
        .hero-stat-lbl{font-size:0.72rem;letter-spacing:0.08em;text-transform:uppercase;color:#b4a08a;margin-top:4px}
        .hero-visual{display:grid;grid-template-columns:1fr 1fr;gap:1rem;animation:hero-in 0.7s ease 0.2s both}
        .hero-pcard{background:#fff;border-radius:16px;padding:1.5rem 1.25rem;text-align:center;box-shadow:0 8px 32px rgba(90,60,20,0.1);border:1px solid rgba(180,155,120,0.12);transition:transform 0.3s}
        .hero-pcard:hover{transform:translateY(-4px)}
        .hero-pcard:nth-child(2){margin-top:2rem}
        .hero-pcard:nth-child(4){margin-top:-2rem}
        .hero-pc-emoji{font-size:3rem;margin-bottom:0.75rem}
        .hero-pc-name{font-family:'Playfair Display',serif;font-size:0.88rem;color:#1a1208;margin-bottom:0.4rem;line-height:1.3}
        .hero-pc-price{font-size:0.85rem;font-weight:600;color:#c17f3a}
        .trust-bar{background:#1a1208;padding:1rem 3rem}
        .trust-inner{max-width:1400px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
        .trust-item{display:flex;align-items:center;gap:10px;color:rgba(245,237,224,0.8)}
        .trust-icon{font-size:1.2rem}
        .trust-main{font-size:0.82rem;font-weight:500;color:#f5ede0}
        .trust-sub{font-size:0.7rem;color:rgba(245,237,224,0.5)}
        .section{max-width:1400px;margin:0 auto;padding:5rem 3rem}
        @media(max-width:768px){.section{padding:3rem 1.5rem}}
        .section-header{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:2.5rem;flex-wrap:wrap;gap:1rem}
        .section-eyebrow{font-size:0.72rem;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#c17f3a;margin-bottom:0.5rem;display:flex;align-items:center;gap:8px}
        .section-eyebrow::before{content:'';width:24px;height:1.5px;background:#c17f3a}
        .section-title{font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(1.6rem,2.5vw,2.4rem);color:#1a1208;letter-spacing:-0.03em;line-height:1.2}
        .section-link{font-size:0.8rem;font-weight:500;letter-spacing:0.06em;text-transform:uppercase;color:#c17f3a;text-decoration:none;display:flex;align-items:center;gap:6px;border-bottom:1px solid rgba(193,127,58,0.3);padding-bottom:2px;transition:all 0.2s}
        .section-link:hover{gap:10px;border-color:#c17f3a}
        .categories-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:1rem}
        @media(max-width:1100px){.categories-grid{grid-template-columns:repeat(3,1fr)}}
        @media(max-width:600px){.categories-grid{grid-template-columns:repeat(2,1fr)}}
        .cat-card{background:#fff;border-radius:16px;padding:1.75rem 1rem;text-align:center;border:1px solid rgba(180,155,120,0.12);text-decoration:none;transition:all 0.3s;position:relative;overflow:hidden}
        .cat-card::before{content:'';position:absolute;inset:0;background:var(--cc,#fef3c7);opacity:0;transition:opacity 0.3s}
        .cat-card:hover::before{opacity:1}
        .cat-card:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(90,60,20,0.12)}
        .cat-emoji{font-size:2.2rem;margin-bottom:0.75rem;display:block;position:relative;z-index:1;transition:transform 0.3s}
        .cat-card:hover .cat-emoji{transform:scale(1.15)}
        .cat-name{font-family:'Playfair Display',serif;font-size:0.88rem;font-weight:600;color:#1a1208;display:block;position:relative;z-index:1}
        .products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem}
        .banner-wrap{background:linear-gradient(120deg,#1a1208 60%,#3a2a18 100%);border-radius:24px;padding:4rem;display:flex;align-items:center;justify-content:space-between;gap:2rem;flex-wrap:wrap;position:relative;overflow:hidden;margin:0 3rem}
        @media(max-width:768px){.banner-wrap{padding:2rem;margin:0 1.5rem}}
        .banner-wrap::before{content:'✨';position:absolute;right:10%;top:50%;transform:translateY(-50%);font-size:8rem;opacity:0.05;pointer-events:none}
        .banner-tag{font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#c17f3a;margin-bottom:0.75rem}
        .banner-title{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,3vw,2.8rem);color:#f5ede0;font-weight:700;letter-spacing:-0.03em;line-height:1.2;margin-bottom:1rem}
        .banner-sub{font-size:0.88rem;color:rgba(245,237,224,0.6);line-height:1.6}
        .banner-cta{background:#c17f3a;color:#fff;font-family:'Jost',sans-serif;font-size:0.82rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;padding:14px 34px;border-radius:4px;text-decoration:none;border:2px solid #c17f3a;transition:all 0.25s;white-space:nowrap;display:inline-block}
        .banner-cta:hover{background:transparent;color:#c17f3a}
        .skeleton-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem}
        .skeleton-card{background:#fff;border-radius:16px;overflow:hidden;border:1px solid rgba(180,155,120,0.1)}
        .skeleton-img{height:220px;background:linear-gradient(90deg,rgba(180,155,120,0.1) 25%,rgba(180,155,120,0.2) 50%,rgba(180,155,120,0.1) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
        .skeleton-body{padding:1.2rem}
        .skeleton-line{height:12px;border-radius:6px;background:linear-gradient(90deg,rgba(180,155,120,0.1) 25%,rgba(180,155,120,0.2) 50%,rgba(180,155,120,0.1) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;margin-bottom:0.75rem}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .footer{background:#1a1208;padding:4rem 3rem 2rem;margin-top:5rem}
        .footer-inner{max-width:1400px;margin:0 auto}
        .footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:3rem;padding-bottom:3rem;border-bottom:1px solid rgba(255,255,255,0.08);margin-bottom:2rem}
        @media(max-width:900px){.footer-top{grid-template-columns:1fr 1fr}}
        .footer-brand{font-family:'Playfair Display',serif;font-weight:700;font-size:1.5rem;color:#f5ede0}
        .footer-brand span{color:#c17f3a}
        .footer-tagline{font-size:0.82rem;color:rgba(245,237,224,0.5);line-height:1.65;margin-top:0.75rem;max-width:260px}
        .footer-col-title{font-size:0.72rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:rgba(245,237,224,0.7);margin-bottom:1.25rem}
        .footer-link{display:block;font-size:0.82rem;color:rgba(245,237,224,0.45);text-decoration:none;margin-bottom:0.7rem;transition:color 0.2s}
        .footer-link:hover{color:#c17f3a}
        .footer-bottom{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
        .footer-copy{font-size:0.75rem;color:rgba(245,237,224,0.3)}
        .footer-payments{font-size:0.7rem;color:rgba(245,237,224,0.3)}
      `}</style>

      <div className="home-page">
        {/* HERO */}
        <section className="hero">
          <div className="hero-inner">
            <div>
              <div className="hero-tag">New Season</div>
              <h1 className="hero-title">Discover Your<br />Perfect Style</h1>
              <p className="hero-sub">Shop the latest trends with up to 60% off on premium fashion and lifestyle products.</p>
              <div className="hero-actions">
                <Link className="btn-dark" to="/products">Shop Now →</Link>
              </div>
              <div className="hero-stats">
                {[{val:'50K+',lbl:'Products'},{val:'1.2M+',lbl:'Buyers'},{val:'4.9★',lbl:'Rating'}].map((s,i) => (
                  <div key={i}>
                    <div className="hero-stat-val">{s.val}</div>
                    <div className="hero-stat-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hero-visual">
              {[{e:'🎧',n:'Headphones',p:'₹4,999'},{e:'👜',n:'Leather Bag',p:'₹2,499'},{e:'🌿',n:'Organic Care',p:'₹1,299'},{e:'⌚',n:'Smart Watch',p:'₹8,999'}].map((p,i)=>(
                <div className="hero-pcard" key={i}>
                  <div className="hero-pc-emoji">{p.e}</div>
                  <div className="hero-pc-name">{p.n}</div>
                  <div className="hero-pc-price">{p.p}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <div className="trust-bar">
          <div className="trust-inner">
            {[{i:'🚚',m:'Free Delivery',s:'Orders above ₹499'},{i:'🔄',m:'Easy Returns',s:'30-day policy'},{i:'🔒',m:'Secure Payment',s:'100% protected'},{i:'🎧',m:'24/7 Support',s:'Always here'}].map((t,i)=>(
              <div className="trust-item" key={i}>
                <span className="trust-icon">{t.i}</span>
                <div><div className="trust-main">{t.m}</div><div className="trust-sub">{t.s}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="section">
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Browse By</div>
              <div className="section-title">Shop by Category</div>
            </div>
            <Link className="section-link" to="/products">View All →</Link>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map((cat,i)=>(
              <Link className="cat-card" key={i} to={`/products?category=${cat.name}`} style={{'--cc': cat.color + '99'}}>
                <span className="cat-emoji">{cat.emoji}</span>
                <span className="cat-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* FEATURED PRODUCTS */}
        <div className="section" style={{paddingTop:0}}>
          <div className="section-header">
            <div>
              <div className="section-eyebrow">Hand Picked</div>
              <div className="section-title">Featured Products</div>
            </div>
            <Link className="section-link" to="/products">View All →</Link>
          </div>
          {loading ? (
            <div className="skeleton-grid">
              {[1,2,3,4].map(i=>(
                <div className="skeleton-card" key={i}>
                  <div className="skeleton-img"/>
                  <div className="skeleton-body">
                    <div className="skeleton-line" style={{width:'60%'}}/>
                    <div className="skeleton-line" style={{width:'80%'}}/>
                    <div className="skeleton-line" style={{width:'40%'}}/>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featured.map((p,i)=><ProductCard key={p._id} product={p} index={i}/>)}
            </div>
          )}
        </div>

        {/* PROMO BANNER */}
        <div className="banner-wrap">
          <div>
            <div className="banner-tag">Limited Time Offer</div>
            <div className="banner-title">Up to 70% Off<br />on Top Brands</div>
            <p className="banner-sub">Explore thousands of deals across fashion, electronics, home & more.</p>
          </div>
          <Link className="banner-cta" to="/products">Shop the Sale →</Link>
        </div>

        {/* FOOTER */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-top">
              <div>
                <div className="footer-brand">Shop<span>EZ</span></div>
                <p className="footer-tagline">Your one-stop destination for effortless online shopping. Premium products, unbeatable prices.</p>
              </div>
              {[{t:'Company',l:['About','Careers','Press','Blog']},{t:'Support',l:['Help Center','Returns','Track Order','Contact']},{t:'Sell on ShopEZ',l:['Seller Portal','Policies','Resources','FAQ']}].map((col,i)=>(
                <div key={i}>
                  <div className="footer-col-title">{col.t}</div>
                  {col.l.map((l,j)=><a key={j} href="#" className="footer-link">{l}</a>)}
                </div>
              ))}
            </div>
            <div className="footer-bottom">
              <div className="footer-copy">© 2025 ShopEZ. All rights reserved.</div>
              <div className="footer-payments">Visa · Mastercard · UPI · Net Banking</div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
