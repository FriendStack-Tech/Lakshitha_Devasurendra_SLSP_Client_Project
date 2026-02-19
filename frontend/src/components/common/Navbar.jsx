import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiLogIn, FiHome, FiPackage, FiInfo, FiPhone } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/', icon: <FiHome /> },
    { name: 'Shop', path: '/shop', icon: <FiPackage /> },
    { name: 'About', path: '/about', icon: <FiInfo /> },
    { name: 'Contact', path: '/contact', icon: <FiPhone /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
    setIsOpen(false);
  };

  return (
    <nav style={{
      background: 'var(--color-white)',
      boxShadow: 'var(--shadow-md)',
      position: 'sticky',
      top: 0,
      zIndex: 'var(--z-sticky)',
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '70px',
        }}>
          {/* Logo */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
          }}>
            <span style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 700,
              color: 'var(--color-secondary)',
            }}>🌶️ DevSpices </span>
          </Link>

          {/* Desktop Navigation */}
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-xl)',
          }}>
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                color: 'var(--color-gray-600)',
                fontWeight: 500,
              }}>
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-lg)',
          }}>
            {/* Cart Icon */}
            <Link to="/cart" style={{
              position: 'relative',
              fontSize: 'var(--font-size-xl)',
              color: 'var(--color-secondary)',
            }}>
              <FiShoppingCart />
              {cart.totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'var(--color-accent)',
                  color: 'var(--color-white)',
                  fontSize: 'var(--font-size-xs)',
                  padding: '2px 6px',
                  borderRadius: 'var(--radius-full)',
                  minWidth: '18px',
                  textAlign: 'center',
                }}>{cart.totalItems}</span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    background: 'var(--color-gray-100)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--color-secondary)',
                    fontWeight: 500,
                  }}
                >
                  <FiUser />
                  <span>{user?.Name?.split(' ')[0]}</span>
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      style={{
                        position: 'absolute',
                        top: '120%',
                        right: 0,
                        background: 'var(--color-white)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-xl)',
                        minWidth: '200px',
                        overflow: 'hidden',
                      }}
                    >
                      <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-md)',
                      }}>
                        Dashboard
                      </Link>
                      <button onClick={handleLogout} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        padding: 'var(--spacing-md)',
                        width: '100%',
                        textAlign: 'left',
                        color: 'var(--color-error)',
                        borderTop: '1px solid var(--color-gray-200)',
                      }}>
                        <FiLogOut /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <Link to="/login" className="btn btn-outline">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              style={{
                display: 'none',
                fontSize: 'var(--font-size-2xl)',
                color: 'var(--color-secondary)',
              }}
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                padding: 'var(--spacing-md) 0',
                borderTop: '1px solid var(--color-gray-200)',
              }}
            >
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  onClick={() => setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    color: 'var(--color-gray-700)',
                    fontWeight: 500,
                  }}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    color: 'var(--color-gray-700)',
                    fontWeight: 500,
                  }}>
                    <FiUser /> Dashboard
                  </Link>
                  <button onClick={handleLogout} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    color: 'var(--color-error)',
                    fontWeight: 500,
                    width: '100%',
                    textAlign: 'left',
                  }}>
                    <FiLogOut /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    color: 'var(--color-gray-700)',
                    fontWeight: 500,
                  }}>
                    <FiLogIn /> Login
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-md)',
                    color: 'var(--color-gray-700)',
                    fontWeight: 500,
                  }}>
                    Register
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-links.desktop { display: none; }
          .auth-buttons { display: none; }
          .mobile-menu-btn { display: block; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;