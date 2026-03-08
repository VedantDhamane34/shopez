import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getAllProducts, getProductsByCategory } from '../services/api';

const CATEGORIES = ['All', 'Men', 'Women', 'Kids', 'Electronics', 'Home', 'Sports'];
const GENDERS    = ['All', 'male', 'female', 'unisex', 'kids'];
const SORT_OPTS  = ['Default', 'Price: Low to High', 'Price: High to Low', 'Most Discounted'];

export default function Products() {
  const [searchParams] = useSearchParams();
  const initCat = searchParams.get('category') || 'All';

  const [allProducts, setAllProducts] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [search,      setSearch]      = useState('');
  const [category,    setCategory]    = useState(initCat);
  const [gender,      setGender]      = useState('All');
  const [sortBy,      setSortBy]      = useState('Default');
  const [maxPrice,    setMaxPrice]    = useState(100000);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); setError('');
      try {
        const { data } = await getAllProducts();
        setAllProducts(data);
      } catch {
        setError('Failed to load products. Is the server running?');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // CLIENT-SIDE FILTERING (all data loaded once)
  let filtered = [...allProducts];
  if (category !== 'All') filtered = filtered.filter(p => p.category === category);
  if (gender   !== 'All') filtered = filtered.filter(p => p.gender   === gender);
  if (search)             filtered = filtered.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));
  filtered = filtered.filter(p => p.price <= maxPrice);
  if (sortBy === 'Price: Low to High')  filtered.sort((a,b) => a.price - b.price);
  if (sortBy === 'Price: High to Low')  filtered.sort((a,b) => b.price - a.price);
  if (sortBy === 'Most Discounted')     filtered.sort((a,b) => (b.discount||0) - (a.discount||0));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Jost:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        .products-page{min-height:100vh;background:#fefcf7;padding-top:68px;font-family:'Jost',sans-serif}
        .products-header{background:linear-gradient(135deg,#f5ede0,#fefcf7);padding:3rem 3rem 2.5rem;border-bottom:1px solid rgba(180,155,120,0.15)}
        .products-header-inner{max-width:1400px;margin:0 auto;display:flex;align-items:flex-end;justify-content:space-between;gap:2rem;flex-wrap:wrap}
        .page-eyebrow{font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#c17f3a;margin-bottom:0.5rem;display:flex;align-items:center;gap:8px}
        .page-eyebrow::before{content:'';width:20px;height:1.5px;background:#c17f3a}
        .page-title{font-family:'Playfair Display',serif;font-weight:700;font-size:clamp(1.6rem,3vw,2.5rem);color:#1a1208;letter-spacing:-0.03em}
        .search-wrap{display:flex;align-items:center;background:#fff;border:1.5px solid rgba(180,155,120,0.3);border-radius:8px;padding:0 1rem;gap:0.5rem;width:300px;transition:border-color 0.2s}
        .search-wrap:focus-within{border-color:#c17f3a}
        .search-wrap svg{width:16px;height:16px;color:#b4a08a;flex-shrink:0}
        .search-input{border:none;outline:none;background:transparent;padding:11px 0;font-family:'Jost',sans-serif;font-size:0.85rem;color:#1a1208;width:100%}
        .search-input::placeholder{color:#c0b0a0}
        .products-layout{max-width:1400px;margin:0 auto;padding:2.5rem 3rem;display:grid;grid-template-columns:230px 1fr;gap:2.5rem;align-items:start}
        @media(max-width:900px){.products-layout{grid-template-columns:1fr;padding:1.5rem}.sidebar{display:none}}
        .sidebar{position:sticky;top:90px}
        .filter-section{margin-bottom:2rem}
        .filter-title{font-size:0.68rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#8a7a6a;margin-bottom:0.85rem;padding-bottom:0.5rem;border-bottom:1px solid rgba(180,155,120,0.15)}
        .filter-btn{display:flex;align-items:center;justify-content:space-between;width:100%;text-align:left;background:none;border:none;padding:7px 10px;border-radius:6px;font-family:'Jost',sans-serif;font-size:0.83rem;color:#5a4a3a;cursor:pointer;transition:all 0.2s;margin-bottom:2px}
        .filter-btn:hover{background:rgba(193,127,58,0.07);color:#1a1208}
        .filter-btn.active{background:rgba(193,127,58,0.12);color:#c17f3a;font-weight:600}
        .price-input{width:100%;border:1.5px solid rgba(180,155,120,0.25);border-radius:7px;padding:8px 12px;font-family:'Jost',sans-serif;font-size:0.82rem;color:#1a1208;outline:none;transition:border-color 0.2s;margin-top:0.5rem}
        .price-input:focus{border-color:#c17f3a}
        .price-lbl{font-size:0.75rem;color:#8a7a6a;margin-top:4px}
        .products-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.75rem;flex-wrap:wrap;gap:1rem}
        .results-count{font-size:0.82rem;color:#8a7a6a}
        .results-count strong{color:#1a1208}
        .sort-select{border:1.5px solid rgba(180,155,120,0.25);border-radius:7px;padding:8px 12px;font-family:'Jost',sans-serif;font-size:0.8rem;color:#5a4a3a;background:#fff;outline:none;cursor:pointer;transition:border-color 0.2s}
        .sort-select:focus{border-color:#c17f3a}
        .products-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.25rem}
        .error-banner{background:rgba(224,90,106,0.07);border:1px solid rgba(224,90,106,0.2);border-radius:12px;padding:1.5rem;text-align:center;color:#c04a5a;font-size:0.88rem}
        .no-results{text-align:center;padding:5rem 2rem;color:#b4a08a}
        .no-results-emoji{font-size:3rem;margin-bottom:1rem}
        .no-results-title{font-family:'Playfair Display',serif;font-size:1.3rem;color:#5a4a3a;margin-bottom:0.5rem}
        .skeleton-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.25rem}
        .sk-card{background:#fff;border-radius:16px;overflow:hidden;border:1px solid rgba(180,155,120,0.1)}
        .sk-img{height:220px;background:linear-gradient(90deg,rgba(180,155,120,0.1) 25%,rgba(180,155,120,0.2) 50%,rgba(180,155,120,0.1) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
        .sk-body{padding:1.2rem}
        .sk-line{height:11px;border-radius:6px;background:linear-gradient(90deg,rgba(180,155,120,0.1) 25%,rgba(180,155,120,0.2) 50%,rgba(180,155,120,0.1) 75%);background-size:200% 100%;animation:shimmer 1.5s infinite;margin-bottom:0.7rem}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      `}</style>

      <div className="products-page">
        <div className="products-header">
          <div className="products-header-inner">
            <div>
              <div className="page-eyebrow">Catalogue</div>
              <div className="page-title">All Products</div>
            </div>
            <div className="search-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
              <input className="search-input" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="products-layout">
          <aside className="sidebar">
            <div className="filter-section">
              <div className="filter-title">Category</div>
              {CATEGORIES.map(cat => (
                <button key={cat} className={`filter-btn ${category===cat?'active':''}`} onClick={()=>setCategory(cat)}>{cat}</button>
              ))}
            </div>
            <div className="filter-section">
              <div className="filter-title">Gender</div>
              {GENDERS.map(g => (
                <button key={g} className={`filter-btn ${gender===g?'active':''}`} onClick={()=>setGender(g)} style={{textTransform:'capitalize'}}>{g}</button>
              ))}
            </div>
            <div className="filter-section">
              <div className="filter-title">Max Price</div>
              <input className="price-input" type="number" value={maxPrice} onChange={e=>setMaxPrice(+e.target.value)} placeholder="Max ₹" />
              <div className="price-lbl">Up to ₹{maxPrice.toLocaleString()}</div>
            </div>
          </aside>

          <div>
            <div className="products-toolbar">
              <div className="results-count">Showing <strong>{filtered.length}</strong> of {allProducts.length} products</div>
              <select className="sort-select" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
                {SORT_OPTS.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            {error && <div className="error-banner">{error}</div>}

            {loading ? (
              <div className="skeleton-grid">
                {[1,2,3,4,5,6].map(i=>(
                  <div className="sk-card" key={i}>
                    <div className="sk-img"/>
                    <div className="sk-body">
                      <div className="sk-line" style={{width:'60%'}}/>
                      <div className="sk-line" style={{width:'80%'}}/>
                      <div className="sk-line" style={{width:'40%'}}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="no-results">
                <div className="no-results-emoji">🔍</div>
                <div className="no-results-title">{error ? 'Error loading products' : 'No products found'}</div>
                <div style={{fontSize:'0.85rem'}}>Try adjusting your filters or search</div>
              </div>
            ) : (
              <div className="products-grid">
                {filtered.map((p,i)=><ProductCard key={p._id} product={p} index={i}/>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
