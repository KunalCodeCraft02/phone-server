import { useState, useCallback } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUploadPhoto } from '../../hooks/usePhotos';
import Button from '../../components/ui/Button';

export default function PhotoUpload({ onClose }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const uploadMutation = useUploadPhoto();

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selected]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('photo', files[i]);
      await uploadMutation.mutateAsync({
        formData,
        onProgress: (e) => {
          const total = ((i + e.loaded / e.total) / files.length) * 100;
          setProgress(Math.round(total));
        },
      });
    }

    setUploading(false);
    setFiles([]);
    onClose?.();
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-white/40 transition-colors">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="photo-upload"
        />
        <label htmlFor="photo-upload" className="cursor-pointer">
          <Camera className="h-12 w-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-white">Select photos</p>
          <p className="text-xs text-slate-400 mt-1">or drag and drop</p>
        </label>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-3 gap-2">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-24 object-cover rounded-xl"
                  />
                  <button
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
                <p className="text-xs text-slate-400 text-center">{progress}% uploaded</p>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleUpload} loading={uploading} className="flex-1">
                <Upload className="h-4 w-4" />
                Upload {files.length} photo{files.length > 1 ? 's' : ''}
              </Button>
              <Button variant="ghost" onClick={() => setFiles([])}>
                Clear
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
