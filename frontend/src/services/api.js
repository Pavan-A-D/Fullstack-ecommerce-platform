// API Service — Axios setup for all API calls

import axios from 'axios';

// Use full backend URL for API calls
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const API = axios.create({ baseURL: `${BACKEND_URL}/api` });

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Product APIs ---
export const fetchProducts = () => API.get('/products');
export const fetchProductById = (id) => API.get(`/products/${id}`);
export const createProduct = (formData) => API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, formData) => API.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// --- Auth APIs ---
export const loginUser = async ({ email, password }) => {
  const { data } = await API.post('/auth/login', { email, password });
  // Transform backend response to match frontend expectations
  const formattedData = {
    data: {
      user: {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
      token: data.token,
    },
  };
  if (data.token) localStorage.setItem('token', data.token);
  return formattedData;
};

export const registerUser = async (userData) => {
  const { data } = await API.post('/auth/register', userData);
  // Transform backend response to match frontend expectations
  const formattedData = {
    data: {
      user: {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      },
      token: data.token,
    },
  };
  if (data.token) localStorage.setItem('token', data.token);
  return formattedData;
};

// --- Cart APIs ---
export const fetchCart = () => API.get('/cart');
export const addToCartAPI = (item) => API.post('/cart', item);
export const removeFromCartAPI = (id) => API.delete(`/cart/${id}`);

// --- Order APIs ---
export const placeOrderAPI = (order) => API.post('/orders', order);
export const fetchOrders = () => API.get('/orders');
export const cancelOrderAPI = (id) => API.put(`/orders/${id}/cancel`);

export default API;
