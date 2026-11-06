import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  Flame, 
  Check, 
  X, 
  Star,
  Eye,
  EyeOff
} from 'lucide-react';
import { FoodItem, Category } from '../../types';
import { api } from '../../services/api';

export const AdminFoodManagement: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Form inputs
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(299);
  const [discountPrice, setDiscountPrice] = useState<string>('');
  const [isVeg, setIsVeg] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [prepTime, setPrepTime] = useState('20-25 mins');
  const [calories, setCalories] = useState<string>('');
  const [formMsg, setFormMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [foodRes, catRes] = await Promise.all([
        api.getFoodItems({ adminView: true }),
        api.getCategories()
      ]);
      if (foodRes.success) setItems(foodRes.items);
      if (catRes.success) {
        setCategories(catRes.categories);
        if (catRes.categories.length > 0) {
          setCategoryId(catRes.categories[0].id);
        }
      }
    } catch (e) {
      console.error('Error fetching admin dishes:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setDescription('');
    setPrice(299);
    setDiscountPrice('');
    setIsVeg(true);
    setIsAvailable(true);
    setIsBestseller(false);
    setIsFeatured(false);
    setImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80');
    setPrepTime('20-25 mins');
    setCalories('450');
    setFormMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setName(item.name);
    setCategoryId(item.category_id);
    setDescription(item.description);
    setPrice(item.price);
    setDiscountPrice(item.discount_price ? String(item.discount_price) : '');
    setIsVeg(item.is_veg === 1);
    setIsAvailable(item.is_available === 1);
    setIsBestseller(item.is_bestseller === 1);
    setIsFeatured(item.is_featured === 1);
    setImageUrl(item.image_url);
    setPrepTime(item.preparation_time || '20-25 mins');
    setCalories(item.calories ? String(item.calories) : '');
    setFormMsg(null);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);

    const payload = {
      name,
      category_id: categoryId,
      description,
      price: Number(price),
      discount_price: discountPrice ? Number(discountPrice) : null,
      is_veg: isVeg ? 1 : 0,
      is_available: isAvailable ? 1 : 0,
      is_bestseller: isBestseller ? 1 : 0,
      is_featured: isFeatured ? 1 : 0,
      image_url: imageUrl,
      preparation_time: prepTime,
      calories: calories ? Number(calories) : null
    };

    try {
      if (editingItem) {
        await api.updateFoodItem(editingItem.id, payload);
      } else {
        await api.createFoodItem(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      setFormMsg(err.message || 'Failed to save food dish');
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this dish from the menu?')) return;
    try {
      await api.deleteFoodItem(id);
      loadData();
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const handleToggleAvailability = async (id: number) => {
    try {
      await api.toggleAvailability(id);
      setItems(prev => prev.map(item =>
        item.id === id ? { ...item, is_available: item.is_available === 1 ? 0 : 1 } : item
      ));
    } catch (e) {
      console.error('Availability toggle failed:', e);
    }
  };

  const filteredItems = items.filter(it => {
    const matchCat = filterCat === 'all' || it.category_id === Number(filterCat) || it.category_slug === filterCat;
    const matchSearch = !search || it.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title & Add Dish Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Menu & Food Dishes
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add new recipes, update prices, toggle availability, and mark bestsellers.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Food Items Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-4 px-5">Dish</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Type</th>
                <th className="py-4 px-4">Price</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Tags</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 flex items-center gap-3">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 max-w-xs">{item.description}</p>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-semibold text-slate-600">
                    {item.category_name || 'Uncategorized'}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 font-bold ${item.is_veg ? 'text-emerald-700' : 'text-rose-700'}`}>
                      <span className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                      {item.is_veg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-black text-slate-900">
                      ₹{item.discount_price && item.discount_price > 0 ? item.discount_price : item.price}
                      {item.discount_price && (
                        <span className="text-[10px] text-slate-400 line-through ml-1">₹{item.price}</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleAvailability(item.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1 ${
                        item.is_available === 1
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {item.is_available === 1 ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{item.is_available === 1 ? 'Available' : 'Sold Out'}</span>
                    </button>
                  </td>

                  <td className="py-3.5 px-4 space-x-1">
                    {item.is_bestseller === 1 && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                        Bestseller
                      </span>
                    )}
                    {item.is_featured === 1 && (
                      <span className="inline-block px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-bold">
                        Featured
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      title="Edit dish"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete dish"
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

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-slate-900 text-base">
                {editingItem ? 'Edit Dish' : 'Add New Dish to Menu'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 overflow-y-auto space-y-4 text-xs">
              {formMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 rounded-xl font-bold">
                  {formMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chicken Dum Biryani"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ingredients, preparation style, flavors..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Regular Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Discount Price (₹, optional)</label>
                  <input
                    type="number"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="e.g. 249"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="20-25 mins"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Calories (kcal)</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="450"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVeg}
                    onChange={(e) => setIsVeg(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>Pure Veg</span>
                </label>

                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                  <span>Available</span>
                </label>

                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <span>Bestseller</span>
                </label>

                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>Featured</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-orange-600 text-white font-bold px-6 py-2 rounded-xl shadow-xs"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

