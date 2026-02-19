import React, { useState } from 'react';
import { useProducts } from '../../context/ProductContext';

const categories = [
  'Spice Powder',
  'Whole Spices',
  'Spice Blends',
  'Herbal Products'
];

const ProductFilter = () => {
  const { filters, updateFilters, clearFilters } = useProducts();
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters({ search: localSearch });
  };

  const handleCategoryChange = (category) => {
    updateFilters({ category: category === filters.category ? '' : category });
  };

  const handlePriceChange = (type, value) => {
    updateFilters({ [type]: value });
  };

  const handleClear = () => {
    setLocalSearch('');
    clearFilters();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md sticky top-4">
      <h3 className="text-lg font-semibold mb-4">Filter Products</h3>
      
      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 text-gray-400 hover:text-primary-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </form>
      
      {/* Categories */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.category === category}
                onChange={() => handleCategoryChange(category)}
                className="rounded text-primary-600 focus:ring-primary-500 mr-2"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Price Range</h4>
        <div className="flex space-x-2">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
              min="0"
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
              min="0"
            />
          </div>
        </div>
      </div>
      
      {/* Clear Filters */}
      {(filters.search || filters.category || filters.minPrice || filters.maxPrice) && (
        <button
          onClick={handleClear}
          className="w-full flex items-center justify-center text-sm text-gray-600 hover:text-primary-600 border border-gray-300 rounded-lg px-3 py-2 hover:border-primary-600 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default ProductFilter;