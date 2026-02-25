import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut,
  FiLogIn, FiHome, FiPackage, FiInfo, FiPhone,
  FiChevronDown, FiSettings
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: <FiHome /> },
    { name: 'Shop', path: '/shop', icon: <FiPackage /> },
    { name: 'About', path: '/about', icon: <FiInfo /> },
    { name: 'Contact', path: '/contact', icon: <FiPhone /> },
  ];

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setIsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  /* Click-outside for profile dropdown */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
    setIsOpen(false);
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <nav className={`nb ${scrolled ? 'nb--scrolled' : ''}`}>
        <div className="nb__inner">

          {/* ── Logo ── */}
          <Link to="/" className="nb__logo">
            <span className="nb__logo-icon">🌶️</span>
            <span className="nb__logo-text">
              Dev<span className="nb__logo-accent">Spices</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="nb__links">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nb__link ${isActive(link.path) ? 'nb__link--active' : ''}`}
              >
                <span className="nb__link-icon">{link.icon}</span>
                <span>{link.name}</span>
                {isActive(link.path) && (
                  <motion.span
                    className="nb__link-underline"
                    layoutId="nav-underline"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ── Right Side ── */}
          <div className="nb__right">

            {/* Cart */}
            <Link to="/cart" className="nb__cart">
              <FiShoppingCart />
              <AnimatePresence>
                {cart.totalItems > 0 && (
                  <motion.span
                    className="nb__cart-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    key={cart.totalItems}
                  >
                    {cart.totalItems > 9 ? '9+' : cart.totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="nb__profile" ref={profileRef}>
                <button
                  className="nb__profile-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="nb__avatar">
                    {user?.Name?.charAt(0).toUpperCase() || <FiUser />}
                  </div>
                  <span className="nb__profile-name">
                    {user?.Name?.split(' ')[0]}
                  </span>
                  <motion.span
                    animate={{ rotate: isProfileOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="nb__profile-chevron"
                  >
                    <FiChevronDown />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      className="nb__dropdown"
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div className="nb__dropdown-header">
                        <div className="nb__dropdown-avatar">
                          {user?.Name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="nb__dropdown-user">{user?.Name}</p>
                          <p className="nb__dropdown-email">{user?.email}</p>
                        </div>
                      </div>
                      <div className="nb__dropdown-divider" />
                      <Link
                        to="/dashboard"
                        className="nb__dropdown-item"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiSettings /> Dashboard
                      </Link>
                      <div className="nb__dropdown-divider" />
                      <button className="nb__dropdown-item nb__dropdown-item--danger" onClick={handleLogout}>
                        <FiLogOut /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="nb__auth">
                <Link to="/login" className="nb__auth-login">
                  <FiLogIn /> Login
                </Link>
                <Link to="/register" className="nb__auth-register">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button className="nb__hamburger" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <FiX />
                  </motion.span>
                ) : (
                  <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <FiMenu />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="nb__mobile"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="nb__mobile-inner">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      to={link.path}
                      className={`nb__mobile-link ${isActive(link.path) ? 'nb__mobile-link--active' : ''}`}
                      onClick={() => setIsOpen(false)}
                    >
                      <span className="nb__mobile-link-icon">{link.icon}</span>
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="nb__mobile-divider" />

                {isAuthenticated ? (
                  <>
                    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24 }}>
                      <Link to="/dashboard" className="nb__mobile-link" onClick={() => setIsOpen(false)}>
                        <span className="nb__mobile-link-icon"><FiSettings /></span> Dashboard
                      </Link>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                      <button className="nb__mobile-link nb__mobile-link--danger" onClick={handleLogout}>
                        <span className="nb__mobile-link-icon"><FiLogOut /></span> Logout
                      </button>
                    </motion.div>
                  </>
                ) : (
                  <motion.div className="nb__mobile-auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }}>
                    <Link to="/login" className="nb__mobile-auth-login" onClick={() => setIsOpen(false)}>
                      <FiLogIn /> Login
                    </Link>
                    <Link to="/register" className="nb__mobile-auth-register" onClick={() => setIsOpen(false)}>
                      Register
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Overlay backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="nb__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <style>{`
        /* ─── Tokens ─── */
        .nb {
          --amber: #C8872A;
          --amber-d: #A06820;
          --amber-l: #F5A94A;
          --dark: #1A1208;
          --mid: #3D2B0F;
          --cream: #FDF8F0;

          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(253, 248, 240, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(200,135,42,0.1);
          transition: background 0.3s, box-shadow 0.3s;
          font-family: sans-serif;
        }

        .nb--scrolled {
          background: rgba(253, 248, 240, 0.96);
          box-shadow: 0 2px 24px rgba(26,18,8,0.1);
        }

        .nb__inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 24px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* ── Logo ── */
        .nb__logo {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nb__logo-icon { font-size: 1.6rem; line-height: 1; }
        .nb__logo-text {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--dark);
          letter-spacing: -0.5px;
          font-family: Georgia, serif;
        }
        .nb__logo-accent { color: var(--amber); }

        /* ── Desktop Links ── */
        .nb__links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .nb__link {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 500;
          color: #6b5c44;
          transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .nb__link:hover { color: var(--amber-d); background: rgba(200,135,42,0.07); }
        .nb__link--active { color: var(--amber-d); font-weight: 600; }
        .nb__link-icon { font-size: 0.9rem; opacity: 0.7; }
        .nb__link-underline {
          position: absolute;
          bottom: 2px;
          left: 14px;
          right: 14px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(90deg, var(--amber), var(--amber-l));
        }

        /* ── Right Section ── */
        .nb__right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        /* ── Cart ── */
        .nb__cart {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          color: var(--dark);
          font-size: 1.2rem;
          text-decoration: none;
          background: rgba(200,135,42,0.08);
          transition: background 0.2s, color 0.2s;
        }
        .nb__cart:hover { background: var(--amber); color: #fff; }
        .nb__cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          background: linear-gradient(135deg, var(--amber), var(--amber-d));
          color: #fff;
          font-size: 0.65rem;
          font-weight: 700;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(200,135,42,0.5);
          border: 2px solid var(--cream);
        }

        /* ── Profile ── */
        .nb__profile { position: relative; }
        .nb__profile-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px 6px 6px;
          background: rgba(200,135,42,0.08);
          border: 1.5px solid rgba(200,135,42,0.2);
          border-radius: 50px;
          cursor: pointer;
          color: var(--dark);
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s;
          font-family: sans-serif;
        }
        .nb__profile-btn:hover { background: rgba(200,135,42,0.15); border-color: var(--amber); }
        .nb__avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--amber), var(--amber-d));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .nb__profile-name { max-width: 90px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .nb__profile-chevron { color: var(--amber); font-size: 0.85rem; display: flex; }

        /* Dropdown */
        .nb__dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          min-width: 230px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 16px 48px rgba(26,18,8,0.16);
          border: 1px solid rgba(200,135,42,0.12);
          overflow: hidden;
          z-index: 100;
        }
        .nb__dropdown-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #fdf3e3, #faebd7);
        }
        .nb__dropdown-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--amber), var(--amber-d));
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          flex-shrink: 0;
        }
        .nb__dropdown-user { font-weight: 700; font-size: 0.9rem; color: var(--dark); margin: 0; }
        .nb__dropdown-email { font-size: 0.75rem; color: #8a7055; margin: 2px 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px; }
        .nb__dropdown-divider { height: 1px; background: rgba(200,135,42,0.1); margin: 0; }
        .nb__dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--dark);
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          font-family: sans-serif;
          text-align: left;
        }
        .nb__dropdown-item:hover { background: rgba(200,135,42,0.07); color: var(--amber-d); }
        .nb__dropdown-item--danger { color: #c0392b; }
        .nb__dropdown-item--danger:hover { background: rgba(192,57,43,0.07); color: #c0392b; }

        /* ── Auth Buttons ── */
        .nb__auth { display: flex; align-items: center; gap: 8px; }
        .nb__auth-login {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; border-radius: 50px; font-size: 0.88rem; font-weight: 600;
          color: var(--amber-d); text-decoration: none;
          border: 1.5px solid rgba(200,135,42,0.3);
          transition: all 0.2s;
        }
        .nb__auth-login:hover { background: rgba(200,135,42,0.08); border-color: var(--amber); }
        .nb__auth-register {
          padding: 8px 18px; border-radius: 50px; font-size: 0.88rem; font-weight: 700;
          background: linear-gradient(135deg, var(--amber), var(--amber-d));
          color: #fff; text-decoration: none;
          box-shadow: 0 4px 14px rgba(200,135,42,0.35);
          transition: all 0.2s;
        }
        .nb__auth-register:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(200,135,42,0.45); }

        /* ── Hamburger ── */
        .nb__hamburger {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(200,135,42,0.08);
          color: var(--dark);
          font-size: 1.2rem;
          cursor: pointer;
          border: none;
          transition: background 0.2s;
        }
        .nb__hamburger:hover { background: rgba(200,135,42,0.18); }

        /* ── Mobile Menu ── */
        .nb__mobile {
          overflow: hidden;
          border-top: 1px solid rgba(200,135,42,0.12);
        }
        .nb__mobile-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 12px 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .nb__mobile-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--dark);
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          font-family: sans-serif;
        }
        .nb__mobile-link:hover { background: rgba(200,135,42,0.08); color: var(--amber-d); }
        .nb__mobile-link--active { background: rgba(200,135,42,0.1); color: var(--amber-d); font-weight: 600; }
        .nb__mobile-link--danger { color: #c0392b; }
        .nb__mobile-link--danger:hover { background: rgba(192,57,43,0.07); }
        .nb__mobile-link-icon { width: 20px; display: flex; align-items: center; justify-content: center; opacity: 0.7; }
        .nb__mobile-divider { height: 1px; background: rgba(200,135,42,0.12); margin: 8px 0; }
        .nb__mobile-auth { display: flex; gap: 10px; padding: 4px 0; }
        .nb__mobile-auth-login {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 12px; border-radius: 12px; font-weight: 600; font-size: 0.9rem;
          color: var(--amber-d); text-decoration: none;
          border: 1.5px solid rgba(200,135,42,0.3);
          transition: all 0.2s;
        }
        .nb__mobile-auth-login:hover { background: rgba(200,135,42,0.08); }
        .nb__mobile-auth-register {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 12px; border-radius: 12px; font-weight: 700; font-size: 0.9rem;
          background: linear-gradient(135deg, var(--amber), var(--amber-d));
          color: #fff; text-decoration: none;
          box-shadow: 0 4px 14px rgba(200,135,42,0.35);
        }

        /* ── Backdrop ── */
        .nb__backdrop {
          position: fixed;
          inset: 0;
          background: rgba(26,18,8,0.35);
          z-index: 999;
          backdrop-filter: blur(2px);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .nb__links { display: none; }
          .nb__auth { display: none; }
          .nb__hamburger { display: flex; }
        }

        @media (max-width: 480px) {
          .nb__profile-name { display: none; }
          .nb__profile-chevron { display: none; }
        }
      `}</style>
    </>
  );
};

export default Navbar;