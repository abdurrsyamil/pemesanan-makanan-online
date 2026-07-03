import React, { useState, useEffect } from 'react';
import { Search, ChefHat, Filter, ArrowUpRight, Sparkles, Utensils, UtensilsCrossed, Bell, ShoppingBag, MapPin, Layers, X } from 'lucide-react';
import { MenuItem, CartItem, User, Order, Notification } from './types';
import {
  fetchMenuFromSupabase,
  addMenuItemToSupabase,
  updateMenuItemInSupabase,
  deleteMenuItemFromSupabase,
} from './lib/supabase';

// Importing Custom Components
import Navbar from './components/Navbar';
import MenuCard from './components/MenuCard';
import CartView from './components/CartView';
import TrackingMap from './components/TrackingMap';
import AdminDashboard from './components/AdminDashboard';
import AuthView from './components/AuthView';
import Notifications from './components/Notifications';

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<string>('menu');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<string>('default');

  // Business Logic States
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(true);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Load user and fetch menu items on mount
  useEffect(() => {
    // 1. Fetch user from localStorage
    const savedUser = localStorage.getItem('nusantara_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // 2. Fetch menu from Supabase (or fallback default list)
    loadMenu();

    // 3. Set up pre-seeded notifications
    setNotifications([
      {
        id: 'notif-1',
        title: 'Selamat Datang!',
        message: 'Selamat datang di Restoran Nusantara. Dapatkan diskon 10% dengan kode promo "NUSANTARA".',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        type: 'success',
      },
    ]);

    // 4. Pre-seed a mock order if there's any user to show map tracking instantly
    const savedOrdersRaw = localStorage.getItem('nusantara_orders');
    if (savedOrdersRaw) {
      setOrders(JSON.parse(savedOrdersRaw));
    }
  }, []);

  const loadMenu = async () => {
    setIsLoadingMenu(true);
    try {
      const data = await fetchMenuFromSupabase();
      setMenuItems(data);
    } catch (err) {
      console.error('Error fetching menu data:', err);
    } finally {
      setIsLoadingMenu(false);
    }
  };

  // Helper for floating temporary Toast/Notification alerts
  const showToast = (title: string, message: string, type: 'success' | 'info' | 'warning') => {
    // 1. Show the mini toast alert
    setActiveToast({ title, message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 4500);

    // 2. Add to notification history tray
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Auth Handlers
  const handleAuthSuccess = (authUser: User) => {
    setUser(authUser);
    localStorage.setItem('nusantara_current_user', JSON.stringify(authUser));
    
    // Redirect to home menu
    setActiveTab('menu');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nusantara_current_user');
    setCart([]);
    showToast('Keluar Akun', 'Anda berhasil keluar dari akun Anda.', 'info');
    setActiveTab('menu');
  };

  // Cart Operations
  const handleAddToCart = (item: MenuItem) => {
    if (!user) {
      setActiveTab('auth');
      showToast('Wajib Masuk', 'Silakan daftar atau masuk akun terlebih dahulu sebelum memesan.', 'warning');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((it) => it.menuItem.id === item.id);
      if (existing) {
        return prevCart.map((it) =>
          it.menuItem.id === item.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      }
      return [...prevCart, { menuItem: item, quantity: 1 }];
    });

    showToast('Keranjang Ditambahkan', `"${item.nama_menu}" dimasukkan ke keranjang belanja Anda.`, 'success');
  };

  const handleRemoveFromCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((it) => it.menuItem.id === item.id);
      if (existing && existing.quantity > 1) {
        return prevCart.map((it) =>
          it.menuItem.id === item.id ? { ...it, quantity: it.quantity - 1 } : it
        );
      }
      return prevCart.filter((it) => it.menuItem.id !== item.id);
    });

    showToast('Keranjang Diperbarui', `Jumlah "${item.nama_menu}" dikurangi.`, 'info');
  };

  const handleUpdateCartQuantity = (itemId: string | number, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((it) => {
          if (it.menuItem.id === itemId) {
            const newQty = it.quantity + delta;
            return { ...it, quantity: newQty };
          }
          return it;
        })
        .filter((it) => it.quantity > 0);
    });
  };

  const handleRemoveCartItemComplete = (itemId: string | number) => {
    const item = cart.find((it) => it.menuItem.id === itemId);
    setCart((prevCart) => prevCart.filter((it) => it.menuItem.id !== itemId));
    if (item) {
      showToast('Item Dihapus', `"${item.menuItem.nama_menu}" dihapus dari keranjang.`, 'info');
    }
  };

  // Checkout Handler
  const handleCheckout = (metodePembayaran: string, alamatTujuan: string) => {
    if (cart.length === 0 || !user) return;

    const subtotal = cart.reduce((acc, item) => acc + item.menuItem.harga * item.quantity, 0);
    const ongkosKirim = 12000;
    const biayaLayanan = 2000;
    const totalHarga = subtotal + ongkosKirim + biayaLayanan;

    const newOrder: Order = {
      id: `NUSA-${Math.floor(1000 + Math.random() * 9000)}`,
      pembeli: {
        nama: user.nama,
        email: user.email,
      },
      items: [...cart],
      totalHarga,
      metodePembayaran,
      status: 'Pesanan Diterima',
      waktuPemesanan: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      lokasiTujuan: {
        nama: alamatTujuan,
        lat: -6.2088 + (Math.random() - 0.5) * 0.02,
        lng: 106.8456 + (Math.random() - 0.5) * 0.02,
      },
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('nusantara_orders', JSON.stringify(updatedOrders));

    // Clear Cart & Shift view to Tracking
    setCart([]);
    setActiveTab('tracking');

    showToast(
      'Pesanan Sukses!',
      `Pembayaran via ${metodePembayaran.toUpperCase()} terkonfirmasi. Pesanan sedang dipersiapkan oleh koki Restoran Nusantara.`,
      'success'
    );
  };

  // Admin DB Handlers
  const handleAddMenuItem = async (item: Partial<MenuItem>) => {
    try {
      const created = await addMenuItemToSupabase(item);
      setMenuItems((prev) => [created, ...prev]);
      showToast('Database Ditambahkan', `"${created.nama_menu}" berhasil disimpan ke database Supabase milik Anda!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error Database', 'Gagal menulis ke Supabase. Silakan cek koneksi.', 'warning');
    }
  };

  const handleUpdateMenuItem = async (id: string | number, fields: Partial<MenuItem>) => {
    try {
      const ok = await updateMenuItemInSupabase(id, fields);
      if (ok) {
        setMenuItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...fields } : item))
        );
        showToast('Database Diperbarui', 'Pembaruan data hidangan disimpan ke Supabase.', 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal Pembaruan', 'Gagal memperbarui menu di Supabase.', 'warning');
    }
  };

  const handleDeleteMenuItem = async (id: string | number) => {
    try {
      const ok = await deleteMenuItemFromSupabase(id);
      if (ok) {
        setMenuItems((prev) => prev.filter((item) => item.id !== id));
        showToast('Database Dihapus', 'Menu berhasil dihapus dari database Supabase.', 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin Order Status Changer (Triggers notifications for user!)
  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prevOrders) => {
      const updated = prevOrders.map((order) => {
        if (order.id === orderId) {
          // Trigger notification popup on status change!
          let title = 'Pembaruan Pesanan';
          let msg = `Status pesanan Anda kini berubah menjadi: ${status}`;
          let type: 'success' | 'info' | 'warning' = 'info';

          if (status === 'Sedang Dimasak') {
            title = '🍳 Hidangan Sedang Dimasak';
            msg = 'Koki terbaik kami mulai membumbui dan memasak hidangan Nusantara hangat pesanan Anda!';
            type = 'info';
          } else if (status === 'Sedang Diantar') {
            title = '🚀 Kurir Sedang Mengantar';
            msg = 'Pak Joko telah menjemput makanan hangat Anda dan melaju cepat menuju lokasi Anda!';
            type = 'success';
          } else if (status === 'Tiba di Lokasi') {
            title = '🏡 Kurir Tiba!';
            msg = 'Ketukan di pintu! Pak Joko telah sampai di lokasi tujuan Anda. Selamat makan!';
            type = 'success';
          }

          showToast(title, msg, type);
          return { ...order, status };
        }
        return order;
      });

      localStorage.setItem('nusantara_orders', JSON.stringify(updated));
      return updated;
    });
  };

  // Filters logic
  const filteredAndSortedMenu = menuItems
    .filter((item) => {
      const matchesSearch =
        item.nama_menu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Semua' || item.kategori === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.harga - b.harga;
      if (sortBy === 'price-high') return b.harga - a.harga;
      if (sortBy === 'name') return a.nama_menu.localeCompare(b.nama_menu);
      return 0; // Default order
    });

  const activeUserOrder = orders.find((o) => o.pembeli.email === user?.email);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentTab={activeTab}
        setCurrentTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        cartCount={cartCount}
        unreadNotificationsCount={notifications.length}
        onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
      />

      {/* Real-time Toast Notification Alert Popup */}
      {activeToast && (
        <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-white rounded-2xl shadow-2xl border border-orange-100 overflow-hidden animate-slide-up">
          <div className="h-1.5 bg-gradient-to-r from-red-600 to-orange-500"></div>
          <div className="p-4 flex items-start space-x-3">
            <div className="p-2 bg-orange-50 text-red-600 rounded-xl">
              <Bell className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">{activeToast.title}</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{activeToast.message}</p>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-gray-300 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Notifications Sliding Tray */}
      <Notifications
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClear={() => setNotifications([])}
      />

      {/* Main Content Areas based on tabs */}
      <main className="flex-grow">
        {activeTab === 'menu' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
            
            {/* Elegant Hero Banner */}
            <div className="bg-gradient-to-br from-red-600 via-orange-500 to-orange-400 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]">
              <div className="absolute top-0 right-0 h-full w-1/2 opacity-15 pointer-events-none hidden md:block">
                <UtensilsCrossed className="h-full w-full stroke-1 translate-x-12 translate-y-6 rotate-12" />
              </div>
              
              <div className="max-w-xl space-y-4 relative z-10">
                <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white/25 rounded-full text-xs font-bold font-mono tracking-wider uppercase">
                  <Sparkles className="h-3 w-3 text-yellow-200" />
                  <span>Kuliner Tradisional Indonesia</span>
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none">
                  Kelezatan Autentik Nusantara, <br className="hidden sm:inline" />
                  <span className="text-yellow-200">Diantar Panas & Segar!</span>
                </h2>
                <p className="text-sm text-orange-50 leading-relaxed max-w-md">
                  Nikmati cita rasa rempah khas Indonesia mulai dari Rendang Minang, Sate Madura, Soto Lamongan, hingga Es Teler manis buatan tangan koki ahli kami.
                </p>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-white/20 text-center max-w-sm">
                <div>
                  <span className="block text-lg font-black text-yellow-200 font-mono">100%</span>
                  <span className="text-[10px] text-orange-100 uppercase tracking-wider">Bahan Alami</span>
                </div>
                <div>
                  <span className="block text-lg font-black text-yellow-200 font-mono">&lt; 30 mnt</span>
                  <span className="text-[10px] text-orange-100 uppercase tracking-wider">Kecepatan Kirim</span>
                </div>
                <div>
                  <span className="block text-lg font-black text-yellow-200 font-mono">4.9 ★</span>
                  <span className="text-[10px] text-orange-100 uppercase tracking-wider">Rating Pelanggan</span>
                </div>
              </div>
            </div>

            {/* Filter, Search, and Sort Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between">
              
              {/* Category selector */}
              <div className="flex space-x-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
                {['Semua', 'Makanan', 'Minuman', 'Cemilan'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    {cat === 'Semua' ? 'Semua Hidangan' : cat}
                  </button>
                ))}
              </div>

              {/* Search input & Sorting */}
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto items-stretch sm:items-center">
                
                {/* Search text */}
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari makanan / minuman..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Sort selector */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto pl-3 pr-8 py-2 bg-gray-100 border-0 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    <option value="default">Urutan Standar</option>
                    <option value="price-low">Harga: Termurah</option>
                    <option value="price-high">Harga: Termahal</option>
                    <option value="name">Abjad: A - Z</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Menu Cards Grid */}
            <div>
              {isLoadingMenu ? (
                <div className="py-24 text-center space-y-3">
                  <div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-gray-500 font-mono">Mengambil data menu Nusantara dari Supabase...</p>
                </div>
              ) : filteredAndSortedMenu.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center shadow-sm">
                  <div className="p-4 bg-orange-50 text-orange-400 rounded-full inline-block mb-3">
                    <ChefHat className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-gray-800">Menu Tidak Ditemukan</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
                    Kami tidak dapat menemukan makanan atau minuman yang cocok dengan pencarian Anda. Silakan coba kata kunci lain.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedMenu.map((item) => (
                    <MenuCard
                      key={item.id}
                      item={item}
                      cartItem={cart.find((it) => it.menuItem.id === item.id)}
                      onAddToCart={handleAddToCart}
                      onRemoveFromCart={handleRemoveFromCart}
                      isLoggedIn={!!user}
                      onPromptLogin={() => {
                        setActiveTab('auth');
                        showToast('Registrasi Akun', 'Silakan buat akun atau masuk terlebih dahulu sebelum menambahkan hidangan Nusantara.', 'warning');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <CartView
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItemComplete}
            onCheckout={handleCheckout}
            onBackToMenu={() => setActiveTab('menu')}
          />
        )}

        {activeTab === 'tracking' && (
          <TrackingMap
            order={activeUserOrder || (orders.length > 0 ? orders[0] : null)}
            onRefreshStatus={() => {
              showToast('Status Terkini', 'Mengambil pembaruan rute kurir real-time...', 'info');
            }}
          />
        )}

        {activeTab === 'admin' && user?.role === 'admin' && (
          <AdminDashboard
            menuItems={menuItems}
            onAddMenuItem={handleAddMenuItem}
            onUpdateMenuItem={handleUpdateMenuItem}
            onDeleteMenuItem={handleDeleteMenuItem}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onRefreshMenu={loadMenu}
          />
        )}

        {activeTab === 'auth' && (
          <AuthView
            onAuthSuccess={handleAuthSuccess}
            onNotification={showToast}
          />
        )}
      </main>

      {/* Elegant Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-12 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h4 className="text-white font-extrabold text-base tracking-tight flex items-center space-x-2">
                <span className="p-1.5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg">
                  <Utensils size={16} />
                </span>
                <span>Restoran Nusantara</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Menyajikan kuliner khas tradisi dari Sabang sampai Merauke secara profesional, higienis, dan cepat saji langsung ke rumah Anda.
              </p>
            </div>
            
            <div className="space-y-2">
              <h5 className="text-white font-bold text-xs uppercase tracking-wider font-mono text-orange-400">Jam Operasional</h5>
              <p className="text-xs">Setiap Hari: 09:00 - 22:00 WIB</p>
              <p className="text-xs">Dapur Utama: Menteng, Jakarta Pusat</p>
              <p className="text-xs">Layanan Pengantaran: Jabodetabek</p>
            </div>

            <div className="space-y-3">
              <h5 className="text-white font-bold text-xs uppercase tracking-wider font-mono text-orange-400">Database & API Status</h5>
              <p className="text-xs leading-relaxed">
                Koneksi aktif ke Supabase PostgreSQL API: <br />
                <code className="text-[10px] bg-slate-800 text-yellow-300 p-1 rounded block mt-1 overflow-x-auto select-all">
                  aqatbxdspyzufzsuskjd.supabase.co
                </code>
              </p>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-6 text-center text-xs text-slate-500 font-mono">
            &copy; {new Date().getFullYear()} Restoran Nusantara App. Hak Cipta Dilindungi Undang-Undang.
          </div>
        </div>
      </footer>
    </div>
  );
}
