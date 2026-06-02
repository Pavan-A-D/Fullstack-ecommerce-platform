/**
 * Navbar — dark glassmorphism navigation with gradient brand, cart badge, auth
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-xl font-bold gradient-text">ShopVerse</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-surface-200 hover:text-primary-400 transition-colors font-medium text-sm">
              Home
            </Link>
            <Link to="/products" className="text-surface-200 hover:text-primary-400 transition-colors font-medium text-sm">
              Products
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-surface-200 hover:text-primary-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-surface-200 hover:text-primary-400 transition-colors font-medium text-sm">
                    Admin
                  </Link>
                )}
                <Link to="/orders" className="text-surface-200 hover:text-primary-400 transition-colors font-medium text-sm">
                  Orders
                </Link>
                <span className="text-primary-400 font-medium text-sm">Hi, {user.name.split(' ')[0]}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-sm text-surface-200 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-surface-200 hover:text-primary-400 transition-colors font-medium text-sm">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-600 to-primary-500 text-white text-sm font-medium hover:from-primary-500 hover:to-primary-400 transition-all"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative text-surface-200">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-accent-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-surface-200 cursor-pointer">
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t border-primary-500/10 px-4 py-4 space-y-2">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-surface-200 hover:text-primary-400">Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2 text-surface-200 hover:text-primary-400">Products</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="block py-2 text-surface-200 hover:text-primary-400">Admin</Link>
              )}
              <Link to="/orders" onClick={() => setMenuOpen(false)} className="block py-2 text-surface-200 hover:text-primary-400">Orders</Link>
              <button onClick={handleLogout} className="block py-2 text-red-400 cursor-pointer">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 text-surface-200 hover:text-primary-400">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block py-2 text-primary-400 font-medium">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
