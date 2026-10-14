import React, { useState, useEffect } from 'react';
import { Product, Order, AdminStats } from '../types.js';
import { BrandLogo } from './BrandLogo.js';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  Upload,
  Eye,
  ExternalLink,
  RefreshCw,
  X,
  Phone
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
  products: Product[];
  onRefreshProducts: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onClose,
  products,
  onRefreshProducts,
}) => {
  const [token, setToken] = useState<string>(() => localStorage.getItem('shu_admin_token') || '');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState('admin');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'products' | 'orders' | 'telegram' | 'settings'>('dashboard');

  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Kurtkalar',
    price: '',
    old_price: '',
    discount: '',
    description: '',
    sizes: 'S, M, L, XL, XXL',
    colors: '#18181B, #FFFFFF',
    image_url: '',
    is_featured: false,
    is_new: true,
    stock: '50'
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productFormError, setProductFormError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Telegram test status
  const [tgTestResult, setTgTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTestingTg, setIsTestingTg] = useState(false);

  // Verify token on mount
  useEffect(() => {
    if (token) {
      fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.authenticated) {
            setIsLoggedIn(true);
            fetchAdminData(token);
          } else {
            localStorage.removeItem('shu_admin_token');
            setToken('');
          }
        })
        .catch(() => {
          setIsLoggedIn(false);
        });
    }
  }, [token]);

  const fetchAdminData = async (authToken: string) => {
    setIsLoadingOrders(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        fetch('/api/orders', { headers: { Authorization: `Bearer ${authToken}` } }),
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${authToken}` } })
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login yoki parol xato");
      }

      localStorage.setItem('shu_admin_token', data.token);
      setToken(data.token);
      setIsLoggedIn(true);
      fetchAdminData(data.token);
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    localStorage.removeItem('shu_admin_token');
    setToken('');
    setIsLoggedIn(false);
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(updated);
        }
        fetchAdminData(token);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let finalImageUrl = formData.image_url;

      // Handle file upload if user picked from computer
      if (selectedImageFile) {
        const uploadForm = new FormData();
        uploadForm.append('image', selectedImageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: uploadForm
        });

        const uploadData = await uploadRes.json();
        if (uploadRes.ok && uploadData.url) {
          finalImageUrl = uploadData.url;
        } else {
          throw new Error(uploadData.error || "Rasm yuklashda xatolik");
        }
      }

      if (!finalImageUrl) {
        throw new Error("Iltimos rasm faylini tanlang yoki URL manzilini kiriting");
      }

      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        old_price: formData.old_price ? Number(formData.old_price) : 0,
        discount: formData.discount ? Number(formData.discount) : 0,
        description: formData.description,
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
        image_url: finalImageUrl,
        is_featured: formData.is_featured,
        is_new: formData.is_new,
        stock: Number(formData.stock) || 50
      };

      let res;
      if (editingProduct) {
        res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Mahsulotni saqlashda xatolik");
      }

      setIsProductModalOpen(false);
      setEditingProduct(null);
      setSelectedImageFile(null);
      setProductFormError('');
      onRefreshProducts();
      fetchAdminData(token);
    } catch (err: any) {
      setProductFormError(err.message || "Xatolik yuz berdi");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        onRefreshProducts();
        fetchAdminData(token);
      }
    } catch (err) {
      console.error('Delete product error:', err);
    }
  };

  const handleTestTelegram = async () => {
    setIsTestingTg(true);
    setTgTestResult(null);
    try {
      const res = await fetch('/api/admin/telegram-test', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTgTestResult(data);
    } catch (err: any) {
      setTgTestResult({ success: false, message: err.message });
    } finally {
      setIsTestingTg(false);
    }
  };

  // If not logged in, show Login Screen
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 bg-[#18181B] text-neutral-100 flex items-center justify-center p-4">
        <div className="bg-[#242428] rounded-3xl p-8 max-w-md w-full border border-neutral-700/60 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <BrandLogo size={56} />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white uppercase mt-2">
              SHU BREND Admin
            </h2>
            <p className="text-xs text-neutral-400">
              Do'kon boshqaruv paneliga kirish
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/80 border border-red-700 text-red-300 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Login
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[#18181B] border border-neutral-700 rounded-xl text-xs font-medium text-white outline-none focus:border-white transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
                Parol
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Parolni kiriting..."
                className="w-full px-4 py-3 bg-[#18181B] border border-neutral-700 rounded-xl text-xs font-medium text-white outline-none focus:border-white transition-colors"
                required
              />
              <p className="text-[10px] text-neutral-500 mt-1">
                Standart login: <code className="text-neutral-300">admin</code> · Parol: <code className="text-neutral-300">shu_brend_secure_password_2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-white hover:bg-neutral-200 text-neutral-950 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              {isLoggingIn ? "Tekshirilmoqda..." : "Tizimga kirish"}
            </button>
          </form>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer text-center block"
          >
            ← Do'konga qaytish
          </button>
        </div>
      </div>
    );
  }

  // Admin Dashboard (Matching Mockup Screen 5)
  return (
    <div className="fixed inset-0 z-50 bg-[#18181B] text-neutral-100 flex flex-col lg:flex-row overflow-hidden font-sans">
      {/* Dark Sidebar (Screen 5) */}
      <div className="w-full lg:w-64 bg-[#1F1F23] border-b lg:border-b-0 lg:border-r border-neutral-800 p-5 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="flex items-center gap-3 pb-6 border-b border-neutral-800">
            <BrandLogo size={36} />
            <div>
              <h1 className="text-sm font-extrabold uppercase tracking-wider text-white">SHU BREND</h1>
              <span className="text-[10px] text-neutral-400 font-mono">Boshqaruv Paneli</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="mt-6 space-y-1">
            <button
              onClick={() => setActiveMenu('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeMenu === 'dashboard' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Bosh sahifa</span>
            </button>

            <button
              onClick={() => setActiveMenu('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeMenu === 'products' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Mahsulotlar</span>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMenu('orders')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeMenu === 'orders' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buyurtmalar</span>
              <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveMenu('telegram')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeMenu === 'telegram' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Telegram Bot</span>
            </button>

            <button
              onClick={() => setActiveMenu('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeMenu === 'settings' ? 'bg-white text-neutral-950 shadow-sm' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Sozlamalar & .env</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-neutral-800 space-y-2">
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Do'konni ochish</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-red-400 hover:bg-red-950/40 rounded-xl text-xs font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Chiqish</span>
          </button>
        </div>
      </div>

      {/* Main Admin Area */}
      <div className="flex-1 overflow-y-auto bg-[#18181B] p-6 lg:p-10 space-y-8">
        {/* Top Bar inside Admin */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">
              {activeMenu === 'dashboard' && "Bosh sahifa"}
              {activeMenu === 'products' && "Mahsulotlar katalogi"}
              {activeMenu === 'orders' && "Mijozlar buyurtmalari"}
              {activeMenu === 'telegram' && "Telegram Bot Integratsiyasi"}
              {activeMenu === 'settings' && "Tizim Sozlamalari"}
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              SHU BREND erkaklar kiyimlari do'koni boshqaruvi
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchAdminData(token)}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Yangilash"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {activeMenu === 'products' && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    name: '',
                    category: 'Kurtkalar',
                    price: '',
                    old_price: '',
                    discount: '',
                    description: '',
                    sizes: 'S, M, L, XL, XXL',
                    colors: '#18181B, #FFFFFF',
                    image_url: '',
                    is_featured: false,
                    is_new: true,
                    stock: '50'
                  });
                  setSelectedImageFile(null);
                  setIsProductModalOpen(true);
                }}
                className="px-4 py-2 bg-white hover:bg-neutral-200 text-neutral-950 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi mahsulot qo'shish</span>
              </button>
            )}
          </div>
        </div>

        {/* 1. Dashboard View (Screen 5 Layout) */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-8">
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#242428] p-5 rounded-2xl border border-neutral-800 shadow-xs">
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Jami mahsulotlar</span>
                <div className="text-3xl font-extrabold text-white mt-2 font-mono">
                  {stats?.totalProducts ?? products.length}
                </div>
                <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">+3 yangi to'plam</span>
              </div>

              <div className="bg-[#242428] p-5 rounded-2xl border border-neutral-800 shadow-xs">
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Jami buyurtmalar</span>
                <div className="text-3xl font-extrabold text-white mt-2 font-mono">
                  {stats?.totalOrders ?? orders.length}
                </div>
                <span className="text-[11px] text-emerald-400 font-medium mt-1 inline-block">+5 ushbu haftada</span>
              </div>

              <div className="bg-[#242428] p-5 rounded-2xl border border-neutral-800 shadow-xs">
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Yangi buyurtmalar</span>
                <div className="text-3xl font-extrabold text-amber-400 mt-2 font-mono">
                  {stats?.newOrders ?? orders.filter(o => o.status === 'Yangi').length}
                </div>
                <span className="text-[11px] text-amber-400 font-medium mt-1 inline-block">Tasdiqlash kutilmoqda</span>
              </div>

              <div className="bg-[#242428] p-5 rounded-2xl border border-neutral-800 shadow-xs">
                <span className="text-xs text-neutral-400 uppercase tracking-wider font-bold">Bajarilgan buyurtmalar</span>
                <div className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
                  {stats?.completedOrders ?? orders.filter(o => o.status === 'Bajarildi').length}
                </div>
                <span className="text-[11px] text-neutral-400 font-medium mt-1 inline-block">Muvaffaqiyatli yetkazilgan</span>
              </div>
            </div>

            {/* Total Revenue Highlight Banner (Screen 5) */}
            <div className="bg-gradient-to-r from-[#2B2B32] via-[#242428] to-[#1E1E22] p-6 rounded-3xl border border-neutral-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-neutral-400 font-bold">Jami buyurtmalar qiymati</span>
                <div className="text-3xl sm:text-4xl font-black text-white font-mono mt-1">
                  {(stats?.totalSales ?? orders.filter(o => o.status !== 'Bekor qilindi').reduce((s, o) => s + o.total_amount, 0)).toLocaleString('uz-UZ')} so'm
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  * Bekor qilingan buyurtmalar jami sotuvga qo'shilmaydi
                </p>
              </div>

              <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-700/60 rounded-xl text-emerald-400 text-xs font-bold self-start sm:self-center">
                +12% O'sish darajasi
              </div>
            </div>

            {/* Recent Orders Table (Screen 5) */}
            <div className="bg-[#242428] rounded-3xl border border-neutral-800 overflow-hidden">
              <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">So'nggi buyurtmalar</h3>
                <button
                  onClick={() => setActiveMenu('orders')}
                  className="text-xs text-neutral-400 hover:text-white underline cursor-pointer"
                >
                  Barcha buyurtmalarni ko'rish →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 font-bold">
                      <th className="p-4">Buyurtma №</th>
                      <th className="p-4">Mijoz</th>
                      <th className="p-4">Telefon</th>
                      <th className="p-4">Summa</th>
                      <th className="p-4">Holat</th>
                      <th className="p-4 text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                    {orders.slice(0, 6).map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-white">#{order.order_number}</td>
                        <td className="p-4 font-semibold text-white">{order.customer_name}</td>
                        <td className="p-4 font-mono">{order.customer_phone}</td>
                        <td className="p-4 font-mono font-bold text-white">{order.total_amount.toLocaleString('uz-UZ')} so'm</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            order.status === 'Yangi' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            order.status === 'Tasdiqlandi' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                            order.status === 'Yetkazilmoqda' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                            order.status === 'Bajarildi' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            'bg-red-950 text-red-400 border border-red-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
                            title="Batafsil"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. Products Management View */}
        {activeMenu === 'products' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((prod) => (
                <div key={prod.id} className="bg-[#242428] rounded-2xl border border-neutral-800 p-4 flex flex-col justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-xl bg-neutral-900 overflow-hidden shrink-0 border border-neutral-800">
                      <img src={prod.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">{prod.category}</span>
                      <h4 className="text-sm font-bold text-white truncate">{prod.name}</h4>
                      <p className="text-xs font-mono font-bold text-white mt-1">
                        {prod.price.toLocaleString('uz-UZ')} so'm
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-1">Zaxirada: {prod.stock || 50} dona</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                    <span className="text-[11px] text-neutral-500 font-mono">ID: #{prod.id}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setFormData({
                            name: prod.name,
                            category: prod.category,
                            price: String(prod.price),
                            old_price: String(prod.old_price || ''),
                            discount: String(prod.discount || ''),
                            description: prod.description,
                            sizes: prod.sizes.join(', '),
                            colors: prod.colors.join(', '),
                            image_url: prod.image_url,
                            is_featured: prod.is_featured,
                            is_new: prod.is_new,
                            stock: String(prod.stock || 50)
                          });
                          setSelectedImageFile(null);
                          setIsProductModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white cursor-pointer"
                        title="Tahrirlash"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {deleteConfirmId === prod.id ? (
                        <div className="flex items-center gap-1.5 animate-fadeIn">
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer"
                          >
                            Ha, o'chirish
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 py-1 bg-neutral-800 text-neutral-300 hover:text-white rounded text-[10px] cursor-pointer"
                          >
                            Yo'q
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(prod.id)}
                          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 cursor-pointer"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Orders Management View */}
        {activeMenu === 'orders' && (
          <div className="space-y-6">
            <div className="bg-[#242428] rounded-3xl border border-neutral-800 overflow-hidden">
              <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-mono">Jami {orders.length} ta buyurtma</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 font-bold">
                      <th className="p-4">№</th>
                      <th className="p-4">Sana</th>
                      <th className="p-4">Mijoz</th>
                      <th className="p-4">Telefon</th>
                      <th className="p-4">Manzil</th>
                      <th className="p-4">Summa</th>
                      <th className="p-4">Holat</th>
                      <th className="p-4">Telegram</th>
                      <th className="p-4 text-right">Amal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 text-neutral-300">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-white">#{order.order_number}</td>
                        <td className="p-4 text-neutral-400 font-mono">
                          {new Date(order.created_at).toLocaleDateString('uz-UZ')}
                        </td>
                        <td className="p-4 font-semibold text-white">{order.customer_name}</td>
                        <td className="p-4 font-mono">
                          <a href={`tel:${order.customer_phone}`} className="hover:underline text-blue-400">
                            {order.customer_phone}
                          </a>
                        </td>
                        <td className="p-4 max-w-[200px] truncate" title={order.delivery_address}>
                          {order.delivery_address}
                        </td>
                        <td className="p-4 font-mono font-bold text-white">
                          {order.total_amount.toLocaleString('uz-UZ')} so'm
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="bg-neutral-900 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-white outline-none cursor-pointer"
                          >
                            <option value="Yangi">Yangi</option>
                            <option value="Tasdiqlandi">Tasdiqlandi</option>
                            <option value="Tayyorlanmoqda">Tayyorlanmoqda</option>
                            <option value="Yetkazilmoqda">Yetkazilmoqda</option>
                            <option value="Bajarildi">Bajarildi</option>
                            <option value="Bekor qilindi">Bekor qilindi</option>
                          </select>
                        </td>
                        <td className="p-4">
                          {order.telegram_sent ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-mono">✓ Yuborilgan</span>
                          ) : (
                            <span className="text-neutral-500 font-mono">-</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. Telegram Integration View */}
        {activeMenu === 'telegram' && (
          <div className="max-w-2xl bg-[#242428] rounded-3xl border border-neutral-800 p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-400" />
                <span>Telegram Bot Xabarnoma Integratsiyasi</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Saytda har bir yangi buyurtma tushganda, administrator Telegram guruhiga yoki shaxsiy chatiga avtomatik batafsil ma'lumot yuboriladi.
              </p>
            </div>

            <div className="bg-[#18181B] p-4 rounded-2xl border border-neutral-800 text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400">TELEGRAM_BOT_TOKEN:</span>
                <span className="text-emerald-400">Sozlangan (.env faylidan o'qiladi)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">TELEGRAM_CHAT_ID:</span>
                <span className="text-emerald-400">Sozlangan (.env faylidan o'qiladi)</span>
              </div>
            </div>

            <div>
              <button
                onClick={handleTestTelegram}
                disabled={isTestingTg}
                className="px-6 py-3 bg-white hover:bg-neutral-200 text-neutral-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isTestingTg ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sinov xabari yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Sinov xabarini yuborish (Test Telegram)</span>
                  </>
                )}
              </button>
            </div>

            {tgTestResult && (
              <div className={`p-4 rounded-xl border text-xs ${
                tgTestResult.success
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : 'bg-amber-950/60 border-amber-700 text-amber-300'
              }`}>
                {tgTestResult.message}
              </div>
            )}
          </div>
        )}

        {/* 5. Settings View */}
        {activeMenu === 'settings' && (
          <div className="max-w-2xl bg-[#242428] rounded-3xl border border-neutral-800 p-6 space-y-6">
            <h3 className="text-lg font-bold text-white">Tizim Sozlamalari & Konfiguratsiya</h3>
            <p className="text-xs text-neutral-400">
              Admin paroli va Telegram tokenlari xavfsizlik nuqtai nazaridan serverdagi <code className="text-white">.env</code> faylida saqlanadi.
            </p>

            <div className="space-y-3 text-xs bg-[#18181B] p-4 rounded-2xl border border-neutral-800 font-mono text-neutral-300">
              <p>PORT=3000</p>
              <p>ADMIN_LOGIN=admin</p>
              <p>ADMIN_PASSWORD=••••••••••••••••</p>
              <p>TELEGRAM_BOT_TOKEN=••••••••••••••••</p>
              <p>TELEGRAM_CHAT_ID=••••••••••••••••</p>
            </div>
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#242428] rounded-3xl max-w-xl w-full p-6 border border-neutral-700 text-white space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold">
                {editingProduct ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {productFormError && (
              <div className="p-3 bg-red-950/80 border border-red-700 text-red-300 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{productFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold mb-1">Nomi *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181B] border border-neutral-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Kategoriya *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181B] border border-neutral-700 rounded-xl text-white outline-none"
                  >
                    <option value="Kiyimlar">Kiyimlar</option>
                    <option value="Ko'ylaklar">Ko'ylaklar</option>
                    <option value="Shimlar">Shimlar</option>
                    <option value="Oyoq kiyimlar">Oyoq kiyimlar</option>
                    <option value="Dvoykalar">Dvoykalar</option>
                    <option value="Kurtkalar">Kurtkalar</option>
                    <option value="Sviterlar">Sviterlar</option>
                    <option value="Sport kiyimlari">Sport kiyimlari</option>
                    <option value="Atirlar">Atirlar</option>
                    <option value="Soatlar">Soatlar</option>
                    <option value="Boshqa">Boshqa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Narxi (so'mda) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181B] border border-neutral-700 rounded-xl text-white outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Eski narxi (so'mda)</label>
                  <input
                    type="number"
                    value={formData.old_price}
                    onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181B] border border-neutral-700 rounded-xl text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Chegirma (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181B] border border-neutral-700 rounded-xl text-white outline-none font-mono"
                  />
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="p-3 bg-[#18181B] rounded-2xl border border-neutral-800 space-y-2">
                <label className="block text-neutral-300 font-bold">Mahsulot rasmi</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setSelectedImageFile(e.target.files[0]);
                    }}
                    className="text-xs text-neutral-400"
                  />
                </div>
                <div className="text-[11px] text-neutral-500">yoki rasm URL manzilini kiriting:</div>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="/src/assets/... yoki https://..."
                  className="w-full px-3 py-2 bg-[#242428] border border-neutral-700 rounded-xl text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold mb-1">Tavsif</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#18181B] border border-neutral-700 rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">O'lchamlar (vergul bilan)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181B] border border-neutral-700 rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">Zaxiradagi soni</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-[#18181B] border border-neutral-700 rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded"
                  />
                  <span>Ommabop mahsulot (Bosh sahifada)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_new}
                    onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                    className="rounded"
                  />
                  <span>Yangi mahsulot</span>
                </label>
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2 rounded-xl bg-white text-neutral-950 font-bold hover:bg-neutral-200"
                >
                  {isUploading ? "Saqlanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail View Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#242428] rounded-3xl max-w-lg w-full p-6 border border-neutral-700 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-bold font-mono">Buyurtma #{selectedOrder.order_number}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Mijoz:</span>
                <span className="font-bold">{selectedOrder.customer_name}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Telefon:</span>
                <a href={`tel:${selectedOrder.customer_phone}`} className="font-mono text-blue-400 hover:underline">
                  {selectedOrder.customer_phone}
                </a>
              </div>
              <div className="flex justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Manzil:</span>
                <span className="text-right max-w-xs">{selectedOrder.delivery_address}</span>
              </div>
              {selectedOrder.map_link && (
                <div className="flex justify-between pb-2 border-b border-neutral-800">
                  <span className="text-neutral-400">Xarita havolasi:</span>
                  <a href={selectedOrder.map_link} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                    Yandex Xaritada ochish ↗
                  </a>
                </div>
              )}
              {selectedOrder.notes && (
                <div className="pb-2 border-b border-neutral-800">
                  <span className="text-neutral-400 block mb-1">Izoh:</span>
                  <p className="bg-[#18181B] p-2.5 rounded-lg text-neutral-300 italic">{selectedOrder.notes}</p>
                </div>
              )}

              <div>
                <span className="text-neutral-400 block mb-2 font-bold uppercase tracking-wider">
                  Mahsulotlar ({selectedOrder.items.length} ta)
                </span>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between p-2 rounded-lg bg-[#18181B]">
                      <span>{item.name} × {item.quantity}</span>
                      <span className="font-mono font-bold">{(item.price * item.quantity).toLocaleString('uz-UZ')} so'm</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-between text-sm font-bold">
                <span>Jami summa:</span>
                <span className="font-mono text-white">{selectedOrder.total_amount.toLocaleString('uz-UZ')} so'm</span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
