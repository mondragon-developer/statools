import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Star, Map, Award } from 'lucide-react';
import useJourneyProgress, { overallPercent, nextStep, nextStepLink, isStreakAlive } from '../../hooks/useJourneyProgress';
import { STAGES } from '../../data/journey';

const ProgressStrip = () => {
  const progress = useJourneyProgress();
  const step = nextStep(progress);
  const percent = overallPercent(progress);
  const isNew = Object.keys(progress.lessons).length === 0;
  const badges = Object.keys(progress.badges).length;
  const link = nextStepLink(step);
  const streakBroken = progress.streak.current > 0 && !isStreakAlive(progress.streak.lastDay);

  return (
    <section aria-label="Your progress" className="bg-white rounded-lg shadow-md p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
          <Stat icon={<Map size={18} aria-hidden="true" />} label="Current stage" value={step.stage ? `Stage ${step.stage.id}` : 'All done'} />
          <Stat icon={<Star size={18} aria-hidden="true" />} label="Journey complete" value={`${percent}%`} />
          <Stat
            icon={<Flame size={18} aria-hidden="true" />}
            label="Day streak"
            value={streakBroken ? '0' : String(progress.streak.current)}
            note={`Longest: ${progress.streak.longest}`}
          />
          <Stat icon={<Award size={18} aria-hidden="true" />} label="Badges" value={`${badges} of ${STAGES.length}`} note={`${progress.xp} XP`} />
        </dl>
        <div className="flex flex-col items-stretch lg:items-end gap-1">
          <Link
            to={link.to}
            className="text-center bg-darkTeal text-white font-bold px-5 py-3 rounded-lg hover:bg-darkTeal/90 transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
          >
            {isNew ? 'Start your first mission' : link.label}
          </Link>
          <p className="text-xs text-darkGrey/80 text-center lg:text-right">
            {isNew
              ? 'Your first mission takes about 10 minutes.'
              : streakBroken
                ? 'Welcome back - pick up right where you left off.'
                : 'Progress is saved in this browser.'}
          </p>
        </div>
      </div>
    </section>
  );
};


const Stat = ({ icon, label, value, note }) => (
  <div className="bg-platinum/50 rounded-md p-3">
    <dt className="flex items-center gap-1 text-xs text-darkGrey/80">{icon}{label}</dt>
    <dd className="text-xl font-bold text-darkGrey">{value}</dd>
    {note && <dd className="text-xs text-darkGrey/70">{note}</dd>}
  </div>
);

export default ProgressStrip;
