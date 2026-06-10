import React, { useState, useRef, useId } from 'react';
import { Info } from 'lucide-react';

const InfoIcon = ({ info }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipId = useId();
  const buttonRef = useRef(null);

  const toggle = () => setShowTooltip(prev => !prev);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && showTooltip) {
      setShowTooltip(false);
      buttonRef.current?.focus();
    }
  };

  return (
    <span
      className="relative inline-flex items-center ml-1"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        ref={buttonRef}
        onClick={toggle}
        aria-expanded={showTooltip}
        aria-describedby={showTooltip ? tooltipId : undefined}
        aria-label="More info"
        className="text-darkTeal hover:text-darkTeal/80 transition-colors"
      >
        <Info size={16} aria-hidden="true" />
      </button>
      {showTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-darkGrey text-white text-xs rounded-lg shadow-lg z-10"
        >
          <button
            onClick={() => { setShowTooltip(false); buttonRef.current?.focus(); }}
            aria-label="Close tooltip"
            className="float-right ml-1 text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded"
          >
            &times;
          </button>
          {info}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-darkGrey"></div>
        </div>
      )}
    </span>
  );
};

export default InfoIcon;
