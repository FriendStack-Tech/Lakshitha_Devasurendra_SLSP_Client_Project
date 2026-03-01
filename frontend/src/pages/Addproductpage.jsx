import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiPackage, FiSave, FiImage, FiTag,
         FiDollarSign, FiBox, FiFileText, FiAlertCircle,
         FiCheckCircle, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

const CATEGORIES = ['Whole Spices', 'Ground Spices', 'Spice Blends', 'Herbs', 'Other'];

const CATEGORY_ICONS = {
  'Whole Spices':  '🌶️',
  'Ground Spices': '🫚',
  'Spice Blends':  '✨',
  'Herbs':         '🌿',
  'Other':         '📦',
};

const EMPTY = { ProductName:'', Category:'', Description:'', Price:'', StockQuantity:'', ImageURL:'' };

const AddProductPage = () => {
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [imgOk,   setImgOk]   = useState(false);
  const [imgErr,  setImgErr]  = useState(false);

  /* ── validation ── */
  const validate = () => {
    const e = {};
    if (!form.ProductName.trim())                              e.ProductName    = 'Product name is required';
    if (!form.Category)                                        e.Category       = 'Please select a category';
    if (!form.Price || isNaN(form.Price) || +form.Price < 0)  e.Price          = 'Enter a valid price';
    if (form.StockQuantity === '' || isNaN(form.StockQuantity) || +form.StockQuantity < 0)
                                                               e.StockQuantity  = 'Enter a valid stock quantity';
    return e;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
    if (name === 'ImageURL') { setImgOk(false); setImgErr(false); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) { setErrors(ve); return; }
    setLoading(true);
    try {
      const payload = { ...form, Price: +form.Price, StockQuantity: +form.StockQuantity };
      if (!payload.ImageURL) delete payload.ImageURL;
      await productService.createProduct(payload);
      toast.success('Product added successfully!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product');
    } finally { setLoading(false); }
  };

  /* ── image preview validation ── */
  const handleImgLoad  = () => { setImgOk(true);  setImgErr(false); };
  const handleImgError = () => { setImgOk(false); setImgErr(true);  };

  const stockNum = Number(form.StockQuantity);
  const stockStatus =
    form.StockQuantity === '' ? null
    : stockNum === 0        ? { label:'Out of Stock', color:'#EF4444', bg:'rgba(239,68,68,0.1)' }
    : stockNum < 10         ? { label:'Low Stock',    color:'#F59E0B', bg:'rgba(245,158,11,0.1)' }
    :                         { label:'In Stock',     color:'#10B981', bg:'rgba(16,185,129,0.1)' };

  return (
    <div className="ap">

      {/* ══ HERO HEADER ══ */}
      <div className="ap__hero">
        <div className="ap__hero-glow" />
        <div className="ap__hero-pattern" />
        <div className="ap__hero-inner">
          <motion.button className="ap__back-btn"
            onClick={() => navigate('/admin/dashboard')}
            whileHover={{ x:-3 }} whileTap={{ scale:0.96 }}
            initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.4 }}
          >
            <FiArrowLeft /> Back to Dashboard
          </motion.button>

          <div className="ap__hero-body">
            <motion.div
              initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
            >
              <span className="ap__eyebrow">✦ Inventory Management</span>
              <h1>Add New Product</h1>
              <p>Fill in the details below to list a new spice in your inventory</p>
            </motion.div>

            {/* quick field count chips */}
            <motion.div className="ap__hero-chips"
              initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.18 }}
            >
              {[
                { label:'Required fields', value:'4', color:'#C8872A' },
                { label:'Optional fields', value:'2', color:'rgba(255,255,255,0.45)' },
              ].map((c,i) => (
                <div key={i} className="ap__hero-chip" style={{ borderColor:`${c.color}40` }}>
                  <strong style={{ color:c.color }}>{c.value}</strong>
                  <span>{c.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ══ CONTENT ══ */}
      <div className="ap__page">
        <div className="ap__layout">

          {/* ─── MAIN FORM CARD ─── */}
          <motion.div className="ap__card"
            initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.12, duration:0.4 }}
          >
            <form onSubmit={handleSubmit} noValidate>

              {/* ── Section: Basic Info ── */}
              <div className="ap__section">
                <div className="ap__section-head">
                  <div className="ap__section-ico"><FiPackage /></div>
                  <div>
                    <h2>Basic Information</h2>
                    <p>Core product details</p>
                  </div>
                </div>

                {/* Product Name */}
                <Field label="Product Name" required error={errors.ProductName}>
                  <div className="ap__input-wrap">
                    <span className="ap__input-ico"><FiTag /></span>
                    <input
                      name="ProductName" value={form.ProductName}
                      onChange={handleChange}
                      placeholder="e.g. Ceylon Cinnamon Sticks"
                      className={`ap__input${errors.ProductName?' ap__input--err':''}`}
                      autoComplete="off"
                    />
                  </div>
                </Field>

                {/* Category */}
                <Field label="Category" required error={errors.Category}>
                  <div className="ap__cat-grid">
                    {CATEGORIES.map(cat => (
                      <motion.button
                        key={cat} type="button"
                        className={`ap__cat-btn${form.Category===cat?' ap__cat-btn--active':''}`}
                        onClick={() => { setForm(p=>({...p,Category:cat})); setErrors(p=>({...p,Category:''})); }}
                        whileHover={{ y:-2 }} whileTap={{ scale:0.96 }}
                      >
                        <span className="ap__cat-emoji">{CATEGORY_ICONS[cat]}</span>
                        <span>{cat}</span>
                        {form.Category===cat && <FiCheckCircle className="ap__cat-check" />}
                      </motion.button>
                    ))}
                  </div>
                </Field>

                {/* Description */}
                <Field label="Description" optional>
                  <div className="ap__input-wrap ap__input-wrap--ta">
                    <span className="ap__input-ico ap__input-ico--top"><FiFileText /></span>
                    <textarea
                      name="Description" value={form.Description}
                      onChange={handleChange}
                      placeholder="Describe the aroma, origin, uses…"
                      rows={4}
                      className="ap__textarea"
                    />
                  </div>
                  <p className="ap__hint">{form.Description.length}/500 characters</p>
                </Field>
              </div>

              {/* ── Section: Pricing & Stock ── */}
              <div className="ap__section ap__section--alt">
                <div className="ap__section-head">
                  <div className="ap__section-ico"><FiDollarSign /></div>
                  <div>
                    <h2>Pricing & Stock</h2>
                    <p>Set price and available quantity</p>
                  </div>
                </div>

                <div className="ap__row-2">
                  {/* Price */}
                  <Field label="Price (Rs.)" required error={errors.Price}>
                    <div className="ap__input-wrap">
                      <span className="ap__input-ico ap__input-prefix">Rs.</span>
                      <input
                        name="Price" type="number" value={form.Price}
                        onChange={handleChange}
                        placeholder="0.00" min="0" step="0.01"
                        className={`ap__input ap__input--prefix${errors.Price?' ap__input--err':''}`}
                      />
                    </div>
                    {form.Price && !errors.Price && (
                      <p className="ap__hint ap__hint--green">
                        ≈ Rs. {Number(form.Price).toLocaleString('en-LK', { minimumFractionDigits:2 })}
                      </p>
                    )}
                  </Field>

                  {/* Stock */}
                  <Field label="Stock Quantity" required error={errors.StockQuantity}>
                    <div className="ap__input-wrap">
                      <span className="ap__input-ico"><FiBox /></span>
                      <input
                        name="StockQuantity" type="number" value={form.StockQuantity}
                        onChange={handleChange}
                        placeholder="0" min="0"
                        className={`ap__input${errors.StockQuantity?' ap__input--err':''}`}
                      />
                    </div>
                    {stockStatus && (
                      <span className="ap__stock-badge" style={{ background:stockStatus.bg, color:stockStatus.color }}>
                        {stockStatus.label}
                      </span>
                    )}
                  </Field>
                </div>
              </div>

              {/* ── Section: Image ── */}
              <div className="ap__section">
                <div className="ap__section-head">
                  <div className="ap__section-ico"><FiImage /></div>
                  <div>
                    <h2>Product Image</h2>
                    <p>Provide an image URL to display on the storefront</p>
                  </div>
                </div>

                <Field label="Image URL" optional>
                  <div className="ap__input-wrap">
                    <span className="ap__input-ico"><FiImage /></span>
                    <input
                      name="ImageURL" value={form.ImageURL}
                      onChange={handleChange}
                      placeholder="https://example.com/product.jpg"
                      className={`ap__input${imgErr?' ap__input--err':''}`}
                    />
                    {form.ImageURL && (
                      <span className={`ap__img-status ${imgOk?'ap__img-status--ok':imgErr?'ap__img-status--err':''}`}>
                        {imgOk ? <FiCheckCircle /> : imgErr ? <FiX /> : null}
                      </span>
                    )}
                  </div>

                  {/* hidden img element to trigger load/error events */}
                  {form.ImageURL && (
                    <img src={form.ImageURL} alt="" style={{ display:'none' }}
                      onLoad={handleImgLoad} onError={handleImgError}
                    />
                  )}

                  {/* preview */}
                  <AnimatePresence>
                    {form.ImageURL && imgOk && (
                      <motion.div className="ap__img-preview"
                        initial={{ opacity:0, y:8, scale:0.97 }}
                        animate={{ opacity:1, y:0, scale:1 }}
                        exit={{ opacity:0, scale:0.97 }}
                      >
                        <img src={form.ImageURL} alt="Preview" />
                        <div className="ap__img-overlay">
                          <span><FiCheckCircle /> Image looks good</span>
                        </div>
                      </motion.div>
                    )}
                    {form.ImageURL && imgErr && (
                      <motion.div className="ap__img-error"
                        initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                      >
                        <FiAlertCircle /> Could not load this image URL
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Field>
              </div>

              {/* ── Footer actions ── */}
              <div className="ap__footer">
                <motion.button type="button" className="ap__btn ap__btn--ghost"
                  onClick={() => navigate('/admin/dashboard')}
                  disabled={loading}
                  whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
                >
                  Cancel
                </motion.button>
                <motion.button type="submit" className="ap__btn ap__btn--primary"
                  disabled={loading}
                  whileHover={!loading?{ scale:1.03, y:-1 }:{}}
                  whileTap={!loading?{ scale:0.97 }:{}}
                >
                  {loading
                    ? <><span className="ap__spinner" /> Saving…</>
                    : <><FiSave /> Add Product</>}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* ─── LIVE PREVIEW CARD ─── */}
          <motion.div className="ap__preview-col"
            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
            transition={{ delay:0.22 }}
          >
            <div className="ap__preview-sticky">
              <div className="ap__preview-card">
                <div className="ap__preview-head">
                  <span className="ap__preview-eyebrow">Live Preview</span>
                  <span className="ap__preview-dot" />
                </div>

                {/* product card mock */}
                <div className="ap__mock">
                  <div className="ap__mock-img">
                    {form.ImageURL && imgOk
                      ? <img src={form.ImageURL} alt={form.ProductName} />
                      : <span>🌶️</span>}
                    {form.Category && (
                      <div className="ap__mock-cat-tag">
                        {CATEGORY_ICONS[form.Category]} {form.Category}
                      </div>
                    )}
                  </div>

                  <div className="ap__mock-body">
                    <p className="ap__mock-name">
                      {form.ProductName || <span className="ap__mock-placeholder">Product Name</span>}
                    </p>
                    {form.Description && (
                      <p className="ap__mock-desc">
                        {form.Description.slice(0, 80)}{form.Description.length > 80 ? '…' : ''}
                      </p>
                    )}
                    <div className="ap__mock-footer">
                      <strong className="ap__mock-price">
                        {form.Price ? `Rs. ${Number(form.Price).toLocaleString()}` : 'Rs. —'}
                      </strong>
                      {stockStatus && (
                        <span className="ap__mock-stock" style={{ color:stockStatus.color }}>
                          {form.StockQuantity} units
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* validation checklist */}
              <div className="ap__checklist">
                <p className="ap__checklist-title">Required fields</p>
                {[
                  { label:'Product name',   ok: !!form.ProductName.trim() },
                  { label:'Category',       ok: !!form.Category },
                  { label:'Price',          ok: !!form.Price && !isNaN(form.Price) && +form.Price >= 0 },
                  { label:'Stock quantity', ok: form.StockQuantity !== '' && !isNaN(form.StockQuantity) && +form.StockQuantity >= 0 },
                ].map((item, i) => (
                  <div key={i} className="ap__check-item">
                    <span className={`ap__check-dot ${item.ok?'ap__check-dot--ok':''}`}>
                      {item.ok ? <FiCheckCircle /> : <span />}
                    </span>
                    <span className={item.ok ? 'ap__check-label--ok' : ''}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════
          STYLES
      ══════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');

        .ap {
          --amber:   #C8872A;
          --amber-d: #A06820;
          --amber-l: #F5A94A;
          --forest:  #2E5A4C;
          --forest-d:#1e3d33;
          --dark:    #1A1208;
          --cream:   #FDF8F0;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f9f4ec;
          padding-bottom: 72px;
        }

        /* ══ HERO ══ */
        .ap__hero {
          position: relative;
          background: linear-gradient(135deg, #1A1208 0%, #2E5A4C 55%, #3d6b5a 100%);
          overflow: hidden; padding: 0;
        }
        .ap__hero-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(ellipse at 80% 40%, rgba(200,135,42,0.22) 0%, transparent 65%);
        }
        .ap__hero-pattern {
          position: absolute; inset: 0; pointer-events: none;
          background-image: repeating-linear-gradient(
            45deg, transparent, transparent 28px,
            rgba(255,255,255,0.02) 28px, rgba(255,255,255,0.02) 29px
          );
        }
        .ap__hero-inner {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 32px 40px 36px;
        }
        .ap__back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 18px; border-radius: 50px;
          border: 1.5px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8);
          font-size: 0.85rem; font-weight: 600; cursor: pointer;
          backdrop-filter: blur(8px); font-family: 'DM Sans', sans-serif;
          transition: all 0.2s; margin-bottom: 24px;
        }
        .ap__back-btn:hover { background: rgba(200,135,42,0.25); border-color: var(--amber-l); color: #fff; }
        .ap__hero-body {
          display: flex; align-items: flex-end; justify-content: space-between;
          flex-wrap: wrap; gap: 20px;
        }
        .ap__eyebrow {
          display: block; font-size: 0.7rem; letter-spacing: 3.5px;
          text-transform: uppercase; color: var(--amber-l);
          font-weight: 700; margin-bottom: 10px;
        }
        .ap__hero h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(1.6rem, 4vw, 2.4rem); color: #fff;
          margin: 0 0 8px; line-height: 1.2;
        }
        .ap__hero > div p, .ap__hero-body > div > p {
          color: rgba(255,255,255,0.52); font-size: 0.9rem; margin: 0;
        }
        .ap__hero-chips { display: flex; gap: 10px; flex-wrap: wrap; }
        .ap__hero-chip {
          background: rgba(255,255,255,0.07); border: 1.5px solid;
          border-radius: 12px; padding: 10px 16px;
          backdrop-filter: blur(8px);
          display: flex; flex-direction: column; gap: 2px;
        }
        .ap__hero-chip strong { font-family: 'Playfair Display', Georgia, serif; font-size: 1.2rem; line-height: 1; }
        .ap__hero-chip span { font-size: 0.68rem; letter-spacing: 1px; text-transform: uppercase; color: rgba(255,255,255,0.4); }

        /* ══ PAGE ══ */
        .ap__page {
          max-width: 1100px; margin: 0 auto; padding: 28px 40px 0;
        }
        .ap__layout {
          display: grid; grid-template-columns: 1fr 300px; gap: 24px; align-items: start;
        }

        /* ══ FORM CARD ══ */
        .ap__card {
          background: #fff; border-radius: 20px;
          border: 1.5px solid rgba(200,135,42,0.1);
          box-shadow: 0 2px 16px rgba(26,18,8,0.07);
          overflow: hidden;
        }

        /* sections */
        .ap__section { padding: 28px; border-bottom: 1px solid rgba(200,135,42,0.08); }
        .ap__section--alt { background: #fdf9f5; }
        .ap__section:last-of-type { border-bottom: none; }
        .ap__section-head {
          display: flex; align-items: center; gap: 12px; margin-bottom: 22px;
        }
        .ap__section-ico {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(200,135,42,0.08); color: var(--amber);
          display: flex; align-items: center; justify-content: center; font-size: 1rem;
        }
        .ap__section-head h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1rem; color: var(--dark); margin: 0 0 2px; font-weight: 600;
        }
        .ap__section-head p { font-size: 0.78rem; color: #a08060; margin: 0; }

        .ap__row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        /* ── Field wrapper ── */
        .ap__field { display: flex; flex-direction: column; gap: 7px; }
        .ap__field-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--amber);
        }
        .ap__field-req { color: #EF4444; }
        .ap__field-opt {
          font-size: 0.65rem; letter-spacing: 1px; color: #b0956e;
          font-weight: 400; text-transform: none;
        }

        /* input */
        .ap__input-wrap { position: relative; display: flex; align-items: center; }
        .ap__input-wrap--ta { align-items: flex-start; }
        .ap__input-ico {
          position: absolute; left: 14px;
          color: var(--amber); font-size: 0.9rem; pointer-events: none;
          display: flex; align-items: center;
        }
        .ap__input-ico--top { top: 14px; align-items: flex-start; }
        .ap__input-prefix {
          font-size: 0.78rem; font-weight: 700; color: var(--amber-d); letter-spacing: 0.5px;
          left: 12px;
        }
        .ap__input {
          width: 100%; box-sizing: border-box;
          padding: 12px 14px 12px 42px;
          border: 1.5px solid rgba(200,135,42,0.2); border-radius: 12px;
          background: #fdf8f0; font-size: 0.9rem; color: var(--dark);
          font-family: 'DM Sans', sans-serif; outline: none;
          transition: border-color 0.22s, box-shadow 0.22s, background 0.18s;
        }
        .ap__input--prefix { padding-left: 52px; }
        .ap__input::placeholder { color: #c0a07a; }
        .ap__input:focus {
          border-color: var(--amber); background: #fff;
          box-shadow: 0 0 0 3.5px rgba(200,135,42,0.12);
        }
        .ap__input--err { border-color: #EF4444; background: rgba(239,68,68,0.03); }
        .ap__input--err:focus { box-shadow: 0 0 0 3px rgba(239,68,68,0.1); border-color: #EF4444; }

        .ap__textarea {
          width: 100%; box-sizing: border-box;
          padding: 12px 14px 12px 42px; border-radius: 12px;
          border: 1.5px solid rgba(200,135,42,0.2); background: #fdf8f0;
          font-size: 0.9rem; color: var(--dark); font-family: 'DM Sans', sans-serif;
          outline: none; resize: vertical; line-height: 1.6;
          transition: border-color 0.22s, box-shadow 0.22s, background 0.18s;
        }
        .ap__textarea:focus {
          border-color: var(--amber); background: #fff;
          box-shadow: 0 0 0 3.5px rgba(200,135,42,0.12);
        }
        .ap__textarea::placeholder { color: #c0a07a; }

        /* error */
        .ap__field-err {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.76rem; color: #EF4444; font-weight: 600;
        }
        .ap__hint { font-size: 0.74rem; color: #b0956e; margin: 0; }
        .ap__hint--green { color: #10B981; font-weight: 600; }

        /* image status icon */
        .ap__img-status {
          position: absolute; right: 12px;
          font-size: 1rem; display: flex; align-items: center;
        }
        .ap__img-status--ok  { color: #10B981; }
        .ap__img-status--err { color: #EF4444; }

        /* image preview */
        .ap__img-preview {
          border-radius: 12px; overflow: hidden; position: relative;
          border: 1.5px solid rgba(200,135,42,0.15);
          box-shadow: 0 4px 16px rgba(26,18,8,0.08);
          margin-top: 4px;
        }
        .ap__img-preview img { width: 100%; height: 180px; object-fit: cover; display: block; }
        .ap__img-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: linear-gradient(transparent, rgba(26,18,8,0.7));
          padding: 12px 14px; display: flex;
        }
        .ap__img-overlay span {
          display: flex; align-items: center; gap: 6px;
          color: #fff; font-size: 0.78rem; font-weight: 600;
        }
        .ap__img-error {
          display: flex; align-items: center; gap: 7px;
          padding: 10px 14px; border-radius: 10px; margin-top: 4px;
          background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.2);
          font-size: 0.8rem; color: #EF4444; font-weight: 600;
        }

        /* category grid */
        .ap__cat-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;
        }
        .ap__cat-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 14px; border-radius: 12px;
          border: 1.5px solid rgba(200,135,42,0.18); background: #fdf8f0;
          color: #8a7055; font-size: 0.85rem; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s; position: relative;
        }
        .ap__cat-btn:hover { border-color: var(--amber); color: var(--amber-d); background: rgba(200,135,42,0.05); }
        .ap__cat-btn--active {
          border-color: var(--amber); background: rgba(200,135,42,0.08);
          color: var(--amber-d); box-shadow: 0 0 0 3px rgba(200,135,42,0.12);
        }
        .ap__cat-emoji { font-size: 1.1rem; flex-shrink: 0; }
        .ap__cat-check {
          position: absolute; right: 10px; color: var(--amber); font-size: 0.85rem;
        }

        /* stock badge */
        .ap__stock-badge {
          display: inline-block; padding: 3px 10px; border-radius: 20px;
          font-size: 0.72rem; font-weight: 700; margin-top: 2px;
        }

        /* ── Footer ── */
        .ap__footer {
          display: flex; justify-content: flex-end; gap: 12px;
          padding: 22px 28px; border-top: 1px solid rgba(200,135,42,0.1);
          background: #fdf9f5;
        }
        .ap__btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; border-radius: 50px; font-size: 0.9rem;
          font-weight: 700; cursor: pointer; font-family: 'DM Sans', sans-serif;
          border: none; transition: all 0.2s;
        }
        .ap__btn--primary {
          background: linear-gradient(135deg, var(--forest), var(--forest-d));
          color: #fff; box-shadow: 0 5px 18px rgba(46,90,76,0.3);
        }
        .ap__btn--primary:hover:not(:disabled) { box-shadow: 0 7px 24px rgba(46,90,76,0.44); }
        .ap__btn--primary:disabled { opacity: 0.65; cursor: not-allowed; }
        .ap__btn--ghost {
          background: none; border: 1.5px solid rgba(200,135,42,0.22); color: #6b5c44;
        }
        .ap__btn--ghost:hover { border-color: var(--amber); color: var(--amber-d); background: rgba(200,135,42,0.05); }
        .ap__btn--ghost:disabled { opacity: 0.5; cursor: not-allowed; }

        /* spinner */
        .ap__spinner {
          display: inline-block; width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: ap-spin 0.7s linear infinite;
        }
        @keyframes ap-spin { to { transform: rotate(360deg); } }

        /* ══ PREVIEW SIDEBAR ══ */
        .ap__preview-col { position: relative; }
        .ap__preview-sticky { position: sticky; top: 24px; display: flex; flex-direction: column; gap: 16px; }
        .ap__preview-card {
          background: #fff; border-radius: 18px; overflow: hidden;
          border: 1.5px solid rgba(200,135,42,0.12);
          box-shadow: 0 2px 14px rgba(26,18,8,0.07);
        }
        .ap__preview-head {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 18px; border-bottom: 1px solid rgba(200,135,42,0.08);
          background: #fdf8f0;
        }
        .ap__preview-eyebrow {
          font-size: 0.68rem; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: var(--amber);
        }
        .ap__preview-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: var(--amber);
          animation: ap-pulse 1.8s ease-in-out infinite;
        }
        @keyframes ap-pulse { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:0.4; transform:scale(1.4); } }

        /* mock product card */
        .ap__mock { }
        .ap__mock-img {
          height: 160px; background: linear-gradient(135deg, #fdf3e3, #f5e5cc);
          display: flex; align-items: center; justify-content: center;
          font-size: 3rem; position: relative; overflow: hidden;
        }
        .ap__mock-img img { width:100%; height:100%; object-fit:cover; position:absolute; inset:0; }
        .ap__mock-cat-tag {
          position: absolute; top: 10px; left: 10px;
          background: rgba(26,18,8,0.65); color: #fff; backdrop-filter: blur(6px);
          border-radius: 20px; padding: 4px 10px; font-size: 0.7rem; font-weight: 700;
        }
        .ap__mock-body { padding: 16px; }
        .ap__mock-name {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1rem; color: var(--dark); margin: 0 0 6px; font-weight: 600; line-height: 1.3;
        }
        .ap__mock-placeholder { color: #c0a07a; font-style: italic; font-weight: 400; }
        .ap__mock-desc { font-size: 0.78rem; color: #8a7055; margin: 0 0 12px; line-height: 1.5; }
        .ap__mock-footer { display: flex; align-items: center; justify-content: space-between; }
        .ap__mock-price {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.1rem; color: var(--amber-d);
        }
        .ap__mock-stock { font-size: 0.75rem; font-weight: 700; }

        /* checklist */
        .ap__checklist {
          background: #fff; border-radius: 16px; padding: 18px 20px;
          border: 1.5px solid rgba(200,135,42,0.1);
          box-shadow: 0 2px 10px rgba(26,18,8,0.05);
        }
        .ap__checklist-title {
          font-size: 0.7rem; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--amber); margin: 0 0 12px;
        }
        .ap__check-item {
          display: flex; align-items: center; gap: 10px;
          padding: 7px 0; border-bottom: 1px solid rgba(200,135,42,0.07);
          font-size: 0.83rem; color: #8a7055;
        }
        .ap__check-item:last-child { border-bottom: none; }
        .ap__check-dot {
          width: 20px; height: 20px; border-radius: 50%;
          border: 2px solid rgba(200,135,42,0.25); background: #fdf8f0;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem; color: transparent; flex-shrink: 0; transition: all 0.25s;
        }
        .ap__check-dot--ok { border-color: #10B981; background: rgba(16,185,129,0.1); color: #10B981; }
        .ap__check-label--ok { color: var(--dark); font-weight: 600; }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .ap__layout { grid-template-columns: 1fr; }
          .ap__preview-col { order: -1; }
          .ap__preview-sticky { position: static; flex-direction: row; }
          .ap__preview-card, .ap__checklist { flex: 1; }
        }
        @media (max-width: 640px) {
          .ap__hero-inner, .ap__page { padding-left: 20px; padding-right: 20px; }
          .ap__section { padding: 22px 20px; }
          .ap__footer { padding: 18px 20px; }
          .ap__row-2 { grid-template-columns: 1fr; }
          .ap__cat-grid { grid-template-columns: 1fr 1fr; }
          .ap__preview-sticky { flex-direction: column; }
          .ap__hero-body { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </div>
  );
};

/* ── Reusable field wrapper ── */
const Field = ({ label, required, optional, error, children }) => (
  <div className="ap__field">
    <label className="ap__field-label">
      {label}
      {required && <span className="ap__field-req">*</span>}
      {optional && <span className="ap__field-opt">(optional)</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p className="ap__field-err"
          initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
        >
          <FiAlertCircle /> {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

export default AddProductPage;