const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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

  // --- Food Items ---
  getFoodItems: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; items: any[] }>(`/food${queryString}`);
  },

  getFoodItemById: (id: number | string) =>
    request<{ success: boolean; item: any }>(`/food/${id}`),

  getCategories: () =>
    request<{ success: boolean; count: number; categories: any[] }>('/food/categories'),

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

  toggleFoodAvailability: (id: number) =>
    request<{ success: boolean; is_available: number }>(`/food/${id}/availability`, {
      method: 'PATCH',
    }),

  toggleAvailability: (id: number) =>
    request<{ success: boolean; is_available: number }>(`/food/${id}/availability`, {
      method: 'PATCH',
    }),

  // --- Orders ---
  createOrder: (orderPayload: any) =>
    request<{ success: boolean; order: any; items: any[]; message: string; whatsapp?: any }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    }),

  trackOrder: (orderNumber: string) =>
    request<{ success: boolean; order: any; items: any[] }>(`/orders/track/${encodeURIComponent(orderNumber)}`),

  getUserOrders: () => request<{ success: boolean; count: number; orders: any[] }>('/orders/my-orders'),
  getMyOrders: () => request<{ success: boolean; count: number; orders: any[] }>('/orders/my-orders'),

  getAdminOrders: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; orders: any[] }>(`/orders/admin/all${queryString}`);
  },

  updateOrderStatus: (id: number, payload: { order_status?: string; payment_status?: string }) =>
    request<{ success: boolean; order: any; message: string }>(`/orders/admin/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  getAdminStats: () => request<{ success: boolean; stats: any }>('/orders/admin/stats'),

  // --- Coupons / Offers ---
  getCoupons: () => request<{ success: boolean; coupons: any[] }>('/coupons'),
  getAdminCoupons: () => request<{ success: boolean; coupons: any[] }>('/coupons'),

  validateCoupon: (code: string, subtotal: number) =>
    request<{ success: boolean; coupon: any; message: string }>('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    }),

  createCoupon: (coupon: any) =>
    request<{ success: boolean; coupon: any; message: string }>('/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon),
    }),

  updateCoupon: (id: number, coupon: any) =>
    request<{ success: boolean; coupon: any; message: string }>(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(coupon),
    }),

  deleteCoupon: (id: number) =>
    request<{ success: boolean; message: string }>(`/coupons/${id}`, {
      method: 'DELETE',
    }),

  toggleCouponStatus: (id: number) =>
    request<{ success: boolean; is_active: number }>(`/coupons/${id}/status`, {
      method: 'PATCH',
    }),

  // --- Settings ---
  getSettings: () => request<{ success: boolean; settings: Record<string, string> }>('/settings'),

  updateSettings: (settingsMap: Record<string, string>) =>
    request<{ success: boolean; settings: Record<string, string>; message: string }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsMap),
    }),

  updateSettingsBulk: (settingsMap: Record<string, string>) =>
    request<{ success: boolean; settings: Record<string, string>; message: string }>('/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsMap),
    }),

  // --- Reviews ---
  getReviews: (foodId?: number) => {
    const q = foodId ? `?food_item_id=${foodId}` : '';
    return request<{ success: boolean; count: number; reviews: any[] }>(`/reviews${q}`);
  },

  createReview: (review: { food_item_id?: number; user_name: string; rating: number; comment: string }) =>
    request<{ success: boolean; review: any; message: string }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    }),

  addReview: (review: { food_item_id?: number; user_name: string; rating: number; comment: string }) =>
    request<{ success: boolean; review: any; message: string }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    }),

  // --- Futuristic Features: AI Craving Scanner & Party Group Ordering ---
  getAICravings: (craving = 'surprise', budget?: number, is_veg?: boolean) => {
    let url = `/food/cravings?craving=${encodeURIComponent(craving)}`;
    if (budget) url += `&budget=${budget}`;
    if (is_veg !== undefined) url += `&is_veg=${is_veg ? '1' : '0'}`;
    return request<{ success: boolean; craving: string; recommendations: any[] }>(url);
  },

  createPartyRoom: (host_name: string, host_phone?: string) =>
    request<{ success: boolean; roomId: string; shareUrl: string; message: string }>('/party/create', {
      method: 'POST',
      body: JSON.stringify({ host_name, host_phone }),
    }),

  getPartyRoom: (id: string) =>
    request<{ success: boolean; room: any }>(`/party/${id}`),

  addPartyItem: (id: string, payload: { userName: string; foodItem: any; quantity: number; customization?: string }) =>
    request<{ success: boolean; items: any[]; message: string }>(`/party/${id}/add-item`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
