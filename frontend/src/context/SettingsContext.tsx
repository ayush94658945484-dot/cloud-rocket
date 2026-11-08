import React, { createContext, useContext, useState, useEffect } from 'react';
import { WebsiteSettings } from '../types';
import { api } from '../services/api';

interface SettingsContextType {
  settings: WebsiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Record<string, any>) => Promise<void>;
}

const defaultSettings: WebsiteSettings = {
  business_name: 'Food Rocket',
  tagline: 'Rocket-Fast Gourmet Flavors Delivered Hot & Fresh in 30 Mins',
  whatsapp_number: '919876543210',
  contact_phone: '+91 98765 43210',
  contact_email: 'orders@foodrocket.com',
  address: 'Cloud Culinary Hub, Kitchen Suite #4, Sector 18, Commercial Zone, Mumbai 400053',
  opening_hours: '11:00 AM – 11:30 PM (Daily)',
  delivery_charge: '40',
  free_delivery_threshold: '499',
  min_order_amount: '149',
  tax_rate_percent: '5',
  instagram_url: 'https://instagram.com',
  facebook_url: 'https://facebook.com',
  delivery_time_estimate: '30-40 mins',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshSettings = async () => {
    try {
      const res = await api.getSettings();
      if (res.success && res.settings) {
        setSettings({ ...defaultSettings, ...res.settings });
      }
    } catch (err) {
      console.warn('Could not load live settings, using fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Record<string, any>) => {
    const res = await api.updateSettingsBulk(newSettings);
    if (res.success && res.settings) {
      setSettings(res.settings);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};

