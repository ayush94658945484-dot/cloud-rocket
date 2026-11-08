import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, Flame, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, authModalMode, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(authModalMode || 'login');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sync mode with context
  React.useEffect(() => {
    if (authModalMode) setMode(authModalMode);
  }, [authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        if (!name.trim()) throw new Error('Please enter your full name');
        await register({ name, email, password, phone });
      }
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = (demoType: 'admin' | 'customer') => {
    if (demoType === 'admin') {
      setEmail('admin@foodrocket.com');
      setPassword('admin123');
    } else {
      setEmail('customer@gmail.com');
      setPassword('customer123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative bg-gradient-to-tr from-slate-950 via-slate-900 to-orange-950 p-6 text-white text-center">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-orange-600/30 border border-orange-500/30 flex items-center justify-center mx-auto mb-3 shadow-md">
            <Flame className="w-7 h-7 text-orange-400" />
          </div>

          <h3 className="text-xl font-black text-white">
            {mode === 'login' ? 'Welcome Back!' : 'Join Food Rocket Club'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {mode === 'login' 
              ? 'Access saved addresses, past orders, and VIP food rewards'
              : 'Create an account to unlock instant 50% discount & live order tracking'
            }
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 mx-6 mt-4 rounded-xl text-xs font-bold">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm py-3 rounded-xl shadow-md shadow-orange-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{submitting ? 'Please wait...' : mode === 'login' ? 'Sign In to Account' : 'Register Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Credentials Autofill */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 block mb-2 font-medium">Quick 1-Click Demo Login:</span>
            <div className="flex items-center justify-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg font-bold hover:bg-purple-100 transition-colors"
              >
                👑 Store Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('customer')}
                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-bold hover:bg-emerald-100 transition-colors"
              >
                👤 Customer Demo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

