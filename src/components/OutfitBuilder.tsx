import React, { useState } from 'react';
import { Product, CartItem } from '../types.js';
import { ShoppingBag, RotateCcw, Check, Sparkles, Layers } from 'lucide-react';

interface OutfitBuilderProps {
  products: Product[];
  onAddOutfitToCart: (items: CartItem[]) => void;
}

type OutfitCategory = 'outerwear' | 'shirt' | 'pants' | 'shoes' | 'accessory';

export const OutfitBuilder: React.FC<OutfitBuilderProps> = ({
  products,
  onAddOutfitToCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<OutfitCategory>('outerwear');

  // Selected garments for each layer slot
  const [selectedOuterwear, setSelectedOuterwear] = useState<Product | null>(
    products.find(p => p.category === 'Kurtkalar') || null
  );
  const [selectedShirt, setSelectedShirt] = useState<Product | null>(
    products.find(p => p.name.includes('futbolkasi') || p.category === 'Ko\'ylaklar') || null
  );
  const [selectedPants, setSelectedPants] = useState<Product | null>(
    products.find(p => p.category === 'Shimlar') || null
  );
  const [selectedShoes, setSelectedShoes] = useState<Product | null>(
    products.find(p => p.category === 'Oyoq kiyimlar') || null
  );
  const [selectedAccessory, setSelectedAccessory] = useState<Product | null>(
    products.find(p => p.category === 'Soatlar' || p.category === 'Boshqa') || null
  );

  const [addedSuccess, setAddedSuccess] = useState(false);

  const categories: { id: OutfitCategory; label: string; icon: string }[] = [
    { id: 'outerwear', label: 'Ustki kiyim', icon: '🧥' },
    { id: 'shirt', label: 'Ichki kiyim / Ko\'ylak', icon: '👔' },
    { id: 'pants', label: 'Shim', icon: '👖' },
    { id: 'shoes', label: 'Oyoq kiyim', icon: '👟' },
    { id: 'accessory', label: 'Aksessuarlar', icon: '⌚' },
  ];

  // Map category to product list
  const getCategoryProducts = (cat: OutfitCategory) => {
    switch (cat) {
      case 'outerwear':
        return products.filter(p => ['Kurtkalar', 'Dvoykalar', 'Sviterlar', 'Sport kiyimlari'].includes(p.category));
      case 'shirt':
        return products.filter(p => ['Kiyimlar', 'Ko\'ylaklar'].includes(p.category));
      case 'pants':
        return products.filter(p => p.category === 'Shimlar');
      case 'shoes':
        return products.filter(p => p.category === 'Oyoq kiyimlar');
      case 'accessory':
        return products.filter(p => ['Atirlar', 'Soatlar', 'Boshqa'].includes(p.category));
      default:
        return [];
    }
  };

  const currentProducts = getCategoryProducts(activeCategory);

  const handleSelectProduct = (product: Product) => {
    switch (activeCategory) {
      case 'outerwear':
        setSelectedOuterwear(product.id === selectedOuterwear?.id ? null : product);
        break;
      case 'shirt':
        setSelectedShirt(product.id === selectedShirt?.id ? null : product);
        break;
      case 'pants':
        setSelectedPants(product.id === selectedPants?.id ? null : product);
        break;
      case 'shoes':
        setSelectedShoes(product.id === selectedShoes?.id ? null : product);
        break;
      case 'accessory':
        setSelectedAccessory(product.id === selectedAccessory?.id ? null : product);
        break;
    }
  };

  const handleClearOutfit = () => {
    setSelectedOuterwear(null);
    setSelectedShirt(null);
    setSelectedPants(null);
    setSelectedShoes(null);
    setSelectedAccessory(null);
  };

  // Calculate active outfit items & total price
  const activeOutfitItems = [
    selectedOuterwear,
    selectedShirt,
    selectedPants,
    selectedShoes,
    selectedAccessory,
  ].filter(Boolean) as Product[];

  const totalOutfitPrice = activeOutfitItems.reduce((sum, item) => sum + item.price, 0);

  const handleAddToCart = () => {
    if (activeOutfitItems.length === 0) return;

    const cartItems: CartItem[] = activeOutfitItems.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: 1,
      size: p.sizes?.[0] || 'L',
      color: p.colors?.[0] || '#18181B',
      image_url: p.image_url
    }));

    onAddOutfitToCart(cartItems);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="outfit-builder">
      {/* Section Header */}
      <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-900 text-white rounded-full text-[11px] font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interaktiv Outfit Builder</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-950 tracking-tight">
            O'z obrazingni yarat
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Kiyimlarni tanlang, ularni modelda sinab ko'ring va mukammal kombinatsiyangizni to'liq holda savatga qo'shing.
          </p>
        </div>

        <button
          onClick={handleClearOutfit}
          className="self-center sm:self-auto px-4 py-2 border border-neutral-300 rounded-xl text-xs font-bold text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Obrazni tozalash</span>
        </button>
      </div>

      {/* Main Builder Grid (Screen 6 Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Interactive Model Stage (Screen 6) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-neutral-200/80 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-neutral-800" />
              <span>Model namoyishi</span>
            </span>
            <span className="text-[11px] font-mono text-neutral-400">SHU BREND 3D LOOK</span>
          </div>

          {/* Model Display Canvas with Layer Overlay */}
          <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden bg-[#EFECE6] border border-neutral-200 shadow-inner">
            {/* Base Model Photo */}
            <img
              src="/src/assets/images/outfit_model_base_1791973131662.jpg"
              alt="Model"
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />

            {/* Visual Overlays & Callout Badges indicating the fitted garments */}
            {selectedOuterwear && (
              <div className="absolute top-[28%] left-4 bg-neutral-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate max-w-[130px]">{selectedOuterwear.name}</span>
              </div>
            )}

            {selectedShirt && !selectedOuterwear && (
              <div className="absolute top-[32%] right-4 bg-neutral-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate max-w-[130px]">{selectedShirt.name}</span>
              </div>
            )}

            {selectedPants && (
              <div className="absolute top-[62%] right-4 bg-neutral-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate max-w-[130px]">{selectedPants.name}</span>
              </div>
            )}

            {selectedShoes && (
              <div className="absolute bottom-4 left-4 bg-neutral-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate max-w-[130px]">{selectedShoes.name}</span>
              </div>
            )}

            {selectedAccessory && (
              <div className="absolute top-4 right-4 bg-neutral-900/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-lg flex items-center gap-1.5 animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="truncate max-w-[110px]">{selectedAccessory.name}</span>
              </div>
            )}

            <div className="absolute bottom-2 right-2 bg-white/70 backdrop-blur-xs text-[9px] text-neutral-600 px-2 py-0.5 rounded">
              Interaktiv namuna
            </div>
          </div>
        </div>

        {/* Right Side: Category Tabs & Wardrobe Items */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                  activeCategory === cat.id
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Garments Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {currentProducts.map((prod) => {
              const isSelected =
                selectedOuterwear?.id === prod.id ||
                selectedShirt?.id === prod.id ||
                selectedPants?.id === prod.id ||
                selectedShoes?.id === prod.id ||
                selectedAccessory?.id === prod.id;

              return (
                <div
                  key={prod.id}
                  onClick={() => handleSelectProduct(prod)}
                  className={`bg-white rounded-2xl border-2 p-3 transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'border-neutral-900 shadow-md ring-2 ring-neutral-400/50'
                      : 'border-neutral-200 hover:border-neutral-400'
                  }`}
                >
                  <div className="relative aspect-square rounded-xl bg-neutral-100 overflow-hidden mb-2">
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="text-xs font-mono font-extrabold text-neutral-950 mt-1">
                      {prod.price.toLocaleString('uz-UZ')} so'm
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Outfit Summary Bar (Matching Screen 6) */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                Tanlangan kiyimlar ({activeOutfitItems.length} ta)
              </h4>
              <span className="text-sm font-extrabold font-mono text-neutral-950">
                Jami: {totalOutfitPrice.toLocaleString('uz-UZ')} so'm
              </span>
            </div>

            {/* Thumbnails Row */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {activeOutfitItems.length === 0 ? (
                <div className="text-xs text-neutral-400 py-3">
                  Hozircha hech qanday kiyim tanlanmadi. Yuqoridagi bo'limlardan kiyim tanlang.
                </div>
              ) : (
                activeOutfitItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative w-16 h-16 rounded-xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 group"
                  >
                    <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (selectedOuterwear?.id === item.id) setSelectedOuterwear(null);
                          if (selectedShirt?.id === item.id) setSelectedShirt(null);
                          if (selectedPants?.id === item.id) setSelectedPants(null);
                          if (selectedShoes?.id === item.id) setSelectedShoes(null);
                          if (selectedAccessory?.id === item.id) setSelectedAccessory(null);
                        }}
                        className="text-white text-xs font-bold hover:scale-110"
                        title="O'chirish"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add All To Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={activeOutfitItems.length === 0}
              className="w-full py-3.5 px-6 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-300 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>
                {addedSuccess
                  ? "Obraz savatga muvaffaqiyatli qo'shildi!"
                  : `Barcha to'plamni savatga qo'shish (${totalOutfitPrice.toLocaleString('uz-UZ')} so'm)`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
