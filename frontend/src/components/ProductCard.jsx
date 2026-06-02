/**
 * ProductCard — glassmorphism card with hover glow, dark palette
 */

import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  // Construct full image URL if it's a relative path
  const imageUrl = product.image?.startsWith('http') 
    ? product.image 
    : `${BACKEND_URL}${product.image}`;

  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:border-primary-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]">
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </Link>

      {/* Info */}
      <div className="p-5 space-y-3">
        <span className="inline-block text-xs font-semibold text-primary-400 bg-primary-500/10 px-2.5 py-1 rounded-full">
          {product.category}
        </span>

        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-surface-100 line-clamp-1 group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 text-sm">
          <div className="text-yellow-400">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </div>
          <span className="text-surface-700 text-xs">({product.rating})</span>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xl font-bold text-surface-100">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium hover:from-primary-500 hover:to-primary-400 transition-all cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
