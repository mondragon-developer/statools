import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Search, BookOpen, Cpu, PencilLine, Calculator, Trophy, ArrowLeft, ArrowRight, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useJourneyProgress, { journeyActions } from '../../hooks/useJourneyProgress';
import { getStage, lessonPath, stagePath } from '../../data/journey';
import { CALCULATORS } from '../../data/journey/calculators';
import Breadcrumbs from '../../components/journey/Breadcrumbs';
import ChoiceQuestion from '../../components/journey/ChoiceQuestion';
import BadgeToast from '../../components/journey/BadgeToast';
import { announcePolite } from '../../utils/announce';

const STEPS = [
  { key: 'hook', label: 'Story hook', icon: Search },
  { key: 'concept', label: 'Concept card', icon: BookOpen },
  { key: 'ai', label: 'AI under the hood', icon: Cpu },
  { key: 'practice', label: 'Guided practice', icon: PencilLine },
  { key: 'mission', label: 'Calculator mission', icon: Calculator },
  { key: 'reflect', label: 'Reflection + reward', icon: Trophy },
];

const LessonPage = () => {
  const { stageId, lessonId } = useParams();
  const stage = getStage(stageId);
  const lessonIndex = stage ? stage.lessons.findIndex(l => l.id === lessonId) : -1;
  const lesson = lessonIndex >= 0 ? stage.lessons[lessonIndex] : null;
  useDocumentTitle(lesson ? `${lesson.title} - Stage ${stage.id}` : 'Lesson not found');

  if (!lesson) return <Navigate to={stage ? stagePath(stage) : '/learn'} replace />;
  // Keyed so moving to the next lesson starts fresh at step one.
  return <LessonPlayer key={lesson.id} stage={stage} lesson={lesson} lessonIndex={lessonIndex} />;
};

