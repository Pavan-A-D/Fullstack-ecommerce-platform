/**
 * Orders Page — dark theme, fetches real orders from backend
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchOrders, cancelOrderAPI } from '../services/api';
import Loader from '../components/Loader';

const OrdersPage = () => {
  const location = useLocation();
  const orderPlaced = location.state?.orderPlaced;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchOrders()
      .then(({ data }) => setOrders(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancelOrder = async (orderId) => {
    setCancellingId(orderId);
    try {
      const { data } = await cancelOrderAPI(orderId);
      setOrders((prev) =>
        prev.map((o) => {
          const orderId_str = (o.id || o._id)?.toString();
          const dataId_str = (data.id || data._id)?.toString();
          return orderId_str === dataId_str ? data : o;
        })
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-surface-100 mb-8">My Orders</h1>

      {orderPlaced && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8 text-center mb-8">
          <p className="text-5xl mb-3">✅</p>
          <h2 className="text-xl font-bold text-green-400 mb-1">Order Placed Successfully!</h2>
          <p className="text-surface-200">Your order has been confirmed and will be shipped soon.</p>
        </div>
      )}

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-4 rounded-xl mb-6">{error}</div>}

      {orders.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-5xl mb-4">📋</p>
          <h3 className="font-semibold text-surface-200 text-lg mb-2">
            {orderPlaced ? 'Your order details will appear here soon.' : 'No orders yet'}
          </h3>
          <p className="text-surface-700 mb-6">
            {orderPlaced ? 'Thank you for shopping with us!' : 'Start shopping to see your orders here.'}
          </p>
          <Link to="/products" className="inline-block px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl font-semibold hover:from-primary-500 hover:to-primary-400 transition-all">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const orderId = order.id || order._id;
            const canCancel = ['Pending', 'Processing'].includes(order.status);
            const isCancelling = cancellingId === orderId;

            return (
              <div key={orderId} className="glass-card rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-surface-700/50">
                  <div>
                    <p className="text-xs text-surface-700">Order ID</p>
                    <p className="text-sm font-mono text-surface-200">{orderId.toString().slice(-8).toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-700">Date</p>
                    <p className="text-sm text-surface-200">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-surface-700">Total</p>
                    <p className="text-sm font-bold text-surface-100">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'Delivered' ? 'bg-green-500/15 text-green-400 border border-green-500/30' :
                    order.status === 'Shipped' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                    order.status === 'Cancelled' ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                    'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.image || item.productId?.image || ''} alt={item.name || item.productId?.name || 'Product'}
                        className="w-10 h-10 rounded-lg object-cover bg-surface-800" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-surface-200 line-clamp-1">{item.name || item.productId?.name}</p>
                        <p className="text-xs text-surface-700">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium text-surface-200">
                        ₹{((item.price || item.productId?.price || 0) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Cancel Order Button */}
                {canCancel && (
                  <div className="mt-4 pt-4 border-t border-surface-700/50 flex justify-end">
                    <button
                      id={`cancel-order-${orderId}`}
                      onClick={() => handleCancelOrder(orderId)}
                      disabled={isCancelling}
                      className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                        bg-red-500/10 text-red-400 border border-red-500/30
                        hover:bg-red-500 hover:text-white hover:border-red-500
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCancelling ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Cancelling...
                        </span>
                      ) : (
                        'Cancel Order'
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
