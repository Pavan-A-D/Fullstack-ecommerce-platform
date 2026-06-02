/**
 * Home Page — dark hero with gradient orbs, glass categories, featured products
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(({ data }) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const categories = [...new Set(products.map((p) => p.category))];

  if (loading) return <Loader />;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 via-surface-950 to-accent-600/20" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="gradient-text">Shop the Future</span>
          </h1>
          <p className="text-lg md:text-xl text-surface-200 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover premium products with cutting-edge design. Electronics, fashion, accessories and more — all in one place.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/products"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-500/25"
            >
              Explore Products
            </Link>
            <Link
              to="/products"
              className="px-8 py-3.5 rounded-xl glass text-surface-200 font-semibold hover:text-primary-400 transition-all"
            >
              View All →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-surface-100 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              to={`/products?category=${encodeURIComponent(cat)}`}
              key={cat}
              className="glass-card rounded-xl p-5 text-center hover:border-primary-500/30 transition-all group"
            >
              <div className="text-3xl mb-3">
                {cat === 'Electronics' ? '🔌' : cat === 'Clothing' ? '👕' : cat === 'Accessories' ? '👜' : cat === 'Footwear' ? '👟' : '🏠'}
              </div>
              <h3 className="font-medium text-surface-200 text-sm group-hover:text-primary-400 transition-colors">{cat}</h3>
              <p className="text-xs text-surface-700 mt-1">{products.filter((p) => p.category === cat).length} items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-surface-100">Featured Products</h2>
          <Link to="/products" className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-primary-500/10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-lg font-bold gradient-text">ShopVerse</span>
          </div>
          <p className="text-surface-700 text-sm">Premium products. Exceptional experience.</p>
          <p className="text-surface-700 text-xs mt-4">© 2026 ShopVerse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
