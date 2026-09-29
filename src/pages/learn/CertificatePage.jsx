import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Printer, CheckCircle2, Circle } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useJourneyProgress, { journeyActions, stageStats } from '../../hooks/useJourneyProgress';
import { STAGES, getStage, CAPSTONE_STAGE_ID, stagePath } from '../../data/journey';
import Breadcrumbs from '../../components/journey/Breadcrumbs';

// The plan only allows a certificate that accurately reflects what was completed,
// so it appears only after every stage badge (which includes the capstone) is earned.
const CertificatePage = () => {
  useDocumentTitle('Certificate');
  const progress = useJourneyProgress();
  const complete = STAGES.every(stage => progress.badges[stage.id]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: 'Learning Journey', to: '/learn' }, { label: 'Certificate' }]} />
      </div>
      {complete ? <Certificate progress={progress} /> : <Remaining progress={progress} />}
    </div>
  );
};

const Remaining = ({ progress }) => (
  <div>
    <h1 className="text-4xl font-bold text-darkGrey mb-2">Your completion certificate</h1>
    <p className="text-lg text-darkGrey/80 mb-6">
      The certificate unlocks when every stage badge is earned. Here is what is left.
    </p>
    <ul className="space-y-3">
      {STAGES.map(stage => {
        const earned = progress.badges[stage.id];
        const stats = stageStats(progress, stage);
        return (
          <li key={stage.id} className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-sm">
            {earned
              ? <CheckCircle2 size={22} className="text-darkTeal flex-shrink-0" aria-hidden="true" />
              : <Circle size={22} className="text-darkGrey/40 flex-shrink-0" aria-hidden="true" />}
            <div className="flex-1">
              <p className="font-bold text-darkGrey">Stage {stage.id}: {stage.title}</p>
              <p className="text-sm text-darkGrey/80">
                {earned ? `${stage.badge.name} earned` : `${stats.percent}% complete - lessons, checkpoints${stage.id === CAPSTONE_STAGE_ID ? ', and a submitted case file' : ''} needed`}
              </p>
            </div>
            {!earned && (
              <Link to={stagePath(stage)} className="text-darkTeal font-semibold underline hover:no-underline">
                Go<span className="sr-only"> to Stage {stage.id}</span>
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  </div>
);

const Certificate = ({ progress }) => {
  const lessonCount = Object.keys(progress.lessons).length;
  const capstoneCase = getStage(CAPSTONE_STAGE_ID).capstone.caseFiles.find(c => c.id === progress.capstone?.caseId);
  // Stages are unlocked, so the last badge earned (not the Stage 7 one) marks completion.
  const lastBadge = Math.max(...Object.values(progress.badges).map(date => Date.parse(date)));
  const finishedAt = new Date(lastBadge).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <div className="print:hidden mb-6 space-y-3">
        <h1 className="text-4xl font-bold text-darkGrey">Congratulations, Data Hero</h1>
        <label htmlFor="cert-name" className="block font-semibold text-darkGrey">Name to show on the certificate (optional)</label>
        <div className="flex flex-wrap gap-3">
          <input
            id="cert-name"
            type="text"
            maxLength={80}
            value={progress.certificateName}
            onChange={(e) => journeyActions.setCertificateName(e.target.value)}
            className="flex-1 min-w-[200px] border-2 border-platinum rounded-md px-3 py-2 text-darkGrey focus:outline-none focus:border-darkTeal focus:ring-2 focus:ring-accentDark"
          />
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-darkTeal text-white font-bold px-5 py-2 rounded-lg hover:bg-darkTeal/90
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
          >
            <Printer size={18} aria-hidden="true" /> Print or save as PDF
          </button>
        </div>
      </div>

      <article aria-label="Completion certificate" className="bg-white border-8 border-double border-darkTeal rounded-lg p-8 sm:p-12 text-center">
        <Award size={56} className="mx-auto text-accentDark mb-3" aria-hidden="true" />
        <p className="uppercase tracking-widest text-sm font-bold text-darkTeal">Certificate of Completion</p>
        <p className="text-darkGrey/80 mt-4">This certifies that</p>
        <p className="text-3xl sm:text-4xl font-bold text-darkGrey my-2">{progress.certificateName.trim() || 'A Statools learner'}</p>
        <p className="text-darkGrey/80">completed</p>
        <p className="text-2xl font-bold text-darkGrey my-2">The Data Detective & AI Apprentice</p>
        <p className="text-darkGrey max-w-xl mx-auto">
          {`${lessonCount} lessons across all ${STAGES.length} stages, every stage checkpoint, and a final case file`}
          {capstoneCase ? ` ("${capstoneCase.title}")` : ''}, earning the badges below.
        </p>
        <ul className="flex flex-wrap justify-center gap-2 my-6">
          {STAGES.map(stage => (
            <li key={stage.id} className="px-3 py-1 rounded-full bg-accent/20 border border-accent text-sm font-semibold text-darkGrey">
              {stage.badge.name}
            </li>
          ))}
        </ul>
        <p className="text-darkGrey/80 text-sm">Completed {finishedAt} - Statools, MDragon Data Tools</p>
        <p className="text-darkGrey/70 text-xs mt-2">Self-paced learning record generated in the learner&apos;s browser. Not an accredited credential.</p>
      </article>
    </div>
  );
};

export default CertificatePage;
