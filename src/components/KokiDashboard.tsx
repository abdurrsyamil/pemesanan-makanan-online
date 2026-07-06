import React from 'react';
import { ChefHat, ClipboardList, Clock, CheckCircle2, Play, AlertCircle, Utensils, Award } from 'lucide-react';
import { Order } from '../types';

interface KokiDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export default function KokiDashboard({ orders, onUpdateOrderStatus }: KokiDashboardProps) {
  // Filter active kitchen orders
  const activeOrders = orders.filter(
    (order) => order.status === 'Pesanan Diterima' || order.status === 'Sedang Dimasak'
  );

  const completedKitchenOrders = orders.filter(
    (order) => order.status === 'Sedang Diantar' || order.status === 'Tiba di Lokasi'
  );

  // Consolidate list of items to cook
  const getCookingSummary = () => {
    const summary: { [key: string]: number } = {};
    activeOrders.forEach((order) => {
      order.items.forEach((item) => {
        const name = item.menuItem.nama_menu;
        summary[name] = (summary[name] || 0) + item.quantity;
      });
    });
    return Object.entries(summary);
  };

  const cookingSummary = getCookingSummary();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-amber-500 to-yellow-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
          <ChefHat className="h-48 w-48 -mr-10 -mb-10 rotate-12" />
        </div>
        <div className="relative z-10">
          <span className="inline-flex items-center space-x-1 px-3 py-1 bg-white/20 rounded-full text-xs font-bold font-mono uppercase mb-3">
            <Award className="h-3.5 w-3.5 text-yellow-200 animate-pulse" />
            <span>Dapur Utama Nusantara</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Dashboard Koki (Chef Portal)
          </h2>
          <p className="text-xs sm:text-sm text-red-50 mt-1 max-w-xl font-mono">
            Pantau pesanan masuk, persiapkan rempah-rempah autentik, dan koordinasikan masakan hangat untuk segera dijemput kurir.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cooking Summary slip */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-md font-bold text-gray-800 flex items-center space-x-2 border-b border-gray-100 pb-4 mb-4">
              <ClipboardList className="h-5 w-5 text-red-600" />
              <span>Ringkasan Masakan (Antrean)</span>
            </h3>

            {cookingSummary.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Utensils className="h-10 w-10 mx-auto text-gray-300 mb-2 animate-bounce" />
                <p className="text-xs">Tidak ada hidangan aktif yang perlu dimasak saat ini.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 mb-2 font-mono">Total porsi yang harus dipersiapkan koki dapur:</p>
                {cookingSummary.map(([name, qty]) => (
                  <div key={name} className="flex justify-between items-center p-3 bg-red-50/50 rounded-xl border border-red-100">
                    <span className="text-sm font-semibold text-gray-800">{name}</span>
                    <span className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-black font-mono">
                      {qty}x Porsi
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kitchen Stats */}
          <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-2xl border border-red-100 p-6 shadow-inner grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white rounded-xl border border-red-50">
              <span className="block text-2xl font-black text-red-600 font-mono">
                {activeOrders.filter(o => o.status === 'Pesanan Diterima').length}
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Perlu Dimasak</span>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-red-50">
              <span className="block text-2xl font-black text-amber-500 font-mono">
                {activeOrders.filter(o => o.status === 'Sedang Dimasak').length}
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Sedang Dimasak</span>
            </div>
            <div className="text-center p-3 bg-white rounded-xl border border-red-50 col-span-2">
              <span className="block text-2xl font-black text-green-600 font-mono">
                {completedKitchenOrders.length}
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Selesai Hari Ini</span>
            </div>
          </div>
        </div>

        {/* Right Column: Active Kitchen Orders Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-amber-500" />
              <span>Daftar Antrean Masak ({activeOrders.length})</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">Waktu Server: Real-time</span>
          </div>

          {activeOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center shadow-sm">
              <div className="p-4 bg-green-50 text-green-500 rounded-full inline-block mb-3">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-gray-800">Dapur Bersih & Rapi!</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Seluruh pesanan pelanggan telah matang dan berada di tangan kurir pengantaran. Santai sejenak selagi menunggu pesanan baru masuk.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {activeOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden ${
                    order.status === 'Sedang Dimasak' ? 'border-amber-400 ring-2 ring-amber-100' : 'border-gray-200'
                  }`}
                >
                  {/* Card Header Info */}
                  <div className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    order.status === 'Sedang Dimasak' ? 'bg-amber-50/50' : 'bg-slate-50'
                  }`}>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-black text-slate-800 font-mono">{order.id}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase font-mono ${
                          order.status === 'Sedang Dimasak'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Dipesan pada: <span className="font-semibold">{order.waktuPemesanan}</span> &bull; Pembeli: <span className="font-semibold text-gray-700">{order.pembeli.nama}</span>
                      </p>
                    </div>

                    {/* Quick status controls */}
                    <div className="flex items-center space-x-2 self-start sm:self-center">
                      {order.status === 'Pesanan Diterima' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'Sedang Dimasak')}
                          className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95 flex items-center space-x-1 cursor-pointer"
                        >
                          <Play size={14} className="fill-white" />
                          <span>Mulai Memasak</span>
                        </button>
                      )}

                      {order.status === 'Sedang Dimasak' && (
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'Sedang Diantar')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow transition-all active:scale-95 flex items-center space-x-1 cursor-pointer"
                        >
                          <CheckCircle2 size={14} />
                          <span>Selesai & Kirim</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* List of food inside this order */}
                  <div className="p-5 border-t border-gray-100 divide-y divide-gray-50">
                    {order.items.map((item) => (
                      <div key={item.menuItem.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.menuItem.gambar}
                            alt={item.menuItem.nama_menu}
                            className="h-10 w-10 object-cover rounded-lg border border-gray-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-gray-800 text-sm">{item.menuItem.nama_menu}</span>
                            <span className="block text-slate-400 text-[11px] max-w-sm truncate">{item.menuItem.deskripsi}</span>
                          </div>
                        </div>
                        <span className="text-sm font-black font-mono text-red-600 bg-red-50 px-2 py-1 rounded">
                          {item.quantity}x
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Customer Note / Payment */}
                  <div className="px-5 py-3 bg-slate-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-mono">
                    <span>Metode: <strong className="text-gray-700 uppercase">{order.metodePembayaran}</strong></span>
                    <span>Tujuan: <strong className="text-gray-700">{order.lokasiTujuan.nama}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
