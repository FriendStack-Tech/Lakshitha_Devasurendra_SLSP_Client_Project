import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--color-secondary)',
      color: 'var(--color-white)',
      padding: 'var(--spacing-3xl) 0 var(--spacing-xl)',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-xl)',
          marginBottom: 'var(--spacing-2xl)',
        }}>
          {/* About */}
          <div>
            <h3 style={{ color: 'var(--color-white)' }}>Spice Emporium</h3>
            <p style={{ opacity: 0.8, marginBottom: 'var(--spacing-lg)' }}>
              Bringing the finest Sri Lankan spices to your kitchen since 2024. 
              Authentic, pure, and sustainably sourced.
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              <a href="#" style={{ color: 'var(--color-white)', opacity: 0.8 }}>
                <FiFacebook size={20} />
              </a>
              <a href="#" style={{ color: 'var(--color-white)', opacity: 0.8 }}>
                <FiTwitter size={20} />
              </a>
              <a href="#" style={{ color: 'var(--color-white)', opacity: 0.8 }}>
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'var(--color-white)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                <Link to="/" style={{ color: 'var(--color-white)', opacity: 0.8 }}>Home</Link>
              </li>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                <Link to="/shop" style={{ color: 'var(--color-white)', opacity: 0.8 }}>Shop</Link>
              </li>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                <Link to="/about" style={{ color: 'var(--color-white)', opacity: 0.8 }}>About Us</Link>
              </li>
              <li style={{ marginBottom: 'var(--spacing-sm)' }}>
                <Link to="/contact" style={{ color: 'var(--color-white)', opacity: 0.8 }}>Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ color: 'var(--color-white)' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                <FiMapPin />
                <span style={{ opacity: 0.8 }}>No 686/B, Vihara Mawatha, Ihala Biyanwila, Kadawatha</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                <FiPhone />
                <span style={{ opacity: 0.8 }}>+94 77 123 4567</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-md)' }}>
                <FiMail />
                <span style={{ opacity: 0.8 }}>Devspices@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          textAlign: 'center',
          paddingTop: 'var(--spacing-xl)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          opacity: 0.6,
          fontSize: 'var(--font-size-sm)',
        }}>
          <p>&copy; {new Date().getFullYear()} Sri Lankan Dev Spice Pvt Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;