import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  Tag, 
  ArrowRight, 
  Sparkles, 
  Check, 
  Clock, 
  MessageCircle,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';

interface CartDrawerProps {
  onNavigateToCheckout: () => void;
  onExploreMenu: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateToCheckout, onExploreMenu }) => {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    discount, 
    deliveryFee, 
    taxAmount, 
    grandTotal, 
    appliedCoupon, 
    applyCouponCode, 
    removeCoupon, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();

  const { settings } = useSettings();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const freeDeliveryThreshold = Number(settings.free_delivery_threshold || 499);
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleApply = async (codeToApply?: string) => {
    const code = codeToApply || couponInput;
    if (!code.trim()) return;

    const res = await applyCouponCode(code);
    if (res.success) {
      setCouponMsg({ text: res.message, error: false });
      setCouponInput('');
    } else {
      setCouponMsg({ text: res.message, error: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)}></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Your Gourmet Cart</h3>
                <p className="text-xs text-slate-500 font-medium">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-9 h-9 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Free Delivery Meter */}
            {subtotal > 0 && (
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-amber-600" />
                    {remainingForFreeDelivery === 0 ? (
                      <span className="text-emerald-700 font-black">🎉 You've unlocked FREE Express Delivery!</span>
                    ) : (
                      <span>Add ₹{remainingForFreeDelivery.toFixed(0)} more for FREE Delivery</span>
                    )}
                  </span>
                  <span>{freeDeliveryPercent}%</span>
                </div>
                <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${freeDeliveryPercent}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Empty Cart State */}
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-20 h-20 rounded-full bg-orange-50 text-orange-400 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Your cart is feeling hungry</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                    Explore our aromatic biryanis, sizzling starters, and gourmet curries to fill it up!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onExploreMenu();
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all active:scale-95"
                >
                  Explore Food Menu
                </button>
              </div>
            ) : (
              /* Items List */
              <div className="space-y-4 divide-y divide-slate-100">
                {cart.map((item) => {
                  const activePrice = item.discount_price && item.discount_price > 0 ? item.discount_price : item.price;
                  return (
                    <div key={item.id} className="pt-4 first:pt-0 flex items-center gap-3.5">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 bg-slate-100 border border-slate-100"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-xs border flex items-center justify-center p-0.5 ${
                            item.is_veg ? 'border-emerald-600' : 'border-rose-600'
                          }`}>
                            <span className={`w-1 h-1 rounded-full ${item.is_veg ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-xs font-black text-slate-800 mt-0.5">
                          ₹{activePrice * item.quantity}
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-slate-400 font-normal ml-1">
                              (₹{activePrice} each)
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-1.5 bg-slate-100 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-white shadow-2xs flex items-center justify-center text-slate-700 hover:bg-orange-600 hover:text-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-white shadow-2xs flex items-center justify-center text-slate-700 hover:bg-orange-600 hover:text-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Coupons Section */}
            {cart.length > 0 && (
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-orange-500" /> Offers & Coupons
                  </h4>
                  {appliedCoupon && (
                    <button
                      onClick={removeCoupon}
                      className="text-[11px] text-rose-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {appliedCoupon ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold text-emerald-800 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" /> '{appliedCoupon.code}' Applied!
                      </p>
                      <p className="text-[11px] text-emerald-600">
                        You are saving ₹{discount.toFixed(2)} on this order
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter Promo Code"
                        className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 uppercase font-bold tracking-wider"
                      />
                      <button
                        onClick={() => handleApply()}
                        className="bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                      >
                        Apply
                      </button>
                    </div>

                    {/* Quick suggestion badges */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                      <button
                        onClick={() => handleApply('WELCOME50')}
                        className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 font-bold hover:bg-orange-100 flex-shrink-0"
                      >
                        ⚡ WELCOME50 (50% OFF)
                      </button>
                      <button
                        onClick={() => handleApply('FEAST100')}
                        className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 font-bold hover:bg-amber-100 flex-shrink-0"
                      >
                        👑 FEAST100 (₹100 OFF)
                      </button>
                    </div>
                  </>
                )}

                {couponMsg && (
                  <p className={`text-xs font-medium ${couponMsg.error ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Drawer Footer Billing & CTAs */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-4">
              
              {/* Billing Summary */}
              <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Item Subtotal</span>
                  <span className="font-bold text-slate-800">₹{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-bold">-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-bold">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 uppercase font-black">FREE</span>
                    ) : (
                      `₹${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes & Restaurant Packaging</span>
                  <span className="font-bold text-slate-800">₹{taxAmount.toFixed(2)}</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                  <span>To Pay</span>
                  <span className="text-orange-600">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onNavigateToCheckout();
                  }}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg shadow-orange-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium text-center">
                <Clock className="w-3.5 h-3.5 text-orange-500" />
                <span>Estimated cooking & express delivery: 30-40 mins</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

