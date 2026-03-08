import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── AUTH ──────────────────────────────────────────────
export const registerUser  = (data) => API.post('/users/register', data);
export const loginUser     = (data) => API.post('/users/login', data);
export const getProfile    = ()     => API.get('/users/profile');
export const updateProfile = (data) => API.put('/users/profile', data);

// ─── PRODUCTS ──────────────────────────────────────────
export const getAllProducts        = ()         => API.get('/products');
export const getProductById        = (id)       => API.get(`/products/${id}`);
export const getProductsByCategory = (category) => API.get(`/products/category/${category}`);
// Admin only
export const addProduct    = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id)   => API.delete(`/products/${id}`);

// ─── CART ──────────────────────────────────────────────
export const getCart        = ()     => API.get('/cart');
export const addToCart      = (data) => API.post('/cart', data);
export const updateCartItem = (id, data) => API.put(`/cart/${id}`, data);
export const removeFromCart = (id)   => API.delete(`/cart/${id}`);
export const clearCart      = ()     => API.delete('/cart/clear');

// ─── ORDERS ────────────────────────────────────────────
export const placeOrder   = (data) => API.post('/orders', data);
export const getMyOrders  = ()     => API.get('/orders/myorders');
// Admin only
export const getAllOrders     = ()         => API.get('/orders');
export const updateOrderStatus = (id, data) => API.put(`/orders/${id}/status`, data);
export const deleteOrder       = (id)      => API.delete(`/orders/${id}`);

// ─── ADMIN ─────────────────────────────────────────────
export const getDashboardStats = ()     => API.get('/admin/stats');
export const getAllUsers        = ()     => API.get('/admin/users');
export const deleteUser        = (id)   => API.delete(`/admin/users/${id}`);
export const getAdminData      = ()     => API.get('/admin/data');
export const updateAdminData   = (data) => API.put('/admin/data', data);

export default API;
