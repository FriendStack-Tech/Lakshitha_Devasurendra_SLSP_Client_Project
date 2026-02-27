import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMail, FiPhone, FiMapPin,
  FiFacebook, FiTwitter, FiInstagram,
  FiArrowRight, FiSend
} from 'react-icons/fi';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const socials = [
    { icon: <FiFacebook />, href: '#', label: 'Facebook' },
    { icon: <FiTwitter />, href: '#', label: 'Twitter' },
    { icon: <FiInstagram />, href: '#', label: 'Instagram' },
  ];

  return (
    <footer className="ft">

      {/* ── Newsletter Strip ── */}
      <div className="ft__newsletter">
        <div className="ft__newsletter-inner">
          <div className="ft__newsletter-text">
            <span className="ft__eyebrow">Stay in the loop</span>
            <h3>Get exclusive spice tips & offers</h3>
          </div>
          {subscribed ? (
            <motion.div
              className="ft__newsletter-thanks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              ✦ Thank you! You're subscribed.
            </motion.div>
          ) : (
            <form className="ft__newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="ft__newsletter-input"
                required
              />
              <button type="submit" className="ft__newsletter-btn">
                <FiSend /> Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="ft__main">
        <div className="ft__container">
          <div className="ft__grid">

            {/* Brand */}
            <div className="ft__brand">
              <Link to="/" className="ft__logo">
                <span className="ft__logo-icon">🌶️</span>
                <span className="ft__logo-text">Dev<span className="ft__logo-accent">Spices</span></span>
              </Link>
              <p className="ft__brand-desc">
                Bringing the finest Sri Lankan spices to your kitchen since 2024.
                Authentic, pure, and sustainably sourced directly from local farmers.
              </p>
              <div className="ft__socials">
                {socials.map((s) => (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="ft__social-btn"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {s.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="ft__col">
              <h4 className="ft__col-title">Quick Links</h4>
              <ul className="ft__list">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="ft__link">
                      <FiArrowRight className="ft__link-arrow" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="ft__col">
              <h4 className="ft__col-title">Contact Us</h4>
              <ul className="ft__contact-list">
                <li className="ft__contact-item">
                  <span className="ft__contact-icon"><FiMapPin /></span>
                  <span>No 686/B, Vihara Mawatha,<br />Ihala Biyanwila, Kadawatha</span>
                </li>
                <li className="ft__contact-item">
                  <span className="ft__contact-icon"><FiPhone /></span>
                  <a href="tel:+94771234567" className="ft__contact-link">+94 77 123 4567</a>
                </li>
                <li className="ft__contact-item">
                  <span className="ft__contact-icon"><FiMail /></span>
                  <a href="mailto:Devspices@gmail.com" className="ft__contact-link">Devspices@gmail.com</a>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div className="ft__col">
              <h4 className="ft__col-title">Business Hours</h4>
              <ul className="ft__hours-list">
                <li className="ft__hours-row">
                  <span>Mon – Fri</span><span className="ft__hours-val">9 AM – 6 PM</span>
                </li>
                <li className="ft__hours-row">
                  <span>Saturday</span><span className="ft__hours-val">10 AM – 4 PM</span>
                </li>
                <li className="ft__hours-row">
                  <span>Sunday</span><span className="ft__hours-val">Closed</span>
                </li>
              </ul>
              <div className="ft__badge">
                <span className="ft__badge-dot" />
                We ship worldwide
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="ft__bottom">
        <div className="ft__container ft__bottom-inner">
          <p className="ft__copy">
            &copy; {new Date().getFullYear()} Sri Lankan Dev Spice Pvt Ltd. All rights reserved.
          </p>
          <div className="ft__bottom-links">
            <a href="#" className="ft__bottom-link">Privacy Policy</a>
            <span className="ft__bottom-dot">·</span>
            <a href="#" className="ft__bottom-link">Terms of Service</a>
          </div>
        </div>
      </div>

      <style>{`
        .ft {
          --amber: #C8872A;
          --amber-d: #A06820;
          --amber-l: #F5A94A;
          --dark: #1A1208;
          font-family: sans-serif;
          margin-top: auto;
        }

        .ft__container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Newsletter ── */
        .ft__newsletter {
          background: linear-gradient(135deg, var(--amber) 0%, var(--amber-d) 100%);
          padding: 40px 24px;
        }
        .ft__newsletter-inner {
          max-width: 1240px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
        }
        .ft__newsletter-text { flex: 1; min-width: 200px; }
        .ft__eyebrow {
          display: block;
          font-size: 0.72rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          margin-bottom: 4px;
          font-weight: 600;
        }
        .ft__newsletter-text h3 {
          color: #fff;
          font-size: clamp(1rem, 2.5vw, 1.4rem);
          margin: 0;
          font-family: Georgia, serif;
        }
        .ft__newsletter-form {
          display: flex;
          gap: 0;
          flex: 1;
          max-width: 420px;
          border-radius: 50px;
          overflow: hidden;
          box-shadow: 0 8px 28px rgba(0,0,0,0.2);
        }
        .ft__newsletter-input {
          flex: 1;
          padding: 14px 20px;
          border: none;
          outline: none;
          font-size: 0.9rem;
          background: rgba(255,255,255,0.95);
          color: var(--dark);
          font-family: sans-serif;
        }
        .ft__newsletter-input::placeholder { color: #a08060; }
        .ft__newsletter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 22px;
          background: var(--dark);
          color: var(--amber-l);
          border: none;
          cursor: pointer;
          font-size: 0.88rem;
          font-weight: 700;
          transition: background 0.2s;
          font-family: sans-serif;
          white-space: nowrap;
        }
        .ft__newsletter-btn:hover { background: #2d1f0a; }
        .ft__newsletter-thanks {
          background: rgba(255,255,255,0.2);
          border: 1.5px solid rgba(255,255,255,0.4);
          color: #fff;
          padding: 14px 28px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.95rem;
        }

        /* ── Main ── */
        .ft__main {
          background: #1A1208;
          padding: 72px 0 48px;
        }
        .ft__grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1.5fr 1.2fr;
          gap: 40px;
        }

        /* Brand col */
        .ft__logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          margin-bottom: 16px;
        }
        .ft__logo-icon { font-size: 1.6rem; }
        .ft__logo-text {
          font-size: 1.4rem;
          font-weight: 800;
          color: #fff;
          font-family: Georgia, serif;
          letter-spacing: -0.5px;
        }
        .ft__logo-accent { color: var(--amber-l); }
        .ft__brand-desc {
          color: rgba(255,255,255,0.55);
          font-size: 0.88rem;
          line-height: 1.75;
          margin-bottom: 24px;
          max-width: 300px;
        }
        .ft__socials { display: flex; gap: 10px; }
        .ft__social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.7);
          font-size: 1rem;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .ft__social-btn:hover { background: var(--amber); color: #fff; border-color: var(--amber); }

        /* Cols */
        .ft__col-title {
          font-size: 0.78rem;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: var(--amber-l);
          font-weight: 700;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(200,135,42,0.2);
        }

        /* Quick Links */
        .ft__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .ft__link {
          display: flex;
          align-items: center;
          gap: 8px;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          font-size: 0.9rem;
          padding: 5px 0;
          transition: color 0.2s, gap 0.2s;
        }
        .ft__link:hover { color: var(--amber-l); gap: 12px; }
        .ft__link-arrow { font-size: 0.75rem; opacity: 0.5; transition: opacity 0.2s; }
        .ft__link:hover .ft__link-arrow { opacity: 1; }

        /* Contact */
        .ft__contact-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; }
        .ft__contact-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          color: rgba(255,255,255,0.55);
          font-size: 0.88rem;
          line-height: 1.55;
        }
        .ft__contact-icon {
          color: var(--amber);
          font-size: 1rem;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .ft__contact-link {
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: color 0.2s;
        }
        .ft__contact-link:hover { color: var(--amber-l); }

        /* Hours */
        .ft__hours-list { list-style: none; padding: 0; margin: 0 0 20px; display: flex; flex-direction: column; gap: 10px; }
        .ft__hours-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.87rem;
          color: rgba(255,255,255,0.5);
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .ft__hours-row:last-child { border-bottom: none; }
        .ft__hours-val { color: rgba(255,255,255,0.8); font-weight: 600; }
        .ft__badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(200,135,42,0.12);
          border: 1px solid rgba(200,135,42,0.25);
          color: var(--amber-l);
          padding: 8px 14px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        .ft__badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #4caf7d;
          box-shadow: 0 0 0 3px rgba(76,175,125,0.25);
          animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(76,175,125,0.25); }
          50% { box-shadow: 0 0 0 6px rgba(76,175,125,0.1); }
        }

        /* ── Bottom Bar ── */
        .ft__bottom {
          background: #0f0b05;
          padding: 18px 24px;
        }
        .ft__bottom-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }
        .ft__copy {
          color: rgba(255,255,255,0.3);
          font-size: 0.8rem;
          margin: 0;
        }
        .ft__bottom-links { display: flex; align-items: center; gap: 10px; }
        .ft__bottom-link {
          color: rgba(255,255,255,0.3);
          font-size: 0.8rem;
          text-decoration: none;
          transition: color 0.2s;
        }
        .ft__bottom-link:hover { color: var(--amber-l); }
        .ft__bottom-dot { color: rgba(255,255,255,0.2); }

        /* ── Responsive ── */
        @media (max-width: 1024px) {
          .ft__grid { grid-template-columns: 1fr 1fr; gap: 36px; }
          .ft__brand { grid-column: 1 / -1; }
          .ft__brand-desc { max-width: 100%; }
        }
        @media (max-width: 600px) {
          .ft__grid { grid-template-columns: 1fr; }
          .ft__brand { grid-column: auto; }
          .ft__newsletter-inner { flex-direction: column; }
          .ft__newsletter-form { max-width: 100%; width: 100%; }
          .ft__bottom-inner { flex-direction: column; text-align: center; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;