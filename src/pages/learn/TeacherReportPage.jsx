import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, Circle, Printer } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { sanitize, isStageComplete } from '../../hooks/useJourneyProgress';
import { decodeProgress } from '../../utils/progressCode';
import { STAGES, getStage, CAPSTONE_STAGE_ID } from '../../data/journey';
import Breadcrumbs from '../../components/journey/Breadcrumbs';

const fmt = (iso) => (iso ? new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '');

const TeacherReportPage = () => {
  useDocumentTitle('Progress Report');
  const [code, setCode] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const read = async () => {
    setError('');
    setReport(null);
    try {
      const data = await decodeProgress(code);
      setReport({ savedAt: data.savedAt, progress: sanitize(data.progress) });
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: 'Learning Journey', to: '/learn' }, { label: 'Progress Report' }]} />
        <h1 className="text-4xl font-bold text-darkGrey mb-2">Read a progress code</h1>
        <p className="text-darkGrey/80 mb-4">
          Paste the code a student sent you. Nothing is uploaded: the code is decoded in this browser.
          Codes are a self-reported record, not a tamper-proof one.
        </p>
        <label htmlFor="report-code" className="block font-semibold text-darkGrey mb-1">Student progress code</label>
        <textarea
          id="report-code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={4}
          aria-describedby={error ? 'report-error' : undefined}
          className="w-full font-mono text-xs border-2 border-platinum rounded-md p-2 text-darkGrey bg-white focus:outline-none focus:border-darkTeal focus:ring-2 focus:ring-accentDark"
        />
        <div className="flex flex-wrap gap-3 mt-2">
          <button
            type="button"
            onClick={read}
            disabled={!code.trim()}
            className="px-5 py-2 rounded-lg bg-darkTeal text-white font-bold hover:bg-darkTeal/90 disabled:opacity-40 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
          >
            Show report
          </button>
          {report && (
            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2 rounded-lg border-2 border-darkGrey text-darkGrey font-semibold hover:bg-white
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
            >
              <Printer size={16} aria-hidden="true" /> Print report
            </button>
          )}
        </div>
        {error && <p id="report-error" role="alert" className="text-red-700 mt-2">{error}</p>}
      </div>

      {report && <Report report={report} />}
    </div>
  );
};

const Report = ({ report }) => {
  const { progress, savedAt } = report;
  const headingRef = useRef(null);
  useEffect(() => { headingRef.current?.focus(); }, [report]);
  const capstoneStage = getStage(CAPSTONE_STAGE_ID);
  const capstoneCase = capstoneStage.capstone.caseFiles.find(c => c.id === progress.capstone?.caseId);
  const lessonsDone = Object.keys(progress.lessons).length;
  const totalLessons = STAGES.reduce((sum, s) => sum + s.lessons.length, 0);

  return (
    <article aria-labelledby="report-heading" className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <header>
        <h2 id="report-heading" ref={headingRef} tabIndex={-1} className="text-2xl font-bold text-darkGrey focus:outline-none">
          {progress.certificateName.trim() || 'Unnamed student'}
        </h2>
        <p className="text-darkGrey/80">
          Code saved {new Date(savedAt).toLocaleString()} - {lessonsDone} of {totalLessons} lessons, {Object.keys(progress.badges).length} of {STAGES.length} badges, {progress.xp} XP, longest streak {progress.streak.longest} days
        </p>
      </header>

      <section aria-labelledby="stages-heading">
        <h3 id="stages-heading" className="text-lg font-bold text-darkGrey mb-2">Stages</h3>
        <ul className="space-y-3">
          {STAGES.map(stage => (
            <li key={stage.id} className="border border-platinum rounded-md p-3">
              <p className="flex items-center gap-2 font-semibold text-darkGrey">
                {isStageComplete(progress, stage)
                  ? <CheckCircle2 size={18} className="text-darkTeal" aria-hidden="true" />
                  : <Circle size={18} className="text-darkGrey/40" aria-hidden="true" />}
                Stage {stage.id}: {stage.title}
                {progress.badges[stage.id] && <span className="text-sm font-normal text-darkGrey/80">- badge {fmt(progress.badges[stage.id])}</span>}
              </p>
              <ul className="mt-2 ml-7 text-sm text-darkGrey space-y-1">
                {stage.lessons.map(lesson => (
                  <li key={lesson.id}>
                    {progress.lessons[lesson.id] ? `Done ${fmt(progress.lessons[lesson.id])}` : 'Not done'} - {lesson.title}
                    {progress.reflections[lesson.id] && (
                      <blockquote className="mt-1 ml-3 pl-3 border-l-2 border-accent text-darkGrey/90">
                        <span className="sr-only">Reflection: </span>{progress.reflections[lesson.id]}
                      </blockquote>
                    )}
                  </li>
                ))}
                <li className="font-semibold">
                  Checkpoints: {progress.checkpoints[stage.id] ? `completed ${fmt(progress.checkpoints[stage.id])}` : 'not completed'}
                </li>
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="capstone-report-heading">
        <h3 id="capstone-report-heading" className="text-lg font-bold text-darkGrey mb-2">Final case file</h3>
        {progress.capstone?.submittedAt && capstoneCase ? (
          <div>
            <p className="text-darkGrey mb-2">
              {capstoneCase.title} - submitted {fmt(progress.capstone.submittedAt)}
            </p>
            <dl className="space-y-2">
              {capstoneStage.capstone.template.map(field => (
                <div key={field.id}>
                  <dt className="font-semibold text-darkTeal">{field.label}</dt>
                  <dd className="text-darkGrey whitespace-pre-wrap">{progress.capstone.answers?.[field.id] || '(empty)'}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <p className="text-darkGrey/80">Not submitted yet.</p>
        )}
      </section>
    </article>
  );
};

export default TeacherReportPage;
