import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo.js';
import { ShoppingBag, Search, Heart, Shield, Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  openCart: () => void;
  wishlistCount: number;
  onSearchClick: () => void;
  openAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  wishlistCount,
  onSearchClick,
  openAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Bosh sahifa' },
    { id: 'products', label: 'Mahsulotlar' },
    { id: 'categories', label: 'Kategoriyalar' },
    { id: 'outfit', label: 'Obraz yaratish', highlight: true },
    { id: 'contact', label: 'Aloqa' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F0]/95 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      {/* Top Notification Announcement */}
      <div className="bg-neutral-900 text-neutral-300 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="hidden sm:inline">⚡️ O'zbekiston bo'ylab</span>
        <span>Barcha buyurtmalarga bepul yetkazib berish!</span>
        <span className="text-neutral-500">·</span>
        <span className="hidden md:inline">Sifat va ishonch — biz bilan!</span>
      </div>

      {/* Main Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark & Logo */}
        <div
          onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <BrandLogo size={46} />
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-xl uppercase text-neutral-950 group-hover:text-neutral-700 transition-colors">
              SHU BREND
            </span>
            <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-medium">
              Erkaklar modasi
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-Line, 4-5 items) */}
        <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-neutral-700">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                if (link.id === 'categories' || link.id === 'products') {
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`whitespace-nowrap transition-colors relative py-1 flex items-center gap-1.5 ${
                activeTab === link.id
                  ? 'text-neutral-950 font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              {link.highlight && <Sparkles className="w-3.5 h-3.5 text-amber-600 inline" />}
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions (Search, Wishlist, Cart Drawer, Admin) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={onSearchClick}
            title="Qidiruv"
            className="p-2.5 rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/60 transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => setActiveTab('products')}
            title="Sevimlilar"
            className="p-2.5 rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-neutral-200/60 transition-colors relative cursor-pointer"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={openCart}
            className="flex items-center gap-2 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Savat</span>
            <span className="w-5 h-5 bg-white text-neutral-900 text-xs font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>

          {/* Admin shortcut button */}
          <button
            onClick={openAdmin}
            title="Admin panel"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 rounded-lg transition-colors cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span className="hidden xl:inline">Admin</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-800 hover:bg-neutral-200/60 lg:hidden cursor-pointer"
            aria-label="Menyu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-[#F8F6F0] px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActiveTab(link.id);
                setMobileMenuOpen(false);
                if (link.id === 'categories' || link.id === 'products') {
                  const el = document.getElementById('catalog-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                activeTab === link.id
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-800 hover:bg-neutral-200/60'
              }`}
            >
              <span>{link.label}</span>
              {link.highlight && <span className="text-xs bg-amber-500/20 text-amber-700 px-2 py-0.5 rounded font-bold">Interaktiv</span>}
            </button>
          ))}
          <div className="pt-2 border-t border-neutral-200">
            <button
              onClick={() => {
                openAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-200/60 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              <span>Admin Panelga kirish</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
