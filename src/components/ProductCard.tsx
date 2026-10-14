import React from 'react';
import { Product } from '../types.js';
import { Heart, ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, size?: string, color?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  return (
    <div className="group bg-white rounded-2xl border border-neutral-200/80 overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-neutral-300 transition-all duration-300">
      {/* Image Area with Badges & Wishlist */}
      <div className="relative aspect-square bg-[#F4F1EA] overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.discount ? (
            <span className="bg-red-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
              -{product.discount}%
            </span>
          ) : null}
          {product.is_new ? (
            <span className="bg-neutral-900 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
              Yangi
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          title={isWishlisted ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-red-50 text-red-600 hover:bg-red-100'
              : 'bg-white/80 text-neutral-700 hover:bg-white hover:text-red-600'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View Overlay on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-neutral-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" />
            Batafsil ko'rish
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Category */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            {product.category}
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(product)}
            className="text-sm sm:text-base font-semibold text-neutral-900 hover:text-neutral-700 transition-colors line-clamp-1 mt-0.5 cursor-pointer"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Price */}
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-extrabold text-neutral-950 font-mono tracking-tight">
              {product.price.toLocaleString('uz-UZ')} so'm
            </span>
            {product.old_price && product.old_price > product.price ? (
              <span className="text-xs text-neutral-400 line-through font-mono">
                {product.old_price.toLocaleString('uz-UZ')} so'm
              </span>
            ) : null}
          </div>

          {/* Sizes preview */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-2 flex items-center gap-1 flex-wrap">
              <span className="text-[10px] text-neutral-400 mr-1">O'lcham:</span>
              {product.sizes.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="text-[10px] font-mono font-medium px-1.5 py-0.5 bg-neutral-100 rounded text-neutral-600"
                >
                  {s}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[10px] text-neutral-400">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-neutral-100 flex items-center gap-2">
          <button
            onClick={() => onAddToCart(product, product.sizes?.[0], product.colors?.[0])}
            className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Savatga qo'shish</span>
          </button>
        </div>
      </div>
    </div>
  );
};
