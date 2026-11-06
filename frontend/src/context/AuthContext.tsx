import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (payload: { name?: string; phone?: string; password?: string }) => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  authModalMode: 'login' | 'register';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('rocket_token') || localStorage.getItem('zaika_token')
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const refreshProfile = async () => {
    const savedToken = localStorage.getItem('rocket_token') || localStorage.getItem('zaika_token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const data = await api.getMe();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Profile fetch error, token might be invalid:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (payload: { name?: string; phone?: string; password?: string }) => {
    const data = await api.updateProfile(payload);
    if (data.success && data.user) {
      setUser(data.user);
    } else {
      throw new Error(data.message || 'Failed to update profile');
    }
  };

  useEffect(() => {
    if (token) {
      refreshProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.login(credentials);
    if (res.success && res.token) {
      localStorage.setItem('rocket_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
    }
  };

  const register = async (payload: { name: string; email: string; password: string; phone?: string }) => {
    const res = await api.register(payload);
    if (res.success && res.token) {
      localStorage.setItem('rocket_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setIsAuthModalOpen(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('rocket_token');
    localStorage.removeItem('zaika_token');
    setToken(null);
    setUser(null);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
