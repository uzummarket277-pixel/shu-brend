import React, { useState } from 'react';
import { Product } from '../types.js';
import { X, ShoppingBag, Zap, Heart, Star, ShieldCheck, Truck, RotateCcw, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onBuyNow: (product: Product, size: string, color: string, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  onToggleWishlist,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'L');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '#18181B');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'size_chart' | 'reviews'>('desc');
  const [selectedImage, setSelectedImage] = useState<string>(product.image_url);

  const allImages = [product.image_url, ...(product.thumbnails || [])].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-neutral-300/80 my-8 flex flex-col max-h-[92vh]">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-neutral-200/80 bg-white flex items-center justify-between shrink-0">
          <div className="text-xs text-neutral-500 flex items-center gap-2">
            <span>Bosh sahifa</span>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span className="font-semibold text-neutral-900 truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            title="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Gallery Left */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-square rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-inner">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {allImages.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        selectedImage === img ? 'border-neutral-900 scale-105 shadow-sm' : 'border-neutral-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Purchase Module Right */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    {product.category}
                  </span>
                  <button
                    onClick={() => onToggleWishlist(product)}
                    className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-600 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'text-red-600 fill-current' : ''}`} />
                  </button>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 mt-1">
                  {product.name}
                </h2>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-neutral-700">4.8</span>
                  <span className="text-xs text-neutral-400">· 24 ta sharh</span>
                </div>
              </div>

              {/* Price & Discounts */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-neutral-200">
                <span className="text-2xl sm:text-3xl font-black text-neutral-950 font-mono tracking-tight">
                  {product.price.toLocaleString('uz-UZ')} so'm
                </span>
                {product.old_price && product.old_price > product.price ? (
                  <>
                    <span className="text-sm text-neutral-400 line-through font-mono">
                      {product.old_price.toLocaleString('uz-UZ')} so'm
                    </span>
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                      -{product.discount || 14}%
                    </span>
                  </>
                ) : null}
              </div>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                    Rang: <span className="font-mono text-neutral-900">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        style={{ backgroundColor: c }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                          selectedColor === c ? 'border-neutral-950 scale-110 shadow-md ring-2 ring-neutral-400' : 'border-neutral-300'
                        }`}
                      >
                        {selectedColor === c && (
                          <Check className={`w-4 h-4 ${c === '#FFFFFF' || c === '#F8F6F0' ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                      O'lcham: <span className="font-mono text-neutral-900 font-bold">{selectedSize}</span>
                    </label>
                    <button
                      onClick={() => setActiveTab('size_chart')}
                      className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 underline cursor-pointer"
                    >
                      O'lchamlar jadvali
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer border ${
                          selectedSize === s
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                            : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Miqdor:
                </label>
                <div className="inline-flex items-center border border-neutral-200 rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-700 font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-mono font-bold text-sm text-neutral-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-700 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    onAddToCart(product, selectedSize, selectedColor, quantity);
                    onClose();
                  }}
                  className="w-full py-4 px-6 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Savatga qo'shish</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, selectedSize, selectedColor, quantity);
                    onClose();
                  }}
                  className="w-full py-3.5 px-6 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 rounded-xl text-sm font-bold tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Hozir xarid qilish</span>
                </button>
              </div>

              {/* Trust Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-neutral-200 text-center text-[11px] text-neutral-600">
                <div className="p-2 rounded-xl bg-white/70 border border-neutral-200/60">
                  <RotateCcw className="w-4 h-4 mx-auto mb-1 text-neutral-800" />
                  <span>Qaytarish kafolati</span>
                </div>
                <div className="p-2 rounded-xl bg-white/70 border border-neutral-200/60">
                  <Truck className="w-4 h-4 mx-auto mb-1 text-neutral-800" />
                  <span>Tez yetkazib berish</span>
                </div>
                <div className="p-2 rounded-xl bg-white/70 border border-neutral-200/60">
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-neutral-800" />
                  <span>Sifat kafolati</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs: Description, Size Chart, Reviews */}
          <div className="mt-12 pt-6 border-t border-neutral-200">
            <div className="flex items-center gap-6 border-b border-neutral-200 pb-3">
              <button
                onClick={() => setActiveTab('desc')}
                className={`text-sm font-bold pb-2 transition-colors cursor-pointer ${
                  activeTab === 'desc' ? 'text-neutral-950 border-b-2 border-neutral-950' : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                Tavsif
              </button>
              <button
                onClick={() => setActiveTab('size_chart')}
                className={`text-sm font-bold pb-2 transition-colors cursor-pointer ${
                  activeTab === 'size_chart' ? 'text-neutral-950 border-b-2 border-neutral-950' : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                O'lchamlar jadvali
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`text-sm font-bold pb-2 transition-colors cursor-pointer ${
                  activeTab === 'reviews' ? 'text-neutral-950 border-b-2 border-neutral-950' : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                Sharhlar (24)
              </button>
            </div>

            <div className="pt-4 text-sm text-neutral-700 leading-relaxed">
              {activeTab === 'desc' && (
                <div className="space-y-3">
                  <p>{product.description}</p>
                  <p className="text-xs text-neutral-500">
                    Material: 100% premium to'qima. Mahsulot SHU BREND sifat nazoratidan o'tgan bo'lib, rangini saqlab qoladi va yuvilganda kichraymaydi.
                  </p>
                </div>
              )}

              {activeTab === 'size_chart' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-300 bg-neutral-100 font-bold text-neutral-800">
                        <th className="p-2.5">O'lcham (Xalqaro)</th>
                        <th className="p-2.5">Bo'y (sm)</th>
                        <th className="p-2.5">Ko'krak aylanasi (sm)</th>
                        <th className="p-2.5">Vazn tavsiyasi (kg)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <tr><td className="p-2 font-mono font-bold">S (46)</td><td className="p-2">165 - 172</td><td className="p-2">88 - 94</td><td className="p-2">55 - 65</td></tr>
                      <tr><td className="p-2 font-mono font-bold">M (48)</td><td className="p-2">170 - 177</td><td className="p-2">94 - 100</td><td className="p-2">65 - 75</td></tr>
                      <tr><td className="p-2 font-mono font-bold">L (50)</td><td className="p-2">175 - 182</td><td className="p-2">100 - 106</td><td className="p-2">75 - 85</td></tr>
                      <tr><td className="p-2 font-mono font-bold">XL (52)</td><td className="p-2">180 - 188</td><td className="p-2">106 - 112</td><td className="p-2">85 - 95</td></tr>
                      <tr><td className="p-2 font-mono font-bold">XXL (54)</td><td className="p-2">185 - 195</td><td className="p-2">112 - 120</td><td className="p-2">95 - 110</td></tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white border border-neutral-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-neutral-900 text-xs">Jahongir Q.</span>
                      <span className="text-[11px] text-neutral-400">Kecha</span>
                    </div>
                    <div className="flex text-amber-500 mb-2">
                      {[...Array(5)].map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-current" />))}
                    </div>
                    <p className="text-xs text-neutral-600">Sifati juda zo'r, o'lchami aynan to'g'ri keldi. Toshkentga 1 kunda yetkazib berishdi. Rahmat SHU BREND jamoasiga!</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-neutral-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-neutral-900 text-xs">Otabek S.</span>
                      <span className="text-[11px] text-neutral-400">3 kun oldin</span>
                    </div>
                    <div className="flex text-amber-500 mb-2">
                      {[...Array(5)].map((_, i) => (<Star key={i} className="w-3.5 h-3.5 fill-current" />))}
                    </div>
                    <p className="text-xs text-neutral-600">Mato qalin va yumshoq. Tikilishi professional darajada, do'kon narxlaridan arzonroq ekan.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
