import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Ticket, ShieldCheck, CreditCard, ChevronRight, MapPin } from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (itemId: string | number, delta: number) => void;
  onRemoveItem: (itemId: string | number) => void;
  onCheckout: (metodePembayaran: string, alamatTujuan: string) => void;
  onBackToMenu: () => void;
}

export default function CartView({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onBackToMenu,
}: CartViewProps) {
  const [metodePembayaran, setMetodePembayaran] = useState('gopay');
  const [alamat, setAlamat] = useState('Jl. Jenderal Sudirman No. 45, Jakarta Selatan');
  const [isAlamatEditing, setIsAlamatEditing] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [isVoucherApplied, setIsVoucherApplied] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.menuItem.harga * item.quantity, 0);
  const ongkosKirim = subtotal > 0 ? 12000 : 0;
  const biayaLayanan = subtotal > 0 ? 2000 : 0;
  const diskon = isVoucherApplied ? Math.min(15000, subtotal * 0.1) : 0; // 10% discount up to 15k
  const total = subtotal + ongkosKirim + biayaLayanan - diskon;

  const handleApplyVoucher = () => {
    if (voucherCode.toLowerCase() === 'nusantara' || voucherCode.toLowerCase() === 'merdeka') {
      setIsVoucherApplied(true);
    } else {
      alert('Kode voucher tidak valid! Coba gunakan kode "NUSANTARA"');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    onCheckout(metodePembayaran, alamat);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex p-5 bg-orange-50 text-orange-500 rounded-full mb-4 ring-8 ring-orange-50/50">
          <ShoppingCart className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Keranjang Belanja Kosong</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
          Seleramu sedang menunggumu! Jelajahi menu lezat kami dan tambahkan hidangan favoritmu sekarang.
        </p>
        <button
          onClick={onBackToMenu}
          className="mt-6 px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
        >
          Lihat Menu Lezat
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
        <ShoppingCart className="h-6 w-6 text-red-600" />
        <span>Keranjang Belanja Anda</span>
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - List of Items */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
              Daftar Pesanan ({cart.length} item)
            </h3>
            
            {cart.map((item) => (
              <div
                key={item.menuItem.id}
                className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                {/* Item Image */}
                <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 bg-gray-50">
                  <img
                    src={item.menuItem.gambar}
                    alt={item.menuItem.nama_menu}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 truncate text-sm sm:text-base">
                    {item.menuItem.nama_menu}
                  </h4>
                  <p className="text-xs text-orange-600 font-bold font-mono mt-0.5">
                    Rp {item.menuItem.harga.toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Action buttons (Quantity counter) */}
                <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => onUpdateQuantity(item.menuItem.id!, -1)}
                    className="p-1 rounded-lg hover:bg-white text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-bold font-mono px-2 text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.menuItem.id!, 1)}
                    className="p-1 rounded-lg hover:bg-white text-gray-600 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Remove completely */}
                <button
                  onClick={() => onRemoveItem(item.menuItem.id!)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Hapus hidangan"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Delivery Address Box */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-red-500" />
                <span>Alamat Pengiriman</span>
              </h3>
              <button
                onClick={() => setIsAlamatEditing(!isAlamatEditing)}
                className="text-xs text-orange-600 hover:text-red-600 font-bold cursor-pointer"
              >
                {isAlamatEditing ? 'Simpan' : 'Ubah Alamat'}
              </button>
            </div>
            {isAlamatEditing ? (
              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                rows={3}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                placeholder="Tulis alamat lengkap Anda untuk mempermudah driver..."
              />
            ) : (
              <p className="text-sm text-gray-600 bg-orange-50/40 p-3 rounded-xl border border-orange-100/30 leading-relaxed">
                {alamat}
              </p>
            )}
          </div>
        </div>

        {/* Right Column - Billing & Checkout details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Voucher Box */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center space-x-2">
              <Ticket className="h-4 w-4 text-red-500" />
              <span>Gunakan Voucher Promo</span>
            </h3>
            <div className="flex space-x-2">
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Kode Promo (cth: NUSANTARA)"
                disabled={isVoucherApplied}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all uppercase placeholder-gray-400 font-mono"
              />
              <button
                onClick={handleApplyVoucher}
                disabled={isVoucherApplied || !voucherCode}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold rounded-xl shadow hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
              >
                Terapkan
              </button>
            </div>
            {isVoucherApplied && (
              <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center space-x-1">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>Voucher Berhasil! Diskon 10% (Hemat Rp {diskon.toLocaleString('id-ID')}) diterapkan.</span>
              </p>
            )}
          </div>

          {/* Checkout & Payment Box */}
          <form onSubmit={handleCheckoutSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Metode Pembayaran Digital
            </h3>

            {/* Popular E-Wallets Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'gopay', label: 'GoPay', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500' },
                { id: 'ovo', label: 'OVO', color: 'bg-purple-50 text-purple-700 border-purple-200 ring-purple-500' },
                { id: 'dana', label: 'DANA', color: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500' },
                { id: 'linkaja', label: 'LinkAja', color: 'bg-red-50 text-red-700 border-red-200 ring-red-500' },
              ].map((wallet) => (
                <label
                  key={wallet.id}
                  className={`flex items-center space-x-2.5 p-3.5 border rounded-xl cursor-pointer transition-all ${
                    metodePembayaran === wallet.id
                      ? `${wallet.color} border-transparent ring-2 font-bold scale-[1.02]`
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={wallet.id}
                    checked={metodePembayaran === wallet.id}
                    onChange={() => setMetodePembayaran(wallet.id)}
                    className="sr-only"
                  />
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${metodePembayaran === wallet.id ? 'border-current' : 'border-gray-300'}`}>
                    {metodePembayaran === wallet.id && <div className="h-2 w-2 rounded-full bg-current"></div>}
                  </div>
                  <span className="text-xs uppercase font-mono tracking-wider">{wallet.label}</span>
                </label>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-gray-100 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal Hidangan</span>
                <span className="font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Ongkos Kirim</span>
                <span className="font-mono">Rp {ongkosKirim.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Biaya Layanan</span>
                <span className="font-mono">Rp {biayaLayanan.toLocaleString('id-ID')}</span>
              </div>
              {diskon > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Potongan Diskon</span>
                  <span className="font-mono">- Rp {diskon.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-gray-800 text-base pt-3 border-t border-dashed border-gray-200">
                <span>Total Pembayaran</span>
                <span className="text-red-600 font-mono text-lg">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Place Order button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] active:scale-98 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CreditCard className="h-5 w-5" />
              <span>Bayar & Pesan Sekarang</span>
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center space-x-1.5 text-center text-[10px] text-gray-400 font-mono">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Keamanan pembayaran terenkripsi oleh SSL Nusantara</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
