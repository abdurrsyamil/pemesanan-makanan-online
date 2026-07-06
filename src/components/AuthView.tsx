import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, ShieldCheck, Sparkles, UserPlus, LogIn, AlertCircle, ChefHat, Truck, ArrowLeft, HelpCircle } from 'lucide-react';
import { User as UserType } from '../types';
import { registerUserInSupabase } from '../lib/supabase';

interface AuthViewProps {
  onAuthSuccess: (user: UserType) => void;
  onNotification: (title: string, message: string, type: 'success' | 'info' | 'warning') => void;
}

export default function AuthView({ onAuthSuccess, onNotification }: AuthViewProps) {
  const [selectedPortal, setSelectedPortal] = useState<'customer' | 'admin' | 'koki' | 'kurir' | null>(null);
  
  // Auth Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Customer smart auto-register state
  const [isEmailRegistered, setIsEmailRegistered] = useState<boolean | null>(null);

  // Check if customer email is already registered in local database
  useEffect(() => {
    if (selectedPortal === 'customer' && email.trim()) {
      const savedUsersRaw = localStorage.getItem('nusantara_users');
      const savedUsers: UserType[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
      const matchedUser = savedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      setIsEmailRegistered(!!matchedUser);
    } else {
      setIsEmailRegistered(null);
    }
  }, [email, selectedPortal]);

  const handlePortalSelect = (portal: 'customer' | 'admin' | 'koki' | 'kurir') => {
    setSelectedPortal(portal);
    setEmail('');
    setPassword('');
    setNama('');
    setError('');
  };

  const handleBackToPortals = () => {
    setSelectedPortal(null);
    setEmail('');
    setPassword('');
    setNama('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formattedEmail = email.toLowerCase().trim();

    if (!formattedEmail || !password) {
      setError('Email dan kata sandi wajib diisi.');
      setIsLoading(false);
      return;
    }

    try {
      // --- PORTAL ROLE LOGIC ---
      if (selectedPortal === 'admin') {
        // ADMIN PORTAL
        if (formattedEmail === 'admin@nusantara.com' || (formattedEmail.includes('admin') && password === 'admin123')) {
          const adminUser: UserType = {
            id: 'admin-1',
            nama: 'Administrator Nusantara',
            email: formattedEmail,
            role: 'admin',
          };
          onAuthSuccess(adminUser);
          onNotification('Selamat Datang!', 'Masuk sebagai Administrator Restoran Nusantara.', 'success');
        } else {
          setError('Kredensial Administrator salah. Gunakan sandi khusus admin.');
        }
      } 
      else if (selectedPortal === 'koki') {
        // KOKI (CHEF) PORTAL
        if (formattedEmail === 'koki@nusantara.com' || (formattedEmail.includes('koki') && password === 'koki123')) {
          const kokiUser: UserType = {
            id: `koki-${Date.now()}`,
            nama: 'Chef Nusantara',
            email: formattedEmail,
            role: 'koki',
          };
          onAuthSuccess(kokiUser);
          onNotification('Selamat Bekerja, Chef!', 'Masuk sebagai Tim Dapur Restoran Nusantara.', 'success');
        } else {
          setError('Kode Otentikasi Tim Dapur tidak cocok.');
        }
      } 
      else if (selectedPortal === 'kurir') {
        // KURIR (DRIVER) PORTAL
        if (formattedEmail === 'kurir@nusantara.com' || (formattedEmail.includes('kurir') && password === 'kurir123')) {
          const kurirUser: UserType = {
            id: `kurir-${Date.now()}`,
            nama: 'Pak Joko (Kurir)',
            email: formattedEmail,
            role: 'kurir',
          };
          onAuthSuccess(kurirUser);
          onNotification('Hati-hati di Jalan!', 'Masuk sebagai Mitra Pengantar Restoran Nusantara.', 'success');
        } else {
          setError('Kredensial Pengantar salah. Gunakan sandi khusus kurir.');
        }
      } 
      else if (selectedPortal === 'customer') {
        // CUSTOMER PORTAL
        const savedUsersRaw = localStorage.getItem('nusantara_users');
        const savedUsers: UserType[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
        
        const matchedUser = savedUsers.find(
          (u) => u.email.toLowerCase() === formattedEmail
        );

        if (matchedUser) {
          // USER EXISTS -> Direct Login
          onAuthSuccess({ ...matchedUser, role: 'customer' });
          onNotification('Selamat Datang Kembali!', `Halo ${matchedUser.nama}, senang melihat Anda kembali!`, 'success');
        } else {
          // USER DOES NOT EXIST -> Dynamic Auto-Registration
          if (!nama.trim()) {
            setError('Nama lengkap wajib diisi untuk pendaftaran akun baru.');
            setIsLoading(false);
            return;
          }

          const newUser: UserType = {
            id: `user-${Date.now()}`,
            nama: nama.trim(),
            email: formattedEmail,
            role: 'customer',
          };

          // Try writing to Supabase users table
          const writeSuccess = await registerUserInSupabase({
            id: newUser.id,
            nama: newUser.nama,
            email: newUser.email,
            role: newUser.role,
          });

          // Save locally
          savedUsers.push(newUser);
          localStorage.setItem('nusantara_users', JSON.stringify(savedUsers));

          onAuthSuccess(newUser);
          if (writeSuccess) {
            onNotification('Registrasi Sukses!', 'Akun Anda berhasil didaftarkan ke Supabase database.', 'success');
          } else {
            onNotification('Masuk Berhasil!', 'Akun berhasil dibuat secara otomatis dan masuk.', 'success');
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  // 1. LANDING PORTALS SELECT VIEW
  if (selectedPortal === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] p-4 bg-gradient-to-br from-[#121212] via-[#1c1212] to-[#121c12]">
        <div className="w-full max-w-4xl text-center mb-10 space-y-3">
          <span className="inline-flex items-center space-x-2 px-3 py-1 bg-red-600/10 border border-red-500/30 text-red-400 rounded-full text-xs font-black tracking-widest uppercase font-mono">
            <Sparkles className="h-3 w-3 text-gold-400 animate-pulse" />
            <span>Gerbang Masuk Terintegrasi</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-gold-100 tracking-tight">
            Portal VIP <span className="text-red-500">Restoran Nusantara</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
            Silakan pilih pintu masuk yang sesuai dengan peran Anda untuk mengakses layanan kuliner nusantara terbaik.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
          {/* Card 1: Customer */}
          <button
            onClick={() => handlePortalSelect('customer')}
            className="bg-[#181818] rounded-3xl border border-white/5 p-6 text-center shadow-xl hover:shadow-2xl hover:border-gold-500/30 hover:-translate-y-1.5 transition-all group flex flex-col justify-between items-center text-left min-h-[240px] cursor-pointer"
          >
            <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl group-hover:bg-red-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
              <User className="h-8 w-8" />
            </div>
            <div className="space-y-1.5 mt-4 text-center">
              <h4 className="font-serif font-bold text-gold-100 text-lg group-hover:text-red-500 transition-colors">
                VIP Pelanggan
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Pesan hidangan premium, kelola reservasi VIP, dan lacak pengantaran kurir pribadi.
              </p>
            </div>
            <span className="text-[10px] font-bold text-gold-400 mt-4 group-hover:underline uppercase tracking-widest">
              Masuk / Daftar &rarr;
            </span>
          </button>

          {/* Card 2: Chef */}
          <button
            onClick={() => handlePortalSelect('koki')}
            className="bg-[#181818] rounded-3xl border border-white/5 p-6 text-center shadow-xl hover:shadow-2xl hover:border-gold-500/30 hover:-translate-y-1.5 transition-all group flex flex-col justify-between items-center text-left min-h-[240px] cursor-pointer"
          >
            <div className="p-4 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-transparent transition-all duration-300">
              <ChefHat className="h-8 w-8" />
            </div>
            <div className="space-y-1.5 mt-4 text-center">
              <h4 className="font-serif font-bold text-gold-100 text-lg group-hover:text-amber-400 transition-colors">
                Kepala Koki Dapur
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Pantau pesanan dapur utama secara real-time dan kelola status hidangan koki.
              </p>
            </div>
            <span className="text-[10px] font-bold text-gold-400 mt-4 group-hover:underline uppercase tracking-widest">
              Akses Dapur &rarr;
            </span>
          </button>

          {/* Card 3: Courier */}
          <button
            onClick={() => handlePortalSelect('kurir')}
            className="bg-[#181818] rounded-3xl border border-white/5 p-6 text-center shadow-xl hover:shadow-2xl hover:border-gold-500/30 hover:-translate-y-1.5 transition-all group flex flex-col justify-between items-center text-left min-h-[240px] cursor-pointer"
          >
            <div className="p-4 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-transparent transition-all duration-300">
              <Truck className="h-8 w-8" />
            </div>
            <div className="space-y-1.5 mt-4 text-center">
              <h4 className="font-serif font-bold text-gold-100 text-lg group-hover:text-emerald-400 transition-colors">
                Mitra Kurir Rute
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Akses rute peta pengantaran VIP hangat dan catat laporan tugas pesanan terkirim.
              </p>
            </div>
            <span className="text-[10px] font-bold text-gold-400 mt-4 group-hover:underline uppercase tracking-widest">
              Buka Rute &rarr;
            </span>
          </button>

          {/* Card 4: Admin */}
          <button
            onClick={() => handlePortalSelect('admin')}
            className="bg-[#181818] rounded-3xl border border-white/5 p-6 text-center shadow-xl hover:shadow-2xl hover:border-gold-500/30 hover:-translate-y-1.5 transition-all group flex flex-col justify-between items-center text-left min-h-[240px] cursor-pointer"
          >
            <div className="p-4 bg-red-600/10 text-red-400 border border-red-600/20 rounded-2xl group-hover:bg-red-700 group-hover:text-white group-hover:border-transparent transition-all duration-300">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div className="space-y-1.5 mt-4 text-center">
              <h4 className="font-serif font-bold text-gold-100 text-lg group-hover:text-red-400 transition-colors">
                Direktur Restoran
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Manajemen menu lengkap di database Supabase dan pengawasan kendali operasional.
              </p>
            </div>
            <span className="text-[10px] font-bold text-gold-400 mt-4 group-hover:underline uppercase tracking-widest">
              Kelola Resto &rarr;
            </span>
          </button>
        </div>
      </div>
    );
  }

  // 2. DEDICATED PORTAL FORM VIEW
  const getPortalInfo = () => {
    switch (selectedPortal) {
      case 'customer':
        return {
          title: 'Portal Pelanggan Nusantara',
          desc: 'Masuk jika sudah memiliki akun, atau buat akun baru di bawah secara instan jika belum terdaftar.',
          color: 'from-red-700 to-gold-600',
          ring: 'focus:ring-gold-500',
          border: 'border-gold-500/30',
          btnBg: 'bg-gradient-to-r from-red-700 to-gold-600 hover:from-red-600 hover:to-gold-500 text-white',
          icon: <User className="h-6 w-6 animate-pulse text-gold-300" />,
          help: '💡 Daftarkan email & password Anda untuk mendaftar akun baru.'
        };
      case 'koki':
        return {
          title: 'Portal Koki Dapur Nusantara',
          desc: 'Masuk khusus untuk Kepala Koki & Tim Dapur Utama Menteng untuk memproses hidangan hangat.',
          color: 'from-amber-600 to-yellow-500',
          ring: 'focus:ring-amber-500',
          border: 'border-amber-500/30',
          btnBg: 'bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-slate-950 font-black',
          icon: <ChefHat className="h-6 w-6 animate-pulse text-yellow-300" />,
          help: '💡 Kredensial khusus koki: email koki@nusantara.com & sandi koki123.'
        };
      case 'kurir':
        return {
          title: 'Portal Kurir Nusantara',
          desc: 'Masuk khusus untuk Mitra Pengantar Rute Jabodetabek untuk menyajikan langsung ke pelanggan.',
          color: 'from-emerald-600 to-emerald-400',
          ring: 'focus:ring-emerald-500',
          border: 'border-emerald-500/30',
          btnBg: 'bg-gradient-to-r from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-slate-950 font-black',
          icon: <Truck className="h-6 w-6 animate-pulse text-emerald-300" />,
          help: '💡 Kredensial khusus kurir: email kurir@nusantara.com & sandi kurir123.'
        };
      case 'admin':
        return {
          title: 'Portal Direktur & Admin',
          desc: 'Masuk khusus Manager & Owner untuk kelola database menu dan sinkronisasi Supabase.',
          color: 'from-red-800 to-red-600',
          ring: 'focus:ring-red-600',
          border: 'border-red-600/30',
          btnBg: 'bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 text-white',
          icon: <ShieldCheck className="h-6 w-6 animate-pulse text-red-300" />,
          help: '💡 Kredensial khusus direktur: email admin@nusantara.com & sandi admin123.'
        };
    }
  };

  const portalInfo = getPortalInfo()!;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] p-4 bg-gradient-to-br from-[#121212] via-[#1c1212] to-[#121c12]">
      <div className="w-full max-w-md bg-[#181818] rounded-3xl shadow-2xl overflow-hidden border border-white/5 relative">
        
        {/* Portal Header Accent bar */}
        <div className={`h-2.5 bg-gradient-to-r ${portalInfo.color}`}></div>

        {/* Return Button */}
        <button
          onClick={handleBackToPortals}
          className="absolute top-6 left-6 inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-gold-400 font-bold focus:outline-none transition-colors cursor-pointer bg-transparent border-0"
        >
          <ArrowLeft size={14} />
          <span>Kembali</span>
        </button>

        {/* Content Box */}
        <div className="p-8 pt-16">
          <div className="text-center mb-6">
            <div className={`inline-flex p-3 bg-white/5 border border-white/10 rounded-2xl text-white shadow-md mb-3`}>
              {portalInfo.icon}
            </div>
            <h2 className="text-xl font-serif font-bold text-gold-100">
              {portalInfo.title}
            </h2>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed px-1">
              {portalInfo.desc}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-950/40 border-l-4 border-red-600 text-red-300 text-xs flex items-start space-x-2 rounded-r-lg">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL INPUT */}
            <div>
              <label className="block text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1.5 font-mono">
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${portalInfo.ring} focus:bg-white/10 transition-all text-sm`}
                  required
                />
              </div>
            </div>

            {/* DYNAMIC REGISTER USER NAME (Displays only on Customer tab if unregistered) */}
            {selectedPortal === 'customer' && isEmailRegistered === false && email.trim().length > 3 && (
              <div className="bg-red-500/5 p-4 rounded-2xl border border-red-500/15 space-y-3 animate-fade-in">
                <p className="text-[10px] text-gold-300 font-bold leading-none flex items-center space-x-1.5">
                  <UserPlus size={13} className="text-red-400 shrink-0" />
                  <span>Akun belum terdaftar. Daftarkan secara otomatis!</span>
                </p>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 font-mono">
                    Nama Lengkap Anda
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukkan nama lengkap Anda"
                      className={`w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${portalInfo.ring} transition-all text-sm`}
                      required={isEmailRegistered === false}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PASSWORD INPUT */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-[10px] font-black text-gold-500 uppercase tracking-widest font-mono">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${portalInfo.ring} focus:bg-white/10 transition-all text-sm`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 ${portalInfo.btnBg} font-black rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2 mt-6 cursor-pointer text-xs uppercase tracking-widest`}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : selectedPortal === 'customer' && isEmailRegistered === false ? (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Daftar Akun Baru</span>
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Masuk Portal</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Portal-specific Bypass instructions */}
        <div className="p-4 bg-white/5 border-t border-white/5 text-center flex items-center justify-center space-x-1.5">
          <HelpCircle className="h-3.5 w-3.5 text-gold-500 shrink-0" />
          <p className="text-[10px] text-gray-400 leading-normal max-w-xs">
            {portalInfo.help}
          </p>
        </div>
      </div>
    </div>
  );
}
