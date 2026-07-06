import React, { useState, useEffect } from 'react';
import { 
  Search, ChefHat, Filter, ArrowUpRight, Sparkles, Utensils, UtensilsCrossed, 
  Bell, ShoppingBag, MapPin, Layers, X, Calendar, MessageSquare, Clock, 
  ShieldCheck, Heart, User, CheckCircle2, ChevronLeft, ChevronRight, 
  Send, AlertCircle, Trash2, Star, Eye, CalendarCheck, Map, Phone, Share2, Compass
} from 'lucide-react';
import { MenuItem, CartItem, User as UserType, Order, Notification } from './types';
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
import KokiDashboard from './components/KokiDashboard';
import KurirDashboard from './components/KurirDashboard';

interface Booking {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  outlet: string;
  tanggal: string;
  waktu: string;
  tamu: number;
  ruangan: string;
  status: string;
}

export default function App() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<string>('home'); // Default tab is now the premium Lounge!
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<string>('default');

  // Business Logic States
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isLoadingMenu, setIsLoadingMenu] = useState<boolean>(true);
  const [activeToast, setActiveToast] = useState<{ title: string; message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  // Custom Feature States (Lounge, Carousel, VIP Reservation, Chat Only WhatsApp)
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [reservations, setReservations] = useState<Booking[]>([]);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessage, setChatMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'assistant',
      text: 'Selamat datang di Layanan VIP Restoran Nusantara! Ada yang bisa kami bantu mengenai pesanan makanan online, menu koki kami, atau pengiriman hari ini? (Chat Only)',
      time: '09:00'
    }
  ]);

  // VIP Reservation Form states
  const [reserveNama, setReserveNama] = useState('');
  const [reserveTelepon, setReserveTelepon] = useState('');
  const [reserveOutlet, setReserveOutlet] = useState('Menteng, Jakarta Pusat');
  const [reserveTanggal, setReserveTanggal] = useState('');
  const [reserveWaktu, setReserveWaktu] = useState('19:00');
  const [reserveTamu, setReserveTamu] = useState(2);
  const [reserveRuangan, setReserveRuangan] = useState('Regular Dining Lounge (Hanamasa style)');

  // Carousel data featuring real menu items from the database
  const carouselSlides = [
    {
      id: 1,
      title: 'Nasi Padang Rendang Daging',
      subtitle: 'Cita Rasa Rendang Sapi Legendaris',
      desc: 'Paket lengkap nasi hangat, daun singkong rebus, gulai gurih khas Minang, sambal ijo, ditambah Rendang Sapi empuk bumbu rempah asli Padang yang meresap sempurna.',
      image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=1200',
      tag: 'BEST SELLER',
      btnPrimary: 'Pesan Online',
      btnSecondary: 'Lihat Semua Menu',
      bgColor: 'from-[#111111] via-[#241111] to-[#111111]'
    },
    {
      id: 2,
      title: 'Sate Ayam Madura Asli',
      subtitle: 'Sate Daging Pilihan Bakar Arang Kelapa',
      desc: '10 tusuk sate daging ayam pilihan dibakar di atas arang batok kelapa hangat, disiram saus kacang gurih pekat kental, kecap manis, irisan bawang merah dan cabai rawit pedas.',
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=1200',
      tag: 'FAVORIT KOKI',
      btnPrimary: 'Pesan Online',
      btnSecondary: 'Lihat Semua Menu',
      bgColor: 'from-[#181111] via-[#351111] to-[#181111]'
    },
    {
      id: 3,
      title: 'Nasi Goreng Nusantara Spesial',
      subtitle: 'Bumbu Pusaka Tradisi Indonesia',
      desc: 'Nasi goreng harum bumbu kecap legendaris racikan rahasia, disajikan lengkap dengan telur mata sapi setengah matang, tomat, mentimun segar, serta taburan bawang goreng renyah.',
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=1200',
      tag: 'MENU UTAMA',
      btnPrimary: 'Pesan Online',
      btnSecondary: 'Lihat Semua Menu',
      bgColor: 'from-[#181611] via-[#2a2419] to-[#181611]'
    },
    {
      id: 4,
      title: 'Ikan Bakar Sambal Rica-Rica',
      subtitle: 'Aroma Bakar Daun Pisang Otentik',
      desc: 'Ikan kembung/nila segar dibakar di atas bara api beralaskan daun pisang alami, dilumuri bumbu kecap manis khas nusantara dan ditaburi sambal rica merah pedas mantap.',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=1200',
      tag: 'SPESIAL PEDAS',
      btnPrimary: 'Pesan Online',
      btnSecondary: 'Lihat Semua Menu',
      bgColor: 'from-[#111111] via-[#242118] to-[#111111]'
    }
  ];

  // Promo Packages using database menu items
  const promoPackages = [
    {
      id: 'PKG-01',
      title: 'Paket Kenyang Nusantara',
      dateRange: 'Selalu Tersedia',
      price: 34000,
      image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=400',
      desc: 'Kombinasi hemat Nasi Goreng Nusantara Spesial (Rp 28.000) yang legendaris berpasangan dengan kesegaran Es Teh Manis Segar (Rp 6.000).'
    },
    {
      id: 'PKG-02',
      title: 'Paket Puas Sate Madura & Es Jeruk',
      dateRange: 'Selalu Tersedia',
      price: 44000,
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&q=80&w=400',
      desc: 'Sajian nikmat Sate Ayam Madura Asli 10 tusuk saus kacang gurih pekat (Rp 32.000) disandingkan dengan kesegaran murni Es Jeruk Peras Dingin (Rp 12.000).'
    },
    {
      id: 'PKG-03',
      title: 'Paket Premium Rendang & Jus Alpukat',
      dateRange: 'Selalu Tersedia',
      price: 63000,
      image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&q=80&w=400',
      desc: 'Kemewahan hidangan Nasi Padang Rendang Daging empuk rempah asli (Rp 45.000) dipadukan bersama Jus Alpukat Mentega Cokelat yang kental dan lembut (Rp 18.000).'
    }
  ];

  // Outlets List representing Delivery Kitchen Hubs
  const outlets = [
    {
      name: 'Dapur Menteng (Cabang Pusat)',
      address: 'Jl. Teuku Umar No. 21, Menteng, Jakarta Pusat',
      phone: '+62 21-25501888',
      hours: '09:00 - 22:00 WIB',
      tags: ['Dapur Utama', 'Delivery Cepat', 'Menu Komplit']
    },
    {
      name: 'Dapur Senopati (Cabang Selatan)',
      address: 'Jl. Senopati No. 74, Kebayoran Baru, Jakarta Selatan',
      phone: '+62 21-88942004',
      hours: '09:00 - 22:00 WIB',
      tags: ['Bumbu Otentik', 'Kurir Instan', 'Pesan Online']
    },
    {
      name: 'Dapur Pacific Place (Cabang SCBD)',
      address: 'Pacific Place Mall, Lantai 5, SCBD Sudirman, Jakarta Selatan',
      phone: '+62 21-72819300',
      hours: '10:00 - 22:00 WIB',
      tags: ['Higienis', 'Kemasan Mewah', 'Area SCBD']
    },
    {
      name: 'Dapur Gading Serpong (Cabang Tangerang)',
      address: 'Ruko Boulevard Gading Serpong Block AA4, Tangerang',
      phone: '+62 21-54319400',
      hours: '09:00 - 22:00 WIB',
      tags: ['Porsi Keluarga', 'Eco Friendly', 'Tangerang Area']
    }
  ];

  // Carousel autoplay logic
  useEffect(() => {
    if (activeTab !== 'home') return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Load user, menu, orders, notifications, and reservations on mount
  useEffect(() => {
    // 1. Fetch user from localStorage
    const savedUser = localStorage.getItem('nusantara_current_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      
      // Auto routing if user is koki, admin or kurir
      if (parsed.role === 'admin') setActiveTab('admin');
      else if (parsed.role === 'koki') setActiveTab('koki');
      else if (parsed.role === 'kurir') setActiveTab('kurir');
    }

    // 2. Fetch menu from Supabase (or fallback default list)
    loadMenu();

    // 3. Set up pre-seeded notifications
    setNotifications([
      {
        id: 'notif-1',
        title: 'Reservasi Sukses!',
        message: 'Layanan reservasi VIP meja makan keluarga kini aktif untuk semua cabang.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        type: 'success',
      },
      {
        id: 'notif-2',
        title: 'Kode Promo Aktif',
        message: 'Gunakan kode "LUXENUSANTARA" untuk diskon VIP Lounge 10% di Menteng.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        type: 'info',
      }
    ]);

    // 4. Load orders
    const savedOrdersRaw = localStorage.getItem('nusantara_orders');
    if (savedOrdersRaw) {
      setOrders(JSON.parse(savedOrdersRaw));
    }

    // 5. Load VIP Table Reservations
    const savedReservations = localStorage.getItem('nusantara_reservations');
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    } else {
      const initialBookings: Booking[] = [
        {
          id: 'RSV-849204',
          nama: 'Budi Santoso',
          email: 'customer@nusantara.com',
          telepon: '081234567890',
          outlet: 'Lounge Menteng (Main Castle)',
          tanggal: '2026-07-10',
          waktu: '19:00',
          tamu: 4,
          ruangan: 'Regular Dining Lounge (Hanamasa style)',
          status: 'Telah Dikonfirmasi',
        }
      ];
      setReservations(initialBookings);
      localStorage.setItem('nusantara_reservations', JSON.stringify(initialBookings));
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
    setActiveToast({ title, message, type });
    setTimeout(() => {
      setActiveToast(null);
    }, 4500);

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
  const handleAuthSuccess = (authUser: UserType) => {
    setUser(authUser);
    localStorage.setItem('nusantara_current_user', JSON.stringify(authUser));

    // Redirect corresponding dashboards
    if (authUser.role === 'admin') {
      setActiveTab('admin');
    } else if (authUser.role === 'koki') {
      setActiveTab('koki');
    } else if (authUser.role === 'kurir') {
      setActiveTab('kurir');
    } else {
      setActiveTab('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('nusantara_current_user');
    setActiveTab('home');
    showToast('Keluar Berhasil', 'Anda telah keluar dari keanggotaan VIP Restoran Nusantara.', 'info');
  };

  // Cart operations
  const handleAddToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((it) => it.menuItem.id === item.id);
      let updated;
      if (existing) {
        updated = prevCart.map((it) =>
          it.menuItem.id === item.id ? { ...it, quantity: it.quantity + 1 } : it
        );
      } else {
        updated = [...prevCart, { menuItem: item, quantity: 1 }];
      }
      showToast('Keranjang Terupdate', `${item.nama_menu} ditambahkan ke pesanan Anda.`, 'success');
      return updated;
    });
  };

  const handleRemoveFromCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((it) => it.menuItem.id === item.id);
      if (!existing) return prevCart;
      let updated;
      if (existing.quantity === 1) {
        updated = prevCart.filter((it) => it.menuItem.id !== item.id);
      } else {
        updated = prevCart.map((it) =>
          it.menuItem.id === item.id ? { ...it, quantity: it.quantity - 1 } : it
        );
      }
      showToast('Keranjang Terupdate', `${item.nama_menu} dikurangi dari pesanan Anda.`, 'info');
      return updated;
    });
  };

  const handleUpdateCartQuantity = (itemId: string | number, quantity: number) => {
    setCart((prevCart) => {
      let updated;
      if (quantity <= 0) {
        updated = prevCart.filter((it) => it.menuItem.id !== itemId);
      } else {
        updated = prevCart.map((it) =>
          it.menuItem.id === itemId ? { ...it, quantity } : it
        );
      }
      return updated;
    });
  };

  const handleRemoveCartItemComplete = (itemId: string | number) => {
    setCart((prevCart) => prevCart.filter((it) => it.menuItem.id !== itemId));
    showToast('Item Dihapus', 'Hidangan berhasil dihapus dari keranjang belanja.', 'info');
  };

  // Checkout process
  const handleCheckout = async (paymentMethod: string, addressString: string) => {
    if (!user) {
      setActiveTab('auth');
      showToast('Otentikasi Diperlukan', 'Silakan masuk ke akun VIP Anda sebelum melakukan checkout.', 'warning');
      return;
    }

    const totalHarga = cart.reduce((acc, it) => acc + it.menuItem.harga * it.quantity, 0);

    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      pembeli: {
        nama: user.nama,
        email: user.email,
      },
      items: [...cart],
      totalHarga,
      metodePembayaran: paymentMethod,
      status: 'Pesanan Diterima',
      waktuPemesanan: new Date().toISOString(),
      lokasiTujuan: {
        nama: addressString,
        lat: -6.2088 + (Math.random() - 0.5) * 0.02,
        lng: 106.8456 + (Math.random() - 0.5) * 0.02,
      },
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('nusantara_orders', JSON.stringify(updatedOrders));

    // Reset Cart
    setCart([]);
    setActiveTab('tracking');
    showToast('Pesanan Terkirim!', 'Koki kami sedang mempersiapkan hidangan nusantara terbaik untuk Anda.', 'success');
  };

  // Supabase CRUD integrations for Menu items
  const handleAddMenuItem = async (newItem: Partial<MenuItem>): Promise<void> => {
    try {
      const added = await addMenuItemToSupabase(newItem as MenuItem);
      if (added) {
        await loadMenu();
        showToast('Menu Ditambahkan', `Hidangan "${newItem.nama_menu}" berhasil dimasukkan ke Supabase.`, 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Kesalahan Simpan', 'Gagal menambahkan menu ke Supabase.', 'warning');
    }
  };

  const handleUpdateMenuItem = async (id: string | number, updatedItem: Partial<MenuItem>): Promise<void> => {
    try {
      const success = await updateMenuItemInSupabase(id, updatedItem as MenuItem);
      if (success) {
        await loadMenu();
        showToast('Menu Diperbarui', `Hidangan "${updatedItem.nama_menu}" berhasil disimpan ke database.`, 'success');
      }
    } catch (err) {
      console.error(err);
      showToast('Kesalahan Simpan', 'Gagal memperbarui menu di Supabase.', 'warning');
    }
  };

  const handleDeleteMenuItem = async (id: string | number): Promise<void> => {
    try {
      const success = await deleteMenuItemFromSupabase(id);
      if (success) {
        await loadMenu();
        showToast('Menu Dihapus', 'Menu berhasil dihapus dari database Supabase.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Kesalahan Hapus', 'Gagal menghapus menu di Supabase.', 'warning');
    }
  };

  // Manage Order status updates
  const handleUpdateOrderStatus = (orderId: string, newStatus: 'Pesanan Diterima' | 'Sedang Dimasak' | 'Sedang Diantar' | 'Tiba di Lokasi') => {
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('nusantara_orders', JSON.stringify(updated));

    // Send corresponding notification based on status
    let title = 'Pembaruan Pesanan';
    let msg = `Pesanan Anda ${orderId} beralih status menjadi ${newStatus}.`;
    let type: 'success' | 'info' | 'warning' = 'info';

    if (newStatus === 'Sedang Dimasak') {
      title = 'Dapur Mulai Memasak 🍳';
      msg = `Kepala Koki sedang meracik rempah terbaik untuk pesanan ${orderId}.`;
      type = 'success';
    } else if (newStatus === 'Sedang Diantar') {
      title = 'Pesanan Sedang Diantar 🛵';
      msg = `Kurir kami telah membawa hidangan Anda dalam wadah thermal hangat menuju lokasi Anda.`;
      type = 'info';
    } else if (newStatus === 'Tiba di Lokasi') {
      title = 'Kurir Tiba di Lokasi! 🎉';
      msg = `Sajian Nusantara hangat telah tiba di depan pintu Anda. Selamat menikmati santapan!`;
      type = 'success';
    }

    showToast(title, msg, type);
  };

  // VIP Reservation Form Submission
  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setActiveTab('auth');
      showToast('Otentikasi VIP', 'Silakan masuk ke akun VIP Anda terlebih dahulu untuk booking lounge.', 'warning');
      return;
    }

    if (!reserveNama || !reserveTelepon || !reserveTanggal) {
      showToast('Formulir Belum Lengkap', 'Harap isi semua kolom formulir reservasi dengan benar.', 'warning');
      return;
    }

    const newBooking: Booking = {
      id: `RSV-${Math.floor(100000 + Math.random() * 900000)}`,
      nama: reserveNama,
      email: user.email,
      telepon: reserveTelepon,
      outlet: reserveOutlet,
      tanggal: reserveTanggal,
      waktu: reserveWaktu,
      tamu: reserveTamu,
      ruangan: reserveRuangan,
      status: 'Menunggu Konfirmasi',
    };

    const updated = [newBooking, ...reservations];
    setReservations(updated);
    localStorage.setItem('nusantara_reservations', JSON.stringify(updated));

    // Clear form
    setReserveNama('');
    setReserveTelepon('');
    setReserveTanggal('');
    
    setActiveTab('my-bookings');
    showToast('Reservasi Terkirim', `Permintaan booking untuk ${newBooking.ruangan} telah diajukan ke Lounge Manager.`, 'success');
  };

  // WhatsApp Simulated Interactive Bot Chat handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = {
      sender: 'user',
      text: chatMessage,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMsg]);
    const inputClean = chatMessage.toLowerCase();
    setChatMessage('');

    // Simulated Typing delay
    setTimeout(() => {
      let replyText = 'Terima kasih telah menghubungi Layanan VIP Restoran Nusantara. Asisten concierge kami sedang memproses permintaan Anda. Ada hal lain yang bisa kami bantu?';
      
      if (inputClean.includes('pesan') || inputClean.includes('kirim') || inputClean.includes('antar') || inputClean.includes('delivery')) {
        replyText = 'Tentu, Kak! Anda bisa memesan hidangan Nusantara lezat kami langsung melalui tab "Gastronomy Menu" di bilah navigasi atas. Semua pesanan akan dimasak hangat dan dikirim instan oleh kurir profesional kami.';
      } else if (inputClean.includes('promo') || inputClean.includes('diskon') || inputClean.includes('paket') || inputClean.includes('murah')) {
        replyText = 'Kami memiliki Paket Spesial Nusantara yang hemat dan valid hari ini! Salah satunya adalah Paket Kenyang Nusantara (Nasi Goreng + Es Teh Manis) hanya seharga Rp 34.000.';
      } else if (inputClean.includes('lokasi') || inputClean.includes('alamat') || inputClean.includes('cabang') || inputClean.includes('dimana')) {
        replyText = 'Kami memiliki 4 pusat dapur cabang pengiriman: Menteng (Jakarta Pusat), Senopati (Jakarta Selatan), Pacific Place (SCBD), dan Gading Serpong (Tangerang). Buka setiap hari hingga jam 10 malam untuk melayani pengantaran Anda.';
      } else if (inputClean.includes('menu') || inputClean.includes('makanan') || inputClean.includes('sate') || inputClean.includes('rendang')) {
        replyText = 'Sajian andalan terpopuler kami adalah Sate Ayam Madura Asli, Bakso Kuah Urat, dan Soto Lamongan Koya Gurih. Semuanya bisa dipesan hangat melalui menu "Gastronomy Menu"!';
      }

      const botReply = {
        sender: 'assistant',
        text: replyText,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      setChatHistory((prev) => [...prev, botReply]);
    }, 1000);
  };

  // Menu filter sorting calculations
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

  // Filter reservations for current user
  const userReservations = reservations.filter((r) => r.email === user?.email);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Navigation - Premium Dark Header */}
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
        <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-[#161616] rounded-2xl shadow-2xl border border-gold-800/40 overflow-hidden animate-slide-up">
          <div className="h-1.5 bg-gradient-to-r from-red-700 via-gold-500 to-yellow-500"></div>
          <div className="p-4 flex items-start space-x-3">
            <div className="p-2 bg-red-950/40 text-red-400 rounded-xl border border-red-500/25">
              <Bell className="h-5 w-5 animate-bounce" />
            </div>
            <div className="flex-grow">
              <h4 className="font-serif font-bold text-gold-100 text-sm">{activeToast.title}</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{activeToast.message}</p>
            </div>
            <button
              onClick={() => setActiveToast(null)}
              className="text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors bg-transparent border-0"
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
        
        {/* --- 1. THE LOUNGE (HOME) VIEW --- */}
        {activeTab === 'home' && (
          <div className="space-y-16 pb-16 animate-fade-in">
            {/* Elegant Carousel Banner combining 4 styles (Steak 21, Hanamasa, Union, Ritz) */}
            <div className="relative w-full overflow-hidden bg-black border-b border-gold-800/20">
              <div 
                className="flex transition-transform duration-1000 ease-in-out h-[560px] md:h-[620px]"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {carouselSlides.map((slide, idx) => (
                  <div 
                    key={slide.id} 
                    className="w-full shrink-0 h-full relative flex items-center justify-center overflow-hidden"
                  >
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10"></div>
                    
                    {/* Background image */}
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-75 transform scale-105 transition-all duration-1000"
                    />

                    {/* Content inside container */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center relative z-20">
                      <div className="max-w-2xl space-y-6">
                        <span className="inline-flex items-center space-x-2 px-3 py-1 bg-red-600/10 border border-red-500/30 text-red-400 rounded-full text-xs font-black tracking-widest uppercase font-mono">
                          <Sparkles className="h-3 w-3 text-gold-400" />
                          <span>{slide.tag}</span>
                        </span>
                        
                        <div className="space-y-2">
                          <h2 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
                            {slide.title}
                          </h2>
                          <p className="text-lg sm:text-xl font-display font-medium text-gold-300">
                            {slide.subtitle}
                          </p>
                        </div>
                        
                        <p className="text-sm text-gray-300 leading-relaxed max-w-lg">
                          {slide.desc}
                        </p>

                        {/* Slide Navigation Buttons - Red bold with gold highlights */}
                        <div className="flex flex-wrap gap-4 pt-4">
                          <button 
                            onClick={() => {
                              setActiveTab('menu');
                            }}
                            className="px-6 py-3.5 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-red-700/20 uppercase text-xs tracking-widest active:scale-95 transition-all border-0 cursor-pointer"
                          >
                            {slide.btnPrimary}
                          </button>
                          
                          <button 
                            onClick={() => {
                              setActiveTab('menu');
                            }}
                            className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-gold-100 border border-gold-500/30 font-bold rounded-xl shadow-md uppercase text-xs tracking-widest active:scale-95 transition-all cursor-pointer"
                          >
                            {slide.btnSecondary}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider Dots Indicator - Ritz-Carlton minimal layout style */}
              <div className="absolute bottom-8 right-8 z-30 flex items-center space-x-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 font-mono text-xs">
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
                  className="p-1 hover:text-gold-400 bg-transparent border-0 cursor-pointer text-white"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-gold-400 font-bold">{currentSlide + 1}</span>
                <span className="text-gray-600">/</span>
                <span className="text-gray-400">{carouselSlides.length}</span>
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)}
                  className="p-1 hover:text-gold-400 bg-transparent border-0 cursor-pointer text-white"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Quick Promo Header Bar - Ref Hanamasa vertical red bar accent */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center space-x-3 mb-10">
                <div className="w-1.5 h-10 bg-red-600 rounded-full"></div>
                <div>
                  <span className="text-[10px] text-gold-500 font-bold tracking-widest uppercase font-mono">Special Offers</span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gold-100">Paket Spesial Nusantara</h3>
                </div>
              </div>

              {/* Grid of Packages */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {promoPackages.map((pkg) => (
                  <div 
                    key={pkg.id}
                    className="bg-[#121212] rounded-3xl overflow-hidden border border-white/5 hover:border-gold-500/20 transition-all shadow-xl flex flex-col justify-between"
                  >
                    <div className="relative aspect-video">
                      <img 
                        src={pkg.image} 
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 px-2 py-1 bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-red-400 border border-red-500/25 rounded-md">
                        {pkg.id}
                      </span>
                    </div>

                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[9px] font-bold font-mono text-gray-400 tracking-wider block">
                          VALID: {pkg.dateRange}
                        </span>
                        <h4 className="font-serif font-bold text-lg text-gold-100 line-clamp-1">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {pkg.desc}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-gray-500 block uppercase font-mono">Harga Spesial</span>
                          <span className="text-base font-extrabold text-red-400">
                            Rp {pkg.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                        <button 
                          onClick={() => {
                            setActiveTab('menu');
                            showToast('Gastronomy Menu', `Silakan cari hidangan dalam ${pkg.title} untuk memesan.`, 'info');
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all border-0 cursor-pointer"
                        >
                          Pesan Paket
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outlets Locations Explorer Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#121212] to-[#181818] rounded-3xl p-8 sm:p-12 border border-white/5">
              <div className="max-w-3xl mb-10 space-y-2">
                <span className="text-xs font-bold font-mono text-gold-500 uppercase tracking-widest">Our Branch Network</span>
                <h3 className="text-3xl sm:text-4xl font-serif font-bold text-gold-100">Eksplorasi Lounge Cabang</h3>
                <p className="text-sm text-gray-400">
                  Semua outlet kami didesain mewah dengan memadukan unsur tradisional Indonesia dan gaya modern berkelas tinggi. Hubungi atau kunjungi kami langsung.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {outlets.map((outlet, idx) => (
                  <div 
                    key={idx}
                    className="bg-[#1c1c1c] p-6 rounded-2xl border border-white/5 hover:border-gold-500/20 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="p-3 bg-white/5 w-fit rounded-xl border border-white/10 text-gold-400">
                        <MapPin size={20} />
                      </div>
                      
                      <div className="space-y-1.5">
                        <h4 className="font-serif font-bold text-base text-gold-100">
                          {outlet.name}
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed min-h-[48px]">
                          {outlet.address}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3.5 pt-4 border-t border-white/5 mt-4">
                      <div className="space-y-1 text-[11px] text-gray-500 font-mono">
                        <div className="flex items-center space-x-1.5">
                          <Phone size={12} className="text-gold-500" />
                          <span>{outlet.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <Clock size={12} className="text-gold-500" />
                          <span>{outlet.hours}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {outlet.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="px-2 py-0.5 bg-red-950/40 border border-red-500/15 text-[9px] font-bold text-red-400 rounded-md font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button 
                        onClick={() => {
                          setActiveTab('menu');
                          showToast('Dapur Cabang', `Membuka menu masakan dari dapur ${outlet.name}.`, 'info');
                        }}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 text-gold-300 hover:text-white border border-gold-500/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Pesan Online Dari Sini
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Quote Section */}
            <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
              <div className="flex justify-center text-gold-500">
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
                <Star className="fill-current" size={20} />
              </div>
              <blockquote className="font-serif italic text-lg sm:text-2xl text-gray-300 leading-relaxed">
                "Cita rasa bumbu rempahnya meresap luar biasa sampai ke dalam daging. Sate Ayam Madura dan Nasi Padang Rendangnya adalah mahakarya terbaik masakan Indonesia yang pernah saya rasakan."
              </blockquote>
              <div className="space-y-0.5">
                <cite className="font-sans font-bold text-gold-300 not-italic text-sm uppercase tracking-widest">
                  Gourmet Magazine Indonesia
                </cite>
                <p className="text-xs text-gray-500 font-mono">Edisi Eksklusif Bintang 5</p>
              </div>
            </div>

          </div>
        )}

        {/* --- 2. THE GASTRONOMY MENU VIEW --- */}
        {activeTab === 'menu' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
            
            {/* Minimalist Header for Menu - Ritz-Carlton elegance */}
            <div className="text-center max-w-xl mx-auto space-y-3 py-6">
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-red-950/40 border border-red-500/15 text-red-400 rounded-full text-xs font-black tracking-widest uppercase font-mono">
                <UtensilsCrossed className="h-3 w-3 text-gold-500" />
                <span>The Culinary Selections</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gold-100 leading-tight">
                Menu Istimewa Tradisional
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
                Silakan jelajahi aneka kuliner Nusantara otentik kami. Semua bahan segar dicuci higienis dan dimasak segar oleh koki ahli kami langsung.
              </p>
            </div>

            {/* Filter, Search, and Sort Bar */}
            <div className="bg-[#121212] rounded-3xl border border-white/5 p-5 shadow-xl flex flex-col lg:flex-row gap-4 items-center justify-between">
              
              {/* Category selector */}
              <div className="flex space-x-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
                {['Semua', 'Makanan', 'Minuman', 'Cemilan'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4.5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all whitespace-nowrap cursor-pointer border-0 ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-red-700 to-red-800 text-gold-100 shadow-md ring-1 ring-gold-500/20'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300'
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
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    <Search className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari makanan / minuman..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:bg-white/10 transition-all"
                  />
                </div>

                {/* Sort selector */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto pl-3 pr-8 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer"
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
                  <div className="h-10 w-10 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-xs text-gray-400 font-mono">Mengambil data menu Nusantara dari Supabase...</p>
                </div>
              ) : filteredAndSortedMenu.length === 0 ? (
                <div className="bg-[#121212] rounded-3xl border border-white/5 py-16 text-center shadow-md">
                  <div className="p-4 bg-red-500/5 text-red-400 border border-red-500/10 rounded-full inline-block mb-3">
                    <ChefHat className="h-8 w-8" />
                  </div>
                  <h4 className="font-serif font-bold text-gold-100 text-lg">Hidangan Tidak Ditemukan</h4>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
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
                        showToast('Registrasi Akun VIP', 'Silakan buat akun atau masuk terlebih dahulu sebelum menambahkan hidangan Nusantara.', 'warning');
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 3. THE RESERVASI VIP FORM TAB --- */}
        {activeTab === 'reserve' && (
          <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
            <div className="bg-[#121212] rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
              <div className="h-2 bg-gradient-to-r from-red-700 to-gold-600"></div>
              
              <div className="p-8 sm:p-12">
                <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-gold-600/10 border border-gold-500/30 text-gold-400 rounded-full text-xs font-black tracking-widest uppercase font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>VIP Dining Lounge Book</span>
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gold-100">
                    Formulir Reservasi VIP Meja
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Ajukan pemesanan meja shabu group, privat karaoke suite, atau meja makan eksklusif keluarga di cabang restoran nusantara pilihan Anda.
                  </p>
                </div>

                {!user ? (
                  <div className="text-center py-10 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                    <AlertCircle className="h-10 w-10 text-red-400 mx-auto" />
                    <h4 className="font-serif font-bold text-gold-100 text-lg">Keanggotaan VIP Diperlukan</h4>
                    <p className="text-xs text-gray-400 max-w-xs mx-auto">
                      Silakan masuk ke portal keanggotaan Anda terlebih dahulu untuk menggunakan sistem booking real-time kami.
                    </p>
                    <button 
                      onClick={() => setActiveTab('auth')}
                      className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-md border-0 cursor-pointer"
                    >
                      Masuk VIP Sekarang
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReserveSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Name field */}
                      <div>
                        <label className="block text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1.5 font-mono">
                          Nama Lengkap Penanggung Jawab
                        </label>
                        <input 
                          type="text" 
                          value={reserveNama}
                          onChange={(e) => setReserveNama(e.target.value)}
                          placeholder="Masukkan nama lengkap"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                          required
                        />
                      </div>

                      {/* Phone field */}
                      <div>
                        <label className="block text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1.5 font-mono">
                          Nomor Telepon Seluler (WhatsApp)
                        </label>
                        <input 
                          type="tel" 
                          value={reserveTelepon}
                          onChange={(e) => setReserveTelepon(e.target.value)}
                          placeholder="Contoh: 0812XXXXXXXX"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                          required
                        />
                      </div>

                      {/* Outlet Branch selection */}
                      <div>
                        <label className="block text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1.5 font-mono">
                          Pilih Cabang Lounge Outlets
                        </label>
                        <select
                          value={reserveOutlet}
                          onChange={(e) => setReserveOutlet(e.target.value)}
                          className="w-full px-4 py-3 bg-[#1c1c1c] border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer"
                        >
                          <option value="Lounge Menteng (Main Castle)">Menteng, Jakarta Pusat (Pusat)</option>
                          <option value="Lounge Senopati (Fine Dining)">Senopati, Jakarta Selatan (Lounge)</option>
                          <option value="Lounge Pacific Place (Executive)">Pacific Place SCBD (Executive)</option>
                          <option value="Lounge Gading Serpong (Family)">Gading Serpong, Tangerang (Family)</option>
                        </select>
                      </div>

                      {/* Room Type package selection */}
                      <div>
                        <label className="block text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1.5 font-mono">
                          Pilih Paket Ruangan / Meja VIP
                        </label>
                        <select
                          value={reserveRuangan}
                          onChange={(e) => setReserveRuangan(e.target.value)}
                          className="w-full px-4 py-3 bg-[#1c1c1c] border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer"
                        >
                          <option value="Regular Dining Lounge (Hanamasa style)">Regular Dining Lounge (Hanamasa style)</option>
                          <option value="VIP Karaoke Room (Steak 21 style)">VIP Karaoke Suite Room (Steak 21 style)</option>
                          <option value="Executive Shabu-Shabu Group Table">Executive Shabu-Shabu Group Table</option>
                          <option value="The Union Bakery Private Conservatory">The Union Private Conservatory</option>
                          <option value="Ritz-Carlton Presidential Family Banquet">Ritz-Carlton Presidential Banquet</option>
                        </select>
                      </div>

                      {/* Date selection */}
                      <div>
                        <label className="block text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1.5 font-mono">
                          Tanggal Kedatangan
                        </label>
                        <input 
                          type="date" 
                          value={reserveTanggal}
                          onChange={(e) => setReserveTanggal(e.target.value)}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all cursor-pointer"
                          required
                        />
                      </div>

                      {/* Time selection */}
                      <div>
                        <label className="block text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1.5 font-mono">
                          Waktu Kedatangan (WIB)
                        </label>
                        <select
                          value={reserveWaktu}
                          onChange={(e) => setReserveWaktu(e.target.value)}
                          className="w-full px-4 py-3 bg-[#1c1c1c] border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer"
                        >
                          <option value="12:00">Makan Siang (12:00 WIB)</option>
                          <option value="13:00">Makan Siang (13:00 WIB)</option>
                          <option value="17:00">Sore (17:00 WIB)</option>
                          <option value="19:00">Makan Malam (19:00 WIB)</option>
                          <option value="20:00">Makan Malam (20:00 WIB)</option>
                        </select>
                      </div>

                      {/* Guest Count */}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1.5 font-mono">
                          Jumlah Tamu (Pax)
                        </label>
                        <div className="flex items-center space-x-3 bg-white/5 border border-white/10 p-2 rounded-xl w-fit">
                          <button 
                            type="button"
                            onClick={() => setReserveTamu(Math.max(1, reserveTamu - 1))}
                            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center font-bold bg-transparent border-0 text-white cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono font-bold text-sm text-gold-300 px-3">{reserveTamu} Tamu</span>
                          <button 
                            type="button"
                            onClick={() => setReserveTamu(Math.min(30, reserveTamu + 1))}
                            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center font-bold bg-transparent border-0 text-white cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                    </div>

                    <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
                      <p className="text-[11px] text-gray-500 leading-normal max-w-sm">
                        * Reservasi gratis tanpa biaya muka. Harap hadir 15 menit sebelum waktu reservasi untuk proses konfirmasi meja oleh Lounge Host kami.
                      </p>
                      
                      <button
                        type="submit"
                        className="px-8 py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-lg active:scale-95 transition-all border-0 cursor-pointer w-full sm:w-auto"
                      >
                        Ajukan Booking Lounge
                      </button>
                    </div>

                  </form>
                )}

              </div>
            </div>
          </div>
        )}

        {/* --- 4. MY BOOKINGS / VIP RESERVATIONS TICKET VIEW --- */}
        {activeTab === 'my-bookings' && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
            <div className="text-center max-w-xl mx-auto space-y-2 py-4">
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-gold-600/10 border border-gold-500/30 text-gold-400 rounded-full text-xs font-black tracking-widest uppercase font-mono">
                <CalendarCheck className="h-3.5 w-3.5" />
                <span>My Dining Reservations</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gold-100">
                Jadwal Reservasi Saya
              </h2>
              <p className="text-xs text-gray-400">
                Pantau tiket digital konfirmasi ruangan VIP dan shabu-shabu table Anda di bawah ini.
              </p>
            </div>

            {userReservations.length === 0 ? (
              <div className="bg-[#121212] rounded-3xl border border-white/5 p-12 text-center shadow-lg">
                <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <h4 className="font-serif font-bold text-gold-100 text-lg">Belum Ada Reservasi</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto leading-relaxed">
                  Anda belum memiliki riwayat reservasi ruang makan VIP. Silakan ajukan di tab "Reservasi VIP" di atas.
                </p>
                <button 
                  onClick={() => setActiveTab('reserve')}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md border-0 mt-5 cursor-pointer"
                >
                  Buat Reservasi Baru
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {userReservations.map((res) => (
                  <div 
                    key={res.id}
                    className="bg-[#121212] rounded-3xl border border-gold-800/20 overflow-hidden shadow-xl flex flex-col md:flex-row"
                  >
                    {/* Ticket Header styling */}
                    <div className="bg-gradient-to-br from-red-800 to-red-950 p-6 md:w-64 text-center md:text-left flex flex-col justify-between border-b md:border-b-0 md:border-r border-gold-800/30 relative">
                      {/* Circle punches on sides to simulate real ticket */}
                      <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-[#0a0a0a] rounded-full hidden md:block"></div>
                      <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-[#0a0a0a] rounded-full hidden md:block border-l border-gold-800/30"></div>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] font-black font-mono text-gold-300 tracking-widest block uppercase">
                          BOOKING TICKET
                        </span>
                        <h4 className="text-xl font-serif font-bold text-gold-100">
                          {res.id}
                        </h4>
                      </div>

                      <div className="pt-8 md:pt-0">
                        <span className="text-[9px] text-red-300 block uppercase font-mono">Status Ticket</span>
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider font-mono mt-1 ${
                          res.status === 'Telah Dikonfirmasi'
                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400'
                            : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                    </div>

                    {/* Ticket Body details */}
                    <div className="p-6 sm:p-8 flex-grow grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
                      
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-gray-500 block uppercase font-mono tracking-widest">Atas Nama</span>
                        <span className="text-sm font-bold text-white block">{res.nama}</span>
                        <span className="text-xs text-gray-400 font-mono">{res.telepon}</span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] text-gray-500 block uppercase font-mono tracking-widest">Outlet Lokasi</span>
                        <span className="text-sm font-bold text-gold-200 block">{res.outlet}</span>
                        <span className="text-xs text-gray-400 leading-tight block">{res.ruangan}</span>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] text-gray-500 block uppercase font-mono tracking-widest">Jadwal Kehadiran</span>
                        <span className="text-sm font-bold text-white block">{res.tanggal}</span>
                        <span className="text-xs text-red-400 font-mono font-bold block">Jam {res.waktu} WIB ({res.tamu} Pax)</span>
                      </div>

                      {/* Mock QR-Code inside ticket for extreme high-end feeling */}
                      <div className="sm:col-span-3 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-3 text-xs text-gray-400 font-mono">
                          <Eye size={16} className="text-gold-500" />
                          <span>Tunjukkan barcode di bawah ke Lounge Host untuk check-in meja Anda.</span>
                        </div>
                        
                        <div className="bg-white p-2 rounded-xl flex items-center justify-center border border-gold-800/30 shadow-md">
                          {/* Beautiful simulated pixel barcode using SVG */}
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950">
                            <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="2"/>
                            <rect x="3" y="3" width="2" height="2" fill="currentColor"/>
                            <rect x="17" y="1" width="6" height="6" stroke="currentColor" strokeWidth="2"/>
                            <rect x="19" y="3" width="2" height="2" fill="currentColor"/>
                            <rect x="1" y="17" width="6" height="6" stroke="currentColor" strokeWidth="2"/>
                            <rect x="3" y="19" width="2" height="2" fill="currentColor"/>
                            <rect x="9" y="1" width="2" height="2" fill="currentColor"/>
                            <rect x="13" y="5" width="2" height="2" fill="currentColor"/>
                            <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="2"/>
                            <rect x="11" y="11" width="2" height="2" fill="currentColor"/>
                            <rect x="17" y="13" width="2" height="2" fill="currentColor"/>
                            <rect x="21" y="9" width="2" height="2" fill="currentColor"/>
                            <rect x="9" y="17" width="2" height="2" fill="currentColor"/>
                            <rect x="13" y="21" width="2" height="2" fill="currentColor"/>
                            <rect x="17" y="17" width="6" height="6" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- 5. THE EPICUREAN BASKET (CART) VIEW --- */}
        {activeTab === 'cart' && (
          <CartView
            cart={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItemComplete}
            onCheckout={handleCheckout}
            onBackToMenu={() => setActiveTab('menu')}
          />
        )}

        {/* --- 6. THE CONCIERGE TRACKER (TRACKING) VIEW --- */}
        {activeTab === 'tracking' && (
          <TrackingMap
            order={activeUserOrder || (orders.length > 0 ? orders[0] : null)}
            onRefreshStatus={() => {
              showToast('Status Terkini', 'Mengambil pembaruan rute kurir real-time...', 'info');
            }}
          />
        )}

        {/* --- 7. THE ADMINISTRATIVE DASHBOARD (ADMIN) VIEW --- */}
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

        {/* --- 8. THE KOKI KITCHEN QUEUE VIEW --- */}
        {activeTab === 'koki' && user?.role === 'koki' && (
          <KokiDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* --- 9. THE KURIR VIP DELIVERY ROUTES VIEW --- */}
        {activeTab === 'kurir' && user?.role === 'kurir' && (
          <KurirDashboard
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* --- 10. AUTHENTICATION VIEW --- */}
        {activeTab === 'auth' && (
          <AuthView
            onAuthSuccess={handleAuthSuccess}
            onNotification={showToast}
          />
        )}
      </main>

      {/* Elegant Footer with Database Status and Info */}
      <footer className="bg-[#111111] text-gray-500 py-12 mt-16 border-t border-gold-800/20 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <h4 className="text-gold-100 font-serif font-bold text-base tracking-wide flex items-center space-x-2.5">
                <span className="p-2 bg-gradient-to-r from-red-700 to-gold-600 text-white rounded-lg ring-1 ring-gold-500/20">
                  <Utensils size={16} />
                </span>
                <span>Restoran Nusantara App</span>
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                Mengintegrasikan seni kuliner pusaka nusantara (Sabang sampai Merauke) dengan teknologi digital real-time, menyajikan kenyamanan kuliner langsung ke pintu rumah Anda.
              </p>
            </div>
            
            <div className="space-y-3.5">
              <h5 className="text-gold-500 font-black text-xs uppercase tracking-widest font-mono">Restoran Info</h5>
              <p className="text-xs text-gray-400">Setiap Hari: 09:00 - 22:00 WIB</p>
              <p className="text-xs text-gray-400">Dapur Utama: Menteng, Jakarta Pusat</p>
              <p className="text-xs text-gray-400">Layanan VIP Pengantaran: Jabodetabek</p>
            </div>

            <div className="space-y-4">
              <h5 className="text-gold-500 font-black text-xs uppercase tracking-widest font-mono">Supabase Connected</h5>
              <p className="text-xs text-gray-400 leading-relaxed">
                Supabase PostgreSQL API Status: <br />
                <code className="text-[10px] bg-black text-yellow-300 px-2 py-1 border border-gold-800/20 rounded block mt-2 overflow-x-auto select-all">
                  aqatbxdspyzufzsuskjd.supabase.co
                </code>
              </p>
            </div>
          </div>
          
          <div className="border-t border-white/5 mt-10 pt-6 text-center text-xs text-gray-600 font-mono">
            &copy; {new Date().getFullYear()} Restoran Nusantara - Luxury Culinary Delivery. Hak Cipta Dilindungi Undang-Undang.
          </div>
        </div>
      </footer>

      {/* --- FLOATING WHATSAPP CHAT WIDGET - Ref Steak 21 image "Whatsapp (Chat Only)" --- */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center space-x-2 p-3 bg-gradient-to-r from-[#25d366] to-[#128c7e] text-white rounded-full shadow-2xl hover:scale-105 transition-transform animate-bounce cursor-pointer border-0 ring-4 ring-green-950/40"
          >
            <MessageSquare size={24} />
            <span className="text-xs font-bold font-sans pr-2 hidden sm:inline">Concierge Support</span>
          </button>
        ) : (
          <div className="w-80 sm:w-96 bg-[#161616] rounded-3xl shadow-2xl border border-gold-800/40 overflow-hidden flex flex-col animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#128c7e] to-[#075e54] p-4 text-white flex items-center justify-between border-b border-gold-800/20">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center text-lg font-serif">
                    👨‍🍳
                  </div>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-[#161616]"></span>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Concierge Restoran Nusantara</h4>
                  <p className="text-[10px] text-green-200">Mitra Asisten VIP (Online)</p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-gray-300 hover:text-white bg-transparent border-0 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat History */}
            <div className="p-4 h-64 overflow-y-auto space-y-3 flex flex-col scrollbar-none bg-[#0e0e0e]">
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx}
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-red-800 to-red-950 text-white self-end rounded-tr-none'
                      : 'bg-white/5 text-gray-200 self-start rounded-tl-none border border-white/5'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[8px] text-gray-500 font-mono block text-right mt-1.5">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-[#161616] border-t border-white/5 flex items-center space-x-2">
              <input 
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Tanyakan sesuatu..."
                className="flex-grow bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-gold-500 placeholder-gray-500"
              />
              <button 
                type="submit"
                className="p-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 rounded-xl transition-all border-0 cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
