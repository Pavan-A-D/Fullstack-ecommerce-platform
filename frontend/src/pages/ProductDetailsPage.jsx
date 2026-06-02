/**
 * Product Details Page — dark theme with glass card layout
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetchProductById(id)
      .then(({ data }) => setProduct(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Loader />;
  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold text-surface-100 mb-2">Product not found</h2>
      <Link to="/products" className="text-primary-400 hover:underline">← Back to Products</Link>
    </div>
  );

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const imageUrl = product.image?.startsWith('http') 
    ? product.image 
    : `${BACKEND_URL}${product.image}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-surface-700 mb-8">
        <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-primary-400 transition-colors">Products</Link>
        <span className="mx-2">/</span>
        <span className="text-surface-200">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <img src={imageUrl} alt={product.name} className="w-full h-[450px] object-cover" />
        </div>

        {/* Details */}
        <div className="space-y-5">
          <span className="inline-block text-xs font-semibold text-primary-400 bg-primary-500/10 px-3 py-1 rounded-full">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-surface-100">{product.name}</h1>

          <div className="flex items-center gap-2">
            <span className="text-yellow-400 text-sm">
              {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
            </span>
            <span className="text-surface-700 text-sm">{product.rating} / 5</span>
          </div>

          <p className="text-surface-200 leading-relaxed">{product.description}</p>

          <p className="text-4xl font-bold text-surface-100">₹{product.price.toLocaleString('en-IN')}</p>

          <div className="flex gap-4 pt-3">
            <button
              onClick={handleAdd}
              disabled={added}
              className={`flex-1 py-3.5 rounded-xl font-semibold transition-all cursor-pointer ${
                added
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 shadow-lg shadow-primary-500/25'
              }`}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <Link to="/cart" className="px-6 py-3.5 rounded-xl glass text-surface-200 hover:text-primary-400 font-medium text-center transition-all">
              View Cart
            </Link>
          </div>

          {/* Badges */}
          <div className="flex gap-6 pt-5 border-t border-surface-700/50 text-xs text-surface-700">
            <span>🚚 Free Shipping</span>
            <span>🛡️ 1 Year Warranty</span>
            <span>↩️ Easy Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
