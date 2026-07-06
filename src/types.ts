export interface MenuItem {
  id?: string | number;
  nama_menu: string;
  deskripsi: string;
  harga: number;
  kategori?: string; // 'Makanan' | 'Minuman' | 'Cemilan'
  gambar?: string;
  tersedia?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface User {
  id: string;
  nama: string;
  email: string;
  role: 'customer' | 'admin' | 'koki' | 'kurir' | 'user';
}

export interface Order {
  id: string;
  pembeli: {
    nama: string;
    email: string;
  };
  items: CartItem[];
  totalHarga: number;
  metodePembayaran: string;
  status: 'Pesanan Diterima' | 'Sedang Dimasak' | 'Sedang Diantar' | 'Tiba di Lokasi';
  waktuPemesanan: string;
  lokasiTujuan: {
    nama: string;
    lat: number;
    lng: number;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning';
}
