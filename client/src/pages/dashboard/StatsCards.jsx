import { motion } from 'framer-motion';
import {
  Image, MessageSquare, Smartphone, BatteryFull,
  HardDrive, MapPin, Wifi, Clock, RefreshCw
} from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function StatsCards({ stats }) {
  const cards = [
    {
      icon: Image,
      label: 'Total Photos',
      value: stats?.totalPhotos ?? 0,
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: MessageSquare,
      label: 'SMS Sent',
      value: stats?.smsSent ?? 0,
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: MessageSquare,
      label: 'SMS Received',
      value: stats?.smsReceived ?? 0,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      icon: Smartphone,
      label: 'Connected Devices',
      value: stats?.connectedDevices ?? 0,
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: BatteryFull,
      label: 'Battery Level',
      value: `${stats?.batteryLevel ?? 0}%`,
      gradient: 'from-yellow-500 to-amber-600',
    },
    {
      icon: HardDrive,
      label: 'Storage Used',
      value: stats?.storageUsed || '0 MB',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      icon: MapPin,
      label: 'Last Location',
      value: stats?.lastLocation || 'Unknown',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      icon: Clock,
      label: 'Last Sync',
      value: stats?.lastSync || 'Never',
      gradient: 'from-teal-500 to-cyan-600',
    },
    {
      icon: RefreshCw,
      label: 'Device Status',
      value: stats?.deviceStatus || 'Offline',
      gradient: 'from-slate-500 to-gray-600',
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div key={card.label} variants={item}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.gradient}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                  <p className="text-sm text-slate-400">{card.label}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
