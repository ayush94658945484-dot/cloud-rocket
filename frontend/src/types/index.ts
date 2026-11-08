export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  points?: number;
  passport_tier?: string;
  badges?: string[];
  created_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  description?: string;
  display_order?: number;
  item_count?: number;
}

export interface FoodItem {
  id: number;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number | null;
  is_veg: number; // 1 for veg, 0 for non-veg
  is_available: number;
  is_bestseller: number;
  is_featured: number;
  image_url: string;
  preparation_time?: string;
  calories?: number | null;
  rating: number;
  reviews_count: number;
}

export interface CartItem extends FoodItem {
  quantity: number;
  customizations?: any;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discount_type: 'PERCENTAGE' | 'FLAT';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number | null;
  valid_until?: string | null;
  is_active: number;
  times_used?: number;
}

export interface OrderItem {
  id?: number;
  food_item_id: number;
  food_name: string;
  price: number;
  quantity: number;
  total_price: number;
  is_veg: number;
  customizations?: any;
}

export interface Order {
  id: number;
  order_number: string;
  user_id?: number | null;
  customer_name: string;
  customer_email?: string;
  customer_phone: string;
  delivery_address: string;
  landmark?: string;
  special_instructions?: string;
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  tax_amount: number;
  total_amount: number;
  coupon_code?: string;
  payment_method: 'WHATSAPP' | 'ONLINE' | 'CASH_ON_DELIVERY';
  payment_status: 'PENDING' | 'COMPLETED' | 'FAILED';
  order_status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  whatsapp_message_text?: string;
  created_at: string;
  items?: OrderItem[];
}

export interface Address {
  id: number;
  label: string;
  recipient_name: string;
  phone: string;
  address_line: string;
  landmark?: string;
  city: string;
  postal_code?: string;
  is_default: number;
}

export interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  food_name?: string;
  created_at?: string;
}

export interface WebsiteSettings {
  business_name?: string;
  tagline?: string;
  whatsapp_number?: string;
  contact_phone?: string;
  contact_email?: string;
  address?: string;
  opening_hours?: string;
  delivery_charge?: string;
  free_delivery_threshold?: string;
  min_order_amount?: string;
  tax_rate_percent?: string;
  instagram_url?: string;
  facebook_url?: string;
  delivery_time_estimate?: string;
}
