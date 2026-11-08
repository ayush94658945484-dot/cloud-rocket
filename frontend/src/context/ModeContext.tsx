import React, { createContext, useContext, useState, useEffect } from 'react';

export type OrderMode = 'delivery' | 'pickup';
export type DietaryMode = 'all' | 'veg';
export type ThemeMode = 'light' | 'dark';

interface ModeContextType {
  orderMode: OrderMode;
  setOrderMode: (mode: OrderMode) => void;
  dietaryMode: DietaryMode;
  setDietaryMode: (mode: DietaryMode) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isModeModalOpen: boolean;
  openModeModal: () => void;
  closeModeModal: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orderMode, setOrderModeState] = useState<OrderMode>(() => {
    return (localStorage.getItem('rocket_order_mode') as OrderMode) || 'delivery';
  });

  const [dietaryMode, setDietaryModeState] = useState<DietaryMode>(() => {
    return (localStorage.getItem('rocket_dietary_mode') as DietaryMode) || 'all';
  });

  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('rocket_theme_mode') as ThemeMode) || 'light';
  });

  const [isModeModalOpen, setIsModeModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('rocket_order_mode', orderMode);
  }, [orderMode]);

  useEffect(() => {
    localStorage.setItem('rocket_dietary_mode', dietaryMode);
  }, [dietaryMode]);

  useEffect(() => {
    localStorage.setItem('rocket_theme_mode', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const setOrderMode = (mode: OrderMode) => setOrderModeState(mode);
  const setDietaryMode = (mode: DietaryMode) => setDietaryModeState(mode);
  const setThemeMode = (mode: ThemeMode) => setThemeModeState(mode);
  const openModeModal = () => setIsModeModalOpen(true);
  const closeModeModal = () => setIsModeModalOpen(false);

  return (
    <ModeContext.Provider
      value={{
        orderMode,
        setOrderMode,
        dietaryMode,
        setDietaryMode,
        themeMode,
        setThemeMode,
        isModeModalOpen,
        openModeModal,
        closeModeModal,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) throw new Error('useMode must be used within ModeProvider');
  return context;
};
