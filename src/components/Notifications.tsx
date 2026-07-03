import React from 'react';
import { Bell, X, CheckCircle, Info, AlertTriangle, Clock } from 'lucide-react';
import { Notification } from '../types';

interface NotificationsProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;
}

export default function Notifications({ notifications, isOpen, onClose, onClear }: NotificationsProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl flex flex-col border-l border-orange-100 animate-slide-in">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-red-600 to-orange-500 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-yellow-200" />
          <h3 className="font-bold font-sans">Notifikasi Real-time</h3>
        </div>
        <div className="flex items-center space-x-2">
          {notifications.length > 0 && (
            <button
              onClick={onClear}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors text-white font-medium cursor-pointer"
            >
              Hapus Semua
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="p-4 bg-orange-50 text-orange-400 rounded-full mb-3">
              <Bell className="h-8 w-8" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Tidak Ada Notifikasi</p>
            <p className="text-xs text-gray-400 mt-1">
              Setiap pembaruan status pesanan Anda akan muncul di sini secara instan!
            </p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-3.5 bg-gradient-to-br from-orange-50/50 to-white border border-orange-100 rounded-xl shadow-sm hover:shadow-md transition-all flex items-start space-x-3"
            >
              {/* Notification Icon based on type */}
              <div className="shrink-0 mt-0.5">
                {notif.type === 'success' && (
                  <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                )}
                {notif.type === 'info' && (
                  <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                    <Info className="h-4 w-4" />
                  </div>
                )}
                {notif.type === 'warning' && (
                  <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Message Details */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-800 truncate">{notif.title}</h4>
                <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{notif.message}</p>
                
                {/* Timestamp */}
                <div className="flex items-center space-x-1 text-[10px] text-gray-400 mt-2 font-mono">
                  <Clock className="h-3 w-3" />
                  <span>{notif.timestamp}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer info banner */}
      <div className="p-3 bg-orange-50 border-t border-orange-100 text-center text-[10px] text-orange-700 font-mono">
        Status Pesanan Terkoneksi Real-time ⚡
      </div>
    </div>
  );
}
