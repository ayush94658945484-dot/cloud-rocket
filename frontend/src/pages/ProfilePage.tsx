import React, { useState, useEffect } from 'react';
import { 
  User, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ArrowRight,
  Phone,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Address, Order } from '../types';

interface ProfilePageProps {
  onTrackOrder: (orderNumber: string) => void;
  onExploreMenu: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onTrackOrder, onExploreMenu }) => {
  const { user, updateProfile, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  // Address modal
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [label, setLabel] = useState('Home');
  const [recipientName, setRecipientName] = useState(user?.name || '');
  const [addressPhone, setAddressPhone] = useState(user?.phone || '');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');

  // Settings form
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [newPassword, setNewPassword] = useState('');
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const profileData = await api.getMe();
      if (profileData.success) {
        setAddresses(profileData.addresses || []);
      }
      const ordersData = await api.getMyOrders();
      if (ordersData.success) {
        setOrders(ordersData.orders || []);
      }
    } catch (e) {
      console.warn('Error fetching customer profile:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone || '');
      loadData();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center px-4 space-y-4">
        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Please Sign In</h2>
        <p className="text-xs text-slate-500">
          Sign in or create an account to view your past orders and saved delivery addresses.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim() || !recipientName.trim() || !addressPhone.trim()) return;

    try {
      const res = await api.addAddress({
        label,
        recipient_name: recipientName,
        phone: addressPhone,
        address_line: addressLine,
        landmark,
        city: 'Mumbai',
        is_default: addresses.length === 0 ? 1 : 0
      });
      if (res.success && res.addresses) {
        setAddresses(res.addresses);
        setShowAddressForm(false);
        setAddressLine('');
        setLandmark('');
      }
    } catch (e) {
      console.error('Failed to add address:', e);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    try {
      const res = await api.deleteAddress(id);
      if (res.success && res.addresses) {
        setAddresses(res.addresses);
      }
    } catch (e) {
      console.error('Failed to delete address:', e);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsMsg(null);
    try {
      await updateProfile({
        name: editName,
        phone: editPhone,
        password: newPassword ? newPassword : undefined
      });
      setSettingsMsg('Profile updated successfully!');
      setNewPassword('');
    } catch (e: any) {
      setSettingsMsg(e.message || 'Failed to update profile');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-orange-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">{user.name}</h1>
            <p className="text-xs text-slate-500">{user.email} • {user.phone || 'No phone set'}</p>
            <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Verified Gourmet Member
            </span>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Order History ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'addresses' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Addresses ({addresses.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Tab 1: Orders History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900">Your Recent Cloud Kitchen Orders</h2>
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">No orders yet</h3>
              <p className="text-xs text-slate-500">Taste the magic of our slow-dum biryanis and gourmet curries!</p>
              <button
                onClick={onExploreMenu}
                className="bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div key={o.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                    <div>
                      <span className="text-xs font-bold text-orange-600">{o.order_number}</span>
                      <p className="text-[11px] text-slate-400">
                        {new Date(o.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        o.order_status === 'DELIVERED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.order_status === 'CANCELLED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.order_status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        ₹{Number(o.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    {o.items?.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.quantity}x {it.food_name}</span>
                        <span className="font-bold">₹{it.total_price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Track CTA */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Paid via: <strong>{o.payment_method}</strong>
                    </span>
                    <button
                      onClick={() => onTrackOrder(o.order_number)}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900">Your Delivery Addresses</h2>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="flex items-center gap-1.5 bg-orange-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* New address form */}
          {showAddressForm && (
            <form onSubmit={handleAddAddress} className="bg-white rounded-3xl p-6 border border-orange-200 shadow-lg space-y-4 max-w-lg">
              <h3 className="font-bold text-sm text-slate-900">Add New Delivery Location</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Label</label>
                  <select
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work / Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={addressPhone}
                    onChange={(e) => setAddressPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Complete Address</label>
                <textarea
                  required
                  rows={2}
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                  placeholder="House/flat, building, street, area"
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 text-white font-bold text-xs px-5 py-2 rounded-xl shadow-xs"
                >
                  Save Address
                </button>
              </div>
            </form>
          )}

          {/* Saved Addresses list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((a) => (
              <div key={a.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-black text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-md inline-block">
                    {a.label}
                  </span>
                  <p className="text-xs font-bold text-slate-800">{a.recipient_name} ({a.phone})</p>
                  <p className="text-xs text-slate-500">{a.address_line}</p>
                  {a.landmark && <p className="text-[11px] text-slate-400">Near: {a.landmark}</p>}
                </div>

                <button
                  onClick={() => handleDeleteAddress(a.id)}
                  className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Account Settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleUpdateProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm max-w-lg space-y-4">
          <h2 className="text-lg font-black text-slate-900">Update Account Profile</h2>

          {settingsMsg && (
            <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              {settingsMsg}
            </p>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">New Password (Leave blank to keep current)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200"
            />
          </div>

          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all"
          >
            Save Changes
          </button>
        </form>
      )}
    </div>
  );
};

