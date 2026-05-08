import { Mail, User as UserIcon, Calendar, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/format';

export function ProfilePage() {
  const { user } = useAuth();
  const displayName = user?.name || user?.username || user?.email?.split('@')[0] || 'there';

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Profile"
        description="The account currently signed in."
      />

      <Card>
        <div className="flex items-center gap-4">
          <Avatar name={displayName} size="lg" />
          <div className="min-w-0">
            <h3 className="font-display text-xl tracking-tight truncate">{displayName}</h3>
            <p className="text-sm text-muted truncate">{user?.email ?? '—'}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field icon={<Mail className="size-3.5" />} label="Email">
            {user?.email ?? '—'}
          </Field>
          <Field icon={<UserIcon className="size-3.5" />} label="Username">
            {user?.username ?? '—'}
          </Field>
          <Field icon={<ShieldCheck className="size-3.5" />} label="User ID">
            <span className="font-mono text-xs">{user?.id ?? '—'}</span>
          </Field>
          <Field icon={<Calendar className="size-3.5" />} label="Joined">
            {user?.createdAt ? formatDate(user.createdAt) : '—'}
          </Field>
        </dl>
      </Card>

      <Card>
        <h4 className="font-display text-base tracking-tight">Profile editing</h4>
        <p className="text-sm text-muted mt-1.5 max-w-prose">
          Profile updates aren't yet exposed by the backend API. When the endpoint ships, this card
          will turn into an editable form — wire it up in <code className="font-mono text-xs">src/services/authService.ts</code>.
        </p>
      </Card>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-app bg-surface-2/40 p-4">
      <dt className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-faint">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm break-all">{children}</dd>
    </div>
  );
}
