const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
const ACCESS_KEY = 'yetu_admin_access';
const REFRESH_KEY = 'yetu_admin_refresh';

export const getAccessToken = () => localStorage.getItem(ACCESS_KEY) || '';
export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY) || '';

export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const apiFetch = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const err = new Error(data.error || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return res.json();
};

export const refreshTokens = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  const res = await fetch(`${API_URL}/auth/admin/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) throw new Error('Refresh failed');
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data;
};

export const loginAdmin = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Login failed');
  }
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return data.admin;
};

export const getAdminMe = async () => {
  try {
    const data = await apiFetch('/auth/admin/me');
    return data.admin;
  } catch (err) {
    if (err.status === 401) {
      await refreshTokens();
      const data = await apiFetch('/auth/admin/me');
      return data.admin;
    }
    throw err;
  }
};

export const logoutAdmin = async () => {
  const refreshToken = getRefreshToken();
  if (refreshToken) {
    await fetch(`${API_URL}/auth/admin/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
  }
  clearTokens();
};

const withRefresh = async (fn) => {
  try {
    return await fn();
  } catch (err) {
    if (err.status === 401) {
      await refreshTokens();
      return fn();
    }
    throw err;
  }
};

export const getCategories = async () => {
  const data = await apiFetch('/categories');
  return data.categories;
};

export const createCategory = async (payload) => {
  const data = await withRefresh(() => apiFetch('/categories', {
    method: 'POST',
    body: JSON.stringify(payload),
  }));
  return data.category;
};

export const updateCategory = async (id, payload) => {
  const data = await withRefresh(() => apiFetch(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }));
  return data.category;
};

export const deleteCategory = async (id) => {
  await withRefresh(() => apiFetch(`/categories/${id}`, { method: 'DELETE' }));
};

export const getProducts = async () => {
  const data = await apiFetch('/products');
  return data.products;
};

export const createProduct = async (payload) => {
  const data = await withRefresh(() => apiFetch('/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  }));
  return data.product;
};

export const updateProduct = async (id, payload) => {
  const data = await withRefresh(() => apiFetch(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  }));
  return data.product;
};

export const deleteProduct = async (id) => {
  await withRefresh(() => apiFetch(`/products/${id}`, { method: 'DELETE' }));
};

export const getAdminOrders = async () => {
  const data = await withRefresh(() => apiFetch('/orders'));
  return data.orders;
};

export const updateAdminOrderStatus = async (id, status) => {
  const data = await withRefresh(() => apiFetch(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }));
  return data.order;
};

export const getAffiliateLinks = async () => {
  const data = await withRefresh(() => apiFetch('/affiliates'));
  return data.links;
};


export const getAffiliatePayouts = async () => {
  const data = await withRefresh(() => apiFetch('/affiliates/payouts'));
  return data.payouts;
};

export const updateAffiliatePayoutStatus = async (id, status) => {
  const data = await withRefresh(() => apiFetch(`/affiliates/payouts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }));
  return data.payout;
};


export const getAdmins = async () => {
  const data = await withRefresh(() => apiFetch('/admins'));
  return data.admins;
};

export const createAdmin = async (payload) => {
  const data = await withRefresh(() => apiFetch('/admins', {
    method: 'POST',
    body: JSON.stringify(payload),
  }));
  return data.admin;
};

export const updateAdmin = async (id, payload) => {
  const data = await withRefresh(() => apiFetch(`/admins/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  }));
  return data.admin;
};

export const deleteAdmin = async (id) => {
  await withRefresh(() => apiFetch(`/admins/${id}`, { method: 'DELETE' }));
};

export const getDashboard = async () => {
  const data = await withRefresh(() => apiFetch('/dashboard'));
  return data;
};





