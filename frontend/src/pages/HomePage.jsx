import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiRefreshCw, FiShoppingCart, FiEye } from 'react-icons/fi';
import heroImg from '../assets/images/1.jpg';
import midImg from '../assets/images/2.jpg';
import lastImg from '../assets/images/3.jpg';

/* ─── Animated Counter ─── */
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count}{suffix}</span>;
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 180]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : data.products || [];
        const latest = [...arr]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setProducts(latest);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  const features = [
    { icon: <FiStar />, title: 'Premium Quality', description: 'Directly sourced from Sri Lankan farmers' },
    { icon: <FiTruck />, title: 'Worldwide Shipping', description: 'Fast and reliable delivery to your doorstep' },
    { icon: <FiShield />, title: '100% Pure', description: 'No additives, no preservatives' },
    { icon: <FiRefreshCw />, title: 'Easy Returns', description: '30-day money-back guarantee' },
  ];

  const stats = [
    { value: 500, suffix: '+', label: 'Happy Customers' },
    { value: 55, suffix: '+', label: 'Spice Varieties' },
    { value: 15, suffix: '+', label: 'Years of Trust' },
    { value: 30, suffix: '', label: 'Countries Shipped' },
  ];

  return (
    <div className="hp">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hp-hero">
        <motion.div className="hp-hero__bg" style={{ y: heroY, opacity: heroOpacity }}>
          <img src={heroImg} alt="Sri Lankan Spices" className="hp-hero__img" />
          <div className="hp-hero__overlay" />
        </motion.div>

        {/* Floating spice dots */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="hp-hero__particle"
            style={{ left: `${8 + i * 8}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ y: [0, -18, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}

        <div className="hp-container hp-hero__content">
          <motion.span
            className="hp-hero__eyebrow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            ✦ Straight from the Island
          </motion.span>
          <motion.h1
            className="hp-hero__title"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            Discover the Authentic<br />
            Taste of <span className="hp-hero__accent">Sri Lanka</span>
          </motion.h1>
          <motion.p
            className="hp-hero__sub"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Premium quality spices directly sourced from local farmers.<br />
            Experience the rich flavors that made Sri Lanka the spice capital of the world.
          </motion.p>
          <motion.div
            className="hp-hero__btns"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
          >
            <Link to="/shop" className="hp-btn hp-btn--primary">
              Shop Now <FiArrowRight />
            </Link>
            <Link to="/about" className="hp-btn hp-btn--ghost">
              Learn More
            </Link>
          </motion.div>
        </div>

        <div className="hp-hero__scroll-hint">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↓</motion.div>
        </div>
      </section>

      {/* ═══════════════ STATS STRIP ═══════════════ */}
      <section className="hp-stats">
        <div className="hp-container hp-stats__grid">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              className="hp-stats__item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <strong><Counter target={s.value} suffix={s.suffix} /></strong>
              <span>{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="hp-features">
        <div className="hp-container">
          <motion.div
            className="hp-section-head"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="hp-label">Our Promise</span>
            <h2>Why Choose Us</h2>
            <p>Every spice tells a story of craftsmanship and purity</p>
          </motion.div>
          <div className="hp-features__grid">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="hp-feat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -8, boxShadow: '0 24px 60px rgba(0,0,0,0.13)' }}
              >
                <div className="hp-feat-card__icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ MID BANNER (image 2) ═══════════════ */}
      <section className="hp-mid-banner">
        <div className="hp-mid-banner__img-wrap">
          <img src={midImg} alt="Our Spices" />
          <div className="hp-mid-banner__overlay" />
        </div>
        <div className="hp-container hp-mid-banner__content">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="hp-label hp-label--light">The Difference</span>
            <h2>From Farm to Your Table,<br />Nothing in Between</h2>
            <p>
              We work directly with generations-old farming families across Sri Lanka's highland and coastal regions. Every batch is hand-selected, sun-dried and packed within 48 hours to preserve the full aromatic profile nature intended.
            </p>
            <Link to="/about" className="hp-btn hp-btn--primary">
              Our Story <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ LATEST PRODUCTS ═══════════════ */}
      <section className="hp-products">
        <div className="hp-container">
          <motion.div
            className="hp-section-head"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="hp-label">Fresh Arrivals</span>
            <h2>Latest Products</h2>
            <p>Newly added to our collection — straight from the source</p>
          </motion.div>

          {loadingProducts ? (
            <div className="hp-products__loading">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="hp-prod-skeleton" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="hp-products__empty">No products available at the moment.</p>
          ) : (
            <div className="hp-products__grid">
              {products.map((product, i) => {
                // ✅ Support all common field name variants from the API
                const imgSrc =
                  product.ImageURL ||
                  product.imageURL ||
                  product.imageUrl ||
                  product.image_url ||
                  product.image ||
                  null;

                const productId = product._id || product.ProductID || product.id;

                const productName =
                  product.ProductName || product.name || 'Unnamed Product';

                const category =
                  product.Category || product.category || 'Spice';

                const price =
                  product.Price ?? product.price ?? null;

                return (
                  <motion.div
                    key={productId || i}
                    className="hp-prod-card"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -6 }}
                  >
                    <div className="hp-prod-card__img-wrap">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={productName}
                          onError={e => {
                            // If URL is broken, hide img and show placeholder
                            e.target.style.display = 'none';
                            e.target.parentElement
                              .querySelector('.hp-prod-card__placeholder')
                              .style.display = 'flex';
                          }}
                        />
                      ) : null}

                      {/* Placeholder: shown when no URL, or URL fails to load */}
                      <div
                        className="hp-prod-card__placeholder"
                        style={{ display: imgSrc ? 'none' : 'flex' }}
                      >
                        🌿
                      </div>

                      <div className="hp-prod-card__actions">
                        <Link
                          to={`/shop/${productId}`}
                          className="hp-prod-card__action-btn"
                        >
                          <FiEye />
                        </Link>
                        <button className="hp-prod-card__action-btn">
                          <FiShoppingCart />
                        </button>
                      </div>
                      <span className="hp-prod-card__badge">New</span>
                    </div>

                    <div className="hp-prod-card__info">
                      <span className="hp-prod-card__cat">{category}</span>
                      <h4>{productName}</h4>
                      <div className="hp-prod-card__footer">
                        <strong className="hp-prod-card__price">
                          {price != null
                            ? `Rs. ${Number(price).toLocaleString()}`
                            : 'View Price'}
                        </strong>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          <motion.div
            className="hp-products__cta"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link to="/shop" className="hp-btn hp-btn--outline">
              View All Products <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ LAST SECTION (image 3) ═══════════════ */}
      <section className="hp-last-banner">
        <div className="hp-last-banner__img-wrap">
          <img src={lastImg} alt="Experience" />
          <div className="hp-last-banner__overlay" />
        </div>
        <div className="hp-container hp-last-banner__content">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hp-last-banner__inner"
          >
            <span className="hp-label hp-label--light">Join the Family</span>
            <h2>Ready to Experience Real<br />Sri Lankan Spices?</h2>
            <p>Join hundreds of happy customers who have discovered the authentic taste of paradise</p>
            <div className="hp-last-banner__btns">
              <Link to="/shop" className="hp-btn hp-btn--primary">
                Start Shopping Now <FiArrowRight />
              </Link>
              <Link to="/about" className="hp-btn hp-btn--ghost">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        /* ── Tokens ── */
        .hp { --amber: #C8872A; --amber-d: #A06820; --amber-l: #F5A94A; --cream: #FDF8F0; --dark: #1A1208; --mid: #3D2B0F; overflow-x: hidden; font-family: 'Georgia', serif; }

        /* ── Layout ── */
        .hp-container { max-width: 1240px; margin: 0 auto; padding: 0 24px; }
        .hp-section-head { text-align: center; margin-bottom: 56px; }
        .hp-section-head h2 { font-size: clamp(2rem, 4vw, 2.8rem); color: var(--dark); margin: 8px 0 12px; }
        .hp-section-head p { color: #6b5c44; font-size: 1.05rem; }
        .hp-label { display: inline-block; font-family: 'sans-serif'; font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase; color: var(--amber); font-weight: 600; margin-bottom: 4px; }
        .hp-label--light { color: #f5c87a; }

        /* ── Buttons ── */
        .hp-btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 30px; border-radius: 50px; font-size: 0.95rem; font-weight: 600; text-decoration: none; transition: all 0.25s; cursor: pointer; border: none; font-family: sans-serif; }
        .hp-btn--primary { background: linear-gradient(135deg, var(--amber), var(--amber-d)); color: #fff; box-shadow: 0 4px 20px rgba(200,135,42,0.4); }
        .hp-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(200,135,42,0.55); }
        .hp-btn--ghost { background: rgba(255,255,255,0.15); color: #fff; border: 1.5px solid rgba(255,255,255,0.5); backdrop-filter: blur(6px); }
        .hp-btn--ghost:hover { background: rgba(255,255,255,0.28); }
        .hp-btn--outline { background: transparent; color: var(--amber); border: 2px solid var(--amber); }
        .hp-btn--outline:hover { background: var(--amber); color: #fff; }
        .hp-btn--xs { padding: 7px 16px; font-size: 0.8rem; }

        /* ─────────── HERO ─────────── */
        .hp-hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
        .hp-hero__bg { position: absolute; inset: -10%; z-index: 0; }
        .hp-hero__img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.55) saturate(1.2); }
        .hp-hero__overlay { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(26,18,8,0.55) 0%, rgba(61,43,15,0.4) 60%, rgba(200,135,42,0.15) 100%); }
        .hp-hero__particle { position: absolute; width: 6px; height: 6px; border-radius: 50%; background: var(--amber-l); pointer-events: none; }
        .hp-hero__content { position: relative; z-index: 2; text-align: center; padding: 120px 24px 80px; }
        .hp-hero__eyebrow { display: inline-block; font-family: sans-serif; letter-spacing: 4px; text-transform: uppercase; font-size: 0.78rem; color: var(--amber-l); margin-bottom: 20px; font-weight: 600; }
        .hp-hero__title { font-size: clamp(2.4rem, 6vw, 4.5rem); color: #fff; line-height: 1.15; margin-bottom: 20px; text-shadow: 0 2px 30px rgba(0,0,0,0.3); }
        .hp-hero__accent { background: linear-gradient(90deg, #F5A94A, #ffcd7a); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hp-hero__sub { font-size: clamp(1rem, 2vw, 1.2rem); color: rgba(255,255,255,0.85); max-width: 580px; margin: 0 auto 40px; line-height: 1.7; }
        .hp-hero__btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .hp-hero__scroll-hint { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,0.5); font-size: 1.2rem; z-index: 2; }

        /* ─────────── STATS ─────────── */
        .hp-stats { background: var(--dark); padding: 40px 0; }
        .hp-stats__grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; }
        .hp-stats__item { text-align: center; padding: 28px 16px; border-right: 1px solid rgba(255,255,255,0.08); }
        .hp-stats__item:last-child { border-right: none; }
        .hp-stats__item strong { display: block; font-size: 2.4rem; color: var(--amber-l); font-family: serif; }
        .hp-stats__item span { font-family: sans-serif; font-size: 0.85rem; color: rgba(255,255,255,0.55); letter-spacing: 1px; text-transform: uppercase; }

        /* ─────────── FEATURES ─────────── */
        .hp-features { padding: 100px 0; background: var(--cream); }
        .hp-features__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 28px; }
        .hp-feat-card { background: #fff; border-radius: 20px; padding: 40px 28px; text-align: center; border: 1px solid rgba(200,135,42,0.1); transition: all 0.3s; cursor: default; }
        .hp-feat-card__icon { width: 68px; height: 68px; background: linear-gradient(135deg, var(--amber), var(--amber-d)); color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 20px; box-shadow: 0 8px 24px rgba(200,135,42,0.35); }
        .hp-feat-card h3 { font-size: 1.15rem; color: var(--dark); margin-bottom: 10px; }
        .hp-feat-card p { font-family: sans-serif; font-size: 0.92rem; color: #6b5c44; line-height: 1.6; }

        /* ─────────── MID BANNER ─────────── */
        .hp-mid-banner { position: relative; min-height: 520px; display: flex; align-items: center; overflow: hidden; }
        .hp-mid-banner__img-wrap { position: absolute; inset: 0; z-index: 0; }
        .hp-mid-banner__img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .hp-mid-banner__overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(26,18,8,0.88) 45%, rgba(26,18,8,0.2) 100%); }
        .hp-mid-banner__content { position: relative; z-index: 2; padding: 80px 24px; }
        .hp-mid-banner__content h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); color: #fff; margin: 10px 0 16px; line-height: 1.25; }
        .hp-mid-banner__content p { font-family: sans-serif; color: rgba(255,255,255,0.78); font-size: 0.97rem; line-height: 1.75; max-width: 480px; margin-bottom: 32px; }

        /* ─────────── PRODUCTS ─────────── */
        .hp-products { padding: 100px 0; background: #fff; }
        .hp-products__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 24px; }
        .hp-products__cta { text-align: center; margin-top: 56px; }
        .hp-products__loading { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 24px; }
        .hp-products__empty { text-align: center; color: #999; font-family: sans-serif; padding: 40px; }
        .hp-prod-skeleton { height: 320px; border-radius: 16px; background: linear-gradient(90deg, #f0e8db 25%, #e8ddd0 50%, #f0e8db 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        .hp-prod-card { background: #fff; border-radius: 16px; overflow: hidden; border: 1px solid rgba(200,135,42,0.12); transition: all 0.3s; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .hp-prod-card__img-wrap { position: relative; height: 200px; background: linear-gradient(135deg, #fdf3e3, #f5e6cc); overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .hp-prod-card__img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
        .hp-prod-card:hover .hp-prod-card__img-wrap img { transform: scale(1.07); }
        .hp-prod-card__placeholder { font-size: 3rem; display: none; }
        .hp-prod-card__badge { position: absolute; top: 12px; left: 12px; background: linear-gradient(135deg, var(--amber), var(--amber-d)); color: #fff; font-family: sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; }
        .hp-prod-card__actions { position: absolute; bottom: -50px; left: 0; right: 0; display: flex; justify-content: center; gap: 10px; padding: 12px; transition: bottom 0.3s; background: linear-gradient(transparent, rgba(0,0,0,0.35)); }
        .hp-prod-card:hover .hp-prod-card__actions { bottom: 0; }
        .hp-prod-card__action-btn { width: 38px; height: 38px; border-radius: 50%; background: #fff; color: var(--amber-d); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; text-decoration: none; font-size: 1rem; transition: all 0.2s; }
        .hp-prod-card__action-btn:hover { background: var(--amber); color: #fff; }
        .hp-prod-card__info { padding: 18px 16px; }
        .hp-prod-card__cat { font-family: sans-serif; font-size: 0.72rem; letter-spacing: 2px; text-transform: uppercase; color: var(--amber); font-weight: 600; }
        .hp-prod-card__info h4 { font-size: 1rem; color: var(--dark); margin: 6px 0 14px; line-height: 1.3; }
        .hp-prod-card__footer { display: flex; align-items: center; justify-content: space-between; }
        .hp-prod-card__price { font-size: 1.1rem; color: var(--amber-d); }

        /* ─────────── LAST BANNER ─────────── */
        .hp-last-banner { position: relative; min-height: 560px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .hp-last-banner__img-wrap { position: absolute; inset: 0; z-index: 0; }
        .hp-last-banner__img-wrap img { width: 100%; height: 100%; object-fit: cover; }
        .hp-last-banner__overlay { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(26,18,8,0.82) 0%, rgba(61,43,15,0.6) 100%); }
        .hp-last-banner__content { position: relative; z-index: 2; width: 100%; padding: 80px 24px; }
        .hp-last-banner__inner { text-align: center; max-width: 680px; margin: 0 auto; }
        .hp-last-banner__inner h2 { font-size: clamp(1.8rem, 4vw, 3rem); color: #fff; margin: 10px 0 16px; line-height: 1.25; }
        .hp-last-banner__inner p { font-family: sans-serif; color: rgba(255,255,255,0.8); font-size: 1rem; margin-bottom: 36px; line-height: 1.7; }
        .hp-last-banner__btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

        /* ─────────── RESPONSIVE ─────────── */
        @media (max-width: 768px) {
          .hp-stats__grid { grid-template-columns: repeat(2, 1fr); }
          .hp-stats__item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); }
          .hp-mid-banner__overlay { background: rgba(26,18,8,0.75); }
          .hp-products__grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
        }
        @media (max-width: 480px) {
          .hp-stats__grid { grid-template-columns: 1fr 1fr; }
          .hp-hero__btns, .hp-last-banner__btns { flex-direction: column; align-items: center; }
        }
      `}</style>
    </div>
  );
};

export default HomePage;