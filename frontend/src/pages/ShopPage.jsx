import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiSliders, FiGrid, FiList, FiPackage } from 'react-icons/fi';
import ProductCard from '../components/products/ProductCard';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [filters, setFilters] = useState({ category: '', minPrice: '', maxPrice: '', search: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const searchRef = useRef(null);

  const categories = ['All', 'Whole Spices', 'Ground Spices', 'Spice Blends', 'Herbs', 'Other'];

  const categoryEmojis = {
    'All': '✦',
    'Whole Spices': '🌰',
    'Ground Spices': '🫙',
    'Spice Blends': '🧂',
    'Herbs': '🌿',
    'Other': '📦',
  };

  useEffect(() => {
    fetchProducts();
  }, [filters.category, filters.minPrice, filters.maxPrice, filters.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search) params.search = filters.search;
      const response = await productService.getAllProducts(params);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setFilters(prev => ({ ...prev, category: cat === 'All' ? '' : cat }));
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', search: '' });
    setActiveCategory('All');
  };

  const hasActiveFilters = filters.minPrice || filters.maxPrice || (filters.category && filters.category !== 'All') || filters.search;

  return (
    <div className="sp">

      {/* ── Hero Banner ── */}
      <div className="sp__hero">
        <div className="sp__hero-bg" />
        <div className="sp__container sp__hero-content">
          <motion.span
            className="sp__eyebrow"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            ✦ Straight from Sri Lanka
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Our Spice Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover the finest authentic Sri Lankan spices
          </motion.p>
        </div>
      </div>

      <div className="sp__container sp__body">

        {/* ── Category Pills ── */}
        <div className="sp__cats">
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              className={`sp__cat-pill ${activeCategory === cat ? 'sp__cat-pill--active' : ''}`}
              onClick={() => handleCategoryClick(cat)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="sp__cat-emoji">{categoryEmojis[cat]}</span>
              {cat}
            </motion.button>
          ))}
        </div>

        {/* ── Toolbar ── */}
        <div className="sp__toolbar">
          {/* Search */}
          <div className="sp__search-wrap" ref={searchRef}>
            <FiSearch className="sp__search-icon" />
            <input
              type="text"
              name="search"
              placeholder="Search spices..."
              value={filters.search}
              onChange={handleFilterChange}
              className="sp__search-input"
            />
            {filters.search && (
              <button
                className="sp__search-clear"
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              >
                <FiX />
              </button>
            )}
          </div>

          <div className="sp__toolbar-right">
            {/* Results count */}
            {!loading && (
              <span className="sp__count">
                {products.length} product{products.length !== 1 ? 's' : ''}
              </span>
            )}

            {/* View toggle */}
            <div className="sp__view-toggle">
              <button
                className={`sp__view-btn ${viewMode === 'grid' ? 'sp__view-btn--active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid view"
              >
                <FiGrid />
              </button>
              <button
                className={`sp__view-btn ${viewMode === 'list' ? 'sp__view-btn--active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List view"
              >
                <FiList />
              </button>
            </div>

            {/* Filter toggle */}
            <button
              className={`sp__filter-btn ${showFilters ? 'sp__filter-btn--active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FiSliders />
              <span>Filters</span>
              {hasActiveFilters && <span className="sp__filter-dot" />}
            </button>
          </div>
        </div>

        {/* ── Filter Panel ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              className="sp__filter-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="sp__filter-inner">
                <div className="sp__filter-group">
                  <label className="sp__filter-label">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="sp__select"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="sp__filter-group">
                  <label className="sp__filter-label">Min Price ($)</label>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="sp__input"
                  />
                </div>

                <div className="sp__filter-group">
                  <label className="sp__filter-label">Max Price ($)</label>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Any"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="sp__input"
                  />
                </div>

                <div className="sp__filter-actions">
                  <button className="sp__clear-btn" onClick={clearFilters}>
                    <FiX /> Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Active Filter Tags ── */}
        {hasActiveFilters && (
          <motion.div
            className="sp__active-filters"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {filters.search && (
              <span className="sp__tag">
                Search: "{filters.search}"
                <button onClick={() => setFilters(p => ({ ...p, search: '' }))}><FiX /></button>
              </span>
            )}
            {filters.category && (
              <span className="sp__tag">
                {filters.category}
                <button onClick={() => { setFilters(p => ({ ...p, category: '' })); setActiveCategory('All'); }}><FiX /></button>
              </span>
            )}
            {filters.minPrice && (
              <span className="sp__tag">
                Min: ${filters.minPrice}
                <button onClick={() => setFilters(p => ({ ...p, minPrice: '' }))}><FiX /></button>
              </span>
            )}
            {filters.maxPrice && (
              <span className="sp__tag">
                Max: ${filters.maxPrice}
                <button onClick={() => setFilters(p => ({ ...p, maxPrice: '' }))}><FiX /></button>
              </span>
            )}
            <button className="sp__tag sp__tag--clear" onClick={clearFilters}>Clear all</button>
          </motion.div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <Loader message="Loading spices..." />
        ) : products.length === 0 ? (
          <motion.div
            className="sp__empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="sp__empty-icon"><FiPackage /></div>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search term</p>
            <button className="sp__empty-btn" onClick={clearFilters}>Clear Filters</button>
          </motion.div>
        ) : (
          <motion.div
            className={`sp__grid ${viewMode === 'list' ? 'sp__grid--list' : ''}`}
            layout
          >
            {products.map((product, i) => (
              <motion.div
                key={product.ProductID || product._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.06, 0.4) }}
                layout
              >
                <ProductCard product={product} listView={viewMode === 'list'} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <style>{`
        .sp {
          --amber: #C8872A;
          --amber-d: #A06820;
          --amber-l: #F5A94A;
          --dark: #1A1208;
          --cream: #FDF8F0;
          min-height: 100vh;
          background: #f9f4ec;
          font-family: sans-serif;
        }

        .sp__container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Hero ── */
        .sp__hero {
          position: relative;
          background: linear-gradient(135deg, #1A1208 0%, #3D2B0F 60%, #5a3d18 100%);
          padding: 64px 24px 56px;
          text-align: center;
          overflow: hidden;
        }
        .sp__hero-bg {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 70% 50%, rgba(200,135,42,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .sp__hero-content { position: relative; z-index: 1; }
        .sp__eyebrow {
          display: inline-block;
          font-size: 0.75rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--amber-l);
          font-weight: 600;
          margin-bottom: 12px;
        }
        .sp__hero h1 {
          font-size: clamp(2rem, 5vw, 3.2rem);
          color: #fff;
          font-family: Georgia, serif;
          margin: 0 0 10px;
        }
        .sp__hero p {
          color: rgba(255,255,255,0.65);
          font-size: 1.05rem;
          margin: 0;
        }

        /* ── Body ── */
        .sp__body { padding: 40px 24px 80px; }

        /* ── Category Pills ── */
        .sp__cats {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 28px;
        }
        .sp__cat-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: 50px;
          font-size: 0.88rem;
          font-weight: 500;
          cursor: pointer;
          border: 1.5px solid rgba(200,135,42,0.25);
          background: #fff;
          color: #6b5c44;
          transition: all 0.2s;
          font-family: sans-serif;
        }
        .sp__cat-pill:hover { border-color: var(--amber); color: var(--amber-d); background: rgba(200,135,42,0.06); }
        .sp__cat-pill--active { background: linear-gradient(135deg, var(--amber), var(--amber-d)); color: #fff; border-color: transparent; box-shadow: 0 4px 14px rgba(200,135,42,0.35); }
        .sp__cat-emoji { font-size: 0.9rem; }

        /* ── Toolbar ── */
        .sp__toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }
        .sp__search-wrap {
          flex: 1;
          min-width: 200px;
          position: relative;
        }
        .sp__search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #a08060;
          font-size: 1rem;
          pointer-events: none;
        }
        .sp__search-input {
          width: 100%;
          padding: 12px 44px;
          border: 1.5px solid rgba(200,135,42,0.2);
          border-radius: 50px;
          font-size: 0.9rem;
          background: #fff;
          color: var(--dark);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: sans-serif;
          box-sizing: border-box;
        }
        .sp__search-input:focus { border-color: var(--amber); box-shadow: 0 0 0 3px rgba(200,135,42,0.12); }
        .sp__search-input::placeholder { color: #b0956e; }
        .sp__search-clear {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #a08060;
          cursor: pointer;
          display: flex;
          font-size: 0.95rem;
          padding: 4px;
        }
        .sp__search-clear:hover { color: var(--amber-d); }

        .sp__toolbar-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }

        .sp__count {
          font-size: 0.85rem;
          color: #8a7055;
          white-space: nowrap;
          padding: 0 4px;
        }

        .sp__view-toggle {
          display: flex;
          background: #fff;
          border: 1.5px solid rgba(200,135,42,0.2);
          border-radius: 10px;
          overflow: hidden;
        }
        .sp__view-btn {
          padding: 9px 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: #a08060;
          font-size: 1rem;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }
        .sp__view-btn:hover { color: var(--amber-d); }
        .sp__view-btn--active { background: var(--amber); color: #fff; }

        .sp__filter-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 18px;
          border-radius: 50px;
          border: 1.5px solid rgba(200,135,42,0.25);
          background: #fff;
          color: #6b5c44;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          position: relative;
          transition: all 0.2s;
          font-family: sans-serif;
        }
        .sp__filter-btn:hover { border-color: var(--amber); color: var(--amber-d); }
        .sp__filter-btn--active { background: var(--amber); color: #fff; border-color: var(--amber); }
        .sp__filter-dot {
          position: absolute;
          top: 7px; right: 7px;
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #e74c3c;
          border: 1.5px solid #fff;
        }

        /* ── Filter Panel ── */
        .sp__filter-panel { overflow: hidden; margin-bottom: 16px; }
        .sp__filter-inner {
          background: #fff;
          border: 1.5px solid rgba(200,135,42,0.15);
          border-radius: 16px;
          padding: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
          align-items: end;
          box-shadow: 0 4px 20px rgba(26,18,8,0.06);
        }
        .sp__filter-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--amber);
          margin-bottom: 8px;
        }
        .sp__select, .sp__input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid rgba(200,135,42,0.2);
          border-radius: 10px;
          font-size: 0.9rem;
          color: var(--dark);
          background: #fdf8f0;
          outline: none;
          transition: border-color 0.2s;
          font-family: sans-serif;
          box-sizing: border-box;
        }
        .sp__select:focus, .sp__input:focus { border-color: var(--amber); }
        .sp__filter-actions { display: flex; align-items: flex-end; }
        .sp__clear-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 18px;
          border-radius: 10px;
          border: 1.5px solid rgba(200,135,42,0.25);
          background: none;
          color: #8a7055;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-family: sans-serif;
        }
        .sp__clear-btn:hover { background: rgba(200,135,42,0.08); color: var(--amber-d); border-color: var(--amber); }

        /* ── Active Filter Tags ── */
        .sp__active-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
          align-items: center;
        }
        .sp__tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          background: rgba(200,135,42,0.1);
          border: 1px solid rgba(200,135,42,0.25);
          color: var(--amber-d);
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .sp__tag button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--amber);
          display: flex;
          align-items: center;
          padding: 0;
          font-size: 0.8rem;
          transition: color 0.15s;
        }
        .sp__tag button:hover { color: var(--amber-d); }
        .sp__tag--clear {
          background: none;
          border-color: rgba(200,135,42,0.15);
          color: #a08060;
          cursor: pointer;
          font-family: sans-serif;
        }
        .sp__tag--clear:hover { background: rgba(200,135,42,0.08); }

        /* ── Grid ── */
        .sp__grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 24px;
          margin-top: 8px;
        }
        .sp__grid--list {
          grid-template-columns: 1fr;
          gap: 14px;
        }

        /* ── Empty State ── */
        .sp__empty {
          text-align: center;
          padding: 80px 20px;
          color: #8a7055;
        }
        .sp__empty-icon {
          width: 72px; height: 72px;
          margin: 0 auto 20px;
          background: rgba(200,135,42,0.08);
          border: 1.5px dashed rgba(200,135,42,0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          color: var(--amber);
        }
        .sp__empty h3 { font-family: Georgia, serif; font-size: 1.4rem; color: var(--dark); margin-bottom: 8px; }
        .sp__empty p { font-size: 0.95rem; margin-bottom: 28px; }
        .sp__empty-btn {
          padding: 12px 28px;
          border-radius: 50px;
          background: linear-gradient(135deg, var(--amber), var(--amber-d));
          color: #fff;
          border: none;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: sans-serif;
          box-shadow: 0 4px 16px rgba(200,135,42,0.35);
        }
        .sp__empty-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(200,135,42,0.45); }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .sp__toolbar { flex-direction: column; align-items: stretch; }
          .sp__toolbar-right { justify-content: flex-end; }
          .sp__grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 14px; }
          .sp__grid--list { grid-template-columns: 1fr; }
          .sp__filter-inner { grid-template-columns: 1fr; }
          .sp__hero { padding: 48px 16px 40px; }
        }
      `}</style>
    </div>
  );
};

export default ShopPage;