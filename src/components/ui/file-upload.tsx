'use client';

import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface FileUploadProps {
  onFilesAdded: (files: File[]) => void;
  uploadedFiles: UploadedFile[];
  onRemoveFile: (id: string) => void;
  maxSize?: number;
  accept?: Record<string, string[]>;
}

const DEFAULT_ACCEPT: Record<string, string[]> = {
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/svg+xml': ['.svg'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
};

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

function FileUpload({
  onFilesAdded,
  uploadedFiles,
  onRemoveFile,
  maxSize = DEFAULT_MAX_SIZE,
  accept = DEFAULT_ACCEPT,
}: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesAdded,
    accept,
    maxSize,
    multiple: true,
  });

  const acceptedExtensions = Object.values(accept).flat().join(', ');

  return (
    <div className="w-full space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          'glass-panel flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors',
          isDragActive
            ? 'border-primary bg-primary-light'
            : 'border-glass-border hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mb-2 h-8 w-8 text-muted" />
        <p className="text-sm font-medium text-foreground">
          {isDragActive
            ? 'Drop files here...'
            : 'Drag & drop files here, or click to browse'}
        </p>
        <p className="mt-1 text-xs text-muted">
          {acceptedExtensions} up to {formatFileSize(maxSize)}
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <ul className="space-y-2">
          {uploadedFiles.map((file) => (
            <li
              key={file.id}
              className="glass-panel flex items-center justify-between rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="h-4 w-4 shrink-0 text-muted" />
                <span className="truncate text-sm text-foreground">
                  {file.name}
                </span>
                <span className="shrink-0 text-xs text-muted">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRemoveFile(file.id)}
                className="ml-2 shrink-0 rounded p-1 text-muted hover:bg-glass-bg-hover hover:text-foreground transition-colors"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export { FileUpload, type FileUploadProps, type UploadedFile };
