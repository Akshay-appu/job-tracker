import { motion } from 'framer-motion';
import { Pencil, Trash2, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '@/utils/format';
import type { JobApplication } from '@/types';

interface ApplicationCardProps {
  app: JobApplication;
  onView: (a: JobApplication) => void;
  onEdit: (a: JobApplication) => void;
  onDelete: (a: JobApplication) => void;
  index?: number;
}

export function ApplicationCard({ app, onView, onEdit, onDelete, index = 0 }: ApplicationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="group h-full flex flex-col gap-3 transition-shadow hover:shadow-soft-lg">
        <div className="flex items-start gap-3">
          <button
            onClick={() => onView(app)}
            className="size-10 shrink-0 rounded-xl bg-surface-2 grid place-items-center text-sm font-semibold text-muted hover:bg-[rgb(var(--border))] transition-colors focus-ring"
            aria-label={`View ${app.position} at ${app.company}`}
          >
            {app.company?.[0]?.toUpperCase() ?? '?'}
          </button>
          <div className="min-w-0 flex-1">
            <button
              onClick={() => onView(app)}
              className="text-left w-full"
            >
              <p className="font-medium truncate group-hover:text-accent-500 transition-colors">{app.position}</p>
              <p className="text-xs text-muted truncate">{app.company}</p>
            </button>
          </div>
          <StatusBadge status={app.status} />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-faint">
          <span className="inline-flex items-center gap-1.5 truncate">
            <MapPin className="size-3 shrink-0" />
            {app.location || '—'}
          </span>
          <span className="inline-flex items-center gap-1.5 truncate">
            <Calendar className="size-3 shrink-0" />
            {formatDate(app.applicationDate)}
          </span>
        </div>

        {app.notes && (
          <p className="text-xs text-muted line-clamp-2 leading-relaxed">{app.notes}</p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-app">
          {app.link ? (
            <a
              href={app.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent-500 transition-colors"
            >
              <ExternalLink className="size-3" /> Listing
            </a>
          ) : (
            <span aria-hidden />
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(app)}
              className="rounded-lg p-1.5 text-faint hover:bg-surface-2 hover:text-[rgb(var(--text))] focus-ring"
              aria-label="Edit"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              onClick={() => onDelete(app)}
              className="rounded-lg p-1.5 text-faint hover:bg-danger/10 hover:text-danger focus-ring"
              aria-label="Delete"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
