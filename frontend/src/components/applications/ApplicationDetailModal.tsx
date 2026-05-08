import { ExternalLink, Calendar, MapPin, IndianRupee, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '@/utils/format';
import type { JobApplication } from '@/types';

interface ApplicationDetailModalProps {
  application: JobApplication | null;
  open: boolean;
  onClose: () => void;
  onEdit: (a: JobApplication) => void;
  onDelete: (a: JobApplication) => void;
}

export function ApplicationDetailModal({
  application,
  open,
  onClose,
  onEdit,
  onDelete,
}: ApplicationDetailModalProps) {
  if (!application) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={application.position}
      description={`${application.company}${application.location ? ` · ${application.location}` : ''}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button
            variant="outline"
            leftIcon={<Trash2 className="size-4" />}
            onClick={() => {
              onDelete(application);
              onClose();
            }}
          >
            Delete
          </Button>
          <Button
            leftIcon={<Pencil className="size-4" />}
            onClick={() => {
              onEdit(application);
              onClose();
            }}
          >
            Edit
          </Button>
        </>
      }
    >
      <div className="grid gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={application.status} />
          {application.link && (
            <a
              href={application.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent-500 transition-colors"
            >
              <ExternalLink className="size-3" />
              View listing
            </a>
          )}
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
          <DetailItem icon={<Calendar className="size-3.5" />} label="Applied">
            {formatDate(application.applicationDate)}
          </DetailItem>
          <DetailItem icon={<MapPin className="size-3.5" />} label="Location">
            {application.location || '—'}
          </DetailItem>
          <DetailItem icon={<IndianRupee className="size-3.5" />} label="Salary">
            {application.salary || '—'}
          </DetailItem>
        </dl>

        {application.jobDescription && (
          <DetailSection title="Job description">
            <p className="text-sm leading-relaxed text-muted whitespace-pre-wrap">
              {application.jobDescription}
            </p>
          </DetailSection>
        )}

        {application.notes && (
          <DetailSection title="Notes">
            <p className="text-sm leading-relaxed text-muted whitespace-pre-wrap">
              {application.notes}
            </p>
          </DetailSection>
        )}
      </div>
    </Modal>
  );
}

function DetailItem({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-faint">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="text-xs font-medium uppercase tracking-[0.14em] text-faint mb-2">{title}</h4>
      <div className="rounded-xl bg-surface-2/60 border border-app p-3.5">{children}</div>
    </section>
  );
}
