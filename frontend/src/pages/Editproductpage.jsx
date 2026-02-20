import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEdit, FiSave } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

const CATEGORIES = ['Whole Spices', 'Ground Spices', 'Spice Blends', 'Herbs', 'Other'];

const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ProductID from URL e.g. /admin/products/PRD00001/edit
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [form, setForm] = useState({
    ProductName: '',
    Category: '',
    Description: '',
    Price: '',
    StockQuantity: '',
    ImageURL: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setFetchLoading(true);
    try {
      const res = await productService.getProduct(id);
      const p = res.data.product;
      setForm({
        ProductName: p.ProductName || '',
        Category: p.Category || '',
        Description: p.Description || '',
        Price: p.Price ?? '',
        StockQuantity: p.StockQuantity ?? '',
        ImageURL: p.ImageURL || ''
      });
    } catch (error) {
      toast.error('Failed to load product details');
      navigate('/admin/dashboard');
    } finally {
      setFetchLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.ProductName.trim()) newErrors.ProductName = 'Product name is required';
    if (!form.Category) newErrors.Category = 'Category is required';
    if (!form.Price || isNaN(form.Price) || Number(form.Price) < 0)
      newErrors.Price = 'Valid price is required';
    if (form.StockQuantity === '' || isNaN(form.StockQuantity) || Number(form.StockQuantity) < 0)
      newErrors.StockQuantity = 'Valid stock quantity is required';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        Price: Number(form.Price),
        StockQuantity: Number(form.StockQuantity)
      };

      await productService.updateProduct(id, payload);
      toast.success('Product updated successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update product';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading product...</p>
        <style jsx>{`
          .page-loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            gap: var(--spacing-md);
            color: var(--color-gray-600);
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--color-gray-200);
            border-top-color: var(--color-secondary);
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="edit-product-page">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/admin/dashboard')}>
            <FiArrowLeft />
            <span>Back to Dashboard</span>
          </button>
          <div className="header-title">
            <div className="title-icon">
              <FiEdit />
            </div>
            <div>
              <h1>Edit Product</h1>
              <p>Update the details for <strong>{form.ProductName}</strong></p>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div
          className="form-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              {/* Product Name */}
              <div className="form-group full-width">
                <label htmlFor="ProductName">Product Name *</label>
                <input
                  id="ProductName"
                  name="ProductName"
                  type="text"
                  value={form.ProductName}
                  onChange={handleChange}
                  placeholder="e.g. Ceylon Cinnamon"
                  className={errors.ProductName ? 'input-error' : ''}
                />
                {errors.ProductName && <span className="error-msg">{errors.ProductName}</span>}
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="Category">Category *</label>
                <select
                  id="Category"
                  name="Category"
                  value={form.Category}
                  onChange={handleChange}
                  className={errors.Category ? 'input-error' : ''}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.Category && <span className="error-msg">{errors.Category}</span>}
              </div>

              {/* Price */}
              <div className="form-group">
                <label htmlFor="Price">Price (Rs.) *</label>
                <input
                  id="Price"
                  name="Price"
                  type="number"
                  value={form.Price}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className={errors.Price ? 'input-error' : ''}
                />
                {errors.Price && <span className="error-msg">{errors.Price}</span>}
              </div>

              {/* Stock Quantity */}
              <div className="form-group">
                <label htmlFor="StockQuantity">Stock Quantity *</label>
                <input
                  id="StockQuantity"
                  name="StockQuantity"
                  type="number"
                  value={form.StockQuantity}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={errors.StockQuantity ? 'input-error' : ''}
                />
                {errors.StockQuantity && <span className="error-msg">{errors.StockQuantity}</span>}
              </div>

              {/* Image URL */}
              <div className="form-group full-width">
                <label htmlFor="ImageURL">Image URL <span className="optional">(optional)</span></label>
                <input
                  id="ImageURL"
                  name="ImageURL"
                  type="text"
                  value={form.ImageURL}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Description */}
              <div className="form-group full-width">
                <label htmlFor="Description">Description <span className="optional">(optional)</span></label>
                <textarea
                  id="Description"
                  name="Description"
                  value={form.Description}
                  onChange={handleChange}
                  placeholder="Describe the product..."
                  rows={4}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/admin/dashboard')}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-sm"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <style jsx>{`
        .edit-product-page {
          padding: var(--spacing-xl) 0;
          min-height: 100vh;
          background: var(--color-gray-50, #f9fafb);
        }

        .page-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 var(--spacing-lg);
        }

        .page-header {
          margin-bottom: var(--spacing-2xl);
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--color-gray-600);
          font-size: var(--font-size-sm);
          margin-bottom: var(--spacing-lg);
          transition: color var(--transition-fast);
        }

        .back-btn:hover {
          color: var(--color-secondary);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
        }

        .title-icon {
          width: 56px;
          height: 56px;
          background: var(--color-warning, #F59E0B);
          color: white;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .header-title h1 {
          color: var(--color-secondary);
          margin-bottom: 4px;
        }

        .header-title p {
          color: var(--color-gray-600);
          font-size: var(--font-size-sm);
        }

        .form-card {
          background: var(--color-white);
          border-radius: var(--radius-lg);
          padding: var(--spacing-2xl);
          box-shadow: var(--shadow-md);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        label {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-gray-700);
        }

        .optional {
          font-weight: 400;
          color: var(--color-gray-500);
        }

        input, select, textarea {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border: 2px solid var(--color-gray-200);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          color: var(--color-gray-900);
          background: var(--color-white);
          transition: border-color var(--transition-fast);
          box-sizing: border-box;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: var(--color-secondary);
        }

        input.input-error, select.input-error {
          border-color: var(--color-error);
        }

        .error-msg {
          color: var(--color-error);
          font-size: 0.75rem;
        }

        textarea {
          resize: vertical;
          font-family: inherit;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-md);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--color-gray-200);
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-sm) var(--spacing-xl);
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: var(--font-size-sm);
          transition: all var(--transition-fast);
          cursor: pointer;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: var(--color-secondary);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--color-secondary-dark, #1e3d33);
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: var(--color-gray-100);
          color: var(--color-gray-700);
          border: 1px solid var(--color-gray-200);
        }

        .btn-secondary:hover:not(:disabled) {
          background: var(--color-gray-200);
        }

        .spinner-sm {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-group.full-width {
            grid-column: 1;
          }

          .form-card {
            padding: var(--spacing-lg);
          }
        }
      `}</style>
    </div>
  );
};

export default EditProductPage;