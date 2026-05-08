import { motion } from 'framer-motion';
import { FileText, Trash2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, formatFileSize } from '@/utils/format';
import type { Resume } from '@/types';

interface ResumeCardProps {
  resume: Resume;
  active?: boolean;
  onSelect: (r: Resume) => void;
  onAnalyze: (r: Resume) => void;
  onDelete: (r: Resume) => void;
  index?: number;
}

export function ResumeCard({ resume, active, onSelect, onAnalyze, onDelete, index = 0 }: ResumeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Card
        unpadded
        className={`p-4 transition-all cursor-pointer hover:shadow-soft-lg ${
          active ? 'ring-2 ring-accent-400 border-accent-400' : ''
        }`}
        onClick={() => onSelect(resume)}
      >
        <div className="flex items-start gap-3">
          <div className="size-10 shrink-0 rounded-xl bg-surface-2 grid place-items-center text-faint">
            <FileText className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">
              {resume.originalFileName ?? resume.fileName}
            </p>
            <p className="text-xs text-faint mt-0.5">
              Uploaded {formatDate(resume.uploadedAt)}
              {resume.fileSize ? ` · ${formatFileSize(resume.fileSize)}` : ''}
            </p>
          </div>
          {active && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-accent-600 dark:text-accent-300">
              <CheckCircle2 className="size-3.5" /> Selected
            </span>
          )}
        </div>

        <div
          className="mt-3 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Sparkles className="size-3.5" />}
            onClick={() => onAnalyze(resume)}
          >
            Analyze
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Trash2 className="size-3.5" />}
            onClick={() => onDelete(resume)}
            className="text-faint hover:text-danger"
          >
            Delete
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
