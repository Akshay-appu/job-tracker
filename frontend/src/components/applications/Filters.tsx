import { Search, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { STATUS_OPTIONS } from '@/utils/constants';
import { cn } from '@/utils/cn';
import type { ApplicationStatus } from '@/types';

export type ViewMode = 'cards' | 'table';

interface FiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  status: ApplicationStatus | '';
  onStatusChange: (v: ApplicationStatus | '') => void;
  view: ViewMode;
  onViewChange: (v: ViewMode) => void;
}

export function Filters({ search, onSearchChange, status, onStatusChange, view, onViewChange }: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-5">
      <div className="flex flex-1 gap-2 max-w-2xl">
        <Input
          containerClassName="flex-1"
          placeholder="Search company, role…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={<Search className="size-4" />}
          aria-label="Search applications"
        />
        <Select
          containerClassName="w-44 shrink-0"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ApplicationStatus | '')}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
      </div>

      <div
        role="tablist"
        aria-label="View mode"
        className="inline-flex items-center bg-surface-2/60 border border-app rounded-xl p-1 self-start sm:self-auto"
      >
        <ViewToggleButton active={view === 'cards'} onClick={() => onViewChange('cards')} icon={<LayoutGrid className="size-4" />} label="Card view" />
        <ViewToggleButton active={view === 'table'} onClick={() => onViewChange('table')} icon={<List className="size-4" />} label="Table view" />
      </div>
    </div>
  );
}

function ViewToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      aria-label={label}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center size-8 rounded-lg transition-colors focus-ring',
        active
          ? 'bg-surface text-[rgb(var(--text))] shadow-soft'
          : 'text-faint hover:text-[rgb(var(--text))]',
      )}
    >
      {icon}
    </button>
  );
}
