import React, { useState } from 'react';
import { Plus, Database, ToggleLeft, ToggleRight, Trash2, Edit2, ListOrdered, ClipboardList, CheckCircle2, ShoppingBag, Truck, ChefHat, Save, X, Sparkles, RefreshCw } from 'lucide-react';
import { MenuItem, Order } from '../types';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  onAddMenuItem: (item: Partial<MenuItem>) => Promise<void>;
  onUpdateMenuItem: (id: string | number, item: Partial<MenuItem>) => Promise<void>;
  onDeleteMenuItem: (id: string | number) => Promise<void>;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onRefreshMenu: () => void;
}

export default function AdminDashboard({
  menuItems,
  onAddMenuItem,
  onUpdateMenuItem,
  onDeleteMenuItem,
  orders,
  onUpdateOrderStatus,
  onRefreshMenu,
}: AdminDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<'database' | 'orders'>('database');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  // Form Fields for adding
  const [nama_menu, setNamaMenu] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [kategori, setKategori] = useState('Makanan');
  const [gambar, setGambar] = useState('');

  // Fields for inline editing
  const [editHarga, setEditHarga] = useState('');
  const [editDeskripsi, setEditDeskripsi] = useState('');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama_menu || !harga) return;

    await onAddMenuItem({
      nama_menu,
      deskripsi,
      harga: Number(harga),
      kategori,
      gambar: gambar || undefined,
    });

    // Reset Form
    setNamaMenu('');
    setDeskripsi('');
    setHarga('');
    setKategori('Makanan');
    setGambar('');
    setIsAdding(false);
  };

  const startInlineEdit = (item: MenuItem) => {
    setEditingId(item.id!);
    setEditHarga(String(item.harga));
    setEditDeskripsi(item.deskripsi);
  };

  const saveInlineEdit = async (id: string | number) => {
    await onUpdateMenuItem(id, {
      harga: Number(editHarga) || 0,
      deskripsi: editDeskripsi,
    });
    setEditingId(null);
  };

  const toggleAvailability = async (item: MenuItem) => {
    await onUpdateMenuItem(item.id!, {
      tersedia: !item.tersedia,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Heading Banner */}
      <div className="bg-gradient-to-r from-red-700 via-amber-500 to-yellow-500 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Database className="h-48 w-48 -mr-10 -mb-10" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              Dashboard Admin Restoran Nusantara
            </h2>
            <p className="text-xs sm:text-sm text-red-50 font-mono">
              Kelola Database Hidangan & Pantau Status Pesanan Pelanggan Secara Real-time
            </p>
          </div>
          <button
            onClick={onRefreshMenu}
            className="mt-4 md:mt-0 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 self-start cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Sinkronkan Supabase</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Selectors */}
      <div className="flex border-b border-gray-200 mb-6 space-x-4">
        <button
          onClick={() => setActiveSubTab('database')}
          className={`pb-3 text-sm font-bold tracking-wide border-b-2 transition-all flex items-center space-x-1.5 cursor-pointer ${
            activeSubTab === 'database'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Database className="h-4 w-4" />
          <span>Kelola Menu Database ({menuItems.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`pb-3 text-sm font-bold tracking-wide border-b-2 transition-all flex items-center space-x-1.5 relative cursor-pointer ${
            activeSubTab === 'orders'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          <span>Pantau Pesanan Aktif ({orders.length})</span>
          {orders.some(o => o.status !== 'Tiba di Lokasi') && (
            <span className="absolute top-1.5 -right-3 h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          )}
        </button>
      </div>

      {/* SUB TAB 1: MANAGE DATABASE FOODS */}
      {activeSubTab === 'database' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">
              Daftar Hidangan & Minuman Supabase
            </h3>
            {!isAdding && (
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-gradient-to-r from-red-700 to-amber-500 hover:from-red-800 hover:to-amber-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Menu Baru</span>
              </button>
            )}
          </div>

          {/* Add Menu Form */}
          {isAdding && (
            <form
              onSubmit={handleAddSubmit}
              className="bg-red-50/40 rounded-2xl border border-red-100 p-6 shadow-sm space-y-4 animate-fade-in"
            >
              <div className="flex justify-between items-center pb-2 border-b border-red-200/30">
                <h4 className="font-bold text-red-950 flex items-center space-x-1">
                  <Sparkles className="h-4 w-4 text-red-600" />
                  <span>Form Tambah Menu Baru ke Database</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="p-1 hover:bg-red-100 rounded-full text-red-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <label className="block text-xs font-bold text-red-900 mb-1">Nama Menu</label>
                  <input
                    type="text"
                    required
                    value={nama_menu}
                    onChange={(e) => setNamaMenu(e.target.value)}
                    placeholder="Contoh: Es Campur Nusantara"
                    className="w-full px-3 py-2 bg-white border border-red-100 rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-red-900 mb-1">Harga (IDR)</label>
                  <input
                    type="number"
                    required
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    placeholder="Contoh: 15000"
                    className="w-full px-3 py-2 bg-white border border-red-100 rounded-xl text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-orange-900 mb-1">Kategori</label>
                  <select
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="Makanan">Makanan Utama</option>
                    <option value="Minuman">Minuman Segar</option>
                    <option value="Cemilan">Cemilan Ringan</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-bold text-orange-900 mb-1">URL Gambar (Opsional)</label>
                  <input
                    type="url"
                    value={gambar}
                    onChange={(e) => setGambar(e.target.value)}
                    placeholder="Kosongkan untuk auto-gambar Unsplash"
                    className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-12">
                  <label className="block text-xs font-bold text-orange-900 mb-1">Deskripsi Kuliner</label>
                  <textarea
                    rows={2}
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Deskripsikan cita rasa hidangan..."
                    className="w-full px-3 py-2 bg-white border border-orange-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold text-xs rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Simpan ke Supabase
                </button>
              </div>
            </form>
          )}

          {/* Database Grid */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-orange-50 border-b border-orange-100 text-xs font-bold text-orange-850 uppercase tracking-wider font-mono">
                    <th className="py-4 px-6">Hidangan</th>
                    <th className="py-4 px-6">Kategori</th>
                    <th className="py-4 px-6">Harga</th>
                    <th className="py-4 px-6">Deskripsi</th>
                    <th className="py-4 px-6 text-center">Tersedia</th>
                    <th className="py-4 px-6 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-sm">
                  {menuItems.map((item) => (
                    <tr key={item.id} className="hover:bg-orange-50/20 transition-colors">
                      {/* Name / Pic */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <img
                            src={item.gambar}
                            alt={item.nama_menu}
                            className="h-10 w-10 rounded-lg object-cover bg-gray-100 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-gray-800 block">{item.nama_menu}</span>
                            <span className="text-[10px] text-gray-400 font-mono">ID: {item.id}</span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 font-mono text-xs">
                        <span className="px-2.5 py-0.5 bg-orange-100 text-orange-800 rounded-full font-semibold">
                          {item.kategori || 'Makanan'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6">
                        {editingId === item.id ? (
                          <input
                            type="number"
                            value={editHarga}
                            onChange={(e) => setEditHarga(e.target.value)}
                            className="w-24 px-2 py-1 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-mono"
                          />
                        ) : (
                          <span className="font-bold font-mono text-gray-700">
                            Rp {item.harga.toLocaleString('id-ID')}
                          </span>
                        )}
                      </td>

                      {/* Description */}
                      <td className="py-4 px-6 max-w-xs">
                        {editingId === item.id ? (
                          <textarea
                            value={editDeskripsi}
                            onChange={(e) => setEditDeskripsi(e.target.value)}
                            rows={1}
                            className="w-full px-2 py-1 bg-white border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        ) : (
                          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                            {item.deskripsi}
                          </p>
                        )}
                      </td>

                      {/* Availability Toggle */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => toggleAvailability(item)}
                          className="p-1 rounded transition-transform active:scale-95 focus:outline-none text-orange-500 cursor-pointer"
                        >
                          {item.tersedia ? (
                            <ToggleRight className="h-7 w-7 text-emerald-500" />
                          ) : (
                            <ToggleLeft className="h-7 w-7 text-gray-300" />
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right space-x-1 shrink-0">
                        {editingId === item.id ? (
                          <div className="flex justify-end space-x-1">
                            <button
                              onClick={() => saveInlineEdit(item.id!)}
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors cursor-pointer"
                              title="Simpan"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors cursor-pointer"
                              title="Batal"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end space-x-1">
                            <button
                              onClick={() => startInlineEdit(item)}
                              className="p-1.5 bg-gray-50 hover:bg-orange-50 text-gray-500 hover:text-orange-600 rounded-lg transition-colors cursor-pointer"
                              title="Edit Harga & Deskripsi"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Apakah Anda yakin ingin menghapus "${item.nama_menu}" dari database?`)) {
                                  onDeleteMenuItem(item.id!);
                                }
                              }}
                              className="p-1.5 bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Hidangan"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: ACTIVE ORDERS MONITOR */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">
              Antrean Pesanan Masuk (Real-time Simulation)
            </h3>
            <span className="text-xs text-gray-500 font-mono">
              Total: {orders.length} pesanan aktif
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-150 p-12 text-center shadow-sm">
              <div className="p-4 bg-orange-50 text-orange-400 rounded-full inline-block mb-3">
                <ListOrdered className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-gray-800">Belum Ada Pesanan Masuk</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Ketika pelanggan memesan dari keranjang belanja mereka, rincian pesanannya akan muncul di sini secara langsung.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-5 space-y-4"
                >
                  {/* Order Header */}
                  <div className="flex justify-between items-start pb-3 border-b border-gray-50">
                    <div>
                      <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md font-mono">
                        #{order.id}
                      </span>
                      <h4 className="font-bold text-gray-800 text-base mt-1.5">{order.pembeli.nama}</h4>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">{order.pembeli.email}</p>
                    </div>

                    <span className="text-[10px] text-gray-400 font-mono text-right block">
                      {order.waktuPemesanan}
                    </span>
                  </div>

                  {/* Order Items list */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Item yang Dipesan</span>
                    {order.items.map((it) => (
                      <div key={it.menuItem.id} className="flex justify-between text-xs text-gray-700">
                        <span>
                          {it.menuItem.nama_menu} <strong className="text-gray-400">x{it.quantity}</strong>
                        </span>
                        <span className="font-mono text-gray-500">
                          Rp {(it.menuItem.harga * it.quantity).toLocaleString('id-ID')}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between font-extrabold text-sm text-gray-800 pt-2 border-t border-dashed border-gray-100">
                      <span>Total Pembayaran</span>
                      <span className="text-red-600 font-mono">
                        Rp {order.totalHarga.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-gray-50/80 rounded-xl p-3 text-xs text-gray-600 leading-relaxed border border-gray-100">
                    <strong className="text-[10px] text-gray-400 block uppercase font-mono mb-0.5">Alamat Tujuan</strong>
                    {order.lokasiTujuan.nama}
                  </div>

                  {/* Interactive Status Controls */}
                  <div className="pt-2 border-t border-gray-100 space-y-3">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                      Kontrol Status Real-time
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* Diterima */}
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Pesanan Diterima')}
                        className={`py-2 px-2.5 rounded-xl border font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                          order.status === 'Pesanan Diterima'
                            ? 'bg-red-50 text-red-700 border-red-200 shadow-sm font-black'
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-500'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>Diterima</span>
                      </button>

                      {/* Dimasak */}
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Sedang Dimasak')}
                        className={`py-2 px-2.5 rounded-xl border font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                          order.status === 'Sedang Dimasak'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm font-black'
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-500'
                        }`}
                      >
                        <ChefHat className="h-3.5 w-3.5 shrink-0" />
                        <span>Dimasak</span>
                      </button>

                      {/* Diantar */}
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Sedang Diantar')}
                        className={`py-2 px-2.5 rounded-xl border font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                          order.status === 'Sedang Diantar'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm font-black'
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-500'
                        }`}
                      >
                        <Truck className="h-3.5 w-3.5 shrink-0" />
                        <span>Kirim Kurir</span>
                      </button>

                      {/* Tiba */}
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'Tiba di Lokasi')}
                        className={`py-2 px-2.5 rounded-xl border font-bold flex items-center justify-center space-x-1 transition-all cursor-pointer ${
                          order.status === 'Tiba di Lokasi'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm font-black'
                            : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-500'
                        }`}
                      >
                        <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
                        <span>Tiba / Selesai</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
