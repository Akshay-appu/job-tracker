import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ALLOWED_RESUME_EXTS, ALLOWED_RESUME_TYPES, MAX_RESUME_SIZE_BYTES } from '@/utils/constants';
import { formatFileSize } from '@/utils/format';
import { cn } from '@/utils/cn';

interface ResumeUploaderProps {
  uploading?: boolean;
  progress?: number;
  onUpload: (file: File) => Promise<void> | void;
}

export function ResumeUploader({ uploading, progress = 0, onUpload }: ResumeUploaderProps) {
  const [hover, setHover] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = (file: File): string | null => {
    const okType = ALLOWED_RESUME_TYPES.includes(file.type) ||
      ALLOWED_RESUME_EXTS.some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!okType) return 'Only PDF and DOCX files are supported.';
    if (file.size > MAX_RESUME_SIZE_BYTES) return `File too large. Max ${formatFileSize(MAX_RESUME_SIZE_BYTES)}.`;
    return null;
  };

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      const err = validate(file);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      setPendingFile(file);
      try {
        await onUpload(file);
      } finally {
        setPendingFile(null);
      }
    },
    [onUpload],
  );

  return (
    <div className="grid gap-3">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHover(false);
          if (uploading) return;
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          'relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all',
          'flex flex-col items-center gap-3',
          hover
            ? 'border-accent-400 bg-accent-50/40 dark:bg-accent-300/5'
            : 'border-app hover:border-strong bg-surface-2/40',
          uploading && 'pointer-events-none opacity-80',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_RESUME_EXTS.join(',')}
          className="sr-only"
          onChange={(e) => {
            void handleFiles(e.target.files);
            // allow re-selecting the same file
            if (inputRef.current) inputRef.current.value = '';
          }}
          disabled={uploading}
        />

        <span
          className={cn(
            'rounded-2xl bg-surface ring-1 ring-app p-3 text-faint shadow-soft',
            hover && 'text-accent-500',
          )}
        >
          <Upload className="size-6" />
        </span>

        <div>
          <p className="font-display text-base tracking-tight">
            Drop your resume here, or <span className="text-accent-500 underline-offset-4 hover:underline">browse</span>
          </p>
          <p className="text-xs text-muted mt-1">
            PDF or DOCX · up to {formatFileSize(MAX_RESUME_SIZE_BYTES)}
          </p>
        </div>

        <AnimatePresence>
          {(uploading || pendingFile) && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-sm"
            >
              <div className="flex items-center gap-2 text-xs text-muted mb-1.5">
                <FileText className="size-3.5" />
                <span className="truncate flex-1 text-left">{pendingFile?.name ?? 'Uploading…'}</span>
                <span className="tabular-nums">{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <motion.div
                  className="h-full bg-accent-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </label>

      {error && (
        <p className="inline-flex items-center gap-2 text-xs text-danger">
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      )}

      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          Choose file
        </Button>
      </div>
    </div>
  );
}
