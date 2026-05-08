import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Sparkles, Wand2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { AnalysisPanel } from '@/components/resumes/AnalysisPanel';
import { resumeService } from '@/services/resumeService';
import { applicationService } from '@/services/applicationService';
import { extractErrorMessage } from '@/services/api';
import { formatDate } from '@/utils/format';
import type { JobApplication, Resume, ResumeAnalysis } from '@/types';

export function AnalyzerPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialResumeId = searchParams.get('resumeId') ?? '';
  const initialJobId = searchParams.get('jobId') ?? '';

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loadingLists, setLoadingLists] = useState(true);

  const [resumeId, setResumeId] = useState<string>(initialResumeId);
  const [jobId, setJobId] = useState<string>(initialJobId);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  // Hydrate the lists in parallel
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingLists(true);
      try {
        const [r, a] = await Promise.allSettled([
          resumeService.list(),
          applicationService.list({ size: 200, sort: 'applicationDate,desc' }),
        ]);
        if (cancelled) return;
        if (r.status === 'fulfilled') {
          setResumes(r.value);
          // Auto-pick first resume if URL param missing
          if (!resumeId && r.value.length > 0) setResumeId(String(r.value[0].id));
        } else {
          toast.error(extractErrorMessage(r.reason, 'Could not load resumes.'));
        }
        if (a.status === 'fulfilled') {
          setApplications(a.value.content);
          if (!jobId && a.value.content.length > 0) setJobId(String(a.value.content[0].id));
        } else {
          toast.error(extractErrorMessage(a.reason, 'Could not load applications.'));
        }
      } finally {
        if (!cancelled) setLoadingLists(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // We intentionally only run this once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep URL in sync with selections so the picker is shareable / refreshable
  useEffect(() => {
    const next = new URLSearchParams();
    if (resumeId) next.set('resumeId', resumeId);
    if (jobId) next.set('jobId', jobId);
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeId, jobId]);

  const selectedResume = useMemo(
    () => resumes.find((r) => String(r.id) === String(resumeId)) ?? null,
    [resumes, resumeId],
  );
  const selectedJob = useMemo(
    () => applications.find((a) => String(a.id) === String(jobId)) ?? null,
    [applications, jobId],
  );

  const canAnalyze = !!selectedResume && !!selectedJob && !analyzing;

  const onAnalyze = async () => {
    if (!selectedResume || !selectedJob) return;
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await resumeService.analyze(selectedResume.id, selectedJob.id);
      setAnalysis(result);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Analysis failed.'));
    } finally {
      setAnalyzing(false);
    }
  };

  const noData = !loadingLists && (resumes.length === 0 || applications.length === 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Analyzer"
        description="Pair a resume with a job application and get an instant match score, missing keywords, and tailored suggestions."
      />

      {noData ? (
        <Card>
          <EmptyState
            icon={<Sparkles className="size-5" />}
            title="A little setup first"
            description={
              resumes.length === 0
                ? 'Upload a resume to get started, then come back here to analyze it.'
                : 'Add a job application — we need a job description to compare against.'
            }
            action={
              resumes.length === 0 ? (
                <Link to="/resumes">
                  <Button leftIcon={<FileText className="size-4" />}>Go to Resumes</Button>
                </Link>
              ) : (
                <Link to="/applications">
                  <Button>Add an application</Button>
                </Link>
              )
            }
          />
        </Card>
      ) : (
        <Card>
          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <Select
              label="Resume"
              value={resumeId}
              onChange={(e) => setResumeId(e.target.value)}
              disabled={loadingLists}
            >
              <option value="">Select a resume</option>
              {resumes.map((r) => (
                <option key={String(r.id)} value={String(r.id)}>
                  {r.originalFileName ?? r.fileName}
                </option>
              ))}
            </Select>

            <Select
              label="Job application"
              value={jobId}
              onChange={(e) => setJobId(e.target.value)}
              disabled={loadingLists}
            >
              <option value="">Select an application</option>
              {applications.map((a) => (
                <option key={String(a.id)} value={String(a.id)}>
                  {a.position} — {a.company} · {formatDate(a.applicationDate)}
                </option>
              ))}
            </Select>

            <Button
              onClick={onAnalyze}
              disabled={!canAnalyze}
              loading={analyzing}
              leftIcon={!analyzing ? <Wand2 className="size-4" /> : undefined}
              size="lg"
            >
              {analyzing ? 'Analyzing…' : 'Run analysis'}
            </Button>
          </div>

          {selectedJob && !selectedJob.jobDescription && (
            <p className="mt-3 text-xs text-warn">
              Heads-up: this application has no job description on file. Edit it from the Applications page to add one — the analyzer relies on it.
            </p>
          )}
        </Card>
      )}

      {analyzing && (
        <Card>
          <div className="flex items-center justify-center gap-3 py-10 text-muted">
            <Spinner size="lg" />
            <span>Running keyword + skill-alias matching…</span>
          </div>
        </Card>
      )}

      {analysis && !analyzing && (
        <motion.div
          key={`${resumeId}-${jobId}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnalysisPanel analysis={analysis} />
        </motion.div>
      )}
    </div>
  );
}
