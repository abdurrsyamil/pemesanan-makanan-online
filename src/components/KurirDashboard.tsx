import React, { useState } from 'react';
import { Truck, MapPin, CheckCircle2, DollarSign, Clock, Navigation, Phone, User, Compass } from 'lucide-react';
import { Order } from '../types';

interface KurirDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export default function KurirDashboard({ orders, onUpdateOrderStatus }: KurirDashboardProps) {
  const [selectedRouteOrder, setSelectedRouteOrder] = useState<Order | null>(null);

  // Available for pickup
  const pickableOrders = orders.filter((order) => order.status === 'Sedang Dimasak');
  // Currently delivering by this driver
  const deliveringOrders = orders.filter((order) => order.status === 'Sedang Diantar');
  // Completed deliveries
  const completedDeliveries = orders.filter((order) => order.status === 'Tiba di Lokasi');

  // Calculate daily courier stats
  const deliveryCommission = completedDeliveries.length * 12000; // Rp 12,000 flat commission per order!

  const handlePickUp = (order: Order) => {
    onUpdateOrderStatus(order.id, 'Sedang Diantar');
    setSelectedRouteOrder(order);
  };

  const handleComplete = (order: Order) => {
    onUpdateOrderStatus(order.id, 'Tiba di Lokasi');
    if (selectedRouteOrder?.id === order.id) {
      setSelectedRouteOrder(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-amber-500 to-yellow-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
          <Truck className="h-48 w-48 -mr-10 -mb-10 rotate-6" />
        </div>
        <div className="relative z-10">
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white/20 rounded-full text-xs font-bold font-mono uppercase mb-3">
            <Compass className="h-3.5 w-3.5 text-yellow-200 animate-spin-slow" />
            <span>Mitra Driver Nusantara</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Kurir (Driver Portal)
          </h2>
          <p className="text-xs sm:text-sm text-red-50 mt-1 max-w-xl font-mono">
            Ambil masakan hangat dari dapur Menteng, navigasikan rute tercepat, dan antarkan kebahagiaan kuliner Nusantara kepada pelanggan setia kita.
          </p>
        </div>
      </div>

      {/* Courier Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-700 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-mono">Pemasukan Hari Ini</span>
            <span className="text-xl font-extrabold text-gray-800 font-mono">
              Rp {deliveryCommission.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-mono">Dapur Memasak</span>
            <span className="text-xl font-extrabold text-gray-800 font-mono">
              {pickableOrders.length} Pesanan
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-mono">Sedang Diantar</span>
            <span className="text-xl font-extrabold text-gray-800 font-mono">
              {deliveringOrders.length} Pesanan
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-700 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-mono">Selesai Diantar</span>
            <span className="text-xl font-extrabold text-gray-800 font-mono">
              {completedDeliveries.length} Pesanan
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: List of Delivery Jobs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Active Deliveries */}
          <div className="space-y-4">
            <h3 className="text-md font-extrabold text-gray-800 flex items-center space-x-2">
              <span className="h-2.5 w-2.5 bg-blue-600 rounded-full animate-ping"></span>
              <span>Tugas Pengantaran Aktif ({deliveringOrders.length})</span>
            </h3>

            {deliveringOrders.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 text-center text-gray-400 text-xs">
                Tidak ada pengantaran aktif saat ini. Silakan ambil pesanan dari antrean dapur di bawah.
              </div>
            ) : (
              <div className="space-y-4">
                {deliveringOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-blue-200 ring-2 ring-blue-50 p-6 space-y-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-black text-slate-800 font-mono text-sm">{order.id}</span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-black uppercase font-mono">
                            Dalam Perjalanan
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Nama Pelanggan: <strong className="text-gray-700">{order.pembeli.nama}</strong> ({order.pembeli.email})
                        </p>
                      </div>

                      <button
                        onClick={() => handleComplete(order)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95 flex items-center space-x-1 cursor-pointer"
                      >
                        <CheckCircle2 size={14} />
                        <span>Selesaikan Pengantaran</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100 text-xs">
                      <div className="space-y-1.5">
                        <span className="text-slate-400 block font-mono">📌 Alamat Penerima:</span>
                        <p className="text-gray-700 font-semibold flex items-center space-x-1">
                          <MapPin size={14} className="text-red-500 shrink-0" />
                          <span>{order.lokasiTujuan.nama}</span>
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-slate-400 block font-mono">💰 Pembayaran & Ongkir:</span>
                        <p className="text-gray-700 font-semibold">
                          Metode: <strong className="uppercase">{order.metodePembayaran}</strong> &bull; Total: Rp {order.totalHarga.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <button
                        onClick={() => setSelectedRouteOrder(order)}
                        className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center space-x-1 cursor-pointer"
                      >
                        <Navigation size={12} className="text-red-600 animate-pulse" />
                        <span>Buka Navigasi Rute Peta</span>
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono">Komisi Anda: Rp 12.000</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Pickable Orders from Kitchen */}
          <div className="space-y-4 pt-4">
            <h3 className="text-md font-extrabold text-gray-800 flex items-center space-x-2">
              <span className="h-2.5 w-2.5 bg-yellow-500 rounded-full"></span>
              <span>Antrean Makanan Matang di Dapur ({pickableOrders.length})</span>
            </h3>

            {pickableOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 py-12 text-center text-gray-400 text-xs">
                Dapur belum menyelesaikan masakan apa pun saat ini. Silakan tunggu sebentar.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pickableOrders.map((order) => (
                  <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-sm hover:border-amber-400 transition-all">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800 font-mono">{order.id}</span>
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-[9px] font-bold uppercase font-mono">
                          Matang & Siap
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        Tujuan: <strong>{order.lokasiTujuan.nama}</strong>
                      </p>
                    </div>

                    <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-gray-100 max-h-24 overflow-y-auto">
                      <span className="text-[10px] text-slate-400 uppercase block font-mono mb-1">Item Hidangan:</span>
                      {order.items.map((it) => (
                        <div key={it.menuItem.id} className="flex justify-between text-gray-600 text-[11px]">
                          <span className="truncate">{it.menuItem.nama_menu}</span>
                          <span className="font-bold">x{it.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePickUp(order)}
                      className="w-full py-2 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-98 flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <Truck size={14} />
                      <span>Ambil Pesanan & Antar</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mini Navigation / Map Simulation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h3 className="text-md font-bold text-gray-800 flex items-center space-x-2 border-b border-gray-100 pb-4">
              <Navigation className="h-5 w-5 text-red-600" />
              <span>Simulasi Navigasi GPS</span>
            </h3>

            {selectedRouteOrder ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-red-50 to-amber-50/50 p-4 rounded-xl border border-red-100 text-xs space-y-2">
                  <p className="font-semibold text-red-800">NAVIGASI AKTIF: {selectedRouteOrder.id}</p>
                  <p className="text-gray-600">
                    Dari: <strong className="text-gray-700">Dapur Utama Menteng</strong>
                  </p>
                  <p className="text-gray-600">
                    Menuju: <strong className="text-gray-700">{selectedRouteOrder.lokasiTujuan.nama}</strong>
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    Perkiraan jarak tempuh: ~4.2 KM. Waktu tempuh: ~12 menit menggunakan sepeda motor Mitra.
                  </p>
                </div>

                {/* Simulated Visual Route Progress */}
                <div className="relative border-l-2 border-dashed border-red-400 pl-4 space-y-6 py-2 ml-2">
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0 h-2 w-2 rounded-full bg-green-500 ring-4 ring-green-100"></span>
                    <p className="text-xs font-bold text-gray-700">Dapur Nusantara Menteng</p>
                    <p className="text-[10px] text-gray-400">Pesanan telah disiapkan koki</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0 h-2 w-2 rounded-full bg-red-600 ring-4 ring-red-100 animate-pulse"></span>
                    <p className="text-xs font-bold text-gray-700">Driver Sedang Mengantar</p>
                    <p className="text-[10px] text-gray-400">Kurir meluncur membawa makanan hangat</p>
                  </div>
                  <div className="relative opacity-60">
                    <span className="absolute -left-[21px] top-0 h-2 w-2 rounded-full bg-gray-300"></span>
                    <p className="text-xs font-bold text-gray-400">Tiba di Lokasi Tujuan</p>
                    <p className="text-[10px] text-gray-400">Hubungi penerima untuk serah terima</p>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-700 flex items-center space-x-1">
                    <Phone size={13} className="text-green-600" />
                    <span>Hubungi Pelanggan:</span>
                  </p>
                  <div className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between text-xs text-gray-600">
                    <span className="font-semibold">{selectedRouteOrder.pembeli.nama}</span>
                    <span className="font-mono text-[11px] text-green-700 select-all">+62 812-3456-7890</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 text-xs">
                <Compass className="h-12 w-12 text-gray-300 mx-auto mb-3 animate-spin-slow" />
                <p>Belum ada rute aktif. Pilih salah satu tugas pengantaran aktif dan klik "Buka Navigasi Rute Peta" untuk memunculkan panduan GPS.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
