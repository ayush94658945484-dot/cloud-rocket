import React, { useState, useEffect } from 'react';
import { 
  Save, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Truck, 
  Percent, 
  Check, 
  AlertCircle,
  Flame,
  Globe
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const [formData, setFormData] = useState({
    business_name: '',
    tagline: '',
    whatsapp_number: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    opening_hours: '',
    delivery_charge: '40',
    free_delivery_threshold: '499',
    min_order_amount: '149',
    tax_rate_percent: '5',
    instagram_url: '',
    facebook_url: '',
    delivery_time_estimate: '30-40 mins'
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        business_name: settings.business_name || 'Food Rocket',
        tagline: settings.tagline || 'Rocket-Fast Gourmet Flavors Delivered Hot & Fresh in 30 Mins',
        whatsapp_number: settings.whatsapp_number || '919876543210',
        contact_phone: settings.contact_phone || '+91 98765 43210',
        contact_email: settings.contact_email || 'orders@foodrocket.com',
        address: settings.address || 'Cloud Culinary Hub, Kitchen Suite #4, Sector 18, Commercial Zone, Mumbai 400053',
        opening_hours: settings.opening_hours || '11:00 AM – 11:30 PM (Daily)',
        delivery_charge: settings.delivery_charge || '40',
        free_delivery_threshold: settings.free_delivery_threshold || '499',
        min_order_amount: settings.min_order_amount || '149',
        tax_rate_percent: settings.tax_rate_percent || '5',
        instagram_url: settings.instagram_url || 'https://instagram.com',
        facebook_url: settings.facebook_url || 'https://facebook.com',
        delivery_time_estimate: settings.delivery_time_estimate || '30-40 mins'
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);

    try {
      await updateSettings(formData);
      setSuccessMsg('Website and WhatsApp settings saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Website & WhatsApp Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure your business identity, delivery charges, and primary WhatsApp ordering phone number.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in">
          <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: WhatsApp Ordering Integration */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <MessageCircle className="w-6 h-6 fill-emerald-600 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Official Business WhatsApp Ordering Number
              </h3>
              <p className="text-xs text-slate-500">
                All customer orders placed on WhatsApp will be dispatched directly to this WhatsApp number.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                WhatsApp Phone Number (with Country Code) *
              </label>
              <input
                type="text"
                required
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                placeholder="e.g. 919876543210 (India: 91 + 10-digit number)"
                className="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Note: Do not include '+' or spaces. e.g. for India use <strong>919876543210</strong>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Voice Contact Phone (For Customer Calls)
              </label>
              <input
                type="text"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Brand Identity */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Brand Identity & Information</h3>
              <p className="text-xs text-slate-500">Business name, tagline, and customer service email.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Business / Brand Name</label>
              <input
                type="text"
                required
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Support Email</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Brand Tagline</label>
            <input
              type="text"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Cloud Kitchen Address</label>
              <textarea
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Kitchen Operational Timings</label>
              <textarea
                rows={2}
                name="opening_hours"
                value={formData.opening_hours}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 3: Delivery Charges & Pricing Engine */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Delivery Charges & Tax Configuration</h3>
              <p className="text-xs text-slate-500">Set base delivery fees, free delivery carts, and restaurant GST.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Base Delivery Fee (₹)</label>
              <input
                type="number"
                name="delivery_charge"
                value={formData.delivery_charge}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Free Delivery Over (₹)</label>
              <input
                type="number"
                name="free_delivery_threshold"
                value={formData.free_delivery_threshold}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Min Order Amount (₹)</label>
              <input
                type="number"
                name="min_order_amount"
                value={formData.min_order_amount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">GST Tax Rate (%)</label>
              <input
                type="number"
                name="tax_rate_percent"
                value={formData.tax_rate_percent}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-600/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

