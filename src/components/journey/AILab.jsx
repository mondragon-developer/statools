import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowRight } from 'lucide-react';
import { AI_LAB } from '../../data/journey/aiLab';
import { getStage, stagePath } from '../../data/journey';

const AILab = () => (
  <section id="ai-lab" tabIndex={-1} aria-labelledby="ai-lab-label ai-lab-heading" className="focus:outline-none">
    <div className="bg-darkGrey text-white rounded-lg p-5 sm:p-6 mb-4">
      <p id="ai-lab-label" className="flex items-center gap-2 text-accent text-sm font-bold uppercase tracking-wide mb-1">
        <Cpu size={16} aria-hidden="true" /> AI Lab
      </p>
      <h3 id="ai-lab-heading" className="text-2xl sm:text-3xl font-bold mb-2">The statistics inside AI</h3>
      <p className="text-white/85 max-w-3xl">
        Every stage of the journey connects to how modern AI works. Pick a question to see which statistics idea answers it,
        then explore it in that stage&apos;s lessons.
      </p>
    </div>

    <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {AI_LAB.map(card => {
        const stage = getStage(card.stage);
        return (
          <li key={card.stage} className="flex">
            <article className="flex flex-col w-full bg-white rounded-lg shadow-sm border-t-4 border-darkTeal p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-darkTeal mb-1">
                Stage {card.stage} - {card.idea}
              </p>
              <h4 className="text-lg font-bold text-darkGrey leading-snug mb-2">{card.question}</h4>
              <p className="text-sm text-darkGrey/85 mb-4">{card.teaser}</p>
              <Link
                to={stagePath(stage)}
                className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-darkTeal underline-offset-4 hover:underline
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark rounded"
              >
                Explore in Stage {card.stage}<span className="sr-only">: {stage.title}</span>
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </article>
          </li>
        );
      })}
    </ul>
  </section>
);

export default AILab;
