import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiEye, FiHeart, FiStar, FiCheck, FiX, FiPackage, FiTag, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

/* ─────────────────────────────────────────
   Reusable Quantity Selector
───────────────────────────────────────── */
const QuantitySelector = ({ qty, onDecrease, onIncrease, max, size = 'md' }) => (
  <div className={`qs qs--${size}`}>
    <button className="qs__btn" onClick={onDecrease} disabled={qty <= 1} aria-label="Decrease quantity">
      <FiMinus />
    </button>
    <span className="qs__count">{qty}</span>
    <button className="qs__btn" onClick={onIncrease} disabled={qty >= max} aria-label="Increase quantity">
      <FiPlus />
    </button>
    <style>{`
      .qs { display: inline-flex; align-items: center; border-radius: 50px; border: 1.5px solid rgba(200,135,42,0.25); background: rgba(200,135,42,0.05); overflow: hidden; font-family: sans-serif; }
      .qs__btn { display: flex; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; color: #A06820; transition: background 0.18s, color 0.18s; flex-shrink: 0; }
      .qs__btn:disabled { color: #ccc; cursor: not-allowed; }
      .qs__btn:not(:disabled):hover { background: rgba(200,135,42,0.15); color: #C8872A; }
      .qs--sm .qs__btn { width: 28px; height: 28px; font-size: 0.75rem; }
      .qs--sm .qs__count { min-width: 22px; font-size: 0.82rem; font-weight: 700; text-align: center; color: #1A1208; }
      .qs--md .qs__btn { width: 38px; height: 38px; font-size: 0.95rem; }
      .qs--md .qs__count { min-width: 34px; font-size: 1.05rem; font-weight: 700; text-align: center; color: #1A1208; }
    `}</style>
  </div>
);

