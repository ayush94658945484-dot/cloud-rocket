import React from 'react';
import { Flame, Phone, Mail, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Feature Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">30-40 Min Delivery</h4>
              <p className="text-slate-400 text-xs">Hot, fresh & right on time</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">5-Star Kitchen Hygiene</h4>
              <p className="text-slate-400 text-xs">FSSAI certified sanitary prep</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Artisanal Master Chefs</h4>
              <p className="text-slate-400 text-xs">Clay tandoors & handi cooking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white text-sm font-bold">Eco Tamper-Proof Pack</h4>
              <p className="text-slate-400 text-xs">100% recyclable spill-free boxes</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
          
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md">
                <Flame className="w-6 h-6" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                {settings.business_name || 'Cloud Rocket'}
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {settings.tagline || 'Gourmet Flavors Delivered Hot & Fresh in 30 Mins'}. We bring Michelin-grade culinary experiences directly to your dining table through dedicated delivery-first kitchens.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a 
                href={settings.instagram_url || 'https://instagram.com'} 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-orange-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href={settings.facebook_url || 'https://facebook.com'} 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-orange-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Explore Menu</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('menu')} className="text-slate-400 hover:text-orange-400 transition-colors">
                  Full Menu
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="text-slate-400 hover:text-orange-400 transition-colors">
                  Hyderabadi Dum Biryanis
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="text-slate-400 hover:text-orange-400 transition-colors">
                  Tandoori Starters
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('menu')} className="text-slate-400 hover:text-orange-400 transition-colors">
                  Royal Family Combos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('offers')} className="text-slate-400 hover:text-orange-400 transition-colors">
                  Offers & Coupons
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Quick Info</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('track')} className="text-slate-400 hover:text-orange-400 transition-colors">
                  Live Order Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="text-slate-400 hover:text-orange-400 transition-colors">
                  About Our Kitchen
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-slate-400 hover:text-orange-400 transition-colors">
                  Contact Customer Care
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="text-slate-400 hover:text-orange-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="text-slate-400 hover:text-orange-400 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('delivery-policy')} className="text-slate-400 hover:text-orange-400 transition-colors">
                  Delivery & Refund Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Cloud Kitchen Location & Hours */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold tracking-wider uppercase">Kitchen Hub</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <span>{settings.address || 'Cloud Culinary Hub, Kitchen Suite #4, Sector 18, Commercial Zone, Mumbai'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>{settings.opening_hours || '11:00 AM – 11:30 PM (Daily)'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>{settings.contact_phone || '+91 98765 43210'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <span>{settings.contact_email || 'orders@cloudrocket.com'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {settings.business_name || 'Cloud Rocket'}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Kitchen Online & Accepting Orders
            </span>
            <button onClick={() => onNavigate('admin')} className="text-slate-600 hover:text-slate-400">
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
