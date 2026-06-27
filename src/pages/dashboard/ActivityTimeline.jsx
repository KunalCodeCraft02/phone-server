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
  photo: 'text-purple-600 bg-purple-50',
  sms: 'text-blue-600 bg-blue-50',
  upload: 'text-green-600 bg-green-50',
  download: 'text-cyan-600 bg-cyan-50',
  delete: 'text-red-600 bg-red-50',
  device: 'text-orange-600 bg-orange-50',
  location: 'text-rose-600 bg-rose-50',
  clipboard: 'text-amber-600 bg-amber-50',
  file: 'text-indigo-600 bg-indigo-50',
  barcode: 'text-teal-600 bg-teal-50',
};

export default function ActivityTimeline({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {activities.map((activity, index) => {
        const Icon = iconMap[activity.type] || FileText;
        const colors = colorMap[activity.type] || 'text-slate-500 bg-slate-100';

        return (
          <motion.div
            key={activity.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className={`p-2 rounded-lg ${colors}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-800 truncate">{activity.description}</p>
              <p className="text-xs text-slate-500">{activity.details}</p>
            </div>
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {timeAgo(activity.createdAt)}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
