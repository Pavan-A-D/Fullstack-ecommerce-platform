/**
 * Checkout Page — dark theme, glass forms, payment selector, backend order API
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrderAPI } from '../services/api';

// Field component moved outside to prevent re-creation on every render
const Field = ({ label, name, type = 'text', value, onChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-surface-200 mb-1.5">{label}</label>
    <input 
      type={type} 
      name={name} 
      value={value} 
      onChange={onChange}
      className={`w-full px-4 py-3 rounded-xl bg-surface-900/50 border ${error ? 'border-red-500' : 'border-surface-700'} text-surface-100 focus:outline-none focus:border-primary-500 text-sm`} 
    />
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '', email: user?.email || '',
    address: '', city: '', state: '', pincode: '', phone: '',
  });
  const [payment, setPayment] = useState('upi');
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.state.trim()) e.state = 'Required';
    if (!form.pincode.trim()) e.pincode = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPlacing(true);
    setApiError(null);
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.id || item._id, name: item.name,
          price: item.price, quantity: item.quantity, image: item.image,
        })),
        totalAmount: totalPrice,
        address: {
          fullName: form.fullName, phone: form.phone, street: form.address,
          city: form.city, state: form.state, pincode: form.pincode,
        },
      };
      await placeOrderAPI(orderData);
      clearCart();
      navigate('/orders', { state: { orderPlaced: true } });
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-surface-100 mb-2">No items to checkout</h2>
        <button onClick={() => navigate('/products')} className="text-primary-400 hover:underline cursor-pointer">Browse Products →</button>
      </div>
    );
  }

  const tax = totalPrice * 0.18;
  const grandTotal = totalPrice + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-surface-100 mb-8">Checkout</h1>
      {apiError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-xl mb-6">{apiError}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="font-bold text-surface-100 mb-5 text-lg">📍 Shipping Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
                <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} />
                <div className="sm:col-span-2"><Field label="Address" name="address" value={form.address} onChange={handleChange} error={errors.address} /></div>
                <Field label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} />
                <Field label="State" name="state" value={form.state} onChange={handleChange} error={errors.state} />
                <Field label="PIN Code" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} />
                <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} />
              </div>
            </div>

            {/* Payment */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="font-bold text-surface-100 mb-5 text-lg">💳 Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'upi', label: 'UPI', icon: '📱' },
                  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                ].map((opt) => (
                  <button key={opt.id} type="button" onClick={() => setPayment(opt.id)}
                    className={`p-4 rounded-xl text-left cursor-pointer transition-all ${
                      payment === opt.id
                        ? 'bg-primary-500/15 border border-primary-500/40 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                        : 'bg-surface-900/50 border border-surface-700 hover:border-surface-200/20'
                    }`}>
                    <span className="text-xl block mb-1">{opt.icon}</span>
                    <span className="text-sm font-medium text-surface-200">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card rounded-xl p-6 h-fit sticky top-20">
            <h2 className="font-bold text-surface-100 text-lg mb-5">Order Summary</h2>
            <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item.id || item._id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-surface-200 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-surface-700">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-medium text-surface-100">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-surface-700 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-surface-200"><span>Subtotal</span><span>₹{totalPrice.toLocaleString('en-IN')}</span></div>
              <div className="flex justify-between text-surface-200"><span>Shipping</span><span className="text-green-400">Free</span></div>
              <div className="flex justify-between text-surface-200"><span>GST (18%)</span><span>₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span></div>
              <div className="border-t border-surface-700 pt-2 flex justify-between font-bold text-surface-100">
                <span>Total</span><span>₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
            <button type="submit" disabled={placing}
              className="w-full mt-5 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold hover:from-primary-500 hover:to-primary-400 disabled:opacity-50 cursor-pointer transition-all">
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
