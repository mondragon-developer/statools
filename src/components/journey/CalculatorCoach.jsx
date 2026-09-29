import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, ArrowRight, RotateCcw, CheckSquare } from 'lucide-react';
import { COACH_NODES, COACH_START } from '../../data/journey/coach';
import { CALCULATORS } from '../../data/journey/calculators';
import { getResource } from '../../data/journey/resources';
import { getStage, stagePath } from '../../data/journey';

const CalculatorCoach = ({ defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const [path, setPath] = useState([COACH_START]);
  const headingRef = useRef(null);
  const moved = useRef(false);

  const node = COACH_NODES[path[path.length - 1]];

  // Each answer replaces the panel content, so focus moves to the new question for
  // keyboard and screen reader users instead of staying on a button that vanished.
  useEffect(() => {
    if (moved.current) headingRef.current?.focus();
  }, [path]);

  const go = (next) => { moved.current = true; setPath(p => [...p, next]); };
  const back = () => { moved.current = true; setPath(p => (p.length > 1 ? p.slice(0, -1) : p)); };
  const restart = () => { moved.current = true; setPath([COACH_START]); };

  return (
    <section aria-labelledby="coach-heading" className="bg-white rounded-lg shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <Compass size={28} className="text-darkTeal" aria-hidden="true" />
          <div>
            <h3 id="coach-heading" className="text-xl font-bold text-darkGrey">Calculator Coach</h3>
            <p className="text-sm text-darkGrey/80">Not sure which calculator you need? Answer a question or two.</p>
          </div>
        </div>
        {!defaultOpen && (
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            aria-controls="coach-panel"
            className="px-4 py-2 rounded-lg border-2 border-darkTeal text-darkTeal font-semibold hover:bg-darkTeal hover:text-white transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
          >
            {open ? 'Close coach' : 'Help me choose'}
          </button>
        )}
      </div>

      {open && (
        <div id="coach-panel" className="border-t border-platinum p-4 sm:p-5">
          {node.question ? (
            <fieldset>
              <legend ref={headingRef} tabIndex={-1} className="font-semibold text-darkGrey mb-3 focus:outline-none">
                {node.question}
              </legend>
              <div className="grid sm:grid-cols-2 gap-2">
                {node.options.map(option => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => go(option.next)}
                    className="text-left p-3 rounded-md border-2 border-platinum text-darkGrey hover:border-darkTeal hover:bg-darkTeal/5 transition-colors
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : (
            <CoachResult result={node.result} headingRef={headingRef} />
          )}

          {path.length > 1 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                type="button"
                onClick={back}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-darkGrey border border-platinum hover:bg-platinum
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark"
              >
                <ArrowLeft size={16} aria-hidden="true" /> Change my answer
              </button>
              <button
                type="button"
                onClick={restart}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold text-darkGrey border border-platinum hover:bg-platinum
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark"
              >
                <RotateCcw size={16} aria-hidden="true" /> Start over
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

const CoachResult = ({ result, headingRef }) => {
  const calc = CALCULATORS[result.calculator];
  const stage = getStage(result.stage);
  const resource = getResource(result.resource);

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-darkTeal mb-1">Recommended</p>
      <h4 ref={headingRef} tabIndex={-1} className="text-xl font-bold text-darkGrey mb-2 focus:outline-none">{calc.name}</h4>
      <p className="text-darkGrey mb-4">{result.reason}</p>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-platinum/50 rounded-md p-3">
          <p className="font-semibold text-darkGrey mb-2">Before you start, have ready:</p>
          <ul className="space-y-1">
            {result.checklist.map(item => (
              <li key={item} className="flex gap-2 text-sm text-darkGrey">
                <CheckSquare size={16} className="flex-shrink-0 mt-0.5 text-darkTeal" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-accent/10 border border-accent/40 rounded-md p-3">
          <p className="font-semibold text-darkGrey mb-2">Reading the result in plain English:</p>
          <p className="text-sm text-darkGrey">{result.interpretation}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to={calc.path}
          className="flex items-center gap-2 bg-darkTeal text-white font-bold px-4 py-2 rounded-lg hover:bg-darkTeal/90 transition-colors
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
        >
          Open Calculator <ArrowRight size={16} aria-hidden="true" />
        </Link>
        {stage && (
          <Link
            to={stagePath(stage)}
            className="px-4 py-2 rounded-lg border-2 border-darkTeal text-darkTeal font-semibold hover:bg-darkTeal/5
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
          >
            Related lessons: Stage {stage.id}
          </Link>
        )}
        {resource && (
          <a
            href={resource.path}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border-2 border-platinum text-darkGrey font-semibold hover:bg-platinum
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
          >
            Guide: {resource.name}<span className="sr-only"> (PDF, opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default CalculatorCoach;
