import React from 'react';
import { BrandLogo } from './BrandLogo.js';
import { Phone, MapPin, Clock, Shield, Sparkles, Send } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  openAdmin: () => void;
  openOutfit: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  openAdmin,
  openOutfit,
}) => {
  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo size={42} />
              <div>
                <span className="font-extrabold tracking-tight text-lg uppercase text-white block">
                  SHU BREND
                </span>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
                  Erkaklar kiyimlari do'koni
                </span>
              </div>
            </div>

            <p className="text-neutral-400 leading-relaxed pr-4 text-xs">
              SHU BREND — zamonaviy, didli va qulay erkaklar kiyimlari uyi. Har bir mahsulot sifatli matolardan tayyorlanadi va O'zbekiston bo'ylab tezkor yetkazib beriladi.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="text-[11px] text-neutral-400">To'lov turlari:</span>
              <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-mono font-bold">Naqd pul</span>
              <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-mono font-bold">Payme</span>
              <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-mono font-bold">Click</span>
              <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-300 font-mono font-bold">Uzum</span>
            </div>
          </div>

          {/* Quick Category Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Kategoriyalar
            </h4>
            <ul className="space-y-2">
              {['Kurtkalar', 'Dvoykalar', 'Shimlar', 'Ko\'ylaklar', 'Oyoq kiyimlar', 'Sviterlar', 'Atirlar', 'Soatlar'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      const el = document.getElementById('catalog-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-neutral-400"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features / Services */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Xizmatlar
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={openOutfit}
                  className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 text-neutral-300 font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Obraz yaratish (Modelda)</span>
                </button>
              </li>
              <li><span>O'lcham tanlash yordami</span></li>
              <li><span>Tezkor yetkazib berish</span></li>
              <li><span>Mahsulotni almashtirish</span></li>
              <li>
                <button
                  onClick={openAdmin}
                  className="hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-neutral-400 pt-2"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3" id="contact-section">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Bog'lanish
            </h4>
            <div className="space-y-2.5 text-neutral-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <span>Toshkent shahri, Amir Temur shoh ko'chasi 107-B</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                <a href="tel:+998712000000" className="hover:text-white font-mono">
                  +998 (71) 200-00-00
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Har kuni: 09:00 — 21:00</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-blue-400 shrink-0" />
                <a href="https://t.me/shubrend_admin" target="_blank" rel="noreferrer" className="hover:text-white">
                  Telegram: @shubrend_admin
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-12 mt-12 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} SHU BREND. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-6">
            <span>Maxfiylik siyosati</span>
            <span>Foydalanish shartlari</span>
            <button onClick={openAdmin} className="hover:text-white underline cursor-pointer">
              Do'kon egasi kabineti
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
