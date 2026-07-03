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

  // Mock score & prep time based on item ID/length to keep it interesting but deterministic
  const rating = 4.7 + (Number(item.id || 0) % 3) * 0.1;
  const prepTime = 15 + (Number(item.id || 0) % 4) * 5;

  return (
    <>
      {/* Individual Card */}
      <div
        onClick={() => setShowDetail(true)}
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full cursor-pointer relative"
        id={`menu-card-${item.id}`}
      >
        {/* Card Badge Category */}
        <span className="absolute top-3 left-3 z-10 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-lg tracking-wider uppercase font-mono shadow-sm">
          {item.kategori || 'Makanan'}
        </span>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-gray-500 hover:text-red-500 transition-colors shadow-sm focus:outline-none cursor-pointer"
        >
          <Heart
            className={`h-4 w-4 transition-transform active:scale-125 ${
              isFavorite ? 'fill-red-500 text-red-500' : ''
            }`}
          />
        </button>

        {/* Card Image */}
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <img
            src={item.gambar}
            alt={item.nama_menu}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {!item.tersedia && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
              <span className="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded-xl tracking-wider uppercase shadow-md">
                Habis
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div className="space-y-1.5">
            {/* Rating and Cooking Time */}
            <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
              <div className="flex items-center space-x-1 text-amber-500">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="font-bold text-gray-700">{rating.toFixed(1)}</span>
                <span className="text-[10px] text-gray-400">(45+)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span>{prepTime} mnt</span>
              </div>
            </div>

            {/* Menu Name */}
            <h3 className="font-bold text-gray-800 text-base leading-snug group-hover:text-red-600 transition-colors line-clamp-1">
              {item.nama_menu}
            </h3>

            {/* Description */}
            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
              {item.deskripsi || 'Sajian istimewa kaya rempah khas nusantara.'}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
            {/* Price */}
            <div>
              <span className="text-[10px] text-gray-400 block font-mono">Harga</span>
              <span className="text-base font-extrabold text-red-600 tracking-tight">
                {formattedPrice}
              </span>
            </div>

            {/* Interactive Cart Button */}
            {!item.tersedia ? (
              <button
                disabled
                className="px-3 py-1.5 bg-gray-100 text-gray-400 text-xs font-semibold rounded-lg cursor-not-allowed"
              >
                Kosong
              </button>
            ) : cartItem && cartItem.quantity > 0 ? (
              <div className="flex items-center bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl shadow-md p-1 space-x-2">
                <button
                  onClick={handleMinusClick}
                  className="p-1 rounded-lg hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="text-xs font-bold font-mono px-1">
                  {cartItem.quantity}
                </span>
                <button
                  onClick={handleCartClick}
                  className="p-1 rounded-lg hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleCartClick}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white text-xs font-bold rounded-xl shadow-md active:scale-95 hover:shadow-lg transition-all focus:outline-none cursor-pointer"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Beli</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal Overlay */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative border border-orange-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Banner Photo */}
            <div className="relative h-64 bg-gray-100">
              <img
                src={item.gambar}
                alt={item.nama_menu}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setShowDetail(false)}
                className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md text-white hover:bg-black/80 rounded-full transition-colors cursor-pointer"
              >
                <Minus className="h-5 w-5 rotate-45" />
              </button>
              <span className="absolute bottom-4 left-4 px-3 py-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold rounded-xl shadow-md">
                {item.kategori || 'Makanan'}
              </span>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{item.nama_menu}</h3>
                <span className="text-lg font-extrabold text-red-600 font-mono">
                  {formattedPrice}
                </span>
              </div>

              {/* Indicators */}
              <div className="flex items-center space-x-4 text-xs text-gray-500 font-mono mb-4 bg-orange-50/50 p-2.5 rounded-xl border border-orange-100/50">
                <div className="flex items-center space-x-1 text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-bold text-gray-700">{rating.toFixed(1)}</span>
                </div>
                <div className="h-3 w-px bg-gray-200"></div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>Sajian dalam {prepTime} menit</span>
                </div>
                <div className="h-3 w-px bg-gray-200"></div>
                <div className="flex items-center space-x-1 text-emerald-600">
                  <UtensilsCrossed className="h-4 w-4" />
                  <span>Rempah Asli</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Deskripsi Hidangan
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.deskripsi ||
                    'Hidangan Nusantara bercita rasa legendaris dengan kombinasi bumbu rempah pilihan yang melimpah dan resep turun-temurun asli Indonesia.'}
                </p>
              </div>

              {/* Highlights & Health info */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-xs bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 block font-mono">Penyajian</span>
                  <span className="font-semibold text-gray-700">Panas & Segar</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-mono">Tingkat Pedas</span>
                  <span className="font-semibold text-red-600">Dapat Disesuaikan</span>
                </div>
              </div>

              {/* Add to Cart button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                  Ingin menikmati hidangan ini?
                </div>
                {!item.tersedia ? (
                  <button
                    disabled
                    className="px-6 py-2.5 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed"
                  >
                    Habis Terjual
                  </button>
                ) : cartItem && cartItem.quantity > 0 ? (
                  <div className="flex items-center bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl shadow-md p-1.5 space-x-3">
                    <button
                      onClick={handleMinusClick}
                      className="p-1.5 rounded-lg hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-bold font-mono px-2 text-sm">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={handleCartClick}
                      className="p-1.5 rounded-lg hover:bg-white/20 transition-colors focus:outline-none cursor-pointer"
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
                    className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-transform flex items-center space-x-2 cursor-pointer"
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
