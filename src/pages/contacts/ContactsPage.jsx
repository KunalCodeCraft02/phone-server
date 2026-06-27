import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Plus, Search, Download, RefreshCw, Edit2, Trash2,
  Table, LayoutGrid, User, Phone, Mail, X
} from 'lucide-react';
import {
  useContacts, useSyncContacts, useUpdateContact, useDeleteContact, useExportContacts
} from '../../hooks/useContacts';
import SearchBar from '../../components/shared/SearchBar';
import EmptyState from '../../components/shared/EmptyState';
import Pagination from '../../components/shared/Pagination';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { timeAgo } from '../../utils/helpers';

export default function ContactsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('table');
  const [editContact, setEditContact] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useContacts({ search, page, limit: 20 });
  const syncMutation = useSyncContacts();
  const updateMutation = useUpdateContact();
  const deleteMutation = useDeleteContact();
  const exportMutation = useExportContacts();

  const contacts = data?.contacts || data?.data || [];
  const total = data?.total || contacts.length;
  const totalPages = data?.totalPages || 1;

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    await updateMutation.mutateAsync({
      id: editContact._id,
      data: {
        name: form.get('name'),
        phone: form.get('phone'),
        email: form.get('email'),
      },
    });
    setEditContact(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Contacts</h2>
          <p className="text-slate-500 text-sm">{total} contacts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => syncMutation.mutate()} loading={syncMutation.isPending}>
            <RefreshCw className="h-4 w-4" />
            Sync
          </Button>
          <Button variant="secondary" onClick={() => exportMutation.mutate()} loading={exportMutation.isPending}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-md flex-1">
          <SearchBar onSearch={setSearch} placeholder="Search contacts..." />
        </div>
        <div className="flex gap-1 bg-white/50 rounded-lg p-1 border border-white/50">
          <button
            onClick={() => setView('table')}
            className={`p-2 rounded-lg transition-colors ${view === 'table' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-800'}`}
          >
            <Table className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-800'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white/50 rounded-xl p-4 animate-pulse flex items-center gap-4">
              <div className="h-10 w-10 bg-slate-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-1/4" />
                <div className="h-2 bg-slate-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <EmptyState icon={Users} title="No contacts" description="Sync your contacts to get started" />
      ) : view === 'table' ? (
        <div className="bg-white/50 rounded-2xl overflow-hidden border border-white/50 shadow-lg shadow-slate-200/30">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/50">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Phone</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Email</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50">
              {contacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
                        {contact.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{contact.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{contact.phone}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{contact.email || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditContact(contact)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                        <Edit2 className="h-4 w-4 text-slate-500" />
                      </button>
                      <button onClick={() => setDeleteId(contact._id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <motion.div
              key={contact._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/50 hover:bg-white/70 rounded-2xl p-5 transition-colors border border-white/50 shadow-lg shadow-slate-200/30"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg font-semibold text-white">
                  {contact.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{contact.name}</p>
                  <p className="text-xs text-slate-500">{timeAgo(contact.updatedAt)}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {contact.phone}
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="h-4 w-4 text-slate-400" />
                    {contact.email}
                  </div>
                )}
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-slate-200/50">
                <Button variant="ghost" size="sm" onClick={() => setEditContact(contact)} className="flex-1">
                  <Edit2 className="h-3 w-3" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setDeleteId(contact._id)} className="text-red-500">
                  <Trash2 className="h-3 w-3" />
                </Button>
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

      <Modal isOpen={!!editContact} onClose={() => setEditContact(null)} title="Edit Contact">
        {editContact && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input name="name" label="Name" defaultValue={editContact.name} required />
            <Input name="phone" label="Phone" defaultValue={editContact.phone} required />
            <Input name="email" label="Email" type="email" defaultValue={editContact.email || ''} />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setEditContact(null)}>Cancel</Button>
              <Button type="submit" loading={updateMutation.isPending}>Save</Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Contact">
        <p className="text-slate-600 mb-4">Are you sure you want to delete this contact?</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => {
              deleteMutation.mutate(deleteId, { onSuccess: () => setDeleteId(null) });
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
}
