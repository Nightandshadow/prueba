/**
 * Cliente API: base URL, token en localStorage, helpers fetch.
 */

const API_BASE = window.API_BASE || (window.location.origin + '/api');

function getToken() {
  return localStorage.getItem('token');
}

function getAuthHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

async function api(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: { ...getAuthHeaders(), ...options.headers },
  };
  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(url, config);
  const rawText = await res.text().catch(() => '');
  const data = (() => {
    if (!rawText) return {};
    try {
      return JSON.parse(rawText);
    } catch {
      return {};
    }
  })();
  if (!res.ok) {
    const err = new Error(data?.error || data?.errors?.[0]?.msg || `Error HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    err.raw = rawText;
    throw err;
  }
  return data;
}

const auth = {
  register: (body) => api('/auth/register', { method: 'POST', body }),
  login: (body) => api('/auth/login', { method: 'POST', body }),
  me: () => api('/auth/me'),
};

const products = {
  getAll: () => api('/products'),
  getByCode: (codigo) => api(`/products/${encodeURIComponent(codigo)}`),
  create: (body) => api('/products', { method: 'POST', body }),
};

const cart = {
  get: () => api('/cart'),
  add: (product_id, cantidad = 1) => api('/cart/add', { method: 'POST', body: { product_id, cantidad } }),
  clear: () => api('/cart', { method: 'DELETE' }),
  remove: (productId) => api(`/cart/product/${productId}`, { method: 'DELETE' }),
  updateQuantity: (cartItemId, cantidad) => api(`/cart/${cartItemId}`, { method: 'PUT', body: { cantidad } }),
};

const orders = {
  getMy: () => api('/orders'),
};

const payments = {
  createCheckoutSession: (success_url, cancel_url) =>
    api('/payments/create-checkout-session', {
      method: 'POST',
      body: { success_url, cancel_url },
    }),
  confirm: (payment_intent_id) =>
    api('/payments/confirm', { method: 'POST', body: { payment_intent_id } }),
};

window.api = api;
window.auth = auth;
window.products = products;
window.cart = cart;
window.orders = orders;
window.payments = payments;
