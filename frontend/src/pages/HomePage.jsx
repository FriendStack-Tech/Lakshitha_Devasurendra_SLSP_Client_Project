import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

const HomePage = () => {
  const features = [
    {
      icon: <FiStar />,
      title: 'Premium Quality',
      description: 'Directly sourced from Sri Lankan farmers'
    },
    {
      icon: <FiTruck />,
      title: 'Worldwide Shipping',
      description: 'Fast and reliable delivery to your doorstep'
    },
    {
      icon: <FiShield />,
      title: '100% Pure',
      description: 'No additives, no preservatives'
    },
    {
      icon: <FiRefreshCw />,
      title: 'Easy Returns',
      description: '30-day money-back guarantee'
    }
  ];

  const categories = [
    { name: 'Whole Spices', image: '/whole-spices.jpg', count: 15 },
    { name: 'Ground Spices', image: '/ground-spices.jpg', count: 20 },
    { name: 'Spice Blends', image: '/blends.jpg', count: 12 },
    { name: 'Herbs', image: '/herbs.jpg', count: 8 },
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Discover the Authentic Taste of <span className="highlight">Sri Lanka</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Premium quality spices directly sourced from local farmers. 
              Experience the rich flavors that made Sri Lanka the spice capital of the world.
            </motion.p>
            <motion.div
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/shop" className="btn btn-primary">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/about" className="btn btn-outline">
                Learn More
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="category-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="category-image">
                  <div className="category-overlay">
                    <h3>{category.name}</h3>
                    <p>{category.count} Products</p>
                    <Link to={`/shop?category=${category.name}`} className="btn btn-outline">
                      Explore
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Real Sri Lankan Spices?</h2>
            <p>Join hundreds of happy customers who have discovered the authentic taste</p>
            <Link to="/shop" className="btn btn-primary btn-large">
              Start Shopping Now
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .homepage {
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero {
          min-height: 80vh;
          background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%);
          color: var(--color-white);
          display: flex;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: url('/spice-pattern.png') repeat;
          opacity: 0.1;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .hero h1 {
          color: var(--color-white);
          font-size: clamp(2rem, 5vw, 3.5rem);
          margin-bottom: var(--spacing-lg);
        }

        .hero .highlight {
          color: var(--color-accent);
        }

        .hero p {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-xl);
          opacity: 0.9;
        }

        .hero-buttons {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
        }

        /* Features Section */
        .features {
          padding: var(--spacing-3xl) 0;
          background: var(--color-white);
        }

        .section-title {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--spacing-xl);
        }

        .feature-card {
          text-align: center;
          padding: var(--spacing-xl);
          background: var(--color-primary-bg);
          border-radius: var(--radius-lg);
          transition: all var(--transition-base);
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }

        .feature-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto var(--spacing-lg);
          background: var(--color-secondary);
          color: var(--color-white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-2xl);
        }

        .feature-card h3 {
          margin-bottom: var(--spacing-sm);
        }

        .feature-card p {
          color: var(--color-gray-600);
        }

        /* Categories Section */
        .categories {
          padding: var(--spacing-3xl) 0;
          background: var(--color-primary-bg);
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-xl);
        }

        .category-card {
          height: 300px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          position: relative;
          cursor: pointer;
        }

        .category-image {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-secondary-dark) 100%);
          position: relative;
          transition: transform var(--transition-base);
        }

        .category-card:hover .category-image {
          transform: scale(1.1);
        }

        .category-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--color-white);
          padding: var(--spacing-lg);
          text-align: center;
        }

        .category-overlay h3 {
          color: var(--color-white);
          margin-bottom: var(--spacing-sm);
        }

        .category-overlay p {
          margin-bottom: var(--spacing-lg);
          opacity: 0.9;
        }

        /* CTA Section */
        .cta {
          padding: var(--spacing-3xl) 0;
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
          color: var(--color-white);
          text-align: center;
        }

        .cta-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .cta h2 {
          color: var(--color-white);
          margin-bottom: var(--spacing-md);
        }

        .cta p {
          margin-bottom: var(--spacing-xl);
          opacity: 0.9;
        }

        .btn-large {
          padding: var(--spacing-md) var(--spacing-2xl);
          font-size: var(--font-size-lg);
        }

        @media (max-width: 768px) {
          .hero-buttons {
            flex-direction: column;
          }

          .features-grid,
          .categories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;