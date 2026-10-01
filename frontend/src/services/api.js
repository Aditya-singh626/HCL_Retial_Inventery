const API_BASE_URL = 'http://localhost:9090';

// Token and User persistence in localStorage
export const getStoredToken = () => localStorage.getItem('token');
export const setStoredToken = (token) => localStorage.setItem('token', token);
export const removeStoredToken = () => localStorage.removeItem('token');

export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};
export const setStoredUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem('user');

// Centralized fetch helper
async function request(endpoint, options = {}) {
  const token = getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage = (typeof data === 'object' && data?.error) 
      ? data.error 
      : (typeof data === 'string' && data) 
        ? data 
        : `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

// User / Auth Endpoints
export const authApi = {
  signup: (payload) => request('/users/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  login: (payload) => request('/users/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

// Product Endpoints
export const productApi = {
  getAll: () => request('/products', { method: 'GET' }),
  getById: (id) => request(`/products/${id}`, { method: 'GET' }),
  create: (payload) => request('/products', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

// Cart Endpoints
export const cartApi = {
  getCart: (userId) => request(`/cart/${userId}`, { method: 'GET' }),
  addToCart: (payload) => request('/cart/add', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  updateQuantity: (userId, productId, quantity) => request(`/cart/${userId}/item/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity })
  }),
  removeItem: (userId, productId) => request(`/cart/${userId}/item/${productId}`, {
    method: 'DELETE'
  }),
  clearCart: (userId) => request(`/cart/${userId}/clear`, {
    method: 'DELETE'
  })
};

// Order Endpoints
export const orderApi = {
  placeOrder: (userId) => request('/orders', {
    method: 'POST',
    body: JSON.stringify({ userId })
  }),
  getOrders: (userId) => request(`/orders/${userId}`, { method: 'GET' })
};
