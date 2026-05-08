import { Sparkles, Lightbulb, Target, ListChecks } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { MatchScore } from './MatchScore';
import { SkillsCloud } from './SkillsCloud';
import type { ResumeAnalysis } from '@/types';

interface AnalysisPanelProps {
  analysis: ResumeAnalysis;
}

export function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  return (
    <div className="grid gap-5">
      {/* Hero card */}
      <Card className="relative overflow-hidden bg-ink-950 text-ink-50 border-ink-800">
        <div className="aurora absolute inset-0" aria-hidden="true" />
        <div className="relative grid sm:grid-cols-[auto_1fr] gap-6 items-center">
          <MatchScore score={analysis.matchScore} />
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-900/80 ring-1 ring-ink-800 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-accent-300">
              <Sparkles className="size-3" />
              <span>AI Analysis</span>
            </span>
            <h3 className="mt-3 font-display text-2xl tracking-tight">Resume × Job match</h3>
            <p className="mt-1.5 text-sm text-ink-300 max-w-md">
              Keyword + skill-alias scoring with stopword filtering. The higher your score, the closer
              your resume aligns with the role's must-haves.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-5">
        <Card>
          <SectionHeader icon={<ListChecks className="size-4" />} title="Matched keywords" badge={analysis.matchedKeywords.length} />
          <SkillsCloud skills={analysis.matchedKeywords} variant="matched" emptyText="No matched keywords yet." />
        </Card>
        <Card>
          <SectionHeader icon={<Target className="size-4" />} title="Missing keywords" badge={analysis.missingKeywords.length} />
          <SkillsCloud skills={analysis.missingKeywords} variant="missing" emptyText="Nothing missing — well done." />
        </Card>
      </div>

      {analysis.extractedSkills && analysis.extractedSkills.length > 0 && (
        <Card>
          <SectionHeader icon={<Sparkles className="size-4" />} title="Skills extracted from your resume" />
          <SkillsCloud skills={analysis.extractedSkills} variant="neutral" />
        </Card>
      )}

      <Card>
        <SectionHeader icon={<Lightbulb className="size-4" />} title="Suggestions" badge={analysis.suggestions.length} />
        {analysis.suggestions.length === 0 ? (
          <p className="text-sm text-faint">No suggestions available.</p>
        ) : (
          <ul className="grid gap-2">
            {analysis.suggestions.map((s, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-app bg-surface-2/40 p-3.5 text-sm leading-relaxed"
              >
                <span className="mt-0.5 size-5 shrink-0 rounded-full bg-accent-100 dark:bg-accent-300/20 text-accent-600 dark:text-accent-300 grid place-items-center text-[11px] font-semibold">
                  {i + 1}
                </span>
                <span className="text-pretty">{s}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function SectionHeader({ icon, title, badge }: { icon: React.ReactNode; title: string; badge?: number }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h4 className="inline-flex items-center gap-2 font-display text-sm tracking-tight">
        <span className="text-faint">{icon}</span>
        {title}
      </h4>
      {typeof badge === 'number' && (
        <span className="text-[11px] tabular-nums text-faint">{badge}</span>
      )}
    </div>
  );
}
