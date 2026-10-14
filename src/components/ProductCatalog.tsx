import React, { useState } from 'react';
import { Product } from '../types.js';
import { ProductCard } from './ProductCard.js';
import { Search, SlidersHorizontal, Grid3X3, LayoutGrid, RotateCcw } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  wishlist: number[];
  onToggleWishlist: (product: Product) => void;
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: string;
  setSortOption: (sort: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  isLoading,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption
}) => {
  const [columns, setColumns] = useState<3 | 4>(3);

  const categories = [
    { id: 'Barchasi', label: 'Barchasi', icon: '✦' },
    { id: 'Kiyimlar', label: 'Kiyimlar', icon: '👕' },
    { id: 'Ko\'ylaklar', label: 'Ko\'ylaklar', icon: '👔' },
    { id: 'Shimlar', label: 'Shimlar', icon: '👖' },
    { id: 'Oyoq kiyimlar', label: 'Oyoq kiyimlar', icon: '👟' },
    { id: 'Dvoykalar', label: 'Dvoykalar', icon: '🤵' },
    { id: 'Kurtkalar', label: 'Kurtkalar', icon: '🧥' },
    { id: 'Sviterlar', label: 'Sviterlar', icon: '🧶' },
    { id: 'Sport kiyimlari', label: 'Sport kiyimlari', icon: '🏃' },
    { id: 'Atirlar', label: 'Atirlar', icon: '🧴' },
    { id: 'Soatlar', label: 'Soatlar', icon: '⌚' },
    { id: 'Boshqa', label: 'Boshqa', icon: '🧢' },
  ];

  // Client-side filtering logic
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'Barchasi' || selectedCategory === 'Barcha mahsulotlar'
        ? true
        : p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesSearch;
  });

  // Client-side sort
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'price_asc') return a.price - b.price;
    if (sortOption === 'price_desc') return b.price - a.price;
    if (sortOption === 'newest') return b.id - a.id;
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="catalog-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Category Sidebar (Screen 2 Layout) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-xs lg:sticky lg:top-24">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-3">
            <h3 className="font-extrabold text-neutral-900 text-sm uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-neutral-700" />
              <span>Kategoriyalar</span>
            </h3>
            <span className="text-xs text-neutral-400 font-mono">
              {filteredProducts.length} ta
            </span>
          </div>

          <div className="space-y-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = cat.id === 'Barchasi'
                ? products.length
                : products.filter(p => p.category.toLowerCase() === cat.id.toLowerCase()).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-neutral-950'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </span>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Main Catalog Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Filter and Search Bar */}
          <div className="bg-white p-4 sm:p-5 rounded-3xl border border-neutral-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Mahsulot nomi yoki turini qidiring..."
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white border border-transparent focus:border-neutral-400 rounded-xl text-xs font-medium text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Controls: Sort and Grid View Mode */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 whitespace-nowrap hidden md:inline">Saralash:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-800 outline-none cursor-pointer hover:border-neutral-300"
                >
                  <option value="featured">Ommabop</option>
                  <option value="newest">Yangi qo'shilganlar</option>
                  <option value="price_asc">Arzonroqdan boshlab</option>
                  <option value="price_desc">Qimmatroqdan boshlab</option>
                </select>
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200">
                <button
                  onClick={() => setColumns(3)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    columns === 3 ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                  title="3 ustunli ko'rinish"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setColumns(4)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    columns === 4 ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                  title="4 ustunli ko'rinish"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters Bar if searching or filtered */}
          {(searchQuery || selectedCategory !== 'Barchasi') && (
            <div className="flex items-center justify-between text-xs text-neutral-600 px-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span>Filtr:</span>
                {selectedCategory !== 'Barchasi' && (
                  <span className="bg-neutral-200/80 px-2.5 py-1 rounded-md text-neutral-900 font-semibold flex items-center gap-1">
                    {selectedCategory}
                    <button onClick={() => onSelectCategory('Barchasi')} className="hover:text-red-600">×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-neutral-200/80 px-2.5 py-1 rounded-md text-neutral-900 font-semibold flex items-center gap-1">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-red-600">×</button>
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  onSelectCategory('Barchasi');
                  setSearchQuery('');
                }}
                className="text-neutral-500 hover:text-neutral-900 underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Barchasini tozalash
              </button>
            </div>
          )}

          {/* Product Grid */}
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-3 border-neutral-900 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-neutral-500 font-medium">Mahsulotlar bazadan yuklanmoqda...</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center space-y-4">
              <div className="text-4xl">🔍</div>
              <h4 className="text-lg font-bold text-neutral-900">Mahsulot topilmadi</h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Kiritilgan so'rov yoki kategoriya bo'yicha hech narsa chiqmadi. Boshqa kalit so'z bilan qidirib ko'ring yoki barcha mahsulotlarga qayting.
              </p>
              <button
                onClick={() => {
                  onSelectCategory('Barchasi');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Barcha mahsulotlarni ko'rish
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
              } gap-5 sm:gap-6`}
            >
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
