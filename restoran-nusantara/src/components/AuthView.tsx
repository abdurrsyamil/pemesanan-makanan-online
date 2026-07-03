import React, { useState } from 'react';
import { User, Mail, Lock, ShieldCheck, Sparkles, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';
import { registerUserInSupabase } from '../lib/supabase';

interface AuthViewProps {
  onAuthSuccess: (user: UserType) => void;
  onNotification: (title: string, message: string, type: 'success' | 'info' | 'warning') => void;
  initialMode?: 'login' | 'register';
}

export default function AuthView({ onAuthSuccess, onNotification, initialMode = 'login' }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      setIsLoading(false);
      return;
    }

    if (!isLogin && !nama) {
      setError('Nama lengkap wajib diisi untuk pendaftaran.');
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        // Pre-configured admin credential bypass for ease of demonstration/testing
        if (email.toLowerCase() === 'admin@nusantara.com' || (email.toLowerCase().includes('admin') && password === 'admin123')) {
          const adminUser: UserType = {
            id: 'admin-1',
            nama: nama || 'Administrator Nusantara',
            email: email,
            role: 'admin',
          };
          onAuthSuccess(adminUser);
          onNotification('Selamat Datang!', 'Masuk sebagai Administrator Restoran Nusantara.', 'success');
          setIsLoading(false);
          return;
        }

        // Standard user mock/local database login
        const savedUsersRaw = localStorage.getItem('nusantara_users');
        const savedUsers: UserType[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
        
        const matchedUser = savedUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (matchedUser) {
          onAuthSuccess(matchedUser);
          onNotification('Selamat Datang Kembali!', `Halo ${matchedUser.nama}, senang melihat Anda kembali!`, 'success');
        } else {
          // If not in database, create one on-the-fly to be super friendly and never block the user!
          const generatedName = email.split('@')[0];
          const newUser: UserType = {
            id: `user-${Date.now()}`,
            nama: generatedName.charAt(0).toUpperCase() + generatedName.slice(1),
            email: email,
            role: isAdmin ? 'admin' : 'user',
          };
          
          // Save locally
          savedUsers.push(newUser);
          localStorage.setItem('nusantara_users', JSON.stringify(savedUsers));
          
          onAuthSuccess(newUser);
          onNotification('Masuk Berhasil', `Akun otomatis dibuat untuk email ${email}.`, 'success');
        }
      } else {
        // --- REGISTER LOGIC ---
        const newUser: UserType = {
          id: `user-${Date.now()}`,
          nama: nama,
          email: email,
          role: isAdmin ? 'admin' : 'user',
        };

        // Try writing to Supabase users table
        const writeSuccess = await registerUserInSupabase({
          id: newUser.id,
          nama: newUser.nama,
          email: newUser.email,
          role: newUser.role,
        });

        // Save locally to localStorage as persistent state
        const savedUsersRaw = localStorage.getItem('nusantara_users');
        const savedUsers: UserType[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
        
        if (savedUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
          setError('Email sudah terdaftar. Silakan masuk.');
          setIsLoading(false);
          return;
        }

        savedUsers.push(newUser);
        localStorage.setItem('nusantara_users', JSON.stringify(savedUsers));

        onAuthSuccess(newUser);
        if (writeSuccess) {
          onNotification('Registrasi Sukses!', 'Akun Anda berhasil didaftarkan ke Supabase database.', 'success');
        } else {
          onNotification('Registrasi Berhasil!', 'Akun disimpan lokal (Supabase users table belum terkonfigurasi, namun pendaftaran tetap sukses).', 'info');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-gradient-to-br from-orange-50 via-red-50 to-orange-100/50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100 relative">
        {/* Top Header Accent */}
        <div className="h-3 bg-gradient-to-r from-red-600 via-orange-500 to-orange-400"></div>

        {/* Content Box */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-gradient-to-tr from-red-600 to-orange-500 rounded-full text-white shadow-md mb-3">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isLogin ? 'Masuk ke Restoran Nusantara' : 'Buat Akun Nusantara'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isLogin 
                ? 'Nikmati hidangan nusantara lezat langsung di depan pintu Anda.' 
                : 'Daftar sekarang untuk mulai memesan hidangan favorit Anda.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-start space-x-2 rounded-r-lg">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Nama Lengkap Anda"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kata Sandi
                </label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm"
                  required
                />
              </div>
            </div>

            {/* Admin Role Checkbox (For demo & testing purposes) */}
            <div className="flex items-center space-x-2 pt-2 pb-1">
              <input
                type="checkbox"
                id="isAdmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="rounded text-orange-500 focus:ring-orange-500 h-4 w-4 accent-orange-500 cursor-pointer"
              />
              <label htmlFor="isAdmin" className="text-xs text-gray-500 select-none cursor-pointer flex items-center space-x-1">
                <ShieldCheck className="h-3.5 w-3.5 text-orange-400" />
                <span>Daftar / Masuk sebagai Administrator</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center space-x-2 mt-4 cursor-pointer"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isLogin ? (
                <>
                  <LogIn className="h-4 w-4" />
                  <span>Masuk Sekarang</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Daftar Akun</span>
                </>
              )}
            </button>
          </form>

          {/* Switch Tab Link */}
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              {isLogin ? 'Belum punya akun Nusantara?' : 'Sudah memiliki akun Nusantara?'}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-sm font-bold text-orange-600 hover:text-red-600 hover:underline mt-1 focus:outline-none cursor-pointer"
            >
              {isLogin ? 'Daftar Akun Baru' : 'Masuk dengan Akun Anda'}
            </button>
          </div>
        </div>

        {/* Demo Bypass Helper */}
        <div className="p-4 bg-orange-50 border-t border-orange-100 text-center">
          <p className="text-[11px] text-orange-800 leading-relaxed">
            💡 <strong>Saran Pengujian Admin:</strong> Gunakan email <code className="bg-orange-100 px-1 py-0.5 rounded text-red-700">admin@nusantara.com</code> & sandi apa saja untuk bypass instan ke dashboard Admin.
          </p>
        </div>
      </div>
    </div>
  );
}
