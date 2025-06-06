// src/components/calculators/InfoIcon.jsx
import React, { useState } from 'react';
import { Info } from 'lucide-react';

const InfoIcon = ({ info }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="text-turquoise hover:text-turquoise/80 transition-colors"
      >
        <Info size={16} />
      </button>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-darkGrey text-white text-xs rounded-lg shadow-lg z-10">
          {info}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-darkGrey"></div>
        </div>
      )}
    </span>
  );
};

export default InfoIcon;
