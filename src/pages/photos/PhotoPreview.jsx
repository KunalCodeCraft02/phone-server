import { Download, Trash2, Share2, X, Calendar, HardDrive } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDateTime, formatFileSize } from '../../utils/helpers';
import { useDeletePhoto } from '../../hooks/usePhotos';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function PhotoPreview({ photo, isOpen, onClose, onDelete }) {
  const deleteMutation = useDeletePhoto();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this photo?')) {
      await deleteMutation.mutateAsync(photo._id);
      onDelete?.();
      onClose();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.filename || 'photo.jpg';
    link.click();
  };

  if (!photo) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 min-h-[300px] lg:min-h-[400px] rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
          <img
            src={photo.url}
            alt={photo.filename || 'Photo'}
            className="max-w-full max-h-[50vh] lg:max-h-[60vh] object-contain"
          />
        </div>

        <div className="lg:w-64 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 truncate">
              {photo.filename || 'Untitled'}
            </h3>
          </div>

          <div className="space-y-3">
            {photo.createdAt && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{formatDateTime(photo.createdAt)}</span>
              </div>
            )}
            {photo.size && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <HardDrive className="h-4 w-4 text-slate-400" />
                <span>{formatFileSize(photo.size)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-slate-200/50">
            <Button onClick={handleDownload} variant="secondary" className="w-full">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button onClick={handleDelete} variant="danger" className="w-full">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
