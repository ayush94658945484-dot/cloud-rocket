import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  MessageCircle, 
  CreditCard, 
  Check, 
  Tag, 
  ArrowLeft, 
  AlertCircle,
  Truck,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';

interface CheckoutPageProps {
  onBackToMenu: () => void;
  onOrderSuccess: (orderData: any, whatsappUrl?: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToMenu, onOrderSuccess }) => {
  const { cart, subtotal, discount, deliveryFee, taxAmount, grandTotal, appliedCoupon, applyCouponCode, removeCoupon, clearCart } = useCart();
  const { user } = useAuth();
  const { settings } = useSettings();

  // Form states
  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Coupon state inside checkout
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email);
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);

      const loadAddresses = async () => {
        setLoadingAddresses(true);
        try {
          const res = await api.getMe();
          if (res.success && res.addresses) {
            setSavedAddresses(res.addresses);
            const defaultAddr = res.addresses.find((a: any) => a.is_default === 1) || res.addresses[0];
            if (defaultAddr) {
              setDeliveryAddress(defaultAddr.address_line);
              setLandmark(defaultAddr.landmark || '');
              if (defaultAddr.phone) setCustomerPhone(defaultAddr.phone);
            }
          }
        } catch (e) {
          console.warn('Could not load saved addresses:', e);
        } finally {
          setLoadingAddresses(false);
        }
      };
      loadAddresses();
    }
  }, [user]);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">Your cart is empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Please select your favorite dishes from our menu before proceeding to checkout.
        </p>
        <button
          onClick={onBackToMenu}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer"
        >
          Browse Cloud Menu
        </button>
      </div>
    );
  }

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError(null);
    const res = await applyCouponCode(couponInput.trim());
    if (res.success) {
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleSelectSavedAddress = (addr: any) => {
    setDeliveryAddress(addr.address_line);
    setLandmark(addr.landmark || '');
    if (addr.phone) setCustomerPhone(addr.phone);
    if (addr.recipient_name) setCustomerName(addr.recipient_name);
  };

  const handlePlaceOrder = async (method: 'WHATSAPP' | 'ONLINE') => {
    setError(null);

    if (!customerName.trim()) {
      setError('Please provide your name');
      return;
    }
    if (!customerPhone.trim()) {
      setError('Please provide your mobile number for delivery updates');
      return;
    }
    if (!deliveryAddress.trim()) {
      setError('Please provide your delivery address');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: customerEmail.trim() || undefined,
        delivery_address: deliveryAddress.trim(),
        landmark: landmark.trim() || undefined,
        special_instructions: specialInstructions.trim() || undefined,
        items: cart.map(item => ({
          id: item.id,
          food_item_id: item.id,
          name: item.name,
          price: item.discount_price && item.discount_price > 0 ? item.discount_price : item.price,
          quantity: item.quantity,
          is_veg: item.is_veg
        })),
        coupon_code: appliedCoupon?.code || undefined,
        payment_method: method
      };

      const res = await api.createOrder(orderPayload);

      if (res.success && res.order) {
        clearCart();

        if (method === 'WHATSAPP' && res.whatsapp?.url) {
          // Open WhatsApp directly
          window.open(res.whatsapp.url, '_blank');
        }

        onOrderSuccess(res.order, res.whatsapp?.url);
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={onBackToMenu}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Food Menu</span>
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Delivery Details Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div>
            <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest bg-orange-100 px-3 py-1 rounded-full">
              Delivery Information
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2">
              Where Should We Deliver Your Feast?
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Our delivery executives use these details to reach you in 30-40 minutes.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Saved Addresses Quick Selection */}
          {savedAddresses.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Choose from Saved Addresses:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectSavedAddress(addr)}
                    className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                      deliveryAddress === addr.address_line
                        ? 'border-orange-500 bg-orange-50/50 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                      <span>{addr.label || 'Home'}</span>
                      {deliveryAddress === addr.address_line && (
                        <Check className="w-3.5 h-3.5 text-orange-600" />
                      )}
                    </div>
                    <p className="text-slate-500 truncate text-[11px]">{addr.address_line}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Inputs */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (WhatsApp) *</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="For invoice & order confirmation receipt"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Complete Delivery Address *</label>
              <div className="relative">
                <textarea
                  required
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="House/Flat number, Building name, Street, Area"
                  className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white"
                ></textarea>
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Landmark (Optional)</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="e.g. Near Metro Station / Opp. Grand Mall"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Special Cooking / Delivery Instructions</label>
              <textarea
                rows={2}
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Make biryani spicy, don't ring the doorbell, call upon arrival..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Dual Checkout Buttons */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary ({cart.length} Dishes)
            </h3>

            {/* Items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-slate-100">
              {cart.map((item) => {
                const activePrice = item.discount_price && item.discount_price > 0 ? item.discount_price : item.price;
                return (
                  <div key={item.id} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-xs border flex items-center justify-center p-0.5 ${
                        item.is_veg ? 'border-emerald-600' : 'border-rose-600'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${item.is_veg ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                      </span>
                      <span className="font-bold text-slate-800">
                        {item.quantity}x {item.name}
                      </span>
                    </div>
                    <span className="font-extrabold text-slate-900">
                      ₹{activePrice * item.quantity}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Coupons Section */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-orange-600" /> Apply Coupon Code
              </span>

              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-emerald-800">'{appliedCoupon.code}' Active!</span>
                    <span className="text-[11px] text-emerald-600 block">Saving ₹{discount.toFixed(2)}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-rose-600 font-bold hover:underline text-[11px]">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Code: WELCOME50"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 font-bold uppercase tracking-wider"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-slate-900 hover:bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-rose-600 text-[11px] font-medium">{couponError}</p>}
            </div>

            {/* Bill Details */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-medium text-slate-600">
              <div className="flex justify-between">
                <span>Item Subtotal</span>
                <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
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
                <span>Taxes & Restaurant Packing (5% GST)</span>
                <span className="font-bold text-slate-900">₹{taxAmount.toFixed(2)}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-xl text-orange-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* DUAL CHECKOUT OPTIONS */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              
              {/* 1. Official WhatsApp Ordering (Primary) */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handlePlaceOrder('WHATSAPP')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm py-3.5 rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>{submitting ? 'Preparing Order...' : 'Order on WhatsApp (Instant Confirmation)'}</span>
              </button>

              {/* 2. Direct Online Payment / COD */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => handlePlaceOrder('ONLINE')}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-3.5 rounded-2xl shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CreditCard className="w-4 h-4 text-orange-400" />
                <span>Place Order Online (Pay Online / COD)</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                🛡️ Safe & Encrypted Checkout. Your order details will be transmitted directly to our kitchen dispatch system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

