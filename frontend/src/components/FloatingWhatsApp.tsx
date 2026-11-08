import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useSettings();

  const handleOpenWhatsApp = () => {
    let rawPhone = settings.whatsapp_number || '919876543210';
    let cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    const brandName = settings.business_name || 'Food Rocket';
    const message = encodeURIComponent(
      `Hello ${brandName}! 👋\nI am browsing your online menu and would like to ask a question or place an order.`
    );

    const url = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip on desktop */}
      <div className="hidden sm:flex items-center bg-white text-slate-800 text-xs font-bold py-1.5 px-3 rounded-full shadow-lg border border-slate-100 animate-bounce">
        <span>Order on WhatsApp 💬</span>
      </div>

      {/* Floating Button */}
      <button
        onClick={handleOpenWhatsApp}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 active:scale-95 transition-all group relative cursor-pointer"
        aria-label="Order or Chat on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-white animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-500 rounded-full border-2 border-white"></span>
        <MessageCircle className="w-8 h-8 fill-white group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

