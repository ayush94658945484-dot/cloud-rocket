const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('rocket_token') || localStorage.getItem('zaika_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred while communicating with the server');
  }

  return data;
}

export const api = {
  // --- Auth ---
  login: (credentials: { email: string; password: string }) =>
    request<{ success: boolean; token: string; user: any; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (payload: { name: string; email: string; password: string; phone?: string }) =>
    request<{ success: boolean; token: string; user: any; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () => request<{ success: boolean; user: any; addresses: any[]; recentOrders: any[] }>('/auth/me'),

  updateProfile: (payload: { name?: string; phone?: string; password?: string }) =>
    request<{ success: boolean; user: any; message: string }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  addAddress: (address: any) =>
    request<{ success: boolean; addresses: any[]; message: string }>('/auth/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    }),

  deleteAddress: (id: number) =>
    request<{ success: boolean; addresses: any[]; message: string }>(`/auth/addresses/${id}`, {
      method: 'DELETE',
    }),

  getAdminCustomers: () =>
    request<{ success: boolean; customers: any[] }>('/auth/admin/customers'),

  // --- Food Items & Categories ---
  getFoodItems: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return request<{ success: boolean; count: number; items: any[] }>(`/food?${query.toString()}`);
  },

  getCategories: () => request<{ success: boolean; categories: any[] }>('/food/categories'),

  getFoodById: (id: number) => request<{ success: boolean; item: any; reviews: any[] }>(`/food/${id}`),

  createFoodItem: (item: any) =>
    request<{ success: boolean; item: any; message: string }>('/food', {
      method: 'POST',
      body: JSON.stringify(item),
    }),

  updateFoodItem: (id: number, item: any) =>
    request<{ success: boolean; item: any; message: string }>(`/food/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    }),

  deleteFoodItem: (id: number) =>
    request<{ success: boolean; message: string }>(`/food/${id}`, {
      method: 'DELETE',
    }),

  toggleAvailability: (id: number) =>
    request<{ success: boolean; is_available: number }>(`/food/${id}/availability`, {
      method: 'PATCH',
    }),

  // --- Orders ---
  createOrder: (orderData: any) =>
    request<{
      success: boolean;
      order: any;
      items: any[];
      whatsapp: { url: string; message: string; targetPhone: string };
      message: string;
    }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    }),

  trackOrder: (orderNumber: string) =>
    request<{ success: boolean; order: any; items: any[] }>(`/orders/track/${orderNumber}`),

  getMyOrders: () => request<{ success: boolean; orders: any[] }>('/orders/my-orders'),

  getAdminOrders: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams(params);
    return request<{ success: boolean; count: number; orders: any[] }>(`/orders/admin/all?${query.toString()}`);
  },

  updateOrderStatus: (id: number, payload: { order_status?: string; payment_status?: string }) =>
    request<{ success: boolean; order: any; message: string }>(`/orders/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  getAdminStats: () => request<{ success: boolean; stats: any }>('/orders/admin/stats'),

  // --- Coupons / Offers ---
  getCoupons: () => request<{ success: boolean; coupons: any[] }>('/coupons'),

  validateCoupon: (code: string, subtotal: number) =>
    request<{ success: boolean; coupon: any; message: string }>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    }),

  getAdminCoupons: () => request<{ success: boolean; coupons: any[] }>('/coupons/admin/all'),

  createCoupon: (coupon: any) =>
    request<{ success: boolean; coupon: any; message: string }>('/coupons/admin', {
      method: 'POST',
      body: JSON.stringify(coupon),
    }),

  updateCoupon: (id: number, coupon: any) =>
    request<{ success: boolean; coupon: any; message: string }>(`/coupons/admin/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coupon),
    }),

  deleteCoupon: (id: number) =>
    request<{ success: boolean; message: string }>(`/coupons/admin/${id}`, {
      method: 'DELETE',
    }),

  // --- Settings ---
  getSettings: () => request<{ success: boolean; settings: any }>('/settings'),

  updateSettingsBulk: (settings: Record<string, any>) =>
    request<{ success: boolean; settings: any; message: string }>('/settings/admin/bulk', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),

  // --- Reviews ---
  getReviews: () => request<{ success: boolean; reviews: any[] }>('/reviews'),

  addReview: (review: { rating: number; comment: string; user_name?: string; food_item_id?: number }) =>
    request<{ success: boolean; review: any; message: string }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    }),
};

