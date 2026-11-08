import React, { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ModeProvider, useMode } from './context/ModeContext';
import { FoodItem } from './types';

// Core UI Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { AuthModal } from './components/AuthModal';
import { FoodDetailModal } from './components/FoodDetailModal';
import { ModeModal } from './components/ModeModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

// Futuristic 3D & Galactic Modules
import { ThreeRocketCursor } from './components/ThreeRocketCursor';
import { FoodCustomizerModal } from './components/FoodCustomizerModal';
import { FoodPartyModal } from './components/FoodPartyModal';
import { FoodPassportModal } from './components/FoodPassportModal';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { MenuPage } from './pages/MenuPage';
import { OffersPage } from './pages/OffersPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPages } from './pages/PoliciesPages';

// Admin Pages
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrderManagement } from './pages/admin/AdminOrderManagement';
import { AdminFoodManagement } from './pages/admin/AdminFoodManagement';
import { AdminCouponManagement } from './pages/admin/AdminCouponManagement';
import { AdminCustomerManagement } from './pages/admin/AdminCustomerManagement';
import { AdminSettings } from './pages/admin/AdminSettings';

const MainApp: React.FC = () => {
  const { user, isAdmin, openAuthModal } = useAuth();
  const { settings } = useSettings();
  const { dietaryMode, setDietaryMode } = useMode();

  // Navigation state
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [adminSubTab, setAdminSubTab] = useState<string>('dashboard');
  
  // Cross-page parameters
  const [menuInitialCategory, setMenuInitialCategory] = useState<string>('all');
  const [initialOrderNumber, setInitialOrderNumber] = useState<string>('');
  const [isVegOnly, setIsVegOnly] = useState<boolean>(false);
  const activeVegOnly = isVegOnly || dietaryMode === 'veg';
  
  // Modal states
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
  const [customizingItem, setCustomizingItem] = useState<FoodItem | null>(null);
  const [isPartyOpen, setIsPartyOpen] = useState<boolean>(false);
  const [isPassportOpen, setIsPassportOpen] = useState<boolean>(false);
  const [partyRoomId, setPartyRoomId] = useState<string>('');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<any | null>(null);
  const [lastWhatsappUrl, setLastWhatsappUrl] = useState<string | undefined>(undefined);

  // Set document title from business name
  useEffect(() => {
    if (settings.business_name) {
      document.title = `${settings.business_name} - Cravings Delivered From Another Planet`;
    }
  }, [settings.business_name]);

  // Check URL parameters for collaborative party room links (?party=ROOM_ID)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const party = params.get('party');
      if (party) {
        setPartyRoomId(party);
        setIsPartyOpen(true);
      }
    } catch (e) {
      console.warn('Failed reading query parameters:', e);
    }
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    // If navigating to admin but user is not admin, open auth modal
    if (page === 'admin' && !isAdmin) {
      openAuthModal('login');
      return;
    }

    if (page === 'menu' && params?.category) {
      setMenuInitialCategory(params.category);
    }

    if (page === 'track' && params?.orderNumber) {
      setInitialOrderNumber(params.orderNumber);
    }

    if (page === 'profile' && !user) {
      openAuthModal('login');
      return;
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickView = (item: FoodItem) => {
    setSelectedFoodItem(item);
  };

  const handleCustomize = (item: FoodItem) => {
    setCustomizingItem(item);
  };

  const handleOrderSuccess = (orderData: any, whatsappUrl?: string) => {
    setLastPlacedOrder(orderData);
    setLastWhatsappUrl(whatsappUrl);
    setCurrentPage('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Admin View
  if (currentPage === 'admin') {
    return (
      <AdminLayout
        activeTab={adminSubTab}
        onTabChange={setAdminSubTab}
        onBackToStore={() => setCurrentPage('home')}
      >
        {adminSubTab === 'dashboard' && <AdminDashboard onNavigateTab={setAdminSubTab} />}
        {adminSubTab === 'orders' && <AdminOrderManagement />}
        {adminSubTab === 'food' && <AdminFoodManagement />}
        {adminSubTab === 'coupons' && <AdminCouponManagement />}
        {adminSubTab === 'customers' && <AdminCustomerManagement />}
        {adminSubTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // Render Public / Storefront View
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-orange-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isVegOnly={activeVegOnly}
        onToggleVegOnly={() => {
          const next = !activeVegOnly;
          setIsVegOnly(next);
          setDietaryMode(next ? 'veg' : 'all');
        }}
        onOpenParty={() => setIsPartyOpen(true)}
        onOpenPassport={() => setIsPassportOpen(true)}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onQuickView={handleQuickView}
            onCustomize={handleCustomize}
            onOpenParty={() => setIsPartyOpen(true)}
            onOpenPassport={() => setIsPassportOpen(true)}
          />
        )}

        {currentPage === 'menu' && (
          <MenuPage
            initialCategory={menuInitialCategory}
            onQuickView={handleQuickView}
            onCustomize={handleCustomize}
            isVegOnly={activeVegOnly}
            onToggleVegOnly={() => {
              const next = !activeVegOnly;
              setIsVegOnly(next);
              setDietaryMode(next ? 'veg' : 'all');
            }}
          />
        )}

        {currentPage === 'offers' && (
          <OffersPage onExploreMenu={() => handleNavigate('menu')} />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            onBackToMenu={() => handleNavigate('menu')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentPage === 'order-success' && (
          <OrderSuccessPage
            order={lastPlacedOrder}
            whatsappUrl={lastWhatsappUrl}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'track' && (
          <TrackOrderPage
            initialOrderNumber={initialOrderNumber}
            onExploreMenu={() => handleNavigate('menu')}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            onTrackOrder={(num) => handleNavigate('track', { orderNumber: num })}
            onExploreMenu={() => handleNavigate('menu')}
          />
        )}

        {currentPage === 'about' && <AboutPage />}

        {currentPage === 'contact' && <ContactPage />}

        {currentPage === 'privacy' && <PoliciesPages type="privacy" />}

        {currentPage === 'terms' && <PoliciesPages type="terms" />}

        {currentPage === 'delivery-policy' && <PoliciesPages type="delivery" />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onNavigateToCheckout={() => handleNavigate('checkout')}
        onExploreMenu={() => handleNavigate('menu')}
      />

      {/* Food Details Modal */}
      <FoodDetailModal
        item={selectedFoodItem}
        onClose={() => setSelectedFoodItem(null)}
        onCustomize={handleCustomize}
      />

      {/* 3D Food Customizer Modal */}
      <FoodCustomizerModal
        item={customizingItem}
        onClose={() => setCustomizingItem(null)}
      />

      {/* Collaborative Food Party Modal */}
      <FoodPartyModal
        isOpen={isPartyOpen}
        onClose={() => setIsPartyOpen(false)}
        initialPartyId={partyRoomId}
        onExploreMenu={() => {
          setIsPartyOpen(false);
          handleNavigate('menu');
        }}
      />

      {/* Digital Food Passport Modal */}
      <FoodPassportModal
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        onExploreMenu={() => {
          setIsPassportOpen(false);
          handleNavigate('menu');
        }}
      />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Dining & Order Mode Switcher Modal */}
      <ModeModal />

      {/* Persistent Floating WhatsApp Help Button */}
      <FloatingWhatsApp />

      {/* 3D Metallic Rocket Mouse Cursor (Desktop with Interactive Toggle) */}
      <ThreeRocketCursor />
    </div>
  );
};

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <CartProvider>
          <ModeProvider>
            <MainApp />
          </ModeProvider>
        </CartProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
