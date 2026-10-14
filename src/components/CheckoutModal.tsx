import React, { useState } from 'react';
import { CartItem, Order } from '../types.js';
import { X, MapPin, Phone, User, CheckCircle2, AlertCircle, Compass, Send } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+998 ');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Phone number formatter
  const handlePhoneChange = (val: string) => {
    if (!val.startsWith('+998')) {
      setCustomerPhone('+998 ');
      return;
    }
    setCustomerPhone(val);
  };

  // Browser GPS Geolocation helper to generate Yandex Maps link without any API key
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Brauzeringizda geolokatsiya qo'llab-quvvatlanmaydi.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        const yandexUrl = `https://yandex.uz/maps/?pt=${lng},${lat}&z=16&l=map`;
        setMapLink(yandexUrl);
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation xatosi:", err.message);
        setIsLocating(false);
        setErrorMessage("Joylashuvni aniqlab bo'lmadi. Iltimos manzilni qo'lda kiriting.");
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage("Iltimos, ism va familiyangizni kiriting");
      return;
    }

    if (customerPhone.trim().length < 13) {
      setErrorMessage("Iltimos, to'liq telefon raqamingizni kiriting (+998 ...)");
      return;
    }

    if (!deliveryAddress.trim()) {
      setErrorMessage("Iltimos, yetkazib berish manzilini kiriting");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          delivery_address: deliveryAddress.trim(),
          map_link: mapLink.trim() || undefined,
          notes: notes.trim() || undefined,
          items: cartItems
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Buyurtmani qabul qilishda xatolik yuz berdi");
      }

      setCompletedOrder(data.order);
      onOrderSuccess(data.order);
    } catch (err: any) {
      setErrorMessage(err.message || "Internet ulanishida xatolik yuz berdi. Qayta urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF8F5] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-neutral-300/80 my-8 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 bg-white flex items-center justify-between shrink-0">
          <h2 className="text-lg font-extrabold text-neutral-950 uppercase tracking-tight">
            {completedOrder ? "Buyurtma tasdiqlandi" : "Buyurtma rasmiylashtirish"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {completedOrder ? (
            /* Order Success View */
            <div className="py-8 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="text-xs font-mono font-bold bg-neutral-200/80 text-neutral-800 px-3 py-1 rounded-full">
                  #{completedOrder.order_number}
                </span>
                <h3 className="text-2xl font-extrabold text-neutral-950 mt-3">
                  Rahmat! Buyurtmangiz qabul qilindi
                </h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto mt-2">
                  Tez orada operatorimiz siz bilan bog'lanib, buyurtma tafsilotlarini va yetkazib berish vaqtini aniqlashtiradi.
                </p>
              </div>

              {/* Order Receipt Card */}
              <div className="bg-white rounded-2xl p-5 border border-neutral-200 text-left text-xs space-y-3">
                <div className="flex justify-between pb-2 border-b border-neutral-100 font-bold text-neutral-900">
                  <span>Mijoz:</span>
                  <span>{completedOrder.customer_name}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-neutral-100 text-neutral-600">
                  <span>Telefon:</span>
                  <span className="font-mono">{completedOrder.customer_phone}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-neutral-100 text-neutral-600">
                  <span>Manzil:</span>
                  <span>{completedOrder.delivery_address}</span>
                </div>
                {completedOrder.map_link && (
                  <div className="flex justify-between pb-2 border-b border-neutral-100 text-neutral-600">
                    <span>Xarita havolasi:</span>
                    <a href={completedOrder.map_link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate max-w-[200px]">
                      Yandex xaritasida ko'rish
                    </a>
                  </div>
                )}
                <div className="flex justify-between pt-1 text-sm font-extrabold text-neutral-950">
                  <span>Jami summa:</span>
                  <span className="font-mono">{completedOrder.total_amount.toLocaleString('uz-UZ')} so'm</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-100 rounded-xl text-neutral-600 text-xs flex items-center justify-center gap-2">
                <Send className="w-4 h-4 text-neutral-800" />
                <span>Buyurtma haqidagi xabar Telegram orqali ma'muriyatga yetkazildi.</span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md"
              >
                Tushunarli, do'konga qaytish
              </button>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Customer Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Ism va familiya *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Masalan: Aliyev Samandar"
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Telefon raqam *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-xs font-mono font-medium text-neutral-900 outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Yetkazib berish manzili *</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Viloyat, shahar, tuman, ko'cha, uy yoki mo'ljal..."
                    className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                {/* Yandex Maps link input & geolocation picker */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Xarita havolasi (Yandex Maps / GPS ixtiyoriy)</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isLocating}
                      className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-950 underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <MapPin className="w-3 h-3 text-red-600" />
                      <span>{isLocating ? "Aniqlanmoqda..." : "GPS orqali joylashuvni olish"}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={mapLink}
                    onChange={(e) => setMapLink(e.target.value)}
                    placeholder="https://yandex.uz/maps/... yoki koordinatalar"
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 outline-none focus:border-neutral-900 transition-colors"
                  />
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Yandex Maps ilovasi yoki brauzerdan lokatsiya havolasini nusxalashingiz yoki GPS tugmasini bosishingiz mumkin.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    Qo'shimcha izoh (ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Eshik kodi, qulay vaqt yoki kuryer uchun eslatma"
                    className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-neutral-900 outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>
              </div>

              {/* Order Items Preview List */}
              <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 pb-2 border-b border-neutral-100">
                  Buyurtma tarkibi ({cartItems.length} ta)
                </h4>
                <div className="max-h-36 overflow-y-auto space-y-2 divide-y divide-neutral-100 pr-1">
                  {cartItems.map((item, i) => (
                    <div key={i} className="pt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{item.name}</span>
                        <span className="text-neutral-400">×{item.quantity}</span>
                      </div>
                      <span className="font-mono font-bold text-neutral-950">
                        {(item.price * item.quantity).toLocaleString('uz-UZ')} so'm
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-neutral-200 flex items-center justify-between text-sm">
                  <span className="font-bold text-neutral-700">Jami to'lov:</span>
                  <span className="text-lg font-black text-neutral-950 font-mono">
                    {totalAmount.toLocaleString('uz-UZ')} so'm
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-neutral-950 hover:bg-neutral-800 disabled:bg-neutral-400 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Buyurtma yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Buyurtmani yuborish</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
