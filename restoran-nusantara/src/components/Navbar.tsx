import React from 'react';
import { Utensils, ShoppingCart, MapPin, User, LogOut, Settings, Bell } from 'lucide-react';
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
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-red-600 via-orange-500 to-orange-400 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <button
            onClick={() => setCurrentTab('menu')}
            className="flex items-center space-x-2 focus:outline-none group cursor-pointer"
            id="nav-logo"
          >
            <div className="p-2 bg-white text-red-600 rounded-full shadow-inner transition-transform group-hover:scale-110">
              <Utensils className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold tracking-tight font-sans">
                Restoran <span className="text-yellow-200">Nusantara</span>
              </h1>
              <p className="text-[10px] text-orange-100 font-mono -mt-1 hidden sm:block">
                Cita Rasa Asli Indonesia
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <button
              onClick={() => setCurrentTab('menu')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentTab === 'menu'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-orange-50 hover:bg-white/10'
              }`}
              id="nav-menu-tab"
            >
              Menu Pilihan
            </button>

            {user && (
              <button
                onClick={() => setCurrentTab('tracking')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 cursor-pointer ${
                  currentTab === 'tracking'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-orange-50 hover:bg-white/10'
                }`}
                id="nav-tracking-tab"
              >
                <MapPin className="h-4 w-4" />
                <span>Lacak Pesanan</span>
              </button>
            )}

            {user?.role === 'admin' && (
              <button
                onClick={() => setCurrentTab('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-1 cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-yellow-400 text-red-950 font-bold shadow-sm hover:bg-yellow-300'
                    : 'text-yellow-100 hover:bg-white/10'
                }`}
                id="nav-admin-tab"
              >
                <Settings className="h-4 w-4" />
                <span>Dashboard Admin</span>
              </button>
            )}
          </nav>

          {/* Right Side Options (Cart, Notifications, Auth) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notification Bell */}
            <button
              onClick={onToggleNotifications}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
              id="nav-notification-bell"
            >
              <Bell className="h-6 w-6 text-white" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-red-900 ring-2 ring-orange-500 animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Shopping Cart button */}
            <button
              onClick={() => setCurrentTab('cart')}
              className={`relative p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none cursor-pointer ${
                currentTab === 'cart' ? 'bg-white/10' : ''
              }`}
              id="nav-cart"
            >
              <ShoppingCart className="h-6 w-6 text-white" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-300 text-[10px] font-bold text-red-900 ring-2 ring-orange-500">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile / Auth Button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold max-w-[120px] truncate">
                    {user.nama}
                  </span>
                  <span className="text-[10px] text-orange-100 capitalize font-mono">
                    {user.role === 'admin' ? '👑 Admin' : 'Pelanggan'}
                  </span>
                </div>
                <div className="h-8 w-8 rounded-full bg-red-700 border-2 border-orange-200 flex items-center justify-center font-bold text-sm text-yellow-100 shadow-md">
                  {user.nama.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-full hover:bg-white/10 text-orange-100 hover:text-white transition-colors cursor-pointer"
                  title="Logout"
                  id="nav-logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentTab('auth')}
                className="flex items-center space-x-1 px-4 py-2 bg-yellow-400 text-red-900 hover:bg-yellow-300 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                id="nav-login-btn"
              >
                <User className="h-4 w-4" />
                <span>Masuk</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-white/10">
          <button
            onClick={() => setCurrentTab('menu')}
            className={`flex flex-col items-center text-[10px] py-1 px-3 rounded-md cursor-pointer ${
              currentTab === 'menu' ? 'text-yellow-200 bg-white/10' : 'text-orange-100'
            }`}
          >
            <Utensils className="h-4 w-4 mb-0.5" />
            Menu
          </button>

          {user && (
            <button
              onClick={() => setCurrentTab('tracking')}
              className={`flex flex-col items-center text-[10px] py-1 px-3 rounded-md cursor-pointer ${
                currentTab === 'tracking' ? 'text-yellow-200 bg-white/10' : 'text-orange-100'
              }`}
            >
              <MapPin className="h-4 w-4 mb-0.5" />
              Lacak
            </button>
          )}

          {user?.role === 'admin' && (
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex flex-col items-center text-[10px] py-1 px-3 rounded-md cursor-pointer ${
                currentTab === 'admin' ? 'text-yellow-200 bg-white/10' : 'text-orange-100'
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
