import { motion } from 'framer-motion';
import {
  Smartphone, Battery, HardDrive, Wifi, WifiOff, Trash2, Clock, RefreshCw
} from 'lucide-react';
import { useDevices, useRemoveDevice } from '../../hooks/useDevices';
import useSocket from '../../hooks/useSocket';
import EmptyState from '../../components/shared/EmptyState';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { timeAgo } from '../../utils/helpers';
import { CardSkeleton } from '../../components/ui/Skeleton';

export default function DevicesPage() {
  const { data, isLoading, refetch } = useDevices();
  const removeMutation = useRemoveDevice();

  useSocket('device:update', () => refetch());
  useSocket('device:connected', () => refetch());
  useSocket('device:disconnected', () => refetch());

  const devices = data?.devices || data?.data || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Devices</h2>
          <p className="text-slate-500 text-sm">{devices.length} registered device{devices.length !== 1 ? 's' : ''}</p>
        </div>
        <Button variant="secondary" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : devices.length === 0 ? (
        <EmptyState
          icon={Smartphone}
          title="No devices"
          description="Install the DeviceCloud app on your Android device to get started"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device, index) => (
            <motion.div
              key={device._id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/50 backdrop-blur-xl border border-white/50 rounded-2xl p-6 hover:bg-white/70 transition-all shadow-lg shadow-slate-200/40"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
                    <Smartphone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{device.name || 'Unknown Device'}</h3>
                    <p className="text-xs text-slate-500">{device.model || 'Android Device'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${device.isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  <Badge variant={device.isOnline ? 'success' : 'neutral'}>
                    {device.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                {/* Battery */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Battery className="h-3.5 w-3.5" />
                      Battery
                    </div>
                    <span className="text-xs text-slate-700">{device.battery ?? 'N/A'}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        (device.battery ?? 0) > 50
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                          : (device.battery ?? 0) > 20
                          ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                          : 'bg-gradient-to-r from-red-500 to-rose-600'
                      }`}
                      style={{ width: `${device.battery ?? 0}%` }}
                    />
                  </div>
                </div>

                {/* Storage */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <HardDrive className="h-3.5 w-3.5" />
                      Storage
                    </div>
                    <span className="text-xs text-slate-700">{device.storageUsed || 'N/A'}</span>
                  </div>
                  <div className="h-1.5 bg-slate-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      style={{ width: `${device.storagePercent ?? 0}%` }}
                    />
                  </div>
                </div>

                {/* Android Version */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Android Version</span>
                  <span className="text-slate-700">{device.androidVersion || 'N/A'}</span>
                </div>

                {/* Last Seen */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="h-3 w-3" />
                    Last seen
                  </div>
                  <span className="text-slate-700">{device.lastSeen ? timeAgo(device.lastSeen) : 'Never'}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => {
                    if (confirm('Remove this device?')) {
                      removeMutation.mutate(device._id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Device
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
