import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle2, X, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { WelcomeWidget } from '@/components/dashboard/WelcomeWidget';
import { StatCard } from '@/components/dashboard/StatCard';
import { StatusPieChart } from '@/components/dashboard/StatusPieChart';
import { ApplicationsTimelineChart } from '@/components/dashboard/ApplicationsTimelineChart';
import { RecentApplications } from '@/components/dashboard/RecentApplications';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { applicationService } from '@/services/applicationService';
import { extractErrorMessage } from '@/services/api';
import type { ApplicationStats, JobApplication } from '@/types';

export function DashboardPage() {
  const [stats, setStats] = useState<ApplicationStats | undefined>();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [statsResult, appsResult] = await Promise.allSettled([
          applicationService.stats(),
          applicationService.list({ size: 100, sort: 'applicationDate,desc' }),
        ]);

        if (cancelled) return;

        if (appsResult.status === 'fulfilled') {
          setApplications(appsResult.value.content);
        } else {
          toast.error(extractErrorMessage(appsResult.reason, 'Could not load applications.'));
        }

        if (statsResult.status === 'fulfilled') {
          setStats(statsResult.value);
        } else if (appsResult.status === 'fulfilled') {
          // Fallback: derive stats from the list if /stats fails.
          const apps = appsResult.value.content;
          setStats({
            total: apps.length,
            applied: apps.filter((a) => a.status === 'APPLIED').length,
            interview: apps.filter((a) => a.status === 'INTERVIEW').length,
            offer: apps.filter((a) => a.status === 'OFFER').length,
            rejected: apps.filter((a) => a.status === 'REJECTED').length,
            withdrawn: apps.filter((a) => a.status === 'WITHDRAWN').length,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Your pipeline at a glance — track applications, surface signal, keep momentum."
        action={
          <Link to="/applications">
            <Button leftIcon={<Plus className="size-4" />} size="sm">
              Add application
            </Button>
          </Link>
        }
      />

      <WelcomeWidget />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={stats?.total ?? 0} hint="All applications" icon={<Briefcase className="size-4" />} loading={loading} delay={0.05} />
        <StatCard label="Interviewing" value={stats?.interview ?? 0} hint="In-progress" accent="text-warn" icon={<Clock className="size-4" />} loading={loading} delay={0.12} />
        <StatCard label="Offers" value={stats?.offer ?? 0} hint="Closed-won" accent="text-success" icon={<CheckCircle2 className="size-4" />} loading={loading} delay={0.19} />
        <StatCard label="Rejected" value={stats?.rejected ?? 0} hint="Closed-lost" accent="text-danger" icon={<X className="size-4" />} loading={loading} delay={0.26} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ApplicationsTimelineChart applications={applications} loading={loading} />
        <StatusPieChart stats={stats} loading={loading} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentApplications applications={applications} loading={loading} />
        </div>
        <ActivityTimeline applications={applications} loading={loading} />
      </div>
    </div>
  );
}
