import React, { useState, useEffect } from 'react';
import { Users, Search, Phone, Mail, ShoppingBag } from 'lucide-react';
import { api } from '../../services/api';

export const AdminCustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.getAdminCustomers();
        if (res.success && res.customers) {
          setCustomers(res.customers);
        }
      } catch (e) {
        console.error('Failed to load customers', e);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Customer Directory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Registered foodies, order counts, and lifetime dining expenditure.
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs max-w-sm">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-4 px-5">Customer</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4">Registered On</th>
                <th className="py-4 px-4">Orders Placed</th>
                <th className="py-4 px-5 text-right">Lifetime Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-xs">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{c.name}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600">
                    <p>{c.email}</p>
                    <p className="text-[11px] text-slate-400">{c.phone || 'No phone'}</p>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(c.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>

                  <td className="py-3.5 px-4 font-black text-slate-800">
                    {c.total_orders || 0} orders
                  </td>

                  <td className="py-3.5 px-5 text-right font-black text-slate-900">
                    ₹{Number(c.total_spent || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

