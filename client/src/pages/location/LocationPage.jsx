import { motion } from 'framer-motion';
import {
  MapPin, Navigation, Battery, Signal, Clock, RefreshCw, Compass
} from 'lucide-react';
import { useLocationHistory, useLatestLocation, useSendLocation } from '../../hooks/useLocation';
import LiveMap from './LiveMap';
import Button from '../../components/ui/Button';
import { formatDateTime } from '../../utils/helpers';

export default function LocationPage() {
  const { data: locationData, isLoading: locationLoading } = useLocationHistory({ limit: 50 });
  const { data: latestData, isLoading: latestLoading } = useLatestLocation();
  const sendMutation = useSendLocation();

  const locations = locationData?.locations || locationData?.data || [];
  const currentLocation = latestData?.location || latestData;

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          sendMutation.mutate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed,
          });
        },
        () => {
          // Fallback for demo
          sendMutation.mutate({
            latitude: 40.7128,
            longitude: -74.0060,
            accuracy: 10,
            speed: 0,
          });
        }
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Location</h2>
          <p className="text-slate-400 text-sm">Track device locations</p>
        </div>
        <Button onClick={handleShareLocation} loading={sendMutation.isPending}>
          <Navigation className="h-4 w-4" />
          Share Location
        </Button>
      </div>

      <LiveMap locations={locations} currentLocation={currentLocation} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Position</h3>
          {latestLoading ? (
            <div className="space-y-3 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-white/10 rounded w-full" />
              ))}
            </div>
          ) : currentLocation ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Compass className="h-3 w-3" /> Latitude
                  </div>
                  <p className="text-sm text-white font-mono">{currentLocation.latitude?.toFixed(6) || 'N/A'}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Compass className="h-3 w-3" /> Longitude
                  </div>
                  <p className="text-sm text-white font-mono">{currentLocation.longitude?.toFixed(6) || 'N/A'}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Signal className="h-3 w-3" /> Accuracy
                  </div>
                  <p className="text-sm text-white">{currentLocation.accuracy?.toFixed(1) || 'N/A'} m</p>
                </div>
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Navigation className="h-3 w-3" /> Speed
                  </div>
                  <p className="text-sm text-white">{currentLocation.speed?.toFixed(1) || '0'} m/s</p>
                </div>
              </div>
              {currentLocation.battery !== undefined && (
                <div className="bg-white/5 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Battery className="h-3 w-3" /> Battery
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                        style={{ width: `${currentLocation.battery}%` }}
                      />
                    </div>
                    <span className="text-sm text-white">{currentLocation.battery}%</span>
                  </div>
                </div>
              )}
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last updated: {formatDateTime(currentLocation.timestamp || currentLocation.createdAt)}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">No location data available</p>
          )}
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Location History</h3>
          {locations.length === 0 ? (
            <p className="text-sm text-slate-400">No location history</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {locations.map((loc, index) => (
                <motion.div
                  key={loc._id || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <MapPin className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-mono">
                      {loc.latitude?.toFixed(4)}, {loc.longitude?.toFixed(4)}
                    </p>
                    <p className="text-xs text-slate-500">{formatDateTime(loc.timestamp || loc.createdAt)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
