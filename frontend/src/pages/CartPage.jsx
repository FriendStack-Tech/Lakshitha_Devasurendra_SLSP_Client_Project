import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      return;
    }
    // Navigate to checkout page
    window.location.href = '/checkout';
  };

  if (cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <FiShoppingBag size={64} />
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items yet</p>
        <Link to="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>

        <style jsx>{`
          .empty-cart {
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: var(--spacing-md);
            text-align: center;
            padding: var(--spacing-xl);
          }

          .empty-cart svg {
            color: var(--color-gray-400);
          }

          .empty-cart h2 {
            color: var(--color-gray-700);
          }

          .empty-cart p {
            color: var(--color-gray-500);
            margin-bottom: var(--spacing-lg);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-content">
          {/* Cart Items */}
          <div className="cart-items">
            {cart.items.map((item) => (
              <motion.div 
                key={item.ProductID}
                className="cart-item"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="item-image">
                  <img src={item.ImageURL || '/default-product.jpg'} alt={item.ProductName} />
                </div>

                <div className="item-details">
                  <h3>{item.ProductName}</h3>
                  <p className="item-category">{item.Category}</p>
                  <p className="item-price">Rs. {item.Price.toLocaleString()}</p>
                </div>

                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item.ProductID, item.quantity - 1, item.ProductName)}
                    className="quantity-btn"
                  >
                    <FiMinus />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.ProductID, item.quantity + 1, item.ProductName)}
                    className="quantity-btn"
                  >
                    <FiPlus />
                  </button>
                </div>

                <div className="item-total">
                  <p>Rs. {(item.Price * item.quantity).toLocaleString()}</p>
                </div>

                <button 
                  className="remove-btn"
                  onClick={() => removeFromCart(item.ProductID, item.ProductName)}
                >
                  <FiTrash2 />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs. {cart.totalAmount.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>Rs. 350</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>Rs. {(cart.totalAmount + 350).toLocaleString()}</span>
              </div>
            </div>

            <button 
              className="btn btn-primary checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <div className="cart-actions">
              <Link to="/shop" className="continue-shopping">
                <FiArrowLeft /> Continue Shopping
              </Link>
              <button onClick={clearCart} className="clear-cart">
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cart-page {
          padding: var(--spacing-xl) 0;
        }

        .cart-page h1 {
          margin-bottom: var(--spacing-xl);
        }

        .cart-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-xl);
        }

        .cart-items {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          overflow: hidden;
        }

        .cart-item {
          display: grid;
          grid-template-columns: auto 1fr auto auto auto;
          gap: var(--spacing-md);
          align-items: center;
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--color-gray-200);
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .item-image {
          width: 80px;
          height: 80px;
          background: var(--color-gray-100);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details h3 {
          margin-bottom: var(--spacing-xs);
          font-size: var(--font-size-lg);
        }

        .item-category {
          color: var(--color-gray-500);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-xs);
        }

        .item-price {
          font-weight: 600;
          color: var(--color-secondary);
        }

        .item-quantity {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .quantity-btn {
          width: 32px;
          height: 32px;
          border: 2px solid var(--color-gray-200);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-gray-600);
          transition: all var(--transition-fast);
        }

        .quantity-btn:hover {
          background: var(--color-secondary);
          border-color: var(--color-secondary);
          color: var(--color-white);
        }

        .quantity {
          font-weight: 500;
          min-width: 30px;
          text-align: center;
        }

        .item-total {
          font-weight: 600;
          color: var(--color-secondary);
        }

        .remove-btn {
          color: var(--color-error);
          font-size: var(--font-size-lg);
          transition: transform var(--transition-fast);
        }

        .remove-btn:hover {
          transform: scale(1.1);
        }

        .order-summary {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-md);
          height: fit-content;
        }

        .order-summary h2 {
          margin-bottom: var(--spacing-lg);
        }

        .summary-details {
          margin-bottom: var(--spacing-xl);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-sm) 0;
          color: var(--color-gray-600);
        }

        .summary-row.total {
          border-top: 2px solid var(--color-gray-200);
          margin-top: var(--spacing-sm);
          padding-top: var(--spacing-lg);
          font-weight: 700;
          color: var(--color-gray-900);
          font-size: var(--font-size-lg);
        }

        .checkout-btn {
          width: 100%;
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .cart-actions {
          display: flex;
          justify-content: space-between;
        }

        .continue-shopping {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          color: var(--color-secondary);
          font-weight: 500;
        }

        .clear-cart {
          color: var(--color-error);
          font-weight: 500;
        }

        @media (max-width: 968px) {
          .cart-content {
            grid-template-columns: 1fr;
          }

          .cart-item {
            grid-template-columns: auto 1fr auto;
            grid-template-rows: auto auto;
          }

          .item-total {
            grid-column: 3;
            grid-row: 1;
          }

          .remove-btn {
            grid-column: 3;
            grid-row: 2;
            justify-self: end;
          }
        }

        @media (max-width: 480px) {
          .cart-item {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .item-image {
            margin: 0 auto;
          }

          .item-quantity {
            justify-content: center;
          }

          .remove-btn {
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
};

export default CartPage;