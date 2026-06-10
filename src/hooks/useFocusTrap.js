import { useEffect, useRef } from 'react';

export default function useFocusTrap(isActive) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const previouslyFocused = document.activeElement;

    const focusableSelector = 'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

    const getFocusable = () => Array.from(container.querySelectorAll(focusableSelector)).filter(el => el.offsetParent !== null);

    // Focus the first focusable element
    const focusable = getFocusable();
    if (focusable.length > 0) {
      focusable[0].focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        const elements = getFocusable();
        if (elements.length === 0) return;
        const first = elements[0];
        const last = elements[elements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused && previouslyFocused.focus) {
        previouslyFocused.focus();
      }
    };
  }, [isActive]);

  return containerRef;
}
