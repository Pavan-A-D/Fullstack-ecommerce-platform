/**
 * Register Page — dark glassmorphism auth card
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;
    setLoading(true);
    const ok = await register({ name: form.name, email: form.email, password: form.password });
    setLoading(false);
    if (ok) navigate('/');
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl bg-surface-900/50 border ${errors[field] ? 'border-red-500' : 'border-surface-700'} text-surface-100 placeholder-surface-700 focus:outline-none focus:border-primary-500 text-sm`;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm glass-card rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-surface-100 text-center mb-1">Create Account</h1>
        <p className="text-surface-700 text-center text-sm mb-6">Join ShopVerse today</p>

        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass('name')} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass('email')} />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={inputClass('password')} />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-200 mb-1.5">Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className={inputClass('confirmPassword')} />
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold hover:from-primary-500 hover:to-primary-400 disabled:opacity-50 cursor-pointer transition-all">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-surface-700 mt-5">
          Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