/* ─────────────────────────────────────────
   Quick View Modal
───────────────────────────────────────── */
const QuickViewModal = ({ productId, onClose }) => {
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  React.useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`http://localhost:5000/api/products/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load product');
        return res.json();
      })
      .then(data => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [productId]);

  const handleAddToCart = () => {
    if (!product || product.StockQuantity <= 0 || added) return;
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const inStock = product?.StockQuantity > 0;
  const lowStock = product?.StockQuantity > 0 && product?.StockQuantity <= 5;

  return (
    <motion.div
      className="qv-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="qv-modal"
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        <button className="qv-close" onClick={onClose} aria-label="Close"><FiX /></button>

        {loading && (
          <div className="qv-state">
            <div className="qv-spinner" />
            <p>Loading product…</p>
          </div>
        )}
        {error && (
          <div className="qv-state qv-state--error"><p>⚠ {error}</p></div>
        )}

        {product && !loading && (
          <div className="qv-body">
            {/* Image */}
            <div className="qv-img-wrap">
              <img
                src={product.ImageURL || '/default-product.jpg'}
                alt={product.ProductName}
                className="qv-img"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
              <div className="qv-img-fallback">🌶️</div>
              {!inStock && <span className="qv-badge qv-badge--out">Out of Stock</span>}
              {lowStock && <span className="qv-badge qv-badge--low">Only {product.StockQuantity} left</span>}
            </div>

            {/* Details */}
            <div className="qv-details">
              <span className="qv-cat"><FiTag /> {product.Category || 'Spice'}</span>

              <h2 className="qv-name">{product.ProductName}</h2>

              <div className="qv-price-row">
                <p className="qv-price">Rs. {Number(product.Price).toLocaleString()}</p>
                {qty > 1 && (
                  <p className="qv-subtotal">
                    Total: Rs. {(Number(product.Price) * qty).toLocaleString()}
                  </p>
                )}
              </div>

              {product.Description && <p className="qv-desc">{product.Description}</p>}

              <div className="qv-stock-row">
                <FiPackage />
                {inStock ? (
                  <span className={lowStock ? 'qv-stock--low' : 'qv-stock--in'}>
                    {lowStock ? `⚠ Only ${product.StockQuantity} items left` : `✓ In Stock (${product.StockQuantity} available)`}
                  </span>
                ) : (
                  <span className="qv-stock--out">✕ Out of Stock</span>
                )}
              </div>

              {/* Quantity selector */}
              {inStock && (
                <div className="qv-qty-wrap">
                  <span className="qv-qty-label">Quantity</span>
                  <QuantitySelector
                    qty={qty}
                    onDecrease={() => setQty(q => Math.max(1, q - 1))}
                    onIncrease={() => setQty(q => Math.min(product.StockQuantity, q + 1))}
                    max={product.StockQuantity}
                    size="md"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="qv-actions">
                <motion.button
                  className={`qv-btn qv-btn--cart ${!inStock ? 'qv-btn--disabled' : ''} ${added ? 'qv-btn--added' : ''}`}
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  whileTap={inStock ? { scale: 0.96 } : {}}
                >
                  {added
                    ? <><FiCheck /> Added{qty > 1 ? ` ${qty} items` : ''} to Cart!</>
                    : <><FiShoppingCart /> Add{qty > 1 ? ` ${qty} items` : ''} to Cart</>
                  }
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      <style>{`
        .qv-backdrop {
          position: fixed; inset: 0;
          background: rgba(26, 18, 8, 0.6);
          backdrop-filter: blur(6px);
          z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          padding: 16px;
        }
        .qv-modal {
          background: #fff; border-radius: 24px;
          width: 100%; max-width: 820px; max-height: 90vh;
          overflow: hidden; position: relative;
          box-shadow: 0 32px 80px rgba(26,18,8,0.25);
          font-family: sans-serif;
        }
        .qv-close {
          position: absolute; top: 14px; right: 14px; z-index: 10;
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.92); backdrop-filter: blur(4px);
          border: 1.5px solid rgba(200,135,42,0.18); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; color: #7a6548; transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .qv-close:hover { background: #C8872A; color: #fff; border-color: #C8872A; transform: scale(1.08); }

        .qv-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 40px; gap: 16px; color: #7a6548; }
        .qv-state--error { color: #e74c3c; }
        .qv-spinner { width: 36px; height: 36px; border: 3px solid rgba(200,135,42,0.2); border-top-color: #C8872A; border-radius: 50%; animation: qv-spin 0.8s linear infinite; }
        @keyframes qv-spin { to { transform: rotate(360deg); } }

        .qv-body { display: grid; grid-template-columns: 1fr 1fr; min-height: 0; }

        .qv-img-wrap { position: relative; background: linear-gradient(135deg, #fdf3e3, #f5e5cc); overflow: hidden; min-height: 380px; }
        .qv-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s ease; }
        .qv-modal:hover .qv-img { transform: scale(1.04); }
        .qv-img-fallback { display: none; position: absolute; inset: 0; align-items: center; justify-content: center; font-size: 5rem; color: rgba(200,135,42,0.35); }
        .qv-badge { position: absolute; top: 14px; left: 14px; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.5px; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; }
        .qv-badge--out { background: #e74c3c; color: #fff; }
        .qv-badge--low { background: rgba(230,126,34,0.9); color: #fff; }

        .qv-details { padding: 36px 32px 32px; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; max-height: 90vh; }
        .qv-cat { display: inline-flex; align-items: center; gap: 5px; font-size: 0.7rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #C8872A; }
        .qv-name { font-size: 1.55rem; font-weight: 800; color: #1A1208; line-height: 1.25; font-family: Georgia, serif; margin: 0; }
        .qv-stars { display: flex; align-items: center; gap: 3px; }
        .qv-star--filled { color: #C8872A; fill: #C8872A; font-size: 0.85rem; }
        .qv-star--empty { color: #ddd; font-size: 0.85rem; }
        .qv-rating-label { font-size: 0.78rem; color: #7a6548; margin-left: 6px; font-weight: 600; }

        .qv-price-row { display: flex; flex-direction: column; gap: 4px; }
        .qv-price { font-size: 1.7rem; font-weight: 900; color: #A06820; font-family: Georgia, serif; margin: 0; }
        .qv-subtotal { font-size: 0.9rem; font-weight: 700; color: #C8872A; margin: 0; }

        .qv-desc { font-size: 0.9rem; color: #5a4a38; line-height: 1.7; margin: 0; }

        .qv-stock-row { display: flex; align-items: center; gap: 7px; font-size: 0.82rem; font-weight: 600; color: #7a6548; padding: 10px 14px; background: rgba(200,135,42,0.06); border-radius: 10px; border: 1px solid rgba(200,135,42,0.1); }
        .qv-stock--in { color: #4caf7d; }
        .qv-stock--low { color: #e67e22; }
        .qv-stock--out { color: #e74c3c; }

        .qv-qty-wrap { display: flex; align-items: center; gap: 14px; padding: 4px 0; }
        .qv-qty-label { font-size: 0.8rem; font-weight: 700; color: #7a6548; text-transform: uppercase; letter-spacing: 1px; }

        .qv-actions { display: flex; flex-direction: column; gap: 10px; margin-top: auto; padding-top: 8px; }
        .qv-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 13px 20px; border-radius: 50px; font-size: 0.9rem; font-weight: 700; cursor: pointer; border: none; transition: all 0.22s; text-decoration: none; font-family: sans-serif; }
        .qv-btn--cart { background: linear-gradient(135deg, #C8872A, #A06820); color: #fff; box-shadow: 0 4px 18px rgba(200,135,42,0.4); }
        .qv-btn--cart:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(200,135,42,0.5); }
        .qv-btn--added { background: linear-gradient(135deg, #4caf7d, #3a9468); box-shadow: 0 4px 18px rgba(76,175,125,0.4); }
        .qv-btn--disabled { background: #e0d5c5; color: #b0a090; cursor: not-allowed; box-shadow: none; }
        .qv-btn--disabled:hover { transform: none; box-shadow: none; }
        .qv-btn--view { background: rgba(200,135,42,0.08); color: #A06820; border: 2px solid rgba(200,135,42,0.25); }
        .qv-btn--view:hover { background: rgba(200,135,42,0.15); border-color: #C8872A; }

        @media (max-width: 620px) {
          .qv-body { grid-template-columns: 1fr; }
          .qv-img-wrap { min-height: 240px; }
          .qv-details { padding: 24px 20px; }
          .qv-name { font-size: 1.25rem; }
        }
      `}</style>
    </motion.div>
  );
};

/* ─────────────────────────────────────────
   Product Card
───────────────────────────────────────── */
const ProductCard = ({ product, listView = false }) => {
  const { addToCart } = useCart();
  const [wished, setWished] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [quickViewId, setQuickViewId] = useState(null);

  const handleAddToCart = () => {
    if (product.StockQuantity <= 0 || added) return;
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => { setAdded(false); setQty(1); }, 2000);
  };

  const inStock = product.StockQuantity > 0;
  const lowStock = product.StockQuantity > 0 && product.StockQuantity <= 5;

  return (
    <>
      <motion.div
        className={`pc ${listView ? 'pc--list' : ''}`}
        whileHover={{ y: listView ? 0 : -6 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        layout
      >
        {/* ── Image ── */}
        <div className="pc__img-wrap">
          <img
            src={product.ImageURL || '/default-product.jpg'}
            alt={product.ProductName}
            className="pc__img"
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
          />
          <div className="pc__img-fallback">🌶️</div>

          <div className="pc__badges">
            {!inStock && <span className="pc__badge pc__badge--out">Out of Stock</span>}
            {lowStock && <span className="pc__badge pc__badge--low">Only {product.StockQuantity} left</span>}
          </div>

          <div className="pc__overlay">
            <button className="pc__overlay-btn" onClick={() => setQuickViewId(product.ProductID)}>
              <FiEye /> Quick View
            </button>
          </div>
        </div>

        {/* ── Info ── */}
        <div className="pc__info">
          <div className="pc__meta">
            <span className="pc__cat">{product.Category || 'Spice'}</span>
          </div>

          <h3 className="pc__name">{product.ProductName}</h3>

          {listView && product.Description && (
            <p className="pc__desc">{product.Description}</p>
          )}

          <div className="pc__footer">
            <div className="pc__price-wrap">
              <span className="pc__price">Rs. {Number(product.Price).toLocaleString()}</span>
              {inStock ? (
                <span className={`pc__stock ${lowStock ? 'pc__stock--low' : ''}`}>
                  {lowStock ? `⚠ ${product.StockQuantity} left` : `✓ In Stock`}
                </span>
              ) : (
                <span className="pc__stock pc__stock--out">✕ Out of Stock</span>
              )}
            </div>

            <div className="pc__actions">
              {/* Eye icon */}
              <button className="pc__btn pc__btn--view" onClick={() => setQuickViewId(product.ProductID)} aria-label="Quick View" title="Quick View">
                <FiEye />
              </button>

              {/* Quantity + Add */}
              {inStock ? (
                added ? (
                  <motion.div className="pc__btn pc__btn--added" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                    <FiCheck /> Added{qty > 1 ? ` ×${qty}` : ''}!
                  </motion.div>
                ) : (
                  <div className="pc__qty-cart">
                    <QuantitySelector
                      qty={qty}
                      onDecrease={() => setQty(q => Math.max(1, q - 1))}
                      onIncrease={() => setQty(q => Math.min(product.StockQuantity, q + 1))}
                      max={product.StockQuantity}
                      size="sm"
                    />
                    <motion.button
                      className="pc__btn pc__btn--cart"
                      onClick={handleAddToCart}
                      whileTap={{ scale: 0.94 }}
                      title={listView ? '' : `Add ${qty > 1 ? qty + ' items' : ''} to cart`}
                    >
                      <FiShoppingCart />
                      {listView && <span>Add{qty > 1 ? ` ×${qty}` : ''}</span>}
                    </motion.button>
                  </div>
                )
              ) : (
                <button className="pc__btn pc__btn--disabled" disabled>
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>

        <style>{`
          .pc {
            --amber: #C8872A; --amber-d: #A06820; --amber-l: #F5A94A; --dark: #1A1208;
            background: #fff; border-radius: 18px; overflow: hidden;
            border: 1px solid rgba(200,135,42,0.1);
            box-shadow: 0 2px 12px rgba(26,18,8,0.06);
            transition: box-shadow 0.3s; font-family: sans-serif;
            display: flex; flex-direction: column;
          }
          .pc:hover { box-shadow: 0 12px 36px rgba(26,18,8,0.13); }

          .pc--list { flex-direction: row; border-radius: 14px; align-items: stretch; }
          .pc--list .pc__img-wrap { width: 180px; flex-shrink: 0; height: auto; border-radius: 0; }
          .pc--list .pc__info { padding: 20px 24px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
          .pc--list .pc__overlay { display: none; }

          .pc__img-wrap { position: relative; height: 210px; background: linear-gradient(135deg, #fdf3e3, #f5e5cc); overflow: hidden; flex-shrink: 0; }
          .pc__img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.45s ease; display: block; }
          .pc:hover .pc__img { transform: scale(1.08); }
          .pc__img-fallback { display: none; position: absolute; inset: 0; align-items: center; justify-content: center; font-size: 3rem; color: rgba(200,135,42,0.4); }

          .pc__badges { position: absolute; top: 12px; left: 12px; display: flex; flex-direction: column; gap: 5px; }
          .pc__badge { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.5px; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; }
          .pc__badge--out { background: #e74c3c; color: #fff; }
          .pc__badge--low { background: rgba(230,126,34,0.9); color: #fff; }

          .pc__wish { position: absolute; top: 12px; right: 12px; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #c0a080; font-size: 0.95rem; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
          .pc__wish:hover { background: #fff; color: #e74c3c; transform: scale(1.1); }
          .pc__wish--active { color: #e74c3c; }
          .pc__wish--active svg { fill: #e74c3c; }

          .pc__overlay { position: absolute; inset: 0; background: rgba(26,18,8,0.45); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
          .pc:hover .pc__overlay { opacity: 1; }
          .pc__overlay-btn { display: flex; align-items: center; gap: 7px; padding: 10px 20px; border-radius: 50px; background: rgba(255,255,255,0.95); color: #A06820; border: none; cursor: pointer; font-size: 0.85rem; font-weight: 700; transform: translateY(10px); transition: transform 0.3s, background 0.2s, color 0.2s; box-shadow: 0 4px 16px rgba(0,0,0,0.2); font-family: sans-serif; }
          .pc:hover .pc__overlay-btn { transform: translateY(0); }
          .pc__overlay-btn:hover { background: #C8872A; color: #fff; }

          .pc__info { padding: 18px 16px 16px; flex: 1; display: flex; flex-direction: column; gap: 8px; }
          .pc__meta { display: flex; align-items: center; justify-content: space-between; }
          .pc__cat { font-size: 0.7rem; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #C8872A; }
          .pc__stars { display: flex; gap: 2px; align-items: center; }
          .pc__star--filled { color: #C8872A; font-size: 0.7rem; fill: #C8872A; }
          .pc__star--empty { color: #ddd; font-size: 0.7rem; }

          .pc__name { font-size: 1rem; font-weight: 700; color: #1A1208; line-height: 1.35; font-family: Georgia, serif; margin: 0; }
          .pc__desc { font-size: 0.87rem; color: #7a6548; line-height: 1.6; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

          .pc__footer { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; margin-top: auto; padding-top: 10px; border-top: 1px solid rgba(200,135,42,0.08); }
          .pc__price-wrap { display: flex; flex-direction: column; gap: 3px; }
          .pc__price { font-size: 1.15rem; font-weight: 800; color: #A06820; font-family: Georgia, serif; }
          .pc__stock { font-size: 0.72rem; font-weight: 600; color: #4caf7d; }
          .pc__stock--low { color: #e67e22; }
          .pc__stock--out { color: #e74c3c; }

          .pc__actions { display: flex; gap: 7px; align-items: center; }

          /* Qty + cart side by side */
          .pc__qty-cart { display: flex; align-items: center; gap: 6px; }

          .pc__btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 9px 14px; border-radius: 50px; font-size: 0.82rem; font-weight: 700; cursor: pointer; border: none; transition: all 0.22s; text-decoration: none; white-space: nowrap; font-family: sans-serif; }
          .pc__btn--view { background: rgba(200,135,42,0.09); color: #A06820; border: 1.5px solid rgba(200,135,42,0.2); padding: 9px 12px; flex-shrink: 0; }
          .pc__btn--view:hover { background: rgba(200,135,42,0.18); border-color: #C8872A; }
          .pc__btn--cart { background: linear-gradient(135deg, #C8872A, #A06820); color: #fff; box-shadow: 0 4px 14px rgba(200,135,42,0.35); padding: 9px 12px; }
          .pc__btn--cart:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,135,42,0.45); }
          .pc__btn--added { background: linear-gradient(135deg, #4caf7d, #3a9468); color: #fff; box-shadow: 0 4px 14px rgba(76,175,125,0.35); display: inline-flex; align-items: center; gap: 6px; padding: 9px 14px; border-radius: 50px; font-size: 0.82rem; font-weight: 700; white-space: nowrap; }
          .pc__btn--disabled { background: #e0d5c5; color: #b0a090; cursor: not-allowed; box-shadow: none; }
          .pc__btn--disabled:hover { transform: none; box-shadow: none; }

          @media (max-width: 480px) {
            .pc--list { flex-direction: column; }
            .pc--list .pc__img-wrap { width: 100%; height: 180px; }
            .pc--list .pc__overlay { display: flex; }
          }
        `}</style>
      </motion.div>

      <AnimatePresence>
        {quickViewId && (
          <QuickViewModal
            productId={quickViewId}
            onClose={() => setQuickViewId(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;