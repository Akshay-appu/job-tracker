import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ResumeUploader } from '@/components/resumes/ResumeUploader';
import { ResumeCard } from '@/components/resumes/ResumeCard';
import { resumeService } from '@/services/resumeService';
import { extractErrorMessage } from '@/services/api';
import type { Resume } from '@/types';

export function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<Resume | null>(null);
  const [deleting, setDeleting] = useState<Resume | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    void refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await resumeService.list();
      setResumes(data);
      // auto-select most recent
      if (data.length > 0 && !active) setActive(data[0]);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not load your resumes.'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    try {
      const created = await resumeService.upload(file, (p) => setProgress(p));
      setResumes((prev) => [created, ...prev]);
      setActive(created);
      toast.success('Resume uploaded');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Upload failed.'));
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleAnalyze = (resume: Resume) => {
    navigate(`/analyzer?resumeId=${resume.id}`);
  };

  const handleDelete = (resume: Resume) => setDeleting(resume);

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await resumeService.remove(deleting.id);
      setResumes((prev) => prev.filter((r) => r.id !== deleting.id));
      if (active?.id === deleting.id) {
        setActive(null);
      }
      toast.success('Resume deleted');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete.'));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resumes"
        description="Upload one or more resumes — we'll keep them ready for AI matching."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card className="h-fit">
          <h3 className="font-display text-base tracking-tight mb-4">Upload a resume</h3>
          <ResumeUploader uploading={uploading} progress={progress} onUpload={handleUpload} />
        </Card>

        <Card unpadded className="h-fit p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base tracking-tight">Your resumes</h3>
            {!loading && resumes.length > 0 && (
              <span className="text-[11px] text-faint uppercase tracking-[0.14em]">
                {resumes.length} on file
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : resumes.length === 0 ? (
            <EmptyState
              icon={<FileText className="size-5" />}
              title="No resumes yet"
              description="Drop a PDF or DOCX above to get started."
            />
          ) : (
            <div className="grid gap-3">
              {resumes.map((r, i) => (
                <ResumeCard
                  key={String(r.id)}
                  resume={r}
                  active={active?.id === r.id}
                  onSelect={setActive}
                  onAnalyze={handleAnalyze}
                  onDelete={handleDelete}
                  index={i}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        size="sm"
        title="Delete resume?"
        description="This file will be removed from your storage."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          </>
        }
      >
        {deleting && (
          <p className="text-sm text-muted">
            <span className="font-medium text-[rgb(var(--text))]">
              {deleting.originalFileName ?? deleting.fileName}
            </span>{' '}
            will be removed permanently.
          </p>
        )}
      </Modal>
    </div>
  );
}
