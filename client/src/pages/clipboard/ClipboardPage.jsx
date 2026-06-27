import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clipboard, Copy, Trash2, RefreshCw, Search as SearchIcon } from 'lucide-react';
import { useClipboardList, useSyncClipboard, useDeleteClipboardItem } from '../../hooks/useClipboard';
import useSocket from '../../hooks/useSocket';
import SearchBar from '../../components/shared/SearchBar';
import EmptyState from '../../components/shared/EmptyState';
import Pagination from '../../components/shared/Pagination';
import Button from '../../components/ui/Button';
import { timeAgo, truncate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function ClipboardPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useClipboardList({ search, page, limit: 20 });
  const syncMutation = useSyncClipboard();
  const deleteMutation = useDeleteClipboardItem();

  useSocket('clipboard:new', () => {});
  useSocket('clipboard:deleted', () => {});

  const items = data?.items || data?.data || [];
  const total = data?.total || items.length;
  const totalPages = data?.totalPages || 1;

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch {
      toast.error('Failed to copy');
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
          <h2 className="text-2xl font-bold text-white">Clipboard</h2>
          <p className="text-slate-400 text-sm">{total} items</p>
        </div>
        <Button variant="secondary" onClick={() => syncMutation.mutate()} loading={syncMutation.isPending}>
          <RefreshCw className="h-4 w-4" />
          Sync Clipboard
        </Button>
      </div>

      <div className="max-w-md">
        <SearchBar onSearch={setSearch} placeholder="Search clipboard..." />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Clipboard}
          title="No clipboard items"
          description="Copy something on your device to sync here"
        />
      ) : (
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
                  <p className="text-sm text-white whitespace-pre-wrap break-words">
                    {truncate(item.content || item.text, 200)}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    {item.type && <span className="mr-2 px-2 py-0.5 bg-white/10 rounded text-slate-400">{item.type}</span>}
                    {timeAgo(item.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => copyToClipboard(item.content || item.text)}
                    className="p-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                    title="Copy back"
                  >
                    <Copy className="h-4 w-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this item?')) {
                        deleteMutation.mutate(item._id);
                      }
                    }}
                    className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </motion.div>
  );
}
