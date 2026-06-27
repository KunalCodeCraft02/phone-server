import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Image, Trash2, Download } from 'lucide-react';
import { usePhotos, useDeletePhoto } from '../../hooks/usePhotos';
import useSocket from '../../hooks/useSocket';
import SearchBar from '../../components/shared/SearchBar';
import EmptyState from '../../components/shared/EmptyState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import PhotoUpload from './PhotoUpload';
import PhotoPreview from './PhotoPreview';
import Modal from '../../components/ui/Modal';

export default function Gallery() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const { data, isLoading } = usePhotos({ search, page, limit: 20 });
  const deleteMutation = useDeletePhoto();

  useSocket('photo:new', () => {});
  useSocket('photo:deleted', () => {});

  const photos = data?.photos || data?.data || [];
  const total = data?.total || photos.length;

  const handleDelete = useCallback(async (e, id) => {
    e.stopPropagation();
    if (confirm('Delete this photo?')) {
      await deleteMutation.mutateAsync(id);
    }
  }, [deleteMutation]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Photos</h2>
          <p className="text-slate-400 text-sm">{total} photos total</p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Plus className="h-4 w-4" />
          Upload Photos
        </Button>
      </div>

      <div className="max-w-md">
        <SearchBar onSearch={setSearch} placeholder="Search photos..." />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <EmptyState
          icon={Image}
          title="No photos yet"
          description="Upload your first photo to get started"
          action={
            <Button onClick={() => setShowUpload(true)}>
              <Plus className="h-4 w-4" />
              Upload Photos
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <motion.div
              key={photo._id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 cursor-pointer"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.url}
                alt={photo.filename || 'Photo'}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-xs text-white truncate">{photo.filename}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleDelete(e, photo._id)}
                  className="p-1.5 bg-red-500/80 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-3 w-3 text-white" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showUpload} onClose={() => setShowUpload(false)} title="Upload Photos">
        <PhotoUpload onClose={() => setShowUpload(false)} />
      </Modal>

      <PhotoPreview
        photo={selectedPhoto}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />
    </motion.div>
  );
}
