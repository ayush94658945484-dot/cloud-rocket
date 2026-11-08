import React, { useState } from 'react';
import { 
  ShoppingBag, 
  User as UserIcon, 
  Menu as MenuIcon, 
  X, 
  Search, 
  Flame, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  PhoneCall,
  LayoutDashboard,
  Sliders,
  Star,
  Users,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { useMode } from '../context/ModeContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  isVegOnly?: boolean;
  onToggleVegOnly?: () => void;
  onOpenParty?: () => void;
  onOpenPassport?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  searchQuery = '',
  onSearchChange,
  isVegOnly = false,
  onToggleVegOnly,
  onOpenParty,
  onOpenPassport
}) => {
  const { user, isAdmin, openAuthModal, logout } = useAuth();
  const { itemCount, subtotal, setIsCartOpen } = useCart();
  const { settings } = useSettings();
  const { orderMode, dietaryMode, openModeModal } = useMode();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'offers', label: 'Special Offers', badge: '50% OFF' },
    { id: 'track', label: 'Track Order' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleScrollToTasteReviews = () => {
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById('taste-reviews');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    } else {
      const el = document.getElementById('taste-reviews');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white text-xs sm:text-sm py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-200"></span>
            </span>
            <span className="truncate font-semibold tracking-wide">
              🎉 Flat 20% OFF on all gourmet orders! Use code <strong className="underline tracking-wider font-black text-amber-200">ROCKET20</strong>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs">
            <span className="flex items-center gap-1 opacity-90">
              <Clock className="w-3.5 h-3.5" /> 30-40 Mins Delivery
            </span>
            <span className="flex items-center gap-1 opacity-90">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Hygienic Cloud Kitchen
            </span>
            <a 
              href={`tel:${settings.contact_phone || '+919876543210'}`} 
              className="flex items-center gap-1 hover:underline font-semibold"
            >
              <PhoneCall className="w-3.5 h-3.5" /> {settings.contact_phone || '+91 98765 43210'}
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Official Food Rocket Brand Logo */}
            <div 
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            >
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-white p-0.5 shadow-md shadow-orange-500/20 ring-2 ring-emerald-500/40 group-hover:scale-105 group-hover:ring-orange-500 transition-all flex-shrink-0">
                <img 
                  src="/food-rocket-logo.png" 
                  alt="Food Rocket Logo" 
                  className="w-full h-full object-contain rounded-full" 
                />
              </div>
              <div>
                <span className="font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  <span className="text-orange-600">Food</span>{' '}
                  <span className="text-emerald-600">Rocket</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 hidden sm:inline-block border border-emerald-300/40">
                    Express Kitchen
                  </span>
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold tracking-wide hidden sm:block">
                  Fuel Your Hunger, Fast 🚀
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all relative flex items-center gap-1.5 ${
                    currentPage === link.id
                      ? 'text-orange-600 bg-orange-50/80 dark:bg-orange-950/40 shadow-xs font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:text-orange-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500 text-white animate-pulse">
                      {link.badge}
                    </span>
                  )}
                </button>
              ))}

              {/* Food Party Group Link */}
              {onOpenParty && (
                <button
                  type="button"
                  onClick={onOpenParty}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800/60 cursor-pointer"
                  title="Group Ordering with Friends"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Party</span>
                  <span className="text-[9px] font-black uppercase bg-emerald-600 text-white px-1.5 py-0.2 rounded-md">
                    Group
                  </span>
                </button>
              )}

              {/* Food Passport Rewards Link */}
              {onOpenPassport && (
                <button
                  type="button"
                  onClick={onOpenPassport}
                  className="px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 border border-amber-200 dark:border-amber-800/60 cursor-pointer"
                  title="Loyalty Rewards & Badges"
                >
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>Passport</span>
                </button>
              )}
            </nav>

            {/* Right Action Icons: Taste Rating, Mode Switcher, Veg Toggle, Cart, Account */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Specific Taste Rating Icon & Reviews Button */}
              <button
                type="button"
                onClick={handleScrollToTasteReviews}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all border border-orange-300/60 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40 text-orange-800 dark:text-orange-200 hover:border-orange-500 shadow-xs cursor-pointer hover:scale-105 active:scale-95 group"
                title="View Verified Customer Taste Ratings with Emojis"
              >
                <span className="text-base group-hover:scale-125 transition-transform">🤤</span>
                <span className="font-black text-slate-900 dark:text-white">4.9</span>
                <span className="text-[10px] bg-orange-500 text-white font-black px-1.5 py-0.2 rounded-md uppercase tracking-wider hidden sm:inline">
                  Taste
                </span>
              </button>
              
              {/* Mode Switcher Button (Popup Trigger) */}
              <button
                type="button"
                onClick={openModeModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all border border-amber-400/40 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 hover:border-amber-500 shadow-xs cursor-pointer hover:scale-102"
                title="Change Delivery / Pickup, Pure Veg, or Dark Mode"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden md:inline">
                  {orderMode === 'delivery' ? '🛵 Delivery' : '🥡 Pickup'}
                </span>
                <span className="text-[10px] bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                  Mode
                </span>
              </button>

              {/* Veg Only Toggle Button */}
              {onToggleVegOnly && (
                <button
                  onClick={onToggleVegOnly}
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    isVegOnly
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                  title="Toggle 100% Pure Veg Dishes"
                >
                  <span className="w-3 h-3 rounded-full border border-emerald-600 flex items-center justify-center p-0.5 bg-white">
                    <span className={`w-1.5 h-1.5 rounded-full ${isVegOnly ? 'bg-emerald-600' : 'bg-transparent'}`}></span>
                  </span>
                  <span>Pure Veg</span>
                </button>
              )}

              {/* Live Search Trigger (Navigates to Menu) */}
              {onSearchChange && (
                <div className="relative hidden md:block w-36 xl:w-48">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      onSearchChange(e.target.value);
                      if (currentPage !== 'menu') onNavigate('menu');
                    }}
                    placeholder="Search dishes..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white focus:border-orange-500 focus:outline-none transition-all placeholder:text-slate-400"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              )}

              {/* Cart Drawer Button with Price and Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold shadow-md shadow-orange-600/20 active:scale-95 transition-all text-xs sm:text-sm group cursor-pointer"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:rotate-12 transition-transform" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-black w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full flex items-center justify-center shadow-xs">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
                {subtotal > 0 && (
                  <span className="bg-black/20 text-white text-xs px-2 py-0.5 rounded-md font-semibold">
                    ₹{subtotal.toFixed(0)}
                  </span>
                )}
              </button>

              {/* User Account / Auth Dropdown */}
              <div className="relative">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                    >
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold hidden md:inline truncate max-w-[90px]">
                        {user.name.split(' ')[0]}
                      </span>
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                          <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAdmin ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                          }`}>
                            {isAdmin ? 'Store Administrator' : 'Valued Customer'}
                          </span>
                        </div>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              onNavigate('admin');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-purple-700 dark:text-purple-300 font-bold hover:bg-purple-50 dark:hover:bg-purple-950/50 flex items-center gap-2 cursor-pointer"
                          >
                            <LayoutDashboard className="w-4 h-4 text-purple-600" />
                            Admin Dashboard
                          </button>
                        )}

                        <button
                          onClick={() => {
                            onNavigate('profile');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400" />
                          My Profile & Addresses
                        </button>

                        <button
                          onClick={() => {
                            onNavigate('profile');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 font-medium cursor-pointer"
                        >
                          <Clock className="w-4 h-4 text-slate-400" />
                          Order History
                        </button>

                        {onOpenPassport && (
                          <button
                            onClick={() => {
                              onOpenPassport();
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2 font-bold cursor-pointer"
                          >
                            <Award className="w-4 h-4 text-amber-500" />
                            Food Passport Miles
                          </button>
                        )}

                        <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setUserDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-semibold cursor-pointer"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => openAuthModal('login')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-orange-600 hover:bg-orange-50/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4 text-orange-600" />
                    <span>Sign In</span>
                  </button>
                )}
              </div>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4">
            
            {/* Mobile Brand Emblem Card */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700 mb-2">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white p-0.5 shadow-sm ring-2 ring-emerald-500/40 flex-shrink-0">
                <img src="/food-rocket-logo.png" alt="Food Rocket Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div>
                <p className="font-black text-slate-900 dark:text-white text-sm">Food Rocket</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Fuel Your Hunger, Fast 🚀</p>
              </div>
            </div>

            {/* Mobile Search */}
            {onSearchChange && (
              <div className="relative mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (currentPage !== 'menu') onNavigate('menu');
                  }}
                  placeholder="Search dishes..."
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:bg-white"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            )}

            {/* Mobile Taste Reviews Shortcut with Emoji */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleScrollToTasteReviews();
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between text-orange-700 dark:text-orange-300 bg-orange-50/80 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">🤤</span>
                <span>Customer Taste Ratings & Reviews</span>
              </div>
              <span className="text-xs font-black bg-orange-500 text-white px-2 py-0.5 rounded-full">
                ⭐ 4.9
              </span>
            </button>

            {/* Food Party Mobile */}
            {onOpenParty && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenParty();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Food Party (Group Ordering)</span>
                </div>
                <span className="text-xs font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  Share
                </span>
              </button>
            )}

            {/* Food Passport Mobile */}
            {onOpenPassport && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPassport();
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Food Passport & Loyalty Miles</span>
                </div>
                <span className="text-xs font-black bg-amber-500 text-white px-2 py-0.5 rounded-full">
                  Miles
                </span>
              </button>
            )}

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer ${
                  currentPage === link.id
                    ? 'text-orange-600 bg-orange-50 font-bold dark:bg-orange-950/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 flex items-center gap-2 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-purple-600" />
                Admin Dashboard
              </button>
            )}

            {/* Veg toggle mobile */}
            {onToggleVegOnly && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Pure Veg Dishes Only</span>
                <button
                  onClick={onToggleVegOnly}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    isVegOnly ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
};
