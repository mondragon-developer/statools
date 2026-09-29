import React, { useState, useRef } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, Award, Cpu, Search, FileText } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useJourneyProgress, { journeyActions, stageStats } from '../../hooks/useJourneyProgress';
import { getStage, lessonPath, CAPSTONE_STAGE_ID, STAGES } from '../../data/journey';
import { CALCULATORS } from '../../data/journey/calculators';
import { getResource } from '../../data/journey/resources';
import Breadcrumbs from '../../components/journey/Breadcrumbs';
import ChoiceQuestion from '../../components/journey/ChoiceQuestion';
import BadgeToast from '../../components/journey/BadgeToast';

const StagePage = () => {
  const { stageId } = useParams();
  const stage = getStage(stageId);
  useDocumentTitle(stage ? `Stage ${stage.id}: ${stage.title}` : 'Stage not found');

  if (!stage) return <Navigate to="/learn" replace />;
  // Keyed so a badge message or answered checkpoints do not carry over to the next stage.
  return <StageView key={stage.id} stage={stage} />;
};

const StageView = ({ stage }) => {
  const progress = useJourneyProgress();
  const [solved, setSolved] = useState({});
  const [earned, setEarned] = useState(null);
  const checkpointsHeadingRef = useRef(null);

  const stats = stageStats(progress, stage);
  const checkpointsDone = Boolean(progress.checkpoints[stage.id]);
  const allSolved = stage.checkpoints.every(q => solved[q.id]);
  const nextStage = STAGES.find(s => s.id === stage.id + 1);

  const onSolved = (id, correct) => {
    setSolved(prev => ({ ...prev, [id]: true }));
    if (correct) journeyActions.answerPractice(id);
  };

  const finishCheckpoints = () => {
    const badgeStage = journeyActions.completeCheckpoints(stage.id);
    if (badgeStage) setEarned(badgeStage);
    else checkpointsHeadingRef.current?.focus();
  };

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Learning Journey', to: '/learn' }, { label: `Stage ${stage.id}` }]} />
        <p className="text-darkTeal font-bold uppercase tracking-wide text-sm">Stage {stage.id} - {stage.theme}</p>
        <h1 className="text-4xl font-bold text-darkGrey mb-2">{stage.title}</h1>
        <p className="text-lg text-darkGrey/80">{stage.question}</p>
      </div>

      {earned && <BadgeToast stage={earned} onClose={() => setEarned(null)} />}

      <div className="grid lg:grid-cols-3 gap-4">
        <section aria-labelledby="case-heading" className="lg:col-span-2 bg-darkGrey text-white rounded-lg p-5">
          <h2 id="case-heading" className="flex items-center gap-2 text-accent font-bold mb-2">
            <Search size={18} aria-hidden="true" /> Detective case
          </h2>
          <p className="text-lg mb-4">{stage.detectiveCase}</p>
          <h3 className="flex items-center gap-2 text-accent font-bold mb-1">
            <Cpu size={18} aria-hidden="true" /> AI connection
          </h3>
          <p className="text-white/90">{stage.aiConnection}</p>
        </section>
        <aside aria-labelledby="skills-heading" className="bg-white rounded-lg p-5 shadow-sm">
          <h2 id="skills-heading" className="font-bold text-darkGrey mb-2">Skills you will gain</h2>
          <ul className="list-disc pl-5 text-sm text-darkGrey space-y-1 mb-4">
            {stage.skills.map(skill => <li key={skill}>{skill}</li>)}
          </ul>
          <p className="flex items-center gap-2 text-sm font-semibold text-darkGrey">
            <Award size={18} className={progress.badges[stage.id] ? 'text-accentDark' : 'text-darkGrey/60'} aria-hidden="true" />
            Badge: {stage.badge.name} {progress.badges[stage.id] ? '(earned)' : ''}
          </p>
          <p className="text-xs text-darkGrey/80 mt-1">{stage.badge.description}</p>
          <div className="mt-4">
            <div className="h-2 bg-platinum rounded-full overflow-hidden" aria-hidden="true">
              <div className="h-full bg-darkTeal" style={{ width: `${stats.percent}%` }} />
            </div>
            <p className="text-xs text-darkGrey/80 mt-1">{stats.percent}% of this stage complete</p>
          </div>
        </aside>
      </div>

      <section aria-labelledby="lessons-heading">
        <h2 id="lessons-heading" className="text-2xl font-bold text-darkGrey mb-3">Daily lessons</h2>
        <ol className="space-y-3">
          {stage.lessons.map((lesson, index) => {
            const done = Boolean(progress.lessons[lesson.id]);
            return (
              <li key={lesson.id}>
                <Link
                  to={lessonPath(stage, lesson)}
                  className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm border-2 border-transparent hover:border-darkTeal transition-colors
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
                >
                  {done
                    ? <CheckCircle2 size={24} className="text-darkTeal flex-shrink-0 mt-1" aria-hidden="true" />
                    : <Circle size={24} className="text-darkGrey/40 flex-shrink-0 mt-1" aria-hidden="true" />}
                  <div className="flex-1">
                    <p className="font-bold text-darkGrey">
                      Lesson {index + 1}: {lesson.title}
                      <span className="sr-only">{done ? ' (completed)' : ''}</span>
                    </p>
                    <p className="text-sm text-darkGrey/80">{lesson.objective}</p>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-darkGrey/80 flex-shrink-0">
                    <Clock size={14} aria-hidden="true" /> {lesson.minutes} min
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {stage.id === CAPSTONE_STAGE_ID && (
        <section aria-labelledby="capstone-link-heading" className="bg-accent/15 border-2 border-accent rounded-lg p-5">
          <h2 id="capstone-link-heading" className="text-xl font-bold text-darkGrey mb-1">Your final case file</h2>
          <p className="text-darkGrey mb-3">
            Pick one of three fictional cases, run the analysis with the calculators, and write your conclusion in the six-part template.
            {progress.capstone?.submittedAt ? ' You have submitted a case file.' : ''}
          </p>
          <Link
            to="/learn/capstone"
            className="inline-block bg-darkTeal text-white font-bold px-5 py-2 rounded-lg hover:bg-darkTeal/90
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
          >
            {progress.capstone?.submittedAt ? 'Review my case file' : 'Open the case files'}
          </Link>
        </section>
      )}

      <section id="checkpoints" tabIndex={-1} aria-labelledby="checkpoints-heading" className="focus:outline-none">
        <h2 id="checkpoints-heading" ref={checkpointsHeadingRef} tabIndex={-1} className="text-2xl font-bold text-darkGrey mb-1 focus:outline-none">Checkpoints</h2>
        <p className="text-darkGrey/80 mb-4">
          {checkpointsDone
            ? 'You finished these checkpoints. You can still practice them again.'
            : 'Short checks with hints and retries. Mistakes cost nothing - understanding is what counts.'}
        </p>
        <div className="space-y-4">
          {stage.checkpoints.map((q, i) => (
            <ChoiceQuestion key={q.id} question={q} number={i + 1} onSolved={onSolved} />
          ))}
        </div>
        {!checkpointsDone && (
          <button
            type="button"
            onClick={finishCheckpoints}
            disabled={!allSolved}
            className="mt-4 bg-darkTeal text-white font-bold px-5 py-3 rounded-lg hover:bg-darkTeal/90 disabled:opacity-40 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
          >
            {allSolved ? 'Complete checkpoints' : `Answer all ${stage.checkpoints.length} questions to finish`}
          </button>
        )}
      </section>

      <section aria-labelledby="tools-heading" className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <h2 id="tools-heading" className="font-bold text-darkGrey mb-2">Calculators in this stage</h2>
          <ul className="space-y-2">
            {stage.calculators.map(key => (
              <li key={key}>
                <Link to={CALCULATORS[key].path} className="text-darkTeal font-semibold underline hover:no-underline">
                  {CALCULATORS[key].name}
                </Link>
                <p className="text-sm text-darkGrey/80">{CALCULATORS[key].summary}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm">
          <h2 className="font-bold text-darkGrey mb-2">Go deeper (PDF guides)</h2>
          <ul className="space-y-2">
            {stage.resources.map(getResource).filter(Boolean).map(resource => (
              <li key={resource.id} className="flex items-center gap-2">
                <FileText size={16} className="text-darkTeal" aria-hidden="true" />
                <a href={resource.path} target="_blank" rel="noopener noreferrer" className="text-darkTeal font-semibold underline hover:no-underline">
                  {resource.name}<span className="sr-only"> (PDF, opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {nextStage && (
        <p className="text-right">
          <Link to={`/learn/stage/${nextStage.id}`} className="text-darkTeal font-semibold underline hover:no-underline">
            Next: Stage {nextStage.id} - {nextStage.title}
          </Link>
        </p>
      )}
    </div>
  );
};

export default StagePage;
