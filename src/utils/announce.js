/**
 * ARIA live region announcer for screen readers (NVDA, VoiceOver).
 * Requires two static live regions in index.html with ids:
 *   a11y-announcer-assertive (aria-live="assertive")
 *   a11y-announcer-polite (aria-live="polite")
 */

export function announceAssertive(message) {
  const el = document.getElementById('a11y-announcer-assertive');
  if (!el) return;
  el.textContent = '';
  setTimeout(() => { el.textContent = message; }, 50);
}

export function announcePolite(message) {
  const el = document.getElementById('a11y-announcer-polite');
  if (!el) return;
  el.textContent = '';
  setTimeout(() => { el.textContent = message; }, 50);
}
