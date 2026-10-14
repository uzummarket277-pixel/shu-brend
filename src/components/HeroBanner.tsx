import React from 'react';
import { BrandLogo } from './BrandLogo.js';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface HeroBannerProps {
  onShopClick: () => void;
  onOutfitClick: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShopClick,
  onOutfitClick,
  selectedCategory,
  onSelectCategory,
}) => {
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

  return (
    <section className="relative overflow-hidden pt-4 pb-12">
      {/* Visual Studio Showcase Card - Inspired by shu-brend-banner.png and Mockup 1 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#EAE6DE] via-[#F4EFE6] to-[#E5DFD3] border border-neutral-300/60 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xs">
          {/* Subtle Ambient Decorative Gradients */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-neutral-200/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Brand Copy & Actions */}
            <div className="lg:col-span-7 space-y-6">
              {/* Brand mark badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-white/80 backdrop-blur-sm rounded-full border border-neutral-300/80 shadow-xs">
                <BrandLogo size={24} />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  SHU BREND · Rasmiy Internet Do'koni
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 uppercase leading-[1.08]">
                  SHU BREND
                </h1>
                <p className="text-xl sm:text-2xl font-semibold text-neutral-800">
                  Erkaklar uchun zamonaviy kiyim-kechak
                </p>
                <p className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed">
                  O'zingizga mos zamonaviy kiyimlarni tanlang va o'z uslubingizni yarating. Premium sifat, mukammal bichim va tezkor yetkazib berish.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onShopClick}
                  className="px-7 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-sm font-bold tracking-wide transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 active:scale-98 cursor-pointer"
                >
                  <span>Xarid qilish</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOutfitClick}
                  className="px-6 py-3.5 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 shadow-xs flex items-center gap-2 active:scale-98 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Obraz yaratish (Modelda sinash)</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-neutral-300/70 grid grid-cols-3 gap-3 text-xs text-neutral-700">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-neutral-900 shrink-0" />
                  <span>Tezkor yetkazish</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0" />
                  <span>100% Asl mahsulot</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-neutral-900 shrink-0" />
                  <span>O'lcham almashtirish</span>
                </div>
              </div>
            </div>

            {/* Right Column: High Fashion Editorial Model Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/60 group">
                <img
                  src="/src/assets/images/hero_model_man_1791973131385.jpg"
                  alt="SHU BREND Erkaklar Modasi"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Badge Over Photo */}
                <div className="absolute bottom-5 left-5 right-5 p-4 bg-white/90 backdrop-blur-md rounded-xl border border-white/50 flex items-center justify-between shadow-lg">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Yangi Kolleksiya 2026</p>
                    <p className="text-sm font-extrabold text-neutral-900">Zamonaviy Klassika & Urban Streetwear</p>
                  </div>
                  <span className="text-xs font-bold bg-neutral-900 text-white px-2.5 py-1 rounded-md">
                    SHU
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar (Screen 1 Category Circles) */}
        <div className="mt-10" id="categories-section">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900 tracking-tight flex items-center gap-2">
              <span>Kiyim kategoriyalari</span>
              <span className="text-xs font-normal text-neutral-500">(Kerakli bo'limni tanlang)</span>
            </h2>
            <button
              onClick={() => onSelectCategory('Barchasi')}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-950 underline cursor-pointer"
            >
              Hammasini ko'rish
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl min-w-[90px] transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-md scale-102'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100/80 border-neutral-200/80 hover:border-neutral-300'
                  }`}
                >
                  <span className="text-2xl filter drop-shadow-xs">{cat.icon}</span>
                  <span className="text-xs font-semibold whitespace-nowrap text-center">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
