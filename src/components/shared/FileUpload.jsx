import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileUp } from 'lucide-react';
import { classNames } from '../../utils/helpers';

export default function FileUpload({ onDrop, accept, multiple = true, className = '' }) {
  const onDropCallback = useCallback(
    (acceptedFiles) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropCallback,
    accept,
    multiple,
  });

  return (
    <div
      {...getRootProps()}
      className={classNames(
        'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300',
        isDragActive
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50/50',
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        {isDragActive ? (
          <FileUp className="h-10 w-10 text-blue-500" />
        ) : (
          <Upload className="h-10 w-10 text-slate-400" />
        )}
        <div>
          <p className="text-sm font-medium text-slate-700">
            {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            or click to select files
          </p>
        </div>
      </div>
    </div>
  );
}
