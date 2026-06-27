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
  image: 'text-purple-600 bg-purple-50',
  video: 'text-red-600 bg-red-50',
  audio: 'text-green-600 bg-green-50',
  document: 'text-blue-600 bg-blue-50',
  archive: 'text-amber-600 bg-amber-50',
  code: 'text-cyan-600 bg-cyan-50',
  other: 'text-slate-500 bg-slate-100',
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
          <h2 className="text-2xl font-bold text-slate-800">Files</h2>
          <p className="text-slate-500 text-sm">{files.length} files</p>
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
        <div className="flex gap-1 bg-white/50 rounded-lg p-1 border border-white/50">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-800'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-800'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white/50 rounded-2xl p-5 animate-pulse">
              <div className="h-10 w-10 bg-slate-200 rounded-xl mb-3" />
              <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-2 bg-slate-200 rounded w-1/2" />
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
                className="bg-white/50 hover:bg-white/70 rounded-2xl p-5 transition-colors group border border-white/50 shadow-lg shadow-slate-200/30"
              >
                <div className={`inline-flex p-3 rounded-xl ${colors} mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-slate-800 truncate">{file.filename || file.name}</p>
                <p className="text-xs text-slate-500 mt-1">{formatFileSize(file.size)}</p>
                <p className="text-xs text-slate-400 mt-1">{timeAgo(file.createdAt)}</p>
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(file)} className="flex-1">
                    <Download className="h-3 w-3" /> Download
                  </Button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this file?')) deleteMutation.mutate(file._id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/50 rounded-2xl overflow-hidden border border-white/50 shadow-lg shadow-slate-200/30">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/50">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Size</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Modified</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50">
              {files.map((file) => {
                const type = getFileType(file.filename || file.name);
                const Icon = iconMap[type];
                const colors = colorMap[type];

                return (
                  <tr key={file._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${colors}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm text-slate-800">{file.filename || file.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatFileSize(file.size)}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{timeAgo(file.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDownload(file)} className="p-1.5 rounded-lg hover:bg-slate-100">
                          <Download className="h-4 w-4 text-slate-500" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this file?')) deleteMutation.mutate(file._id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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
