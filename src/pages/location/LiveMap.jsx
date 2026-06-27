import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function LiveMap({ locations = [], currentLocation }) {
  return (
    <div className="relative w-full aspect-video bg-slate-100 rounded-2xl border border-white/50 overflow-hidden shadow-lg shadow-slate-200/40">
      {/* Simulated map background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-transparent to-purple-100/50" />
      </div>

      {/* Map label */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺</div>
          <p className="text-slate-500 text-sm">Map View</p>
          <p className="text-slate-400 text-xs mt-1">Integrate with Mapbox/Google Maps</p>
        </div>
      </div>

      {/* Current location pin */}
      {currentLocation && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <div className="absolute -inset-3 bg-blue-400/30 rounded-full animate-ping" />
            <div className="relative p-2 bg-blue-600 rounded-full shadow-lg shadow-blue-500/30">
              <MapPin className="h-5 w-5 text-white" />
            </div>
          </div>
        </motion.div>
      )}

      {/* History pins */}
      {locations.slice(0, 10).map((loc, index) => (
        <div
          key={loc._id || index}
          className="absolute p-1 bg-white/80 rounded-full shadow-sm border border-slate-200"
          style={{
            top: `${20 + (index * 6) % 60}%`,
            left: `${15 + (index * 8) % 70}%`,
          }}
        >
          <MapPin className="h-3 w-3 text-slate-500" />
        </div>
      ))}
    </div>
  );
}
