import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Lock } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useJourneyProgress, { journeyActions } from '../../hooks/useJourneyProgress';
import { STAGES } from '../../data/journey';
import { GLOSSARY } from '../../data/journey/glossary';
import Breadcrumbs from '../../components/journey/Breadcrumbs';
import ProgressStrip from '../../components/journey/ProgressStrip';
import StageMap from '../../components/journey/StageMap';
import CalculatorCoach from '../../components/journey/CalculatorCoach';
import { announcePolite } from '../../utils/announce';

const LearnHubPage = () => {
  useDocumentTitle('Learning Journey');
  const progress = useJourneyProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const allBadges = STAGES.every(stage => progress.badges[stage.id]);

  const reset = () => {
    journeyActions.reset();
    setConfirmReset(false);
    announcePolite('Journey progress reset.');
  };

  return (
    <div className="space-y-10">
      <div>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Learning Journey' }]} />
        <h1 className="text-4xl font-bold text-darkGrey mb-2">The Data Detective & AI Apprentice</h1>
        <p className="text-lg text-darkGrey/80 max-w-3xl">
          Seven stages take you from your first dataset to a real analysis of your own. Each lesson follows the same
          loop: learn one idea, practice it with hints, then use a real calculator. Along the way you will see how the
          same ideas support modern AI.
        </p>
      </div>

      <ProgressStrip />

      <section aria-labelledby="map-heading">
        <h2 id="map-heading" className="text-2xl font-bold text-darkGrey mb-4">Journey map</h2>
        <StageMap />
      </section>

      <section aria-labelledby="badges-heading">
        <h2 id="badges-heading" className="text-2xl font-bold text-darkGrey mb-4">Badges</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STAGES.map(stage => {
            const earned = progress.badges[stage.id];
            return (
              <li
                key={stage.id}
                className={`rounded-lg p-4 border-2 ${earned ? 'bg-white border-accent' : 'bg-white/60 border-dashed border-darkGrey/30'}`}
              >
                <p className="flex items-center gap-2 font-bold text-darkGrey">
                  {earned
                    ? <Award size={20} className="text-accentDark" aria-hidden="true" />
                    : <Lock size={18} className="text-darkGrey/60" aria-hidden="true" />}
                  {stage.badge.name}
                  <span className="sr-only">{earned ? ' (earned)' : ' (not earned yet)'}</span>
                </p>
                <p className="text-sm text-darkGrey/80 mt-1">{stage.badge.description}</p>
                {earned && (
                  <p className="text-xs text-darkGrey/70 mt-2">Earned {new Date(earned).toLocaleDateString()}</p>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-4">
          <Link to="/learn/certificate" className="text-darkTeal font-semibold underline hover:no-underline">
            {allBadges ? 'View your completion certificate' : 'See what the completion certificate needs'}
          </Link>
        </p>
      </section>

      <CalculatorCoach defaultOpen />

      <section aria-labelledby="glossary-heading">
        <h2 id="glossary-heading" className="text-2xl font-bold text-darkGrey mb-4">Beginner glossary</h2>
        <dl className="grid md:grid-cols-2 gap-3">
          {GLOSSARY.map(entry => (
            <div key={entry.term} className="bg-white rounded-lg p-4 shadow-sm">
              <dt className="font-bold text-darkTeal">{entry.term}</dt>
              <dd className="text-darkGrey text-sm mt-1">{entry.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="library-link-heading" className="bg-white rounded-lg p-5 shadow-sm">
        <h2 id="library-link-heading" className="text-xl font-bold text-darkGrey mb-2">Need a reference?</h2>
        <p className="text-darkGrey/80 mb-3">
          Every PDF guide and practice quiz is still available in the Resource Library, labeled by stage.
        </p>
        <Link to="/#resource-library" className="text-darkTeal font-semibold underline hover:no-underline">
          Open the Resource Library
        </Link>
      </section>

      <section aria-labelledby="reset-heading" className="border-t border-darkGrey/20 pt-6">
        <h2 id="reset-heading" className="text-lg font-bold text-darkGrey mb-1">Start over</h2>
        <p className="text-sm text-darkGrey/80 mb-3">Progress is stored only in this browser. Resetting clears lessons, XP, streaks, and badges.</p>
        {confirmReset ? (
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Confirm reset">
            <span className="text-sm font-semibold text-darkGrey">Clear all journey progress?</span>
            <button type="button" onClick={reset} className="px-4 py-2 rounded-lg bg-red-700 text-white font-semibold hover:bg-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2">
              Yes, reset
            </button>
            <button type="button" onClick={() => setConfirmReset(false)} className="px-4 py-2 rounded-lg border-2 border-darkGrey text-darkGrey font-semibold hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2">
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmReset(true)} className="px-4 py-2 rounded-lg border-2 border-red-700 text-red-700 font-semibold hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2">
            Reset my progress
          </button>
        )}
      </section>
    </div>
  );
};

export default LearnHubPage;
