import { useEffect, useState } from 'react';

// A callback ref observes dialogs mounted after loading, not just open-state changes.
export default function useFocusTrap(isActive) {
  const [container, setContainer] = useState(null);
  useEffect(() => {
    if (!isActive || !container) return;
    const previouslyFocused = document.activeElement;
    const selector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const getFocusable = () => [...container.querySelectorAll(selector)].filter(el => el.getClientRects().length && !el.closest('[inert]'));
    container.tabIndex = -1;
    (getFocusable()[0] || container).focus();
    // Disable every background branch, including floating controls and virtual-cursor access.
    const background = [];
    let branch = container;
    while (branch.parentElement && branch !== document.body) {
      for (const sibling of branch.parentElement.children) {
        if (sibling !== branch && !sibling.inert && !sibling.matches('[aria-live], [role="alert"], [role="status"]')) {
          sibling.inert = true;
          background.push(sibling);
        }
      }
      branch = branch.parentElement;
    }
    const handleKeyDown = e => {
      if (e.key !== 'Tab') return;
      const elements = getFocusable();
      const first = elements[0] || container;
      const last = elements.at(-1) || container;
      if (!elements.length || (e.shiftKey && document.activeElement === first)) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    const keepFocus = e => {
      if (!container.contains(e.target)) (getFocusable()[0] || container).focus();
    };
    container.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', keepFocus);
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', keepFocus);
      background.forEach(el => { el.inert = false; });
      if (previouslyFocused?.isConnected && !previouslyFocused.closest('[inert]')) previouslyFocused.focus();
    };
  }, [isActive, container]);
  return setContainer;
}
