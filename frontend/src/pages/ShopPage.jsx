import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';
import ProductCard from '../components/products/ProductCard';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All',
    'Whole Spices',
    'Ground Spices',
    'Spice Blends',
    'Herbs',
    'Other'
  ];

  useEffect(() => {
    fetchProducts();
  }, [filters.category, filters.minPrice, filters.maxPrice, filters.search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.search) params.search = filters.search;

      const response = await productService.getAllProducts(params);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
  };

  return (
    <div className="shop-page">
      <div className="container">
        {/* Header */}
        <div className="shop-header">
          <h1>Our Spice Collection</h1>
          <p>Discover the finest Sri Lankan spices</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="shop-toolbar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              name="search"
              placeholder="Search spices..."
              value={filters.search}
              onChange={handleFilterChange}
              className="search-input"
            />
          </div>
          
          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter /> Filters
          </button>
        </div>

        {/* Filters */}
        <motion.div 
          className={`filters-panel ${showFilters ? 'show' : ''}`}
          initial={false}
          animate={{ height: showFilters ? 'auto' : 0 }}
        >
          <div className="filters-content">
            <div className="filter-group">
              <label>Category</label>
              <select 
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="filter-select"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="price-input"
                />
                <span>to</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="price-input"
                />
              </div>
            </div>

            <button className="btn btn-outline" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try adjusting your filters</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.ProductID} product={product} />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .shop-page {
          padding: var(--spacing-xl) 0;
        }

        .shop-header {
          text-align: center;
          margin-bottom: var(--spacing-2xl);
        }

        .shop-header h1 {
          color: var(--color-secondary);
          margin-bottom: var(--spacing-sm);
        }

        .shop-header p {
          color: var(--color-gray-600);
          font-size: var(--font-size-lg);
        }

        .shop-toolbar {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
        }

        .search-box {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: var(--spacing-md);
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-gray-400);
        }

        .search-input {
          width: 100%;
          padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 3rem;
          border: 2px solid var(--color-gray-200);
          border-radius: var(--radius-md);
          font-size: var(--font-size-md);
          transition: border-color var(--transition-fast);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--color-secondary);
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-md) var(--spacing-lg);
          background: var(--color-white);
          border: 2px solid var(--color-gray-200);
          border-radius: var(--radius-md);
          color: var(--color-gray-700);
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .filter-toggle:hover {
          border-color: var(--color-secondary);
          color: var(--color-secondary);
        }

        .filters-panel {
          overflow: hidden;
          margin-bottom: var(--spacing-lg);
        }

        .filters-content {
          padding: var(--spacing-lg);
          background: var(--color-white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--spacing-lg);
          align-items: end;
        }

        .filter-group label {
          display: block;
          margin-bottom: var(--spacing-sm);
          color: var(--color-gray-700);
          font-weight: 500;
        }

        .filter-select {
          width: 100%;
          padding: var(--spacing-sm);
          border: 2px solid var(--color-gray-200);
          border-radius: var(--radius-md);
          font-size: var(--font-size-md);
        }

        .price-inputs {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .price-input {
          flex: 1;
          padding: var(--spacing-sm);
          border: 2px solid var(--color-gray-200);
          border-radius: var(--radius-md);
          font-size: var(--font-size-md);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-lg);
        }

        .no-products {
          text-align: center;
          padding: var(--spacing-3xl) 0;
          color: var(--color-gray-500);
        }

        .no-products h3 {
          margin-bottom: var(--spacing-sm);
        }

        @media (max-width: 768px) {
          .shop-toolbar {
            flex-direction: column;
          }

          .filters-content {
            grid-template-columns: 1fr;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ShopPage;