import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

const STORAGE_KEY = 'statools-ai-notice-v1';

const read = () => {
  try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
};

// Shown inside both chat panels until the visitor dismisses it once. It does not
// block sending: the point is that the disclosure is seen before the first message,
// not that it stands in the way of a student who already read it.
const AiNotice = ({ className = '' }) => {
  const [seen, setSeen] = useState(read);
  if (seen) return null;

  const dismiss = () => {
    setSeen(true);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* private mode: shows again next visit */ }
  };

  return (
    <div role="note" className={`flex items-start gap-2 px-4 py-2 text-xs text-darkGrey bg-accent/15 border-t border-accent ${className}`}>
      <Info size={16} className="flex-shrink-0 mt-0.5 text-darkTeal" aria-hidden="true" />
      <p className="flex-1">
        You are chatting with an AI. Messages go to an outside AI service to generate replies and it can make
        mistakes. Do not include names, grades, or other personal details.{' '}
        <Link to="/privacy" className="underline text-darkTeal hover:no-underline">Privacy</Link>
        {' / '}
        <Link to="/terms" className="underline text-darkTeal hover:no-underline">Terms</Link>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="flex-shrink-0 px-2 py-1 rounded font-semibold text-darkTeal hover:bg-darkTeal/10
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark"
      >
        Got it
      </button>
    </div>
  );
};

export default AiNotice;
