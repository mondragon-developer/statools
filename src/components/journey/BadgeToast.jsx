import React, { useEffect, useRef } from 'react';
import { Award, X } from 'lucide-react';

// Rendered in place (not a modal) so it never traps focus; focus moves to it once so
// screen reader users hear the award.
const BadgeToast = ({ stage, onClose }) => {
  const ref = useRef(null);
  useEffect(() => { ref.current?.focus(); }, []);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="relative flex items-start gap-4 bg-accent/20 border-2 border-accent rounded-lg p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accentDark"
    >
      <Award size={40} className="text-accentDark flex-shrink-0" aria-hidden="true" />
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-accentDark">Badge earned</p>
        <p className="text-2xl font-bold text-darkGrey">{stage.badge.name}</p>
        <p className="text-darkGrey">{stage.badge.description}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss badge message"
        className="absolute top-2 right-2 p-1 rounded text-darkGrey hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark"
      >
        <X size={18} aria-hidden="true" />
      </button>
    </div>
  );
};

export default BadgeToast;
