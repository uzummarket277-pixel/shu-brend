import React from 'react';
import { CartItem } from '../types.js';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, delta: number, size?: string, color?: string) => void;
  onRemoveItem: (id: number, size?: string, color?: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between border-l border-neutral-300/80 animate-slideLeft">
        {/* Top Header */}
        <div className="p-6 border-b border-neutral-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-neutral-900" />
            <h2 className="text-lg font-extrabold text-neutral-950 uppercase tracking-tight">
              Savat
            </h2>
            <span className="text-xs text-neutral-500 font-mono">({cartItems.length} xil mahsulot)</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
            title="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {cartItems.length === 0 ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-neutral-200/60 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-neutral-800">Savatingiz hozircha bo'sh</h3>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Do'kon katalogimizdan o'zingizga yoqqan zamonaviy kiyimlarni tanlang va xariddan rohatlaning!
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Katalogga qaytish
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div
                key={`${item.id}-${item.size}-${item.color}-${idx}`}
                className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-xs flex items-center gap-4"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-neutral-900 truncate" title={item.name}>
                    {item.name}
                  </h4>
                  <div className="text-[11px] text-neutral-500 flex items-center gap-2 mt-0.5">
                    {item.size && <span>O'lcham: <b>{item.size}</b></span>}
                    {item.color && (
                      <span className="flex items-center gap-1">
                        Rang:
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block"
                          style={{ backgroundColor: item.color }}
                        />
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono font-bold text-neutral-950 mt-1">
                    {item.price.toLocaleString('uz-UZ')} so'm
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => onRemoveItem(item.id, item.size, item.color)}
                    className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer p-1"
                    title="O'chirish"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50 text-xs">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1, item.size, item.color)}
                      className="px-2 py-0.5 hover:bg-neutral-200 text-neutral-700 font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2 font-mono font-bold text-neutral-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1, item.size, item.color)}
                      className="px-2 py-0.5 hover:bg-neutral-200 text-neutral-700 font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Area with Total & Buttons */}
        {cartItems.length > 0 && (
          <div className="p-6 bg-white border-t border-neutral-200 shrink-0 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500 font-medium">Jami summa:</span>
              <span className="text-xl font-extrabold text-neutral-950 font-mono tracking-tight">
                {totalAmount.toLocaleString('uz-UZ')} so'm
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
              >
                <span>Buyurtma rasmiylashtirish</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onClearCart}
                className="w-full py-2.5 text-xs text-neutral-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Savatchani tozalash
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
