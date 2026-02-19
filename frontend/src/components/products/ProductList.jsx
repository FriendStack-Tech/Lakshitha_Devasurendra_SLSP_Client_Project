import React from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/Loader';

const ProductList = () => {
  const { products, loading } = useProducts();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;