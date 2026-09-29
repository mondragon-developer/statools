import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Lightbulb, ExternalLink, CheckSquare } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useJourneyProgress, { journeyActions } from '../../hooks/useJourneyProgress';
import { getStage, CAPSTONE_STAGE_ID, stagePath } from '../../data/journey';
import { CALCULATORS } from '../../data/journey/calculators';
import Breadcrumbs from '../../components/journey/Breadcrumbs';
import BadgeToast from '../../components/journey/BadgeToast';
import { announcePolite } from '../../utils/announce';

const CapstonePage = () => {
  useDocumentTitle('Final Case File');
  const stage = getStage(CAPSTONE_STAGE_ID);
  const { capstone } = stage;
  const progress = useJourneyProgress();
  const saved = progress.capstone;

  const [caseId, setCaseId] = useState(saved?.caseId || null);
  const draftFor = (id) => saved?.drafts?.[id] || (id === saved?.caseId ? saved.answers : null) || {};
  const [answers, setAnswers] = useState(() => (saved?.caseId ? draftFor(saved.caseId) : {}));
  const [hintsShown, setHintsShown] = useState(0);
  const [earned, setEarned] = useState(null);
  const [showModel, setShowModel] = useState(Boolean(saved?.submittedAt));
  const submittedThisCase = Boolean(saved?.submittedAt) && saved.caseId === caseId;
  const caseHeadingRef = useRef(null);
  const picked = useRef(false);

  const caseFile = capstone.caseFiles.find(c => c.id === caseId);
  const filled = capstone.template.every(field => (answers[field.id] || '').trim());

  useEffect(() => {
    if (picked.current) caseHeadingRef.current?.focus();
  }, [caseId]);

  const choose = (id) => {
    picked.current = true;
    setCaseId(id);
    setHintsShown(0);
    setShowModel(Boolean(saved?.submittedAt) && id === saved.caseId);
    setAnswers(draftFor(id));
  };

  const update = (fieldId, value) => {
    const next = { ...answers, [fieldId]: value };
    setAnswers(next);
    journeyActions.saveCapstoneDraft(caseId, next);
  };

  const submit = () => {
    const badgeStage = journeyActions.submitCapstone(caseId, answers);
    setShowModel(true);
    announcePolite('Case file submitted. A model answer is now shown below your response.');
    if (badgeStage) setEarned(badgeStage);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Breadcrumbs items={[{ label: 'Learning Journey', to: '/learn' }, { label: 'Stage 7', to: stagePath(stage) }, { label: 'Final Case File' }]} />
        <h1 className="text-4xl font-bold text-darkGrey mb-2">Final Case File</h1>
        <p className="text-lg text-darkGrey/80">{capstone.intro}</p>
      </div>

      <section aria-labelledby="checklist-heading" className="bg-white rounded-lg shadow-sm p-5">
        <h2 id="checklist-heading" className="text-xl font-bold text-darkGrey mb-3">Detective checklist</h2>
        <ol className="space-y-2">
          {capstone.checklist.map((item, i) => (
            <li key={item} className="flex gap-3 text-darkGrey">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-darkTeal text-white text-sm font-bold flex items-center justify-center" aria-hidden="true">{i + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="cases-heading">
        <h2 id="cases-heading" className="text-2xl font-bold text-darkGrey mb-3">Choose your case</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {capstone.caseFiles.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => choose(c.id)}
              aria-pressed={caseId === c.id}
              className={`text-left rounded-lg p-4 border-2 transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2
                ${caseId === c.id ? 'bg-darkTeal text-white border-darkTeal' : 'bg-white text-darkGrey border-platinum hover:border-darkTeal'}`}
            >
              <FolderOpen size={22} className={caseId === c.id ? 'text-accent' : 'text-darkTeal'} aria-hidden="true" />
              <span className="block font-bold mt-2">{c.title}</span>
            </button>
          ))}
        </div>
      </section>

      {caseFile && (
        <>
          <section aria-labelledby="case-file-heading" className="bg-darkGrey text-white rounded-lg p-5 space-y-4">
            <h2 id="case-file-heading" ref={caseHeadingRef} tabIndex={-1} className="text-2xl font-bold focus:outline-none">{caseFile.title}</h2>
            <p className="text-white/90">{caseFile.brief}</p>
            <div className="space-y-2">
              {caseFile.datasets.map(d => (
                <div key={d.label} className="bg-white/10 rounded-md p-3">
                  <p className="text-sm font-semibold text-accent">{d.label}</p>
                  <p className="font-mono text-sm break-words select-all">{d.values}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="font-semibold mb-2">Suggested tools</p>
              <div className="flex flex-wrap gap-2">
                {caseFile.calculators.map(key => (
                  <a
                    key={key}
                    href={`${import.meta.env.BASE_URL}${CALCULATORS[key].path.slice(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-accent text-darkGrey font-semibold px-3 py-2 rounded-lg hover:bg-white
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-darkGrey"
                  >
                    {CALCULATORS[key].name} <ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </div>
            </div>
            <div aria-live="polite">
              {caseFile.hints.slice(0, hintsShown).map((hint, i) => (
                <p key={hint} className="flex gap-2 text-sm bg-white/10 rounded-md p-2 mb-2">
                  <Lightbulb size={16} className="flex-shrink-0 mt-0.5 text-accent" aria-hidden="true" />
                  <span><span className="font-semibold">Hint {i + 1}:</span> {hint}</span>
                </p>
              ))}
            </div>
            {hintsShown < caseFile.hints.length && (
              <button
                type="button"
                onClick={() => setHintsShown(n => n + 1)}
                className="px-4 py-2 rounded-lg border-2 border-white text-white font-semibold hover:bg-white hover:text-darkGrey
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {hintsShown === 0 ? 'I need a hint' : 'Another hint'}
              </button>
            )}
          </section>

          <section aria-labelledby="template-heading" className="bg-white rounded-lg shadow-md p-5 space-y-4">
            <div>
              <h2 id="template-heading" className="text-2xl font-bold text-darkGrey">Your response</h2>
              <p className="text-darkGrey/80">The conclusion is yours to explain. Drafts save automatically in this browser.</p>
            </div>
            {capstone.template.map(field => (
              <div key={field.id}>
                <label htmlFor={`cap-${field.id}`} className="block font-bold text-darkGrey">{field.label}</label>
                <p id={`cap-${field.id}-help`} className="text-sm text-darkGrey/80 mb-1">{field.prompt}</p>
                <textarea
                  id={`cap-${field.id}`}
                  aria-describedby={`cap-${field.id}-help`}
                  value={answers[field.id] || ''}
                  onChange={(e) => update(field.id, e.target.value)}
                  rows={3}
                  maxLength={2000}
                  className="w-full border-2 border-platinum rounded-md p-3 text-darkGrey focus:outline-none focus:border-darkTeal focus:ring-2 focus:ring-accentDark"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={submit}
              disabled={!filled}
              className="bg-accent text-darkGrey font-bold px-6 py-3 rounded-lg border-2 border-darkGrey hover:bg-darkGrey hover:text-white disabled:opacity-40 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
            >
              {submittedThisCase ? 'Update my submission' : saved?.submittedAt ? 'Submit this case instead' : 'Submit my case file'}
            </button>
            {!filled && <p className="text-sm text-darkGrey/80">Fill in all six parts to submit.</p>}
          </section>

          {earned && <BadgeToast stage={earned} onClose={() => setEarned(null)} />}

          {showModel && (
            <section aria-labelledby="model-heading" className="bg-darkTeal/5 border-2 border-darkTeal rounded-lg p-5">
              <h2 id="model-heading" className="text-xl font-bold text-darkGrey mb-1">One model answer</h2>
              <p className="text-sm text-darkGrey/80 mb-4">Compare it with yours. Different wording is fine; check whether your method and limits match the data.</p>
              <dl className="space-y-3">
                {capstone.template.map(field => (
                  <div key={field.id}>
                    <dt className="flex items-center gap-2 font-bold text-darkTeal">
                      <CheckSquare size={16} aria-hidden="true" />{field.label}
                    </dt>
                    <dd className="text-darkGrey ml-6">{caseFile.sampleAnalysis[field.id]}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-3 mt-5">
                <Link to={`${stagePath(stage)}#checkpoints`} className="bg-darkTeal text-white font-bold px-4 py-2 rounded-lg hover:bg-darkTeal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2">
                  Stage 7 checkpoints
                </Link>
                <Link to="/learn/certificate" className="px-4 py-2 rounded-lg border-2 border-darkTeal text-darkTeal font-semibold hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2">
                  My certificate
                </Link>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default CapstonePage;
