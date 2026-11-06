import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Flame, 
  Star, 
  X, 
  RefreshCcw 
} from 'lucide-react';
import { FoodItem, Category } from '../types';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';

interface MenuPageProps {
  initialCategory?: string;
  onQuickView: (item: FoodItem) => void;
  isVegOnly?: boolean;
  onToggleVegOnly?: () => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  initialCategory = 'all',
  onQuickView,
  isVegOnly = false,
  onToggleVegOnly,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('default');
  const [bestsellerOnly, setBestsellerOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const params: any = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: search.trim() || undefined,
        veg: isVegOnly ? true : undefined,
        bestseller: bestsellerOnly ? true : undefined,
        sort: sort !== 'default' ? sort : undefined,
        maxPrice: maxPrice < 1000 ? maxPrice : undefined,
      };

      const res = await api.getFoodItems(params);
      if (res.success) {
        setItems(res.items);
      }
    } catch (err) {
      console.error('Failed to fetch food items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, search, isVegOnly, bestsellerOnly, sort, maxPrice]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSearch('');
    setBestsellerOnly(false);
    setMaxPrice(1000);
    setSort('default');
    if (isVegOnly && onToggleVegOnly) onToggleVegOnly();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest bg-orange-100 px-3 py-1 rounded-full">
          Gourmet Cloud Menu
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Handcrafted Dishes & Feasts
        </h1>
        <p className="text-slate-500 text-sm">
          Freshly prepared on demand using authentic ingredients and delivered piping hot.
        </p>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        
        {/* Top Search & Primary Filters Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dish by name, ingredients..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-orange-500 focus:bg-white transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Toggle Filters: Pure Veg & Bestsellers */}
          <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {onToggleVegOnly && (
              <button
                onClick={onToggleVegOnly}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border flex-shrink-0 cursor-pointer ${
                  isVegOnly
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center p-0.5 ${
                  isVegOnly ? 'border-white bg-white' : 'border-emerald-600 bg-white'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isVegOnly ? 'bg-emerald-600' : 'bg-emerald-600'}`}></span>
                </span>
                <span>Pure Veg Only</span>
              </button>
            )}

            <button
              onClick={() => setBestsellerOnly(!bestsellerOnly)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all border flex-shrink-0 cursor-pointer ${
                bestsellerOnly
                  ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${bestsellerOnly ? 'fill-white' : 'text-amber-500'}`} />
              <span>Bestsellers</span>
            </button>

            {/* Sorting Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="default">Sort by: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Category Pills (Scrollable) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-slate-100">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🍽️ All Dishes ({items.length})
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === cat.slug
                  ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Food Cards Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 py-12">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl h-72 border border-slate-100 animate-pulse p-4 space-y-4">
              <div className="h-40 bg-slate-200 rounded-2xl"></div>
              <div className="h-4 bg-slate-200 rounded-md w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded-md w-1/2"></div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center max-w-md mx-auto border border-slate-100 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No dishes match your filter</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search terms, toggling veg preferences, or exploring other categories.
          </p>
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md mx-auto transition-all"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((dish) => (
            <FoodCard key={dish.id} item={dish} onQuickView={onQuickView} />
          ))}
        </div>
      )}
    </div>
  );
};

