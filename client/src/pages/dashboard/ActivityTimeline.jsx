import { motion } from 'framer-motion';
import {
  Image, MessageSquare, Upload, Download, Trash2,
  Smartphone, MapPin, Clipboard, FileText, ScanBarcode
} from 'lucide-react';
import { timeAgo } from '../../utils/helpers';

const iconMap = {
  photo: Image,
  sms: MessageSquare,
  upload: Upload,
  download: Download,
  delete: Trash2,
  device: Smartphone,
  location: MapPin,
  clipboard: Clipboard,
  file: FileText,
  barcode: ScanBarcode,
};

const colorMap = {
  photo: 'text-purple-400 bg-purple-500/20',
  sms: 'text-blue-400 bg-blue-500/20',
  upload: 'text-green-400 bg-green-500/20',
  download: 'text-cyan-400 bg-cyan-500/20',
  delete: 'text-red-400 bg-red-500/20',
  device: 'text-orange-400 bg-orange-500/20',
  location: 'text-rose-400 bg-rose-500/20',
  clipboard: 'text-amber-400 bg-amber-500/20',
  file: 'text-indigo-400 bg-indigo-500/20',
  barcode: 'text-teal-400 bg-teal-500/20',
};

export default function ActivityTimeline({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-400 text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, index) => {
        const Icon = iconMap[activity.type] || FileText;
        const colors = colorMap[activity.type] || 'text-slate-400 bg-slate-500/20';

        return (
          <motion.div
            key={activity.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
          >
            <div className={`p-2 rounded-lg ${colors}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{activity.description}</p>
              <p className="text-xs text-slate-400">{activity.details}</p>
            </div>
            <span className="text-xs text-slate-500 whitespace-nowrap">
              {timeAgo(activity.createdAt)}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
