import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      className="product-card"
      whileHover={{ y: -8 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="product-image">
        <img 
          src={product.ImageURL || '/default-product.jpg'} 
          alt={product.ProductName}
        />
        {product.StockQuantity <= 0 && (
          <span className="out-of-stock">Out of Stock</span>
        )}
      </div>

      <div className="product-info">
        <h3>{product.ProductName}</h3>
        <p className="product-category">{product.Category}</p>
        <p className="product-price">
          Rs. {product.Price.toLocaleString()}
        </p>
        <p className="product-stock">
          {product.StockQuantity > 0 ? (
            <>In Stock: {product.StockQuantity}</>
          ) : (
            <span style={{ color: 'var(--color-error)' }}>Out of Stock</span>
          )}
        </p>

        <div className="product-actions">
          <Link to={`/product/${product.ProductID}`} className="btn btn-outline">
            <FiEye /> View
          </Link>
          <button 
            className="btn btn-primary"
            onClick={() => addToCart(product)}
            disabled={product.StockQuantity <= 0}
          >
            <FiShoppingCart /> Add to Cart
          </button>
        </div>
      </div>

      <style jsx>{`
        .product-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          transition: all var(--transition-base);
        }

        .product-image {
          height: 200px;
          overflow: hidden;
          position: relative;
          background: var(--color-gray-100);
        }

        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-base);
        }

        .product-card:hover .product-image img {
          transform: scale(1.1);
        }

        .out-of-stock {
          position: absolute;
          top: var(--spacing-sm);
          right: var(--spacing-sm);
          background: var(--color-error);
          color: var(--color-white);
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: 500;
        }

        .product-info {
          padding: var(--spacing-lg);
        }

        .product-info h3 {
          margin-bottom: var(--spacing-xs);
          font-size: var(--font-size-lg);
        }

        .product-category {
          color: var(--color-gray-500);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-sm);
        }

        .product-price {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--color-secondary);
          margin-bottom: var(--spacing-sm);
        }

        .product-stock {
          color: var(--color-gray-600);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-md);
        }

        .product-actions {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: var(--spacing-sm);
        }

        .product-actions .btn {
          padding: var(--spacing-sm);
          font-size: var(--font-size-sm);
        }

        @media (max-width: 768px) {
          .product-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default ProductCard;