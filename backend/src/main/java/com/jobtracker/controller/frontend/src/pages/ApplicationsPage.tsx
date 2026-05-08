import { useEffect, useMemo, useState } from 'react';
import { Plus, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Filters, type ViewMode } from '@/components/applications/Filters';
import { ApplicationCard } from '@/components/applications/ApplicationCard';
import { ApplicationTable } from '@/components/applications/ApplicationTable';
import { ApplicationForm } from '@/components/applications/ApplicationForm';
import { ApplicationDetailModal } from '@/components/applications/ApplicationDetailModal';
import { applicationService } from '@/services/applicationService';
import { extractErrorMessage } from '@/services/api';
import { useDebounce } from '@/hooks/useDebounce';
import type { ApplicationStatus, JobApplication, JobApplicationInput } from '@/types';

type ModalKind = null | 'create' | 'edit' | 'view' | 'delete';

export function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [status, setStatus] = useState<ApplicationStatus | ''>('');
  const [view, setView] = useState<ViewMode>('cards');

  const [sortField, setSortField] = useState<string>('applicationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const [modalKind, setModalKind] = useState<ModalKind>(null);
  const [activeApp, setActiveApp] = useState<JobApplication | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const refresh = async (statusFilter: ApplicationStatus | '' = status) => {
    setLoading(true);
    try {
      const page = await applicationService.list({
        size: 200,
        sort: `${sortField},${sortDirection}`,
        status: statusFilter || undefined,
      });
      setApplications(page.content);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not load applications.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sortField, sortDirection]);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return applications;
    const q = debouncedSearch.trim().toLowerCase();
    return applications.filter(
      (a) =>
        a.company.toLowerCase().includes(q) ||
        a.position.toLowerCase().includes(q) ||
        (a.location ?? '').toLowerCase().includes(q),
    );
  }, [applications, debouncedSearch]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCreate = () => {
    setActiveApp(null);
    setModalKind('create');
  };
  const handleEdit = (a: JobApplication) => {
    setActiveApp(a);
    setModalKind('edit');
  };
  const handleView = (a: JobApplication) => {
    setActiveApp(a);
    setModalKind('view');
  };
  const handleDelete = (a: JobApplication) => {
    setActiveApp(a);
    setModalKind('delete');
  };
  const closeModal = () => {
    if (submitting) return;
    setModalKind(null);
    setActiveApp(null);
  };

  const onSubmit = async (data: JobApplicationInput) => {
    setSubmitting(true);
    try {
      if (modalKind === 'edit' && activeApp) {
        const updated = await applicationService.update(activeApp.id, data);
        setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        toast.success('Application updated');
      } else {
        const created = await applicationService.create(data);
        setApplications((prev) => [created, ...prev]);
        toast.success('Application added');
      }
      closeModal();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not save changes.'));
    } finally {
      setSubmitting(false);
    }
  };

  const onConfirmDelete = async () => {
    if (!activeApp) return;
    setSubmitting(true);
    try {
      await applicationService.remove(activeApp.id);
      setApplications((prev) => prev.filter((a) => a.id !== activeApp.id));
      toast.success('Application deleted');
      closeModal();
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Could not delete.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Every role, every stage, in one focused list."
        action={
          <Button leftIcon={<Plus className="size-4" />} onClick={handleCreate}>
            Add application
          </Button>
        }
      />

      <Filters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        view={view}
        onViewChange={setView}
      />

      {loading ? (
        view === 'table' ? (
          <ApplicationTable
            applications={[]}
            loading
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        )
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="size-5" />}
          title={search || status ? 'No matching applications' : 'No applications yet'}
          description={
            search || status
              ? 'Try clearing filters or searching for a different term.'
              : 'Add your first application and we\'ll start tracking the funnel.'
          }
          action={
            !search && !status ? (
              <Button leftIcon={<Plus className="size-4" />} onClick={handleCreate}>
                Add your first application
              </Button>
            ) : null
          }
        />
      ) : view === 'table' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
          <ApplicationTable
            applications={filtered}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <ApplicationCard
              key={String(a.id)}
              app={a}
              index={i}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create/Edit modal */}
      <Modal
        open={modalKind === 'create' || modalKind === 'edit'}
        onClose={closeModal}
        size="xl"
        title={modalKind === 'edit' ? 'Edit application' : 'Add application'}
        description={
          modalKind === 'edit'
            ? 'Update the role details below.'
            : 'Capture the role you just applied to.'
        }
      >
        <ApplicationForm
          initial={modalKind === 'edit' ? activeApp ?? undefined : undefined}
          onSubmit={onSubmit}
          onCancel={closeModal}
          submitting={submitting}
        />
      </Modal>

      {/* Detail modal */}
      <ApplicationDetailModal
        application={activeApp}
        open={modalKind === 'view'}
        onClose={closeModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Delete confirm */}
      <Modal
        open={modalKind === 'delete'}
        onClose={closeModal}
        size="sm"
        title="Delete application?"
        description="This action can't be undone."
        footer={
          <>
            <Button variant="ghost" onClick={closeModal} disabled={submitting}>Cancel</Button>
            <Button variant="danger" loading={submitting} onClick={onConfirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        {activeApp && (
          <p className="text-sm text-muted">
            <span className="font-medium text-[rgb(var(--text))]">{activeApp.position}</span> at{' '}
            <span className="font-medium text-[rgb(var(--text))]">{activeApp.company}</span> will be permanently removed.
          </p>
        )}
      </Modal>
    </div>
  );
}
