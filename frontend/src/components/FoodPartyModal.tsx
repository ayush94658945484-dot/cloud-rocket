import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Share2, 
  Copy, 
  Check, 
  ShoppingBag, 
  X, 
  Plus, 
  Trash2, 
  Clock, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { FoodItem } from '../types';

interface FoodPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreMenu?: () => void;
  initialPartyId?: string;
}

export const FoodPartyModal: React.FC<FoodPartyModalProps> = ({ 
  isOpen, 
  onClose, 
  onExploreMenu,
  initialPartyId 
}) => {
  const { addToCart, setIsCartOpen } = useCart();

  const [roomId, setRoomId] = useState<string>(initialPartyId || '');
  const [hostName, setHostName] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [roomData, setRoomData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [quickDish, setQuickDish] = useState<string>('Hyderabadi Dum Chicken Biryani');
  const [availableDishes, setAvailableDishes] = useState<FoodItem[]>([]);

  // Load sample dishes for quick group addition
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await api.getFoodItems({ limit: 12 });
        if (res.success && res.items) {
          setAvailableDishes(res.items);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchDishes();
  }, []);

  // Poll / fetch room if roomId exists
  const fetchRoom = async (id: string) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.getPartyRoom(id);
      if (res.success && res.room) {
        setRoomData(res.room);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPartyId) {
      setRoomId(initialPartyId);
      fetchRoom(initialPartyId);
    }
  }, [initialPartyId]);

  const handleCreateRoom = async () => {
    if (!hostName.trim()) return;
    setLoading(true);
    try {
      const res = await api.createPartyRoom(hostName.trim());
      if (res.success && res.roomId) {
        setRoomId(res.roomId);
        fetchRoom(res.roomId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyShareLink = () => {
    const link = `${window.location.origin}?party=${roomId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddMemberItem = async (dish: FoodItem) => {
    const memberName = userName.trim() || hostName.trim() || 'Foodie Friend';
    try {
      const res = await api.addPartyItem(roomId, {
        userName: memberName,
        foodItem: dish,
        quantity: 1,
        customization: 'Group Choice'
      });
      if (res.success) {
        fetchRoom(roomId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckoutGroupOrder = () => {
    if (!roomData || !roomData.items || roomData.items.length === 0) return;
    // Add all party items into local cart
    roomData.items.forEach((item: any) => {
      addToCart({
        ...item.foodItem,
        name: `${item.foodItem.name} (${item.userName})`
      }, item.quantity || 1);
    });
    setIsCartOpen(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-emerald-500/50 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/80 my-8 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Food Party • Group Ordering Studio
              </h3>
              <p className="text-xs text-slate-400">Order together, combine carts & checkout in 1 tap</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* If No Room Created Yet */}
          {!roomId ? (
            <div className="space-y-4">
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800 text-center">
                <Users className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="text-base font-black text-white">Start a Collaborative Food Party</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Create a unique room link. Share it on WhatsApp with friends, colleagues or family. Everyone picks their dishes, and you pay together.
                </p>

                <div className="mt-5 max-w-sm mx-auto flex gap-2">
                  <input
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    placeholder="Enter your name (e.g. Host Rahul)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="button"
                    disabled={!hostName.trim() || loading}
                    onClick={handleCreateRoom}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Party'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Active Party Room */
            <div className="space-y-6">
              
              {/* Share Bar */}
              <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
                    ACTIVE ROOM: {roomId}
                  </span>
                  <span className="text-xs font-bold text-slate-200 block">
                    Host: {roomData?.host_name || hostName}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied Room Link!' : 'Share Party Link'}</span>
                </button>
              </div>

              {/* Your Name Entry */}
              <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400">Ordering As:</span>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name to tag your dishes"
                  className="flex-1 bg-transparent text-xs text-white focus:outline-none placeholder-slate-600"
                />
              </div>

              {/* Collaborative Cart Items */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
                  <span>Group Cart Items ({roomData?.items?.length || 0})</span>
                  <button
                    type="button"
                    onClick={() => fetchRoom(roomId)}
                    className="text-emerald-400 hover:underline cursor-pointer text-[11px]"
                  >
                    Refresh List
                  </button>
                </h4>

                {!roomData?.items || roomData.items.length === 0 ? (
                  <div className="p-6 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-400">
                    No dishes added yet! Select dishes below or share the link with friends.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {roomData.items.map((it: any) => (
                      <div
                        key={it.id}
                        className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-md bg-emerald-950 text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                            {it.userName.charAt(0).toUpperCase()}
                          </span>
                          <div>
                            <span className="font-black text-white">{it.foodItem?.name}</span>
                            <span className="text-slate-400 block text-[10px]">
                              Added by <strong className="text-emerald-300">{it.userName}</strong>
                            </span>
                          </div>
                        </div>

                        <span className="font-mono font-bold text-amber-400">
                          ₹{it.foodItem?.discount_price || it.foodItem?.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Add Dishes from Kitchen */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5">
                  Quick Add Delicacies to Group Cart
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableDishes.slice(0, 4).map((d) => (
                    <div
                      key={d.id}
                      className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">{d.name}</span>
                        <span className="text-[11px] text-amber-400 font-mono">₹{d.discount_price || d.price}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddMemberItem(d)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer flex-shrink-0"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Checkout Bar */}
        {roomId && (
          <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">TOTAL GROUP ITEMS</span>
              <span className="text-sm font-black text-white">{roomData?.items?.length || 0} Dishes</span>
            </div>

            <button
              type="button"
              disabled={!roomData?.items || roomData.items.length === 0}
              onClick={handleCheckoutGroupOrder}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Checkout Unified Group Order</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
