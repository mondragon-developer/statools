import React, { useState } from 'react';
import { X } from 'lucide-react';

const STORAGE_KEY = 'a11y-banner-dismissed';

const AccessibilityBanner = () => {
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem(STORAGE_KEY) === '1'; }
    catch { return false; }
  });

  if (dismissed) return null;

  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch {}
  };

  return (
    <div
      role="region"
      aria-label="Accessibility features available"
      className="fixed top-0 left-0 right-0 z-50 bg-darkTeal text-white text-sm px-4 py-2 flex items-center justify-center gap-4 shadow-md"
    >
      <p>
        This site supports <strong>keyboard navigation</strong>, <strong>screen readers</strong>, and{' '}
        <strong>voice commands</strong>.{' '}
        <a href="/statools/accessibility" className="underline hover:text-platinum">Learn more</a>
      </p>
      <button
        onClick={dismiss}
        aria-label="Dismiss accessibility banner"
        className="flex-shrink-0 p-1 rounded hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
};

export default AccessibilityBanner;
