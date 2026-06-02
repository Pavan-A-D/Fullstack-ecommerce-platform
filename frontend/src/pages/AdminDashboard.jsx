/**
 * Admin Dashboard — dark theme, product management (add, edit, delete)
 */

import { useState, useEffect } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', category: '', rating: '', description: '', image: null,
  });

  useEffect(() => { loadProducts(); }, []);

  useEffect(() => {
    if (user && user.role !== 'admin') navigate('/');
  }, [user, navigate]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const { data } = await fetchProducts();
      setProducts(data);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setFormData({ ...formData, image: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null); setSuccess(null);
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('rating', formData.rating);
      data.append('description', formData.description);
      if (formData.image) data.append('image', formData.image);

      if (editingId) {
        await updateProduct(editingId, data);
        setSuccess('Product updated successfully!');
      } else {
        await createProduct(data);
        setSuccess('Product added successfully!');
      }
      setFormData({ name: '', price: '', category: '', rating: '', description: '', image: null });
      setShowForm(false); setEditingId(null);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name, price: product.price, category: product.category,
      rating: product.rating, description: product.description, image: null,
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setError(null);
        await deleteProduct(id);
        setSuccess('Product deleted successfully!');
        loadProducts();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', price: '', category: '', rating: '', description: '', image: null });
    setShowForm(false); setEditingId(null); setError(null);
  };

  if (loading) return <Loader />;

  const inputClass = "w-full px-4 py-3 rounded-xl bg-surface-900/50 border border-surface-700 text-surface-100 placeholder-surface-700 focus:outline-none focus:border-primary-500 text-sm";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold gradient-text">Admin Dashboard</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-400 transition-all cursor-pointer">
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {error && <div className="mb-5 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">{error}</div>}
      {success && <div className="mb-5 p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl">{success}</div>}

      {showForm && (
        <div className="mb-8 glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold text-surface-100 mb-5">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" placeholder="Product Name" value={formData.name}
              onChange={handleInputChange} required className={inputClass} />
            <input type="number" name="price" placeholder="Price" value={formData.price}
              onChange={handleInputChange} required className={inputClass} />
            <input type="text" name="category" placeholder="Category" value={formData.category}
              onChange={handleInputChange} required className={inputClass} />
            <input type="number" name="rating" placeholder="Rating (0-5)" value={formData.rating}
              onChange={handleInputChange} min="0" max="5" step="0.1" className={inputClass} />
            <input type="file" name="image" accept="image/*" onChange={handleImageChange}
              className="px-4 py-3 rounded-xl border border-surface-700 text-surface-200 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary-500/20 file:text-primary-400 file:px-3 file:py-1 file:text-sm file:cursor-pointer" />
            <textarea name="description" placeholder="Description" value={formData.description}
              onChange={handleInputChange} rows="3" className={`md:col-span-2 ${inputClass}`} />
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-medium hover:from-primary-500 hover:to-primary-400 transition-all cursor-pointer">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
              <button type="button" onClick={handleCancel}
                className="px-5 py-2.5 rounded-xl border border-surface-700 text-surface-200 hover:bg-surface-800 transition-all cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-surface-700">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-surface-200">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-surface-200">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-surface-200">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-surface-200">Rating</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-surface-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-8 text-center text-surface-700">No products found</td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-surface-700/50 hover:bg-surface-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-surface-100 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-surface-200">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm text-surface-200">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-surface-200">{product.rating} ⭐</td>
                  <td className="px-6 py-4 text-sm flex gap-2">
                    <button onClick={() => handleEdit(product)}
                      className="px-3 py-1.5 text-primary-400 hover:bg-primary-500/10 rounded-lg cursor-pointer transition-colors">Edit</button>
                    <button onClick={() => handleDelete(product.id)}
                      className="px-3 py-1.5 text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
