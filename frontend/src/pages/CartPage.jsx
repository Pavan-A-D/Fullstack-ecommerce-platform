/**
 * Cart Page — dark theme with glass items and summary
 */

import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-2xl font-bold text-surface-100 mb-2">Your cart is empty</h2>
          <p className="text-surface-700 mb-6">Add some products to get started!</p>
          <Link to="/products" className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold hover:from-primary-500 hover:to-primary-400 transition-all">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const tax = totalPrice * 0.18;
  const grandTotal = totalPrice + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-surface-100">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300 cursor-pointer transition-colors">
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="glass-card rounded-xl p-4 flex gap-4 items-center">
              <Link to={`/products/${item.id}`}>
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.id}`} className="font-medium text-surface-100 hover:text-primary-400 line-clamp-1 transition-colors">
                  {item.name}
                </Link>
                <p className="text-sm text-surface-700">{item.category}</p>
                <p className="font-bold text-surface-100 mt-1">₹{item.price.toLocaleString('en-IN')}</p>
              </div>
              {/* Qty */}
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg bg-surface-800 text-surface-200 hover:bg-surface-700 flex items-center justify-center cursor-pointer transition-colors">−</button>
                <span className="w-8 text-center font-medium text-surface-100">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-surface-800 text-surface-200 hover:bg-surface-700 flex items-center justify-center cursor-pointer transition-colors">+</button>
              </div>
              <p className="font-bold text-surface-100 w-24 text-right hidden sm:block">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </p>
              <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300 text-lg cursor-pointer transition-colors" title="Remove">✕</button>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="glass-card rounded-xl p-6 h-fit sticky top-20">
          <h2 className="font-bold text-surface-100 text-lg mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-surface-200">
              <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>₹{totalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-surface-200">
              <span>Shipping</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="flex justify-between text-surface-200">
              <span>GST (18%)</span>
              <span>₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="border-t border-surface-700 pt-3 flex justify-between font-bold text-surface-100 text-base">
              <span>Total</span>
              <span>₹{grandTotal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
          <Link to="/checkout" className="block w-full mt-5 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold text-center hover:from-primary-500 hover:to-primary-400 transition-all">
            Proceed to Checkout
          </Link>
          <Link to="/products" className="block text-center text-primary-400 text-sm mt-3 hover:text-primary-300 transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
