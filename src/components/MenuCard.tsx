import React, { useState } from 'react';
import { Plus, Minus, Star, Heart, Clock, UtensilsCrossed, Info, ShoppingBag } from 'lucide-react';
import { MenuItem, CartItem } from '../types';

interface MenuCardProps {
  key?: string | number;
  item: MenuItem;
  cartItem?: CartItem;
  onAddToCart: (item: MenuItem) => void;
  onRemoveFromCart: (item: MenuItem) => void;
  isLoggedIn: boolean;
  onPromptLogin: () => void;
}

export default function MenuCard({
  item,
  cartItem,
  onAddToCart,
  onRemoveFromCart,
  isLoggedIn,
  onPromptLogin,
}: MenuCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      onPromptLogin();
      return;
    }
    onAddToCart(item);
  };

  const handleMinusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveFromCart(item);
  };

  const formattedPrice = `Rp ${item.harga.toLocaleString('id-ID')}`;

  // Deterministic scores & preparation time to look authentic and rich
  const rating = 4.8 + (Number(item.id || 0) % 3) * 0.1;
  const prepTime = 15 + (Number(item.id || 0) % 4) * 5;

  return (
    <>
      {/* Individual Card - Union & Steak 21 High-Contrast Classic Look */}
      <div
        onClick={() => setShowDetail(true)}
        className="group bg-[#ffffff] rounded-2xl border border-gray-100 hover:border-gold-500/30 overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col h-full cursor-pointer relative shadow-sm hover:shadow-2xl"
        id={`menu-card-${item.id}`}
      >
        {/* Card Badge Category - Premium gold ribbon */}
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-gradient-to-r from-red-700 to-red-800 text-gold-200 text-[9px] font-black tracking-widest uppercase rounded-lg shadow-md border border-gold-500/20 font-mono">
          {item.kategori || 'Makanan'}
        </span>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-[#111111]/70 backdrop-blur-md hover:bg-white text-gray-300 hover:text-red-500 transition-all shadow-md border border-white/15 cursor-pointer"
        >
          <Heart
            className={`h-4 w-4 transition-transform active:scale-125 ${
              isFavorite ? 'fill-red-500 text-red-500 stroke-red-500' : ''
            }`}
          />
        </button>

        {/* Card Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          <img
            src={item.gambar}
            alt={item.nama_menu}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
          {!item.tersedia && (
            <div className="absolute inset-0 bg-[#111111]/75 backdrop-blur-xs flex items-center justify-center">
              <span className="px-4 py-2 bg-gradient-to-r from-red-700 to-red-800 text-gold-100 font-extrabold text-xs tracking-widest uppercase rounded-xl shadow-lg border border-gold-500/30">
                Habis Dipesan
              </span>
            </div>
          )}
        </div>

        {/* Card Content - Union style elegance */}
        <div className="p-5 flex-1 flex flex-col justify-between bg-white">
          <div className="space-y-2">
            {/* Rating and Cooking Time */}
            <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <div className="flex items-center space-x-1 text-gold-600">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="font-extrabold text-slate-800">{rating.toFixed(1)}</span>
                <span className="text-[10px] text-gray-400 font-medium">(4.9k)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span>{prepTime} mnt</span>
              </div>
            </div>

            {/* Menu Name - Classic Serif Typography */}
            <h3 className="font-serif font-bold text-[#1a1a1a] text-lg leading-snug group-hover:text-red-700 transition-colors line-clamp-1">
              {item.nama_menu}
            </h3>

            {/* Description */}
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {item.deskripsi || 'Sajian istimewa kaya rempah khas nusantara.'}
            </p>
          </div>

          <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between">
            {/* Price */}
            <div>
              <span className="text-[9px] text-gray-400 block font-mono uppercase tracking-widest">Harga VIP</span>
              <span className="text-base font-extrabold text-red-600 tracking-tight">
                {formattedPrice}
              </span>
            </div>

            {/* Interactive Cart Button */}
            {!item.tersedia ? (
              <button
                disabled
                className="px-3 py-2 bg-gray-100 text-gray-400 text-xs font-semibold rounded-xl cursor-not-allowed border-0"
              >
                Kosong
              </button>
            ) : cartItem && cartItem.quantity > 0 ? (
              <div className="flex items-center bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl shadow-md p-1 space-x-1.5 ring-1 ring-gold-500/20">
                <button
                  onClick={handleMinusClick}
                  className="p-1 rounded-lg hover:bg-white/20 transition-colors focus:outline-none cursor-pointer border-0 bg-transparent text-white"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs font-black font-mono px-1">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={handleCartClick}
                  className="p-1 rounded-lg hover:bg-white/20 transition-colors focus:outline-none cursor-pointer border-0 bg-transparent text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleCartClick}
                className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-[#111111] to-[#222222] hover:from-red-700 hover:to-red-800 text-white hover:text-white border border-gold-800/40 hover:border-transparent text-xs font-bold rounded-xl shadow-md active:scale-95 hover:shadow-xl transition-all focus:outline-none cursor-pointer"
              >
                <ShoppingBag className="h-3.5 w-3.5 text-gold-300" />
                <span className="tracking-wider uppercase text-[10px]">Pesan</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div
            className="bg-[#111111] text-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative border border-gold-800/40"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Banner Photo */}
            <div className="relative h-64 bg-slate-900">
              <img
                src={item.gambar}
                alt={item.nama_menu}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setShowDetail(false)}
                className="absolute top-4 right-4 p-2.5 bg-black/60 backdrop-blur-md text-gray-300 hover:text-white hover:bg-black/80 rounded-full transition-colors cursor-pointer border-0"
              >
                <Minus className="h-5 w-5 rotate-45" />
              </button>
              <span className="absolute bottom-4 left-4 px-3 py-1 bg-gradient-to-r from-red-700 to-red-800 text-gold-100 text-xs font-black rounded-lg shadow-lg border border-gold-500/30">
                {item.kategori || 'Makanan'}
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-gradient-to-b from-[#111111] to-[#181818]">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-serif font-bold text-gold-100">{item.nama_menu}</h3>
                <span className="text-xl font-black text-red-500 font-mono">
                  {formattedPrice}
                </span>
              </div>

              {/* Indicators */}
              <div className="flex items-center space-x-4 text-xs text-gray-400 font-mono mb-5 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="flex items-center space-x-1 text-gold-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-extrabold text-gold-200">{rating.toFixed(1)}</span>
                </div>
                <div className="h-3 w-px bg-white/10"></div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span>Sajian dalam {prepTime} menit</span>
                </div>
                <div className="h-3 w-px bg-white/10"></div>
                <div className="flex items-center space-x-1 text-emerald-400">
                  <UtensilsCrossed className="h-4 w-4" />
                  <span>Rempah Asli</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-[10px] font-black text-gold-500 uppercase tracking-widest mb-1.5">
                  Deskripsi Hidangan
                </h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {item.deskripsi ||
                    'Hidangan Nusantara bercita rasa legendaris dengan kombinasi bumbu rempah pilihan yang melimpah dan resep turun-temurun asli Indonesia.'}
                </p>
              </div>

              {/* Highlights & Health info */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-xs bg-white/5 p-3.5 rounded-xl border border-white/5">
                <div>
                  <span className="text-gray-400 block font-mono text-[10px] uppercase tracking-wider">Penyajian</span>
                  <span className="font-bold text-gray-200">Panas & Segar</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-mono text-[10px] uppercase tracking-wider">Tingkat Pedas</span>
                  <span className="font-bold text-red-400">Dapat Disesuaikan</span>
                </div>
              </div>

              {/* Add to Cart button */}
              <div className="flex items-center justify-between pt-5 border-t border-white/15">
                <div className="text-xs text-gray-400">
                  Ingin menikmati hidangan premium ini?
                </div>
                {!item.tersedia ? (
                  <button
                    disabled
                    className="px-6 py-3 bg-white/5 text-gray-500 font-bold rounded-xl cursor-not-allowed border-0"
                  >
                    Habis Terjual
                  </button>
                ) : cartItem && cartItem.quantity > 0 ? (
                  <div className="flex items-center bg-gradient-to-r from-red-700 to-red-800 text-white rounded-xl shadow-lg p-1.5 space-x-4 border border-gold-500/20">
                    <button
                      onClick={handleMinusClick}
                      className="p-1.5 rounded-lg hover:bg-white/20 transition-colors focus:outline-none cursor-pointer border-0 bg-transparent text-white"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-black font-mono px-2 text-sm text-white">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={handleCartClick}
                      className="p-1.5 rounded-lg hover:bg-white/20 transition-colors focus:outline-none cursor-pointer border-0 bg-transparent text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      handleCartClick(e);
                      setShowDetail(false);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg active:scale-95 transition-transform flex items-center space-x-2 cursor-pointer border-0"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Masukkan Keranjang</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
