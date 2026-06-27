import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen, Upload, Download, Trash2, Grid, List, File,
  Image, Film, Music, FileText, Archive, Code, ChevronRight
} from 'lucide-react';
import { useFiles, useUploadFile, useDownloadFile, useDeleteFile } from '../../hooks/useFiles';
import SearchBar from '../../components/shared/SearchBar';
import EmptyState from '../../components/shared/EmptyState';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import FileUpload from '../../components/shared/FileUpload';
import { formatFileSize, getFileType } from '../../utils/helpers';
import { timeAgo } from '../../utils/helpers';
import toast from 'react-hot-toast';

const iconMap = {
  image: Image,
  video: Film,
  audio: Music,
  document: FileText,
  archive: Archive,
  code: Code,
  other: File,
};

const colorMap = {
  image: 'text-purple-400 bg-purple-500/20',
  video: 'text-red-400 bg-red-500/20',
  audio: 'text-green-400 bg-green-500/20',
  document: 'text-blue-400 bg-blue-500/20',
  archive: 'text-amber-400 bg-amber-500/20',
  code: 'text-cyan-400 bg-cyan-500/20',
  other: 'text-slate-400 bg-slate-500/20',
};

export default function FilesPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [showUpload, setShowUpload] = useState(false);

  const { data, isLoading } = useFiles({ search, limit: 50 });
  const uploadMutation = useUploadFile();
  const downloadMutation = useDownloadFile();
  const deleteMutation = useDeleteFile();

  const files = data?.files || data?.data || [];

  const handleUpload = useCallback(async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      await uploadMutation.mutateAsync({ formData });
    }
    setShowUpload(false);
  }, [uploadMutation]);

  const handleDownload = useCallback((file) => {
    downloadMutation.mutate({ id: file._id, filename: file.filename || file.name });
  }, [downloadMutation]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Files</h2>
          <p className="text-slate-400 text-sm">{files.length} files</p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Upload className="h-4 w-4" />
          Upload Files
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-md flex-1">
          <SearchBar onSearch={setSearch} placeholder="Search files..." />
        </div>
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white/5 rounded-2xl p-5 animate-pulse">
              <div className="h-10 w-10 bg-white/10 rounded-xl mb-3" />
              <div className="h-3 bg-white/10 rounded w-3/4 mb-2" />
              <div className="h-2 bg-white/10 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : files.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No files"
          description="Upload your first file to get started"
          action={
            <Button onClick={() => setShowUpload(true)}>
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
          }
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file, index) => {
            const type = getFileType(file.filename || file.name);
            const Icon = iconMap[type];
            const colors = colorMap[type];

            return (
              <motion.div
                key={file._id || index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white/5 hover:bg-white/10 rounded-2xl p-5 transition-colors group"
              >
                <div className={`inline-flex p-3 rounded-xl ${colors} mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-white truncate">{file.filename || file.name}</p>
                <p className="text-xs text-slate-400 mt-1">{formatFileSize(file.size)}</p>
                <p className="text-xs text-slate-500 mt-1">{timeAgo(file.createdAt)}</p>
                <div className="flex gap-2 mt-3 pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(file)} className="flex-1">
                    <Download className="h-3 w-3" /> Download
                  </Button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this file?')) deleteMutation.mutate(file._id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4 text-red-400" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/5 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-3">Size</th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-3">Modified</th>
                <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {files.map((file) => {
                const type = getFileType(file.filename || file.name);
                const Icon = iconMap[type];
                const colors = colorMap[type];

                return (
                  <tr key={file._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colors}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-white">{file.filename || file.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">{formatFileSize(file.size)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{timeAgo(file.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDownload(file)} className="p-1.5 rounded-lg hover:bg-white/10">
                          <Download className="h-4 w-4 text-slate-400" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this file?')) deleteMutation.mutate(file._id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Files">
        <FileUpload onDrop={handleUpload} multiple />
      </Modal>
    </motion.div>
  );
}
