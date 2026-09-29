import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Target, Search } from 'lucide-react';
import useJourneyProgress, { nextStep, nextStepLink } from '../../hooks/useJourneyProgress';

const TodayMission = () => {
  const progress = useJourneyProgress();
  const step = nextStep(progress);
  const link = nextStepLink(step);

  let hook;
  let objective;
  let minutes = 15;
  let title;
  if (step.type === 'lesson') {
    title = step.lesson.title;
    hook = step.lesson.hook;
    objective = step.lesson.objective;
    minutes = step.lesson.minutes;
  } else if (step.type === 'checkpoints') {
    title = `Stage ${step.stage.id} checkpoints`;
    hook = step.stage.detectiveCase;
    objective = `Answer a few short questions to earn the ${step.stage.badge.name} badge. Hints and retries are included.`;
    minutes = 10;
  } else if (step.type === 'capstone') {
    title = 'Your final case file';
    hook = step.stage.detectiveCase;
    objective = 'Pick a case, choose your tools, and explain your conclusion in your own words.';
    minutes = 30;
  } else {
    title = 'Journey complete';
    hook = 'You finished every stage. Revisit any lesson, try a different case file, or take a brain break with Math Snake.';
    objective = 'Keep your skills sharp by explaining a result to someone else.';
  }

  return (
    <section aria-labelledby="today-mission-heading" className="bg-darkGrey text-white rounded-lg shadow-lg p-5 sm:p-6">
      <p className="text-accent text-sm font-bold uppercase tracking-wide mb-1">
        {step.stage ? `Today's mission - Stage ${step.stage.id}: ${step.stage.theme}` : "Today's mission"}
      </p>
      <h3 id="today-mission-heading" className="text-2xl font-bold mb-3">{title}</h3>
      <p className="flex gap-2 text-white/90 mb-3">
        <Search size={18} className="flex-shrink-0 mt-1 text-accent" aria-hidden="true" />
        <span>{hook}</span>
      </p>
      <p className="flex gap-2 text-white/90 mb-4">
        <Target size={18} className="flex-shrink-0 mt-1 text-accent" aria-hidden="true" />
        <span>{objective}</span>
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <Link
          to={link.to}
          className="bg-accent text-darkGrey font-bold px-5 py-3 rounded-lg hover:bg-white transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-darkGrey"
        >
          {step.type === 'done' ? 'View certificate' : 'Start mission'}
        </Link>
        <span className="flex items-center gap-1 text-sm text-white/80">
          <Clock size={16} aria-hidden="true" /> About {minutes} minutes
        </span>
      </div>
    </section>
  );
};

export default TodayMission;
