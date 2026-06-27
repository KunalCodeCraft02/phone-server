import { motion } from 'framer-motion';
import { QrCode, Trash2, Copy, ExternalLink } from 'lucide-react';
import { useQRList, useDeleteQR } from '../../hooks/useQR';
import SearchBar from '../../components/shared/SearchBar';
import EmptyState from '../../components/shared/EmptyState';
import { timeAgo, truncate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function QRHistory({ search }) {
  const { data, isLoading } = useQRList({ search, limit: 50 });
  const deleteMutation = useDeleteQR();

  const items = data?.scans || data?.data || [];

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState icon={QrCode} title="No scans yet" description="Scan a QR code to see history" />
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <motion.div
          key={item._id || index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white break-all">{truncate(item.content || item.data, 150)}</p>
              <p className="text-xs text-slate-500 mt-1">{timeAgo(item.createdAt)}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => copyToClipboard(item.content || item.data)}
                className="p-2 rounded-lg hover:bg-blue-500/20 transition-colors"
              >
                <Copy className="h-4 w-4 text-blue-400" />
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete?')) deleteMutation.mutate(item._id);
                }}
                className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
