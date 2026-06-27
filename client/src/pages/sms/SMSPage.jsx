import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MessageSquare, Inbox, Send, AlertCircle, Trash2 } from 'lucide-react';
import { useSMSList, useDeleteSMS } from '../../hooks/useSMS';
import useSocket from '../../hooks/useSocket';
import SearchBar from '../../components/shared/SearchBar';
import EmptyState from '../../components/shared/EmptyState';
import Pagination from '../../components/shared/Pagination';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { timeAgo, truncate } from '../../utils/helpers';
import SMSSend from './SMSSend';

const tabs = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'failed', label: 'Failed', icon: AlertCircle },
];

export default function SMSPage() {
  const [tab, setTab] = useState('inbox');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showSend, setShowSend] = useState(false);

  const { data, isLoading } = useSMSList({ type: tab, search, page, limit: 20 });
  const deleteMutation = useDeleteSMS();

  useSocket('sms:new', () => {});

  const messages = data?.messages || data?.data || [];
  const total = data?.total || messages.length;
  const totalPages = data?.totalPages || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">SMS</h2>
          <p className="text-slate-400 text-sm">{total} messages</p>
        </div>
        <Button onClick={() => setShowSend(true)}>
          <Plus className="h-4 w-4" />
          Send SMS
        </Button>
      </div>

      <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 w-fit">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setPage(1); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="max-w-md">
        <SearchBar onSearch={setSearch} placeholder="Search messages..." />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-white/10 rounded w-1/4" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No messages"
          description={`No ${tab} messages found`}
        />
      ) : (
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <motion.div
              key={msg._id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <MessageSquare className="h-4 w-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-white">
                      {msg.type === 'sent' ? `To: ${msg.receiver}` : `From: ${msg.sender}`}
                    </p>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {timeAgo(msg.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1">{truncate(msg.body || msg.message, 100)}</p>
                  {msg.status && (
                    <Badge
                      variant={msg.status === 'sent' ? 'success' : msg.status === 'failed' ? 'danger' : 'info'}
                      className="mt-2"
                    >
                      {msg.status}
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (confirm('Delete this message?')) {
                      deleteMutation.mutate(msg._id);
                    }
                  }}
                  className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/20 transition-all"
                >
                  <Trash2 className="h-4 w-4 text-red-400" />
                </button>
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

      <SMSSend isOpen={showSend} onClose={() => setShowSend(false)} />
    </motion.div>
  );
}
