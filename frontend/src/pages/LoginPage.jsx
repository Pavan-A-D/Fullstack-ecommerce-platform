/**
 * Login Page — dark glassmorphism auth card
 */

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    setLoading(true);
    const ok = await login(form);
    setLoading(false);
    if (ok) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm glass-card rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-surface-100 text-center mb-1">Welcome Back</h1>
        <p className="text-surface-700 text-center text-sm mb-6">Sign in to your account</p>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-surface-900/50 border ${errors.email ? 'border-red-500' : 'border-surface-700'} text-surface-100 placeholder-surface-700 focus:outline-none focus:border-primary-500 text-sm`} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl bg-surface-900/50 border ${errors.password ? 'border-red-500' : 'border-surface-700'} text-surface-100 placeholder-surface-700 focus:outline-none focus:border-primary-500 text-sm`} />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold hover:from-primary-500 hover:to-primary-400 disabled:opacity-50 cursor-pointer transition-all">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-surface-700 mt-5">
          Don&apos;t have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">Sign Up</Link>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
