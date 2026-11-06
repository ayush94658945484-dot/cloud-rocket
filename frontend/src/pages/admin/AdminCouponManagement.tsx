import React, { useState, useEffect } from 'react';
import { Tag, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
import { Coupon } from '../../types';
import { api } from '../../services/api';

export const AdminCouponManagement: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FLAT'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [minOrder, setMinOrder] = useState<number>(299);
  const [maxDiscount, setMaxDiscount] = useState<string>('100');
  const [isActive, setIsActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminCoupons();
      if (res.success && res.coupons) {
        setCoupons(res.coupons);
      }
    } catch (e) {
      console.error('Failed to load admin coupons', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openAddModal = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setDiscountType('PERCENTAGE');
    setDiscountValue(20);
    setMinOrder(299);
    setMaxDiscount('100');
    setIsActive(true);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDescription(c.description);
    setDiscountType(c.discount_type);
    setDiscountValue(c.discount_value);
    setMinOrder(c.min_order_amount);
    setMaxDiscount(c.max_discount_amount ? String(c.max_discount_amount) : '');
    setIsActive(c.is_active === 1);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const payload = {
      code: code.trim().toUpperCase(),
      description,
      discount_type: discountType,
      discount_value: Number(discountValue),
      min_order_amount: Number(minOrder),
      max_discount_amount: maxDiscount ? Number(maxDiscount) : null,
      is_active: isActive ? 1 : 0
    };

    try {
      if (editingCoupon) {
        await api.updateCoupon(editingCoupon.id, payload);
      } else {
        await api.createCoupon(payload);
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await api.deleteCoupon(id);
      fetchCoupons();
    } catch (e) {
      console.error('Failed to delete coupon:', e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Offers & Discount Coupons
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create percentage discounts, flat deals, and minimum cart thresholds without editing code.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon Code</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-4 px-5">Code</th>
                <th className="py-4 px-4">Type & Value</th>
                <th className="py-4 px-4">Min Order</th>
                <th className="py-4 px-4">Max Cap</th>
                <th className="py-4 px-4">Times Used</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-5 font-black text-slate-900 text-sm tracking-wider">
                    {c.code}
                    <span className="block text-[11px] text-slate-400 font-normal">{c.description}</span>
                  </td>

                  <td className="py-4 px-4 font-bold text-orange-600">
                    {c.discount_type === 'PERCENTAGE' ? `${c.discount_value}% OFF` : `₹${c.discount_value} FLAT`}
                  </td>

                  <td className="py-4 px-4 font-semibold text-slate-700">
                    ₹{c.min_order_amount}
                  </td>

                  <td className="py-4 px-4 font-semibold text-slate-700">
                    {c.max_discount_amount ? `₹${c.max_discount_amount}` : 'No limit'}
                  </td>

                  <td className="py-4 px-4 font-bold text-slate-500">
                    {c.times_used || 0} orders
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                      c.is_active === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {c.is_active === 1 ? 'Active' : 'Disabled'}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl font-bold">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. MONSOON20"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 uppercase font-black tracking-wider focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 20% off up to ₹150 on biryanis"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min Cart Value (₹)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="Optional"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 font-bold cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-orange-600 rounded"
                />
                <span>Active for Customers</span>
              </label>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 text-white font-bold px-6 py-2 rounded-xl shadow-xs"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

