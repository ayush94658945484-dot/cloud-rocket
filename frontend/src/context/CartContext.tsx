import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, FoodItem, Coupon } from '../types';
import { api } from '../services/api';
import { useSettings } from './SettingsContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: FoodItem, quantity?: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, delta: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: number) => number;
  itemCount: number;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  taxAmount: number;
  grandTotal: number;
  appliedCoupon: Coupon | null;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rocket_cart') || localStorage.getItem('zaika_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('rocket_applied_coupon') || localStorage.getItem('zaika_applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('rocket_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('rocket_applied_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('rocket_applied_coupon');
      localStorage.removeItem('zaika_applied_coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (item: FoodItem, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: number, delta: number) => {
    setCart(prev => {
      return prev
        .map(i => {
          if (i.id === itemId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const getItemQuantity = (itemId: number): number => {
    const item = cart.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  };

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = cart.reduce((acc, item) => {
    const price = item.discount_price && item.discount_price > 0 ? item.discount_price : item.price;
    return acc + price * item.quantity;
  }, 0);

  // Discount Calculation
  let discount = 0;
  if (appliedCoupon) {
    if (subtotal >= (appliedCoupon.min_order_amount || 0)) {
      if (appliedCoupon.discount_type === 'PERCENTAGE') {
        discount = (subtotal * appliedCoupon.discount_value) / 100;
        if (appliedCoupon.max_discount_amount) {
          discount = Math.min(discount, appliedCoupon.max_discount_amount);
        }
      } else {
        discount = appliedCoupon.discount_value;
      }
      discount = Math.min(discount, subtotal);
    } else {
      // If order value fell below min order, drop coupon
      discount = 0;
    }
  }

  // Delivery Charges
  const baseDelivery = Number(settings.delivery_charge || 40);
  const freeThreshold = Number(settings.free_delivery_threshold || 499);
  const deliveryFee = subtotal === 0 || subtotal >= freeThreshold ? 0 : baseDelivery;

  // Taxes
  const taxRate = Number(settings.tax_rate_percent || 5);
  const taxAmount = Number(((subtotal - discount) * (taxRate / 100)).toFixed(2));

  // Grand Total
  const grandTotal = Math.max(0, Number((subtotal - discount + deliveryFee + taxAmount).toFixed(2)));

  const applyCouponCode = async (code: string) => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        return { success: true, message: res.message };
      }
      return { success: false, message: 'Invalid coupon' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to apply coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        itemCount,
        subtotal,
        discount,
        deliveryFee,
        taxAmount,
        grandTotal,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

