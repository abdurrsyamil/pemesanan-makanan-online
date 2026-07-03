import React, { useEffect, useState } from 'react';
import { MapPin, ChefHat, ShoppingBag, Truck, CheckCircle, Navigation, Phone, MessageSquare, ShieldCheck, RefreshCw } from 'lucide-react';
import { Order, Notification } from '../types';

interface TrackingMapProps {
  order: Order | null;
  onRefreshStatus?: () => void;
}

export default function TrackingMap({ order, onRefreshStatus }: TrackingMapProps) {
  const [driverProgress, setDriverProgress] = useState(0); // 0 to 100%
  const [eta, setEta] = useState(25); // Minutes left

  // Path coordinates for the delivery rider on our visual SVG map
  // Map dimensions are 500 x 300
  const restaurantCoord = { x: 80, y: 80 };
  const destinationCoord = { x: 420, y: 220 };
  
  // Waypoints for the route
  const waypoints = [
    restaurantCoord,
    { x: 180, y: 80 },
    { x: 180, y: 150 },
    { x: 300, y: 150 },
    { x: 300, y: 220 },
    destinationCoord
  ];

  // Calculate current rider coordinates along the path based on progress (0 - 100)
  const getRiderCoordinate = (progress: number) => {
    if (progress <= 0) return restaurantCoord;
    if (progress >= 100) return destinationCoord;

    const segmentCount = waypoints.length - 1;
    const segmentWeight = 100 / segmentCount;
    const currentSegmentIndex = Math.floor(progress / segmentWeight);
    const segmentProgress = (progress % segmentWeight) / segmentWeight;

    if (currentSegmentIndex >= segmentCount) return destinationCoord;

    const start = waypoints[currentSegmentIndex];
    const end = waypoints[currentSegmentIndex + 1];

    return {
      x: start.x + (end.x - start.x) * segmentProgress,
      y: start.y + (end.y - start.y) * segmentProgress,
    };
  };

  // Keep driver moving or stationary depending on state
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (order) {
      if (order.status === 'Pesanan Diterima') {
        setDriverProgress(0);
        setEta(30);
      } else if (order.status === 'Sedang Dimasak') {
        setDriverProgress(10);
        setEta(22);
      } else if (order.status === 'Sedang Diantar') {
        // Automatically animate driver movement for delightful client-side simulation
        setDriverProgress(20);
        setEta(15);
        interval = setInterval(() => {
          setDriverProgress((prev) => {
            if (prev >= 95) {
              clearInterval(interval);
              return 95;
            }
            // Slowly decrease ETA as driver moves
            setEta((prevEta) => Math.max(2, Math.round(15 * (1 - prev / 100))));
            return prev + 1;
          });
        }, 1200);
      } else if (order.status === 'Tiba di Lokasi') {
        setDriverProgress(100);
        setEta(0);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [order?.status]);

  const riderPos = getRiderCoordinate(driverProgress);

  const getStepClass = (stepStatus: string) => {
    if (!order) return 'text-gray-300';
    const statusSequence = ['Pesanan Diterima', 'Sedang Dimasak', 'Sedang Diantar', 'Tiba di Lokasi'];
    const orderIndex = statusSequence.indexOf(order.status);
    const stepIndex = statusSequence.indexOf(stepStatus);

    if (orderIndex >= stepIndex) {
      return 'text-orange-500 font-bold';
    }
    return 'text-gray-400';
  };

  const getStepIconClass = (stepStatus: string) => {
    if (!order) return 'bg-gray-100 text-gray-400 border-gray-200';
    const statusSequence = ['Pesanan Diterima', 'Sedang Dimasak', 'Sedang Diantar', 'Tiba di Lokasi'];
    const orderIndex = statusSequence.indexOf(order.status);
    const stepIndex = statusSequence.indexOf(stepStatus);

    if (orderIndex > stepIndex) {
      return 'bg-gradient-to-tr from-red-600 to-orange-500 text-white border-transparent scale-110';
    } else if (orderIndex === stepIndex) {
      return 'bg-yellow-400 text-red-950 border-transparent scale-115 ring-4 ring-yellow-200 animate-pulse';
    }
    return 'bg-white text-gray-300 border-gray-200';
  };

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex p-5 bg-orange-50 text-orange-500 rounded-full mb-4 ring-8 ring-orange-50/50">
          <Navigation className="h-12 w-12" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Belum Ada Pelacakan Aktif</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
          Silakan pesan hidangan lezat terlebih dahulu. Setelah pembayaran selesai, Anda bisa melacak kurir di sini secara real-time!
        </p>
      </div>
    );
  }

  // Create SVG path string for visuals
  const dPath = `M ${waypoints.map(w => `${w.x} ${w.y}`).join(' L ')}`;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Pelacakan Pengiriman Nusantara</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-mono">
            ID PESANAN: #{order.id} &bull; Metode: {order.metodePembayaran.toUpperCase()}
          </p>
        </div>
        <div className="mt-3 md:mt-0 flex items-center space-x-3 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 text-orange-800 text-sm font-semibold">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-ping"></div>
          <span>Status: {order.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Map Container - LEFT */}
        <div className="lg:col-span-8 bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-sm relative">
          
          {/* Header Legend */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-md border border-slate-100 text-xs flex space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="h-3 w-3 bg-red-600 rounded-full inline-block ring-2 ring-red-200"></span>
              <span className="font-semibold text-slate-700">Restoran</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-3 w-3 bg-orange-500 rounded-full inline-block ring-2 ring-orange-200"></span>
              <span className="font-semibold text-slate-700">Kurir</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="h-3 w-3 bg-blue-600 rounded-full inline-block ring-2 ring-blue-200"></span>
              <span className="font-semibold text-slate-700">Rumah Anda</span>
            </div>
          </div>

          {/* Interactive SVG Map */}
          <div className="aspect-[5/3] w-full relative">
            <svg viewBox="0 0 500 300" className="w-full h-full bg-[#f4f3f0]">
              {/* Grid background representing roads/blocks */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <rect width="40" height="40" fill="#f4f3f0" />
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e9e8e3" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Decorative Map Features */}
              {/* Lake/River */}
              <path d="M 0 250 C 120 250, 150 180, 250 180 C 350 180, 380 280, 500 280 L 500 300 L 0 300 Z" fill="#d2e3fc" opacity="0.7" />
              {/* Green Park Area */}
              <rect x="220" y="20" width="100" height="70" rx="15" fill="#ceebd0" opacity="0.6" />
              <text x="270" y="60" textAnchor="middle" fill="#608d62" fontSize="9" fontWeight="bold" fontFamily="sans-serif">Taman Nusantara</text>

              {/* Roads drawing behind */}
              <path d={dPath} fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              {/* Active path dashed drawing depending on progress */}
              <path d={dPath} fill="none" stroke="#fdba74" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

              {/* Restaurant Marker */}
              <g transform={`translate(${restaurantCoord.x}, ${restaurantCoord.y})`}>
                <circle cx="0" cy="0" r="18" fill="#dc2626" className="animate-pulse" opacity="0.2" />
                <circle cx="0" cy="0" r="12" fill="#dc2626" />
                <path d="M-5-5 L5-5 L5 5 L-5 5 Z" fill="#ffffff" />
                <foreignObject x="-8" y="-8" width="16" height="16">
                  <div className="text-white flex items-center justify-center">
                    <ChefHat size={12} className="stroke-[2.5]" />
                  </div>
                </foreignObject>
              </g>
              <text x={restaurantCoord.x} y={restaurantCoord.y - 18} textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Restoran Nusantara</text>

              {/* User Home Marker */}
              <g transform={`translate(${destinationCoord.x}, ${destinationCoord.y})`}>
                <circle cx="0" cy="0" r="18" fill="#2563eb" opacity="0.2" />
                <circle cx="0" cy="0" r="12" fill="#2563eb" />
                <foreignObject x="-8" y="-8" width="16" height="16">
                  <div className="text-white flex items-center justify-center">
                    <MapPin size={12} className="stroke-[2.5]" />
                  </div>
                </foreignObject>
              </g>
              <text x={destinationCoord.x} y={destinationCoord.y - 18} textAnchor="middle" fill="#2563eb" fontSize="10" fontWeight="bold" fontFamily="sans-serif">Rumah Anda</text>

              {/* Animated Delivery Rider Marker */}
              {driverProgress > 0 && (
                <g transform={`translate(${riderPos.x}, ${riderPos.y})`}>
                  <circle cx="0" cy="0" r="22" fill="#ea580c" opacity="0.15" className="animate-ping" />
                  <circle cx="0" cy="0" r="15" fill="#f97316" stroke="#ffffff" strokeWidth="2" className="shadow-md" />
                  <foreignObject x="-9" y="-9" width="18" height="18">
                    <div className="text-white flex items-center justify-center h-full">
                      <Truck size={12} className="stroke-[2.5]" />
                    </div>
                  </foreignObject>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Milestone Steps & Rider Info Card - RIGHT */}
        <div className="lg:col-span-4 space-y-6">
          {/* Driver Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono">
              Driver Nusantara Anda
            </h3>
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-full bg-orange-100 border-2 border-orange-200 flex items-center justify-center font-bold text-orange-600 text-lg shadow-inner">
                👨🏻‍✈️
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-base">Pak Joko Susilo</h4>
                <p className="text-xs text-gray-500 flex items-center space-x-1 mt-0.5">
                  <Truck className="h-3 w-3 text-orange-500" />
                  <span>Yamaha NMAX (B 4930 SFZ)</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50 text-center">
              <div className="bg-orange-50/50 p-2.5 rounded-xl border border-orange-100/20">
                <span className="text-[10px] text-gray-400 block font-mono">ESTIMASI TIBA</span>
                <span className="text-base font-extrabold text-orange-700 font-mono">
                  {eta > 0 ? `${eta} Menit` : 'Tiba!'}
                </span>
              </div>
              <div className="bg-orange-50/50 p-2.5 rounded-xl border border-orange-100/20">
                <span className="text-[10px] text-gray-400 block font-mono">JARAK</span>
                <span className="text-base font-extrabold text-orange-700 font-mono">
                  {eta > 0 ? `${(eta * 0.15).toFixed(1)} km` : '0 km'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2.5 pt-1">
              <button
                onClick={() => alert('Menghubungi Pak Joko melalui Whatsapp (+62 812-3456-7890)...')}
                className="flex-1 py-2.5 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 text-xs font-bold rounded-xl border border-gray-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Telepon</span>
              </button>
              <button
                onClick={() => alert('Membuka Fitur Chat dengan Driver...')}
                className="flex-1 py-2.5 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 text-xs font-bold rounded-xl border border-gray-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Chat</span>
              </button>
            </div>
          </div>

          {/* Stepper Status Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center justify-between">
              <span>Perjalanan Pesanan</span>
              {onRefreshStatus && (
                <button
                  onClick={onRefreshStatus}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                  title="Refresh Status"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              )}
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-y-3 before:left-[17px] before:w-0.5 before:bg-gray-100">
              {/* Step 1: Diterima */}
              <div className="flex items-start space-x-4 relative z-10">
                <div className={`h-9 w-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${getStepIconClass('Pesanan Diterima')}`}>
                  <ShoppingBag className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm ${getStepClass('Pesanan Diterima')}`}>Pesanan Diterima</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Dapur Restoran Nusantara telah memvalidasi pembayaran Anda.
                  </p>
                </div>
              </div>

              {/* Step 2: Dimasak */}
              <div className="flex items-start space-x-4 relative z-10">
                <div className={`h-9 w-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${getStepIconClass('Sedang Dimasak')}`}>
                  <ChefHat className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm ${getStepClass('Sedang Dimasak')}`}>Sedang Dimasak</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Koki terbaik kami sedang mengolah bumbu rempah Nusantara segar.
                  </p>
                </div>
              </div>

              {/* Step 3: Diantar */}
              <div className="flex items-start space-x-4 relative z-10">
                <div className={`h-9 w-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${getStepIconClass('Sedang Diantar')}`}>
                  <Truck className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm ${getStepClass('Sedang Diantar')}`}>Sedang Diantar</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Pak Joko sedang melaju kencang membawakan makanan hangat Anda.
                  </p>
                </div>
              </div>

              {/* Step 4: Tiba */}
              <div className="flex items-start space-x-4 relative z-10">
                <div className={`h-9 w-9 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${getStepIconClass('Tiba di Lokasi')}`}>
                  <CheckCircle className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm ${getStepClass('Tiba di Lokasi')}`}>Tiba di Lokasi</h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Selesai! Silakan nikmati hidangan lezat selagi hangat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