const LessonPlayer = ({ stage, lesson, lessonIndex }) => {
  const progress = useJourneyProgress();
  const alreadyDone = Boolean(progress.lessons[lesson.id]);
  const [step, setStep] = useState(0);
  const [solved, setSolved] = useState({});
  const [earned, setEarned] = useState(null);
  const headingRef = useRef(null);
  const nextPanelRef = useRef(null);
  const stepChanged = useRef(false);
  const justCompleted = useRef(false);

  useEffect(() => {
    if (stepChanged.current) headingRef.current?.focus();
  }, [step]);

  // The "Complete lesson" button unmounts on click; without this, focus falls to <body>.
  useEffect(() => {
    if (alreadyDone && justCompleted.current && !earned) {
      justCompleted.current = false;
      nextPanelRef.current?.focus();
    }
  }, [alreadyDone, earned]);

  const goTo = (index) => {
    stepChanged.current = true;
    setStep(index);
    window.scrollTo(0, 0);
  };

  const practiceDone = alreadyDone || lesson.practice.every(q => solved[q.id]);
  const canAdvance = STEPS[step].key !== 'practice' || practiceDone;
  const nextLesson = stage.lessons[lessonIndex + 1];

  const onSolved = (id, correct) => {
    setSolved(prev => ({ ...prev, [id]: true }));
    if (correct) journeyActions.answerPractice(id);
  };

  const complete = () => {
    justCompleted.current = true;
    const badgeStage = journeyActions.completeLesson(stage.id, lesson.id);
    announcePolite(`Lesson complete. ${lesson.title}.`);
    if (badgeStage) setEarned(badgeStage);
  };

  const StepIcon = STEPS[step].icon;

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumbs
        items={[
          { label: 'Learning Journey', to: '/learn' },
          { label: `Stage ${stage.id}`, to: stagePath(stage) },
          { label: `Lesson ${lessonIndex + 1}` },
        ]}
      />
      <p className="text-darkTeal font-bold uppercase tracking-wide text-sm">
        Stage {stage.id} - Lesson {lessonIndex + 1} of {stage.lessons.length} - about {lesson.minutes} minutes
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-darkGrey mb-2">{lesson.title}</h1>
      <p className="text-darkGrey/80 mb-6">
        <span className="font-semibold">Goal:</span> {lesson.objective}
        {alreadyDone && <span className="ml-2 inline-flex items-center gap-1 text-darkTeal font-semibold"><CheckCircle2 size={16} aria-hidden="true" />Completed</span>}
      </p>

      <nav aria-label="Lesson steps" className="mb-6">
        <ol className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {STEPS.map((s, i) => {
            const reachable = i <= step || alreadyDone || (i === step + 1 && canAdvance);
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  disabled={!reachable}
                  aria-current={i === step ? 'step' : undefined}
                  className={`w-full text-xs sm:text-[0.7rem] font-semibold px-2 py-2 rounded-md border-2 transition-colors leading-tight
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark
                    ${i === step ? 'bg-darkTeal border-darkTeal text-white' : i < step ? 'bg-darkTeal/10 border-darkTeal/40 text-darkGrey' : 'bg-white border-platinum text-darkGrey'}
                    disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className="block">{i + 1}.</span>
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <section aria-labelledby="step-heading" className="bg-white rounded-lg shadow-md p-5 sm:p-7 mb-6">
        <h2 id="step-heading" ref={headingRef} tabIndex={-1} className="flex items-center gap-2 text-2xl font-bold text-darkGrey mb-4 focus:outline-none">
          <StepIcon size={24} className="text-darkTeal" aria-hidden="true" />
          {STEPS[step].label}
        </h2>

        {STEPS[step].key === 'hook' && (
          <div className="space-y-4">
            <p className="text-lg text-darkGrey leading-relaxed">{lesson.hook}</p>
            <p className="text-sm text-darkGrey/80 bg-platinum/50 rounded-md p-3">
              <span className="font-semibold">Case question:</span> {stage.question}
            </p>
          </div>
        )}

        {STEPS[step].key === 'concept' && <ConceptCard concept={lesson.concept} />}

        {STEPS[step].key === 'ai' && (
          <div className="space-y-3">
            {lesson.ai.paragraphs.map(p => <p key={p} className="text-darkGrey leading-relaxed">{p}</p>)}
            <p className="text-sm text-darkGrey/80 border-l-4 border-accent pl-3">
              This is a simplified picture. Real AI systems are more complex, but they are built on the same statistical ideas.
            </p>
          </div>
        )}

        {STEPS[step].key === 'practice' && (
          <div className="space-y-4">
            <p className="text-darkGrey/80">Wrong answers unlock hints. Take your time - there is no penalty for trying again.</p>
            {lesson.practice.map((q, i) => (
              <ChoiceQuestion key={q.id} question={q} number={i + 1} solved={alreadyDone || Boolean(solved[q.id])} onSolved={onSolved} />
            ))}
          </div>
        )}

        {STEPS[step].key === 'mission' && (
          <Mission lesson={lesson} tried={Boolean(progress.calculators[lesson.id])} />
        )}

        {STEPS[step].key === 'reflect' && (
          <Reflection
            lesson={lesson}
            saved={progress.reflections[lesson.id] || ''}
            done={alreadyDone}
            onComplete={complete}
          />
        )}
      </section>

      {earned && <div className="mb-6"><BadgeToast stage={earned} onClose={() => setEarned(null)} /></div>}

      {STEPS[step].key === 'reflect' && alreadyDone && (
        <div ref={nextPanelRef} tabIndex={-1} className="bg-darkTeal/10 border-2 border-darkTeal rounded-lg p-5 mb-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accentDark">
          <p className="font-bold text-darkGrey mb-2">Lesson complete. What is next?</p>
          <div className="flex flex-wrap gap-3">
            {nextLesson ? (
              <Link to={lessonPath(stage, nextLesson)} className="bg-darkTeal text-white font-bold px-4 py-2 rounded-lg hover:bg-darkTeal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2">
                Next: {nextLesson.title}
              </Link>
            ) : (
              <Link to={`${stagePath(stage)}#checkpoints`} className="bg-darkTeal text-white font-bold px-4 py-2 rounded-lg hover:bg-darkTeal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2">
                Go to the Stage {stage.id} checkpoints
              </Link>
            )}
            <Link to="/learn" className="px-4 py-2 rounded-lg border-2 border-darkTeal text-darkTeal font-semibold hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2">
              Back to the journey map
            </Link>
          </div>
        </div>
      )}

      <div className="flex justify-between gap-3">
        <button
          type="button"
          onClick={() => goTo(step - 1)}
          disabled={step === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border-2 border-darkGrey text-darkGrey font-semibold hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
        >
          <ArrowLeft size={18} aria-hidden="true" /> Back
        </button>
        {step < STEPS.length - 1 && (
          <button
            type="button"
            onClick={() => goTo(step + 1)}
            disabled={!canAdvance}
            className="flex items-center gap-1 px-5 py-2 rounded-lg bg-darkTeal text-white font-bold hover:bg-darkTeal/90 disabled:opacity-40 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
          >
            {canAdvance ? 'Next' : 'Answer the questions to continue'} <ArrowRight size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

const ConceptCard = ({ concept }) => (
  <div className="space-y-4">
    {concept.paragraphs.map(p => <p key={p} className="text-darkGrey leading-relaxed">{p}</p>)}
    {concept.table && (
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <caption className="text-left text-darkGrey/80 font-semibold mb-2">{concept.table.caption}</caption>
          <thead>
            <tr>
              {concept.table.headers.map(h => (
                <th key={h} scope="col" className="text-left bg-darkGrey text-white px-3 py-2 border border-darkGrey">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {concept.table.rows.map((row, r) => (
              <tr key={r} className={r % 2 === 0 ? 'bg-white' : 'bg-platinum/40'}>
                {row.map((cell, c) => (
                  c === 0
                    ? <th key={c} scope="row" className="text-left font-semibold px-3 py-2 border border-platinum text-darkGrey">{cell}</th>
                    : <td key={c} className="px-3 py-2 border border-platinum text-darkGrey">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    {concept.keyTerms && (
      <dl className="grid sm:grid-cols-2 gap-3">
        {concept.keyTerms.map(t => (
          <div key={t.term} className="bg-darkTeal/5 border border-darkTeal/30 rounded-md p-3">
            <dt className="font-bold text-darkTeal">{t.term}</dt>
            <dd className="text-sm text-darkGrey mt-1">{t.definition}</dd>
          </div>
        ))}
      </dl>
    )}
  </div>
);

const DataBlock = ({ label, value }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      announcePolite(`${label} copied to clipboard.`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      announcePolite('Copy failed. Select the values and copy them manually.');
    }
  };
  return (
    <div className="bg-platinum/50 rounded-md p-3">
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="font-semibold text-darkGrey text-sm">{label}</p>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 text-sm px-3 py-1 rounded-md bg-white border border-darkGrey/30 text-darkGrey hover:bg-darkGrey hover:text-white
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark"
        >
          <Copy size={14} aria-hidden="true" /> {copied ? 'Copied' : 'Copy'}<span className="sr-only"> {label}</span>
        </button>
      </div>
      <p className="font-mono text-sm text-darkGrey break-words select-all">{value}</p>
    </div>
  );
};

const Mission = ({ lesson, tried }) => {
  const { mission } = lesson;
  const calc = CALCULATORS[mission.calculator];
  return (
    <div className="space-y-4">
      <p className="text-lg text-darkGrey">{mission.task}</p>
      {mission.data && <DataBlock label={mission.dataLabel || 'Data'} value={mission.data} />}
      {mission.dataY && <DataBlock label={mission.dataYLabel || 'Y values'} value={mission.dataY} />}
      <ol className="list-decimal pl-5 space-y-1 text-darkGrey">
        {mission.steps.map(s => <li key={s}>{s}</li>)}
      </ol>
      <p className="bg-accent/15 border border-accent/40 rounded-md p-3 text-darkGrey">
        <span className="font-semibold">Look for:</span> {mission.lookFor}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={`/statools${calc.path}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => journeyActions.markCalculatorTried(lesson.id)}
          className="flex items-center gap-2 bg-darkTeal text-white font-bold px-4 py-2 rounded-lg hover:bg-darkTeal/90
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
        >
          Open {calc.name} <ExternalLink size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
        </a>
        {tried && <span className="flex items-center gap-1 text-sm text-darkTeal font-semibold"><CheckCircle2 size={16} aria-hidden="true" /> Calculator opened</span>}
      </div>
      <details className="bg-platinum/40 rounded-md p-3">
        <summary className="font-semibold text-darkGrey cursor-pointer">How to read the result</summary>
        <p className="text-darkGrey mt-2">{mission.interpretation}</p>
      </details>
    </div>
  );
};

const Reflection = ({ lesson, saved, done, onComplete }) => {
  const [text, setText] = useState(saved);
  const [showSample, setShowSample] = useState(Boolean(saved));

  const save = () => {
    journeyActions.saveReflection(lesson.id, text);
    setShowSample(true);
    announcePolite('Reflection saved.');
  };

  return (
    <div className="space-y-4">
      <label htmlFor="reflection" className="block text-lg text-darkGrey">{lesson.reflection.prompt}</label>
      <textarea
        id="reflection"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        maxLength={1000}
        className="w-full border-2 border-platinum rounded-md p-3 text-darkGrey focus:outline-none focus:border-darkTeal focus:ring-2 focus:ring-accentDark"
        placeholder="Write one or two sentences in your own words."
      />
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={save}
          disabled={!text.trim()}
          className="px-4 py-2 rounded-lg border-2 border-darkTeal text-darkTeal font-semibold hover:bg-darkTeal/5 disabled:opacity-40 disabled:cursor-not-allowed
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
        >
          Save my answer
        </button>
        {!showSample && (
          <button
            type="button"
            onClick={() => setShowSample(true)}
            className="px-4 py-2 rounded-lg text-darkGrey underline hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark"
          >
            Skip and see an example
          </button>
        )}
      </div>
      {showSample && (
        <div role="status" className="bg-darkTeal/5 border border-darkTeal/30 rounded-md p-3">
          <p className="font-semibold text-darkTeal mb-1">One possible answer</p>
          <p className="text-darkGrey">{lesson.reflection.sampleAnswer}</p>
          <p className="text-sm text-darkGrey/80 mt-2">Yours does not need to match. What matters is that you can explain the idea in your own words.</p>
        </div>
      )}
      {!done && (
        <button
          type="button"
          onClick={onComplete}
          disabled={!showSample}
          className="w-full sm:w-auto bg-accent text-darkGrey font-bold px-6 py-3 rounded-lg border-2 border-darkGrey hover:bg-darkGrey hover:text-white disabled:opacity-40 disabled:cursor-not-allowed
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
        >
          Complete lesson
        </button>
      )}
    </div>
  );
};

export default LessonPage;
