import React, { useState, useId } from 'react';
import { CheckCircle2, Lightbulb } from 'lucide-react';

// Wrong answers reveal hints one at a time instead of costing anything; once the
// hints run out the learner may reveal the answer so nobody gets stuck.
const ChoiceQuestion = ({ question, number, solved, onSolved }) => {
  const [selected, setSelected] = useState(null);
  const [wrongTries, setWrongTries] = useState(0);
  const [status, setStatus] = useState(solved ? 'correct' : 'idle');
  const groupId = useId();
  const feedbackId = useId();

  const hints = question.hints || [];
  const hintsShown = hints.slice(0, Math.min(wrongTries, hints.length));
  const newHint = status === 'wrong' && wrongTries <= hints.length;
  const done = status === 'correct' || status === 'revealed';

  const check = () => {
    if (selected === null) return;
    if (selected === question.answer) {
      setStatus('correct');
      onSolved?.(question.id, true);
    } else {
      setWrongTries(t => t + 1);
      setStatus('wrong');
    }
  };

  const reveal = () => {
    setSelected(question.answer);
    setStatus('revealed');
    onSolved?.(question.id, false);
  };

  return (
    <fieldset className="bg-white rounded-lg border border-platinum p-4 sm:p-5" aria-describedby={feedbackId}>
      <legend className="font-semibold text-darkGrey mb-3 float-left w-full">
        {number !== undefined && <span className="text-darkTeal mr-1">{number}.</span>}
        {question.question}
      </legend>

      <div className="space-y-2 clear-both">
        {question.options.map((option, index) => {
          const isAnswer = done && index === question.answer;
          return (
            <label
              key={option}
              className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors
                ${isAnswer ? 'border-darkTeal bg-darkTeal/10' : selected === index ? 'border-darkGrey bg-platinum/60' : 'border-platinum hover:bg-platinum/40'}
                ${done ? 'cursor-default' : ''}`}
            >
              <input
                type="radio"
                name={groupId}
                value={index}
                checked={selected === index}
                disabled={done}
                onChange={() => { setSelected(index); if (status === 'wrong') setStatus('idle'); }}
                className="mt-1 accent-darkTeal"
              />
              <span className="text-darkGrey">{option}</span>
            </label>
          );
        })}
      </div>

      <div id={feedbackId} role="status" aria-live="polite" className="mt-3 space-y-2">
        {status === 'wrong' && (
          <p className="text-accentDark font-medium">
            {newHint ? 'Not quite. Try again - here is a hint.' : 'Not quite. Try a different answer.'}
          </p>
        )}
        {!done && hintsShown.map((hint) => (
          <p key={hint} className="flex gap-2 text-sm text-darkGrey bg-accent/15 border border-accent/40 rounded-md p-2">
            <Lightbulb size={16} className="flex-shrink-0 mt-0.5 text-accentDark" aria-hidden="true" />
            <span>{hint}</span>
          </p>
        ))}
        {done && (
          <div className="text-sm text-darkGrey bg-darkTeal/5 border border-darkTeal/30 rounded-md p-3">
            <p className="flex items-center gap-2 font-semibold text-darkTeal mb-1">
              <CheckCircle2 size={16} aria-hidden="true" />
              {status === 'correct' ? (wrongTries > 0 ? 'Correct - nice persistence.' : 'Correct.') : 'Here is the answer.'}
            </p>
            <p>{question.explanation}</p>
          </div>
        )}
      </div>

      {!done && (
        <div className="flex flex-wrap gap-2 mt-3">
          <button
            type="button"
            onClick={check}
            disabled={selected === null || status === 'wrong'}
            className="px-4 py-2 rounded-lg bg-darkTeal text-white font-semibold hover:bg-darkTeal/90 disabled:opacity-40 disabled:cursor-not-allowed
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
          >
            Check answer
          </button>
          {wrongTries > hints.length && (
            <button
              type="button"
              onClick={reveal}
              className="px-4 py-2 rounded-lg border-2 border-darkGrey text-darkGrey font-semibold hover:bg-platinum
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
            >
              Show me the answer
            </button>
          )}
        </div>
      )}
    </fieldset>
  );
};

export default ChoiceQuestion;
