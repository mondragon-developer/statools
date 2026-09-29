import React from 'react';
import { Link } from 'react-router-dom';
import { Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { STAGES, stagePath } from '../../data/journey';
import useJourneyProgress, { stageStats, nextStep } from '../../hooks/useJourneyProgress';

const STATUS_LABEL = { start: 'Start', continue: 'Continue', completed: 'Completed' };

// Stages are never locked: the order is a recommendation, and the plan only allows
// locks where a prerequisite is truly needed.
const StageMap = ({ compact = false, headingLevel = 'h3' }) => {
  const Heading = headingLevel;
  const progress = useJourneyProgress();
  const next = nextStep(progress);
  const nextStageId = next.stage?.id;

  return (
    <ol className={`grid gap-4 ${compact ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2 xl:grid-cols-3'}`} aria-label="Journey stages">
      {STAGES.map((stage) => {
        const stats = stageStats(progress, stage);
        const isNext = stage.id === nextStageId;
        const completed = stats.status === 'completed';
        return (
          <li key={stage.id} className="flex">
            <Link
              to={stagePath(stage)}
              className={`group flex flex-col w-full rounded-lg p-4 border-2 transition-all hover:shadow-lg
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2
                ${completed ? 'bg-darkTeal/5 border-darkTeal' : isNext ? 'bg-white border-accent shadow-md' : 'bg-white border-platinum'}`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wide text-darkTeal">Stage {stage.id}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full
                    ${completed ? 'bg-darkTeal text-white' : isNext ? 'bg-accent text-darkGrey' : 'bg-platinum text-darkGrey'}`}
                >
                  {isNext && !completed ? 'Up next' : STATUS_LABEL[stats.status]}
                </span>
              </div>
              <Heading className="text-lg font-bold text-darkGrey leading-snug">{stage.title}</Heading>
              <p className="text-sm text-darkGrey/80 mb-2">{stage.theme}</p>
              {!compact && <p className="text-sm text-darkGrey mb-3">{stage.detectiveCase}</p>}
              {!compact && (
                <p className="text-xs text-darkGrey/80 mb-3">
                  <span className="font-semibold">Skills:</span> {stage.skills.join(', ')}
                </p>
              )}
              <div className="mt-auto space-y-2">
                <div className="flex items-center justify-between text-xs text-darkGrey/80">
                  <span>{stats.done} of {stats.total} lessons</span>
                  <span className="flex items-center gap-1">
                    {completed ? <CheckCircle2 size={14} className="text-darkTeal" aria-hidden="true" /> : <Award size={14} aria-hidden="true" />}
                    {stage.badge.name}
                  </span>
                </div>
                <div className="h-2 bg-platinum rounded-full overflow-hidden" aria-hidden="true">
                  <div className="h-full bg-darkTeal transition-all" style={{ width: `${stats.percent}%` }} />
                </div>
                <span className="sr-only">{`${stats.percent}% complete.`}</span>
                <span className="flex items-center gap-1 text-sm font-semibold text-darkTeal group-hover:gap-2 transition-all">
                  {STATUS_LABEL[stats.status]} stage <ArrowRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
};

export default StageMap;
