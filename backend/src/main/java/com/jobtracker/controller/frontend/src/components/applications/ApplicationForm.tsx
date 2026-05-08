import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { STATUS_OPTIONS } from '@/utils/constants';
import { toDateInputValue } from '@/utils/format';
import type { JobApplication, JobApplicationInput } from '@/types';

interface ApplicationFormProps {
  initial?: JobApplication;
  onSubmit: (data: JobApplicationInput) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
}

export function ApplicationForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobApplicationInput>({
    defaultValues: initial
      ? {
          company: initial.company,
          position: initial.position,
          location: initial.location ?? '',
          status: initial.status,
          applicationDate: toDateInputValue(initial.applicationDate),
          jobDescription: initial.jobDescription ?? '',
          notes: initial.notes ?? '',
          salary: initial.salary ?? '',
          link: initial.link ?? '',
        }
      : {
          status: 'APPLIED',
          applicationDate: toDateInputValue(new Date().toISOString()),
        },
  });

  const isBusy = submitting || isSubmitting;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company *"
          placeholder="Acme Inc."
          {...register('company', { required: 'Company is required' })}
          error={errors.company?.message}
          autoFocus
        />
        <Input
          label="Position *"
          placeholder="Senior Software Engineer"
          {...register('position', { required: 'Position is required' })}
          error={errors.position?.message}
        />
        <Input
          label="Location"
          placeholder="Bengaluru / Remote"
          {...register('location')}
        />
        <Input
          type="date"
          label="Application date *"
          {...register('applicationDate', { required: 'Date is required' })}
          error={errors.applicationDate?.message}
        />
        <Select label="Status *" {...register('status', { required: true })}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </Select>
        <Input
          label="Salary"
          placeholder="₹ 24 LPA"
          {...register('salary')}
        />
      </div>
      <Input
        type="url"
        label="Listing URL"
        placeholder="https://…"
        {...register('link')}
      />
      <Textarea
        label="Job description"
        placeholder="Paste the job description so the AI analyzer can run keyword matching."
        rows={4}
        {...register('jobDescription')}
      />
      <Textarea
        label="Notes"
        placeholder="Recruiter, referral, follow-up tasks…"
        rows={3}
        {...register('notes')}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isBusy}>
          Cancel
        </Button>
        <Button type="submit" loading={isBusy}>
          {initial ? 'Save changes' : 'Add application'}
        </Button>
      </div>
    </form>
  );
}
