import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Clock, 
  MapPin, 
  MessageCircle, 
  Phone, 
  CheckCircle2, 
  Eye, 
  X,
  Filter
} from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';

export const AdminOrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: search.trim() || undefined
      });
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (e) {
      console.error('Failed to load admin orders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    try {
      const res = await api.updateOrderStatus(orderId, { order_status: newStatus });
      if (res.success && res.order) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: res.order.order_status } : o));
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, order_status: res.order.order_status } : null);
        }
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const statusBadges: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
    CONFIRMED: 'bg-blue-100 text-blue-800 border-blue-200',
    PREPARING: 'bg-orange-100 text-orange-800 border-orange-200',
    OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-800 border-purple-200',
    DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    CANCELLED: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Live Kitchen Order Tickets
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Incoming orders from website & WhatsApp. Update status to notify delivery and kitchen staff.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs self-start sm:self-auto cursor-pointer"
        >
          Refresh Feed
        </button>
      </div>

      {/* Filter and Search Row */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, name, phone..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Status Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {['all', 'PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap cursor-pointer transition-all ${
                statusFilter === st
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'All Orders' : st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-4 px-5">Order #</th>
                <th className="py-4 px-4">Customer</th>
                <th className="py-4 px-4">Address</th>
                <th className="py-4 px-4">Total</th>
                <th className="py-4 px-4">Method</th>
                <th className="py-4 px-4">Status & Action</th>
                <th className="py-4 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-semibold">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-black text-slate-900">
                      {ord.order_number}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {new Date(ord.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{ord.customer_name}</div>
                      <a 
                        href={`https://wa.me/${ord.customer_phone.replace(/[^0-9]/g, '')}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <MessageCircle className="w-3 h-3" /> {ord.customer_phone}
                      </a>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs text-slate-600 truncate">
                      {ord.delivery_address}
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900">
                      ₹{Number(ord.total_amount).toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        ord.payment_method === 'WHATSAPP' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {ord.payment_method}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className={`text-xs font-black uppercase px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                          statusBadges[ord.order_status] || 'bg-slate-100'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="PREPARING">PREPARING</option>
                        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                        title="View Full Order Ticket"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-black text-slate-900 text-base">
                  Ticket #{selectedOrder.order_number}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {new Date(selectedOrder.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 space-y-1">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Customer Contact</span>
                <p className="font-bold text-slate-800 text-sm">{selectedOrder.customer_name}</p>
                <p className="text-slate-600">{selectedOrder.customer_phone}</p>
                <p className="text-slate-500">{selectedOrder.delivery_address}</p>
                {selectedOrder.landmark && <p className="text-slate-400">Landmark: {selectedOrder.landmark}</p>}
                {selectedOrder.special_instructions && (
                  <p className="text-orange-600 font-medium pt-1">
                    Kitchen Note: "{selectedOrder.special_instructions}"
                  </p>
                )}
              </div>

              {/* Items List */}
              <div>
                <span className="font-bold text-slate-400 uppercase text-[10px] block mb-2">Order Dishes</span>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl p-3 bg-white space-y-2">
                  {selectedOrder.items?.map((it: any, idx: number) => (
                    <div key={idx} className="pt-2 first:pt-0 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-800">{it.quantity}x {it.food_name}</span>
                        <span className="text-[10px] text-slate-400 block">{it.is_veg ? '🟢 Veg' : '🔴 Non-Veg'}</span>
                      </div>
                      <span className="font-black text-slate-900">₹{it.total_price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-3.5 rounded-2xl bg-slate-50 space-y-1.5 font-medium text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{Number(selectedOrder.subtotal).toFixed(2)}</span>
                </div>
                {selectedOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({selectedOrder.coupon_code}):</span>
                    <span>-₹{Number(selectedOrder.discount_amount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>₹{Number(selectedOrder.delivery_fee).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes:</span>
                  <span>₹{Number(selectedOrder.tax_amount).toFixed(2)}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-200 flex justify-between font-black text-sm text-slate-900">
                  <span>Grand Total:</span>
                  <span className="text-orange-600">₹{Number(selectedOrder.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-900 text-white font-bold text-xs px-5 py-2 rounded-xl"
              >
                Close Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

