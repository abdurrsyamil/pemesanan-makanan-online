import React from 'react';
import { Utensils, ShoppingCart, MapPin, User, LogOut, Settings, Bell, Calendar, MessageSquare, ShieldCheck, ChefHat, Truck } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserType | null;
  onLogout: () => void;
  cartCount: number;
  unreadNotificationsCount: number;
  onToggleNotifications: () => void;
}

export default function Navbar({
  currentTab,
  setCurrentTab,
  user,
  onLogout,
  cartCount,
  unreadNotificationsCount,
  onToggleNotifications,
}: NavbarProps) {
  // Translate roles for display badges
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return '👑 Admin Lounge';
      case 'koki':
        return '👨‍🍳 Kepala Koki';
      case 'kurir':
        return '🛵 Kurir VIP';
      default:
        return '👤 VIP Member';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#111111] border-b border-gold-800/40 text-white shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand - Ref Hanamasa & Union style typography */}
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center space-x-3 focus:outline-none group cursor-pointer bg-transparent border-0 text-left"
            id="nav-logo"
          >
            <div className="p-2.5 bg-gradient-to-br from-red-700 to-gold-600 text-white rounded-xl shadow-lg ring-1 ring-gold-500/30 transition-transform group-hover:scale-105">
              <Utensils className="h-6 w-6 text-gold-100" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-serif font-bold tracking-wide text-gold-100">
                Restoran <span className="text-red-500">Nusantara</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-sans tracking-widest uppercase -mt-0.5">
                Pemesanan Makanan Online
              </p>
            </div>
          </button>

          {/* Navigation Links - Ref Union Group & Steak 21 elegance */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            <button
              onClick={() => setCurrentTab('home')}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer bg-transparent border-0 ${
                currentTab === 'home'
                  ? 'bg-gold-500/10 text-gold-300 border border-gold-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              id="nav-home-tab"
            >
              Lounge
            </button>

            <button
              onClick={() => setCurrentTab('menu')}
              className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer bg-transparent border-0 ${
                currentTab === 'menu'
                  ? 'bg-gold-500/10 text-gold-300 border border-gold-500/30'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
              id="nav-menu-tab"
            >
              Gastronomy Menu
            </button>

            {user && (user.role === 'customer' || user.role === 'user') && (
              <>
                <button
                  onClick={() => setCurrentTab('tracking')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center space-x-1 cursor-pointer bg-transparent border-0 ${
                    currentTab === 'tracking'
                      ? 'bg-gold-500/10 text-gold-300 border border-gold-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  id="nav-tracking-tab"
                >
                  <MapPin className="h-3.5 w-3.5 text-gold-400" />
                  <span>Lacak Kurir</span>
                </button>
              </>
            )}

            {/* Admin Dashboard */}
            {user && user.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin')}
                className="px-3 py-2 bg-gold-600/20 text-gold-300 border border-gold-500/40 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center space-x-1 hover:bg-gold-600/35 transition-all cursor-pointer text-left"
                id="nav-admin-tab"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Admin Lounge</span>
              </button>
            )}

            {/* Koki Dashboard */}
            {user && user.role === 'koki' && (
              <button
                onClick={() => setCurrentTab('koki')}
                className="px-3 py-2 bg-amber-600/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center space-x-1 hover:bg-amber-600/35 transition-all cursor-pointer text-left"
                id="nav-koki-tab"
              >
                <ChefHat className="h-3.5 w-3.5" />
                <span>Dapur Koki</span>
              </button>
            )}

            {/* Kurir Dashboard */}
            {user && user.role === 'kurir' && (
              <button
                onClick={() => setCurrentTab('kurir')}
                className="px-3 py-2 bg-red-600/20 text-red-300 border border-red-500/40 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center space-x-1 hover:bg-red-600/35 transition-all cursor-pointer text-left"
                id="nav-kurir-tab"
              >
                <Truck className="h-3.5 w-3.5" />
                <span>Rute Kurir</span>
              </button>
            )}
          </nav>

          {/* Right Side Options (WhatsApp Badge, Cart, Notifications, Auth) */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* WhatsApp Support Badge - Ref Steak 21 image "(Chat Only)" green pill */}
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center space-x-2 px-3 py-1.5 bg-[#25d366]/10 border border-[#25d366]/30 rounded-xl text-[#25d366] text-xs font-medium hover:bg-[#25d366]/20 transition-all shadow-md cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#25d366]"></span>
              </span>
              <div className="text-left font-sans">
                <p className="text-[10px] text-gray-400 -mb-0.5 font-bold">Whatsapp</p>
                <p className="text-[9px] text-[#25d366] font-mono">(Chat Only)</p>
              </div>
            </a>

            {/* Notification Bell */}
            <button
              onClick={onToggleNotifications}
              className="relative p-2.5 rounded-full hover:bg-white/5 text-gray-300 hover:text-gold-200 transition-colors focus:outline-none cursor-pointer bg-transparent border-0"
              id="nav-notification-bell"
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-black text-white ring-2 ring-[#111111] animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Shopping Cart button */}
            <button
              onClick={() => setCurrentTab('cart')}
              className={`relative p-2.5 rounded-full hover:bg-white/5 text-gray-300 hover:text-gold-200 transition-colors focus:outline-none cursor-pointer bg-transparent border-0 ${
                currentTab === 'cart' ? 'bg-gold-500/10 text-gold-300' : ''
              }`}
              id="nav-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold-400 text-[9px] font-black text-slate-950 ring-2 ring-[#111111]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile / Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-gray-100 max-w-[110px] truncate">
                    {user.nama}
                  </span>
                  <span className="text-[9px] text-gold-400 tracking-wider font-mono font-bold uppercase">
                    {getRoleBadge(user.role)}
                  </span>
                </div>
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-gold-600 to-gold-800 border border-gold-400/40 flex items-center justify-center font-black text-sm text-gold-50 shadow-md">
                  {user.nama.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors cursor-pointer bg-transparent border-0"
                  title="Logout"
                  id="nav-logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab('auth')}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 hover:from-gold-400 hover:to-gold-500 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer border-0"
                id="nav-login-btn"
              >
                <User className="h-3.5 w-3.5" />
                <span>Masuk VIP</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-3 border-t border-gold-800/20 text-xs">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center text-[10px] py-1 px-3 rounded-lg cursor-pointer bg-transparent border-0 ${
              currentTab === 'home' ? 'text-gold-300 bg-gold-500/10 font-bold' : 'text-gray-400'
            }`}
          >
            <Utensils className="h-4 w-4 mb-0.5" />
            Lounge
          </button>

          <button
            onClick={() => setCurrentTab('menu')}
            className={`flex flex-col items-center text-[10px] py-1 px-3 rounded-lg cursor-pointer bg-transparent border-0 ${
              currentTab === 'menu' ? 'text-gold-300 bg-gold-500/10 font-bold' : 'text-gray-400'
            }`}
          >
            <ShieldCheck className="h-4 w-4 mb-0.5" />
            Menu
          </button>

          {user && (user.role === 'customer' || user.role === 'user') && (
            <button
              onClick={() => setCurrentTab('tracking')}
              className={`flex flex-col items-center text-[10px] py-1 px-3 rounded-lg cursor-pointer bg-transparent border-0 ${
                currentTab === 'tracking' ? 'text-gold-300 bg-gold-500/10 font-bold' : 'text-gray-400'
              }`}
            >
              <MapPin className="h-4 w-4 mb-0.5" />
              Lacak
            </button>
          )}

          {user && user.role === 'koki' && (
            <button
              onClick={() => setCurrentTab('koki')}
              className={`flex flex-col items-center text-[10px] py-1 px-3 rounded-lg cursor-pointer bg-transparent border-0 ${
                currentTab === 'koki' ? 'text-gold-300 bg-gold-500/10 font-bold' : 'text-gray-400'
              }`}
            >
              <ChefHat className="h-4 w-4 mb-0.5" />
              Koki
            </button>
          )}

          {user && user.role === 'kurir' && (
            <button
              onClick={() => setCurrentTab('kurir')}
              className={`flex flex-col items-center text-[10px] py-1 px-3 rounded-lg cursor-pointer bg-transparent border-0 ${
                currentTab === 'kurir' ? 'text-gold-300 bg-gold-500/10 font-bold' : 'text-gray-400'
              }`}
            >
              <MapPin className="h-4 w-4 mb-0.5" />
              Kurir
            </button>
          )}

          {user && user.role === 'admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex flex-col items-center text-[10px] py-1 px-3 rounded-lg cursor-pointer bg-transparent border-0 ${
                currentTab === 'admin' ? 'text-gold-300 bg-gold-500/10 font-bold' : 'text-gray-400'
              }`}
            >
              <Settings className="h-4 w-4 mb-0.5" />
              Admin
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
