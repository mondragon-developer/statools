const CONTROLS = 'button, a[href], [role="button"], [role="tab"], [role="link"], summary, input:not([type="hidden"]), select, textarea';
const TABBABLE = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';

export const normalize = (text) => (text || '')
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const isVisible = (el) => el.getClientRects().length > 0
  && !el.closest('[inert], [aria-hidden="true"], [data-voice-ignore]')
  && getComputedStyle(el).visibility !== 'hidden';

const isEnabled = (el) => !el.disabled && el.getAttribute('aria-disabled') !== 'true';

function accessibleName(el) {
  const label = el.getAttribute('aria-label');
  if (label) return label;
  const labelledBy = el.getAttribute('aria-labelledby');
  if (labelledBy) {
    const text = labelledBy.split(/\s+/).map(id => document.getElementById(id)?.textContent || '').join(' ');
    if (text.trim()) return text;
  }
  if (el.id && /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) {
    const forLabel = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    if (forLabel) return forLabel.textContent;
  }
  return el.textContent || el.getAttribute('placeholder') || el.getAttribute('title') || '';
}

function score(name, phrase) {
  const n = normalize(name);
  if (!n || !phrase) return 0;
  if (n === phrase) return 1;
  if (n.startsWith(phrase)) return 0.9;
  if (n.includes(phrase)) return 0.6 + 0.3 * (phrase.length / n.length);
  const words = phrase.split(' ');
  const nameWords = new Set(n.split(' '));
  const hits = words.filter(w => nameWords.has(w)).length;
  // Every spoken word present, in any order ("calculators local" still finds "Local Calculators").
  return hits === words.length ? 0.55 : 0;
}

// Headings are framed together with the card or list item they introduce, so saying
// "local calculators" highlights the whole Local Calculators card, not just its title.
function frameFor(heading) {
  const card = heading.closest('.rounded-lg, .rounded-xl, li, article');
  if (card) return card;
  // A small section (like the footer's Contact block) is framed whole; a page-sized one is not.
  const section = heading.closest('section');
  return section && section.offsetHeight < window.innerHeight ? section : heading;
}

/**
 * Best on-page match for a spoken phrase.
 * controlsOnly limits the search to things that can be activated (for "click X").
 */
export function findTarget(spoken, { controlsOnly = false } = {}) {
  const phrase = normalize(spoken);
  if (phrase.length < 2) return null;
  const selector = controlsOnly ? CONTROLS : `h1, h2, h3, h4, ${CONTROLS}`;
  let best = null;
  let bestScore = 0;
  document.querySelectorAll(selector).forEach(el => {
    if (!isVisible(el) || (el.matches(CONTROLS) && !isEnabled(el))) return;
    // On a tie a heading wins, so a bare section name frames the section, not a menu link to it.
    const s = score(accessibleName(el), phrase) + (/^H[1-4]$/.test(el.tagName) ? 0.01 : 0);
    if (s > bestScore) {
      best = el;
      bestScore = s;
    }
  });
  if (!best || bestScore < 0.55) return null;
  const isHeading = /^H[1-4]$/.test(best.tagName);
  return { element: isHeading ? frameFor(best) : best, control: isHeading ? null : best, matched: best };
}

/** Moves real focus to an element and frames it the way keyboard focus looks. */
export function highlight(el) {
  document.querySelectorAll('.voice-highlight').forEach(node => node.classList.remove('voice-highlight'));
  const needsTabIndex = !el.matches(TABBABLE) && !el.hasAttribute('tabindex');
  if (needsTabIndex) el.setAttribute('tabindex', '-1');
  el.classList.add('voice-highlight');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  el.focus({ preventScroll: true, focusVisible: true });

  const clear = () => {
    el.classList.remove('voice-highlight');
    if (needsTabIndex) el.removeAttribute('tabindex');
    el.removeEventListener('blur', clear);
  };
  el.addEventListener('blur', clear);
}

/** Tab / Shift+Tab equivalent for "next" and "previous". */
export function moveFocus(step) {
  const all = [...document.querySelectorAll(TABBABLE)].filter(el => isVisible(el) && isEnabled(el));
  if (!all.length) return null;
  const current = document.activeElement;
  let index = all.indexOf(current);
  // A framed card is focusable but not tabbable; continue from its position in the page.
  if (index === -1 && current && current !== document.body) {
    const after = all.findIndex(el => current.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING && !current.contains(el));
    const inside = all.findIndex(el => current.contains(el));
    const start = inside !== -1 ? inside : after;
    if (step > 0) index = start - 1;
    else index = start === -1 ? all.length : start;
  }
  const next = all[(index + step + all.length) % all.length] || all[0];
  highlight(next);
  return next;
}

export const nameOf = (el) => normalize(accessibleName(el)).slice(0, 60);

const TEXT_TYPES = ['text', 'search', 'email', 'url', 'tel'];

/**
 * Types into the focused field in a way React's controlled inputs notice. Text fields get
 * the words appended; number fields and sliders get their value replaced by the spoken number.
 */
export function typeIntoFocused(text) {
  const el = document.activeElement;
  if (!el) return false;
  let next;
  if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && TEXT_TYPES.includes(el.type))) {
    next = el.value ? `${el.value} ${text}` : text;
  } else if (el.tagName === 'INPUT' && (el.type === 'number' || el.type === 'range')) {
    const number = Number.parseFloat(text.replace(/[^0-9.-]/g, ''));
    if (!Number.isFinite(number)) return false;
    next = String(number);
  } else {
    return false;
  }
  const proto = el.tagName === 'INPUT' ? HTMLInputElement.prototype : HTMLTextAreaElement.prototype;
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, next);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  return true;
}
