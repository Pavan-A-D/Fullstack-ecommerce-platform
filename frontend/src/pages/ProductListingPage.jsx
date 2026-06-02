/**
 * Product Listing Page — dark theme with glass filters sidebar
 */

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const ProductListingPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    fetchProducts()
      .then(({ data }) => setProducts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (debouncedSearch) result = result.filter((p) => p.name.toLowerCase().includes(debouncedSearch.toLowerCase()));
    if (category) result = result.filter((p) => p.category === category);
    result = result.filter((p) => p.price <= maxPrice);
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, debouncedSearch, category, maxPrice, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setMaxPrice(10000);
    setSortBy('');
    setSearchParams({});
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-surface-100 mb-8">All Products</h1>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-96 px-4 py-3 rounded-xl bg-surface-900/50 border border-surface-700 text-surface-100 placeholder-surface-700 focus:outline-none focus:border-primary-500 text-sm"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <aside className="lg:w-60 shrink-0 space-y-5">
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-surface-200 mb-3 text-sm">Category</h3>
            <div className="space-y-1">
              <button onClick={() => { setCategory(''); setSearchParams({}); }}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${!category ? 'bg-primary-600 text-white' : 'text-surface-200 hover:bg-surface-800'}`}>
                All
              </button>
              {categories.map((cat) => (
                <button key={cat} onClick={() => { setCategory(cat); setSearchParams({ category: cat }); }}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${category === cat ? 'bg-primary-600 text-white' : 'text-surface-200 hover:bg-surface-800'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-surface-200 mb-3 text-sm">Max Price: ₹{maxPrice.toLocaleString('en-IN')}</h3>
            <input type="range" min="500" max="10000" step="500" value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-primary-500" />
          </div>

          <div className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-surface-200 mb-3 text-sm">Sort By</h3>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-surface-900 border border-surface-700 text-surface-200 text-sm focus:outline-none focus:border-primary-500">
              <option value="">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>

          <button onClick={clearFilters} className="w-full py-2.5 rounded-lg border border-surface-700 text-surface-200 hover:bg-surface-800 text-sm cursor-pointer transition-all">
            Clear Filters
          </button>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <p className="text-sm text-surface-700 mb-4">{filtered.length} product(s) found</p>
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-surface-700 text-lg">No products match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
