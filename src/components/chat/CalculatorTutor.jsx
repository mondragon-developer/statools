import React, { useState, useRef, useEffect, useId, lazy, Suspense } from 'react';
import { X, Send, GraduationCap } from 'lucide-react';
import { sendMessage } from '../../api/chatApi';
import { CALCULATOR_GUIDES } from '../../data/calculatorGuides';
import AiNotice from './AiNotice';

const ChatMarkdown = lazy(() => import('./ChatMarkdown'));
const LOGO = `${import.meta.env.BASE_URL}mdragon.svg`;
const MAX_PAGE_TEXT = 3500;

function labelFor(el) {
  const aria = el.getAttribute('aria-label');
  if (aria) return aria;
  if (el.id) {
    const label = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
    if (label) return label.textContent.trim();
  }
  return el.closest('label')?.textContent.trim() || el.name || el.placeholder || 'field';
}

// What the student currently has on screen: field values (innerText omits them) plus the
// visible text, which carries the calculator's results and explanations.
function pageSnapshot() {
  const root = document.getElementById('main-content');
  if (!root) return '';
  const fields = [...root.querySelectorAll('input, select, textarea')]
    .filter(el => el.type !== 'hidden' && el.getClientRects().length > 0)
    .map(el => {
      if (el.type === 'checkbox' || el.type === 'radio') return el.checked ? `${labelFor(el)}: selected` : null;
      const value = el.tagName === 'SELECT' ? el.options[el.selectedIndex]?.text : el.value;
      return `${labelFor(el).slice(0, 80)}: ${value ? value.slice(0, 300) : '(empty)'}`;
    })
    .filter(Boolean);
  const selected = [...root.querySelectorAll('[aria-pressed="true"], [aria-selected="true"]')]
    .map(el => el.textContent.trim().slice(0, 60))
    .filter(Boolean);
  const text = root.innerText.replace(/\n{3,}/g, '\n\n').slice(0, MAX_PAGE_TEXT);
  return [
    `Current inputs:\n${fields.join('\n') || '(none)'}`,
    `Selected buttons or tabs: ${selected.join(', ') || '(none)'}`,
    `Visible page text (results and explanations, may be cut off):\n${text}`,
  ].join('\n\n');
}

function buildContext(guide) {
  const list = (title, items) => (items?.length ? `${title}:\n- ${items.join('\n- ')}` : '');
  return [
    `Calculator: ${guide.name}`,
    `Purpose: ${guide.purpose}`,
    list('Use it when', guide.whenToUse),
    list('Not the right tool for', guide.notFor),
    list('Modes', guide.modes),
    list('Inputs', guide.inputs),
    list('Steps', guide.steps),
    list('Outputs', guide.outputs),
    list('Common mistakes', guide.mistakes),
    `ON THE STUDENT'S SCREEN RIGHT NOW\n${pageSnapshot()}`,
  ].filter(Boolean).join('\n\n');
}

/**
 * AI tutor docked beside a calculator. It is deliberately not modal: the student keeps
 * using the calculator while the tutor walks them through it.
 */
const CalculatorTutor = ({ calcKey, onOpenChange }) => {
  const guide = CALCULATOR_GUIDES[calcKey];
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => (guide ? [{
    id: 'welcome',
    role: 'assistant',
    content: `Hi! I'm your tutor for the ${guide.name}. I won't just hand you answers - I'll guide you step by step so you can do it yourself. Ask how the calculator works, or paste the problem you're working on.`,
  }] : []));
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // crypto.randomUUID only exists on secure origins; plain-http LAN testing falls back.
  const [conversationId] = useState(() => (window.crypto?.randomUUID ? crypto.randomUUID() : `t-${Date.now()}-${Math.random()}`));
  const toggleRef = useRef(null);
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const headingId = useId();
  const noteId = useId();

  useEffect(() => { onOpenChange?.(open); }, [open, onOpenChange]);
  useEffect(() => {
    if (!open) return;
    // Loaded ahead of the first reply so it never flashes raw markdown inside the live log.
    import('./ChatMarkdown');
    inputRef.current?.focus();
  }, [open]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [messages, loading]);

  if (!guide) return null;

  const close = () => {
    setOpen(false);
    setTimeout(() => toggleRef.current?.focus(), 0);
  };

  const send = async (textArg) => {
    const text = (textArg ?? input).trim();
    if (!text || loading) return;
    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: text };
    const history = [...messages, userMsg].filter(m => m.id !== 'welcome' && !m.failed).map(({ role, content }) => ({ role, content }));
    setMessages(prev => [...prev, userMsg]);
    if (textArg === undefined) setInput('');
    // A starter chip unmounts once used; keep focus in the panel instead of dropping to <body>.
    else inputRef.current?.focus();
    setError('');
    setLoading(true);
    try {
      const reply = await sendMessage(history, conversationId, buildContext(guide));
      setMessages(prev => [...prev, { id: `a-${Date.now()}`, role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => prev.map(m => (m.id === userMsg.id ? { ...m, failed: true } : m)));
      setError('The tutor could not answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  const starters = [...guide.starters, 'Help me understand my result'];
  const showStarters = messages.length === 1;

  return (
    <>
      {!open && (
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setOpen(true)}
          data-tutor-toggle
          className="print:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 pl-2 pr-4 py-2 rounded-full bg-darkTeal text-white font-bold shadow-lg
            border-2 border-white hover:bg-darkTeal/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
        >
          <img src={LOGO} alt="" className="w-9 h-9 rounded-full object-cover" />
          Ask the AI tutor
        </button>
      )}

      {open && (
        <aside
          id="calculator-tutor"
          aria-labelledby={headingId}
          onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } }}
          className="print:hidden fixed z-40 bg-white shadow-2xl border-platinum flex flex-col
            inset-x-0 bottom-0 h-[60vh] rounded-t-xl border-t
            md:inset-x-auto md:right-0 md:top-0 md:h-full md:w-96 md:rounded-none md:border-l"
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 bg-darkGrey text-white md:rounded-none rounded-t-xl">
            <h2 id={headingId} className="flex items-center gap-2 font-semibold">
              <img src={LOGO} alt="" className="w-8 h-8 rounded-full object-cover bg-white" />
              <span>
                AI Tutor
                <span className="block text-xs font-normal text-white/80">{guide.name}</span>
              </span>
            </h2>
            <button
              type="button"
              onClick={close}
              aria-label="Close AI tutor"
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div role="log" aria-label="Tutor conversation" aria-live="polite" className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
            {messages.map(msg => (
              <div key={msg.id} className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && <img src={LOGO} alt="" className="w-7 h-7 flex-shrink-0 rounded-full object-cover mt-0.5" />}
                <div
                  role="article"
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-darkTeal text-white' : 'bg-platinum/60 text-darkGrey'}`}
                >
                  <span className="sr-only">{msg.role === 'user' ? 'You said: ' : 'Tutor said: '}</span>
                  {msg.role === 'assistant' && msg.id !== 'welcome'
                    ? <Suspense fallback={msg.content}><div className="whitespace-normal"><ChatMarkdown>{msg.content}</ChatMarkdown></div></Suspense>
                    : msg.content}
                </div>
              </div>
            ))}
            {showStarters && (
              <div className="flex flex-wrap gap-2 pl-9">
                {starters.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="text-left text-sm px-3 py-1.5 rounded-full border-2 border-darkTeal text-darkTeal hover:bg-darkTeal/5
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {loading && (
              <div className="flex items-start gap-2" role="status">
                <img src={LOGO} alt="" className="w-7 h-7 flex-shrink-0 rounded-full object-cover" />
                <p className="bg-platinum/60 text-darkGrey px-3 py-2 rounded-lg text-sm">Thinking...</p>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <AiNotice />

          {error && <p role="alert" className="px-4 py-2 text-sm text-red-700 bg-red-50 border-t border-red-200">{error}</p>}

          {/* pl-16 on phones clears the voice-commands button that sits in the bottom-left corner. */}
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="border-t border-platinum p-3 pl-16 md:pl-3 space-y-2">
            <label htmlFor="tutor-input" className="sr-only">Ask the tutor or paste your problem</label>
            <div className="flex items-end gap-2">
              <textarea
                id="tutor-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={3}
                maxLength={4000}
                aria-describedby={noteId}
                placeholder="Ask a question or paste your problem..."
                className="flex-1 resize-none px-3 py-2 text-sm border-2 border-platinum rounded-lg focus:outline-none focus:border-darkTeal focus:ring-2 focus:ring-accentDark"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send to tutor"
                className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-full bg-darkTeal text-white hover:bg-darkTeal/90
                  disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-1"
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </div>
            <p id={noteId} className="flex items-start gap-1 text-xs text-darkGrey/70">
              <GraduationCap size={14} className="flex-shrink-0 mt-0.5" aria-hidden="true" />
              Enter sends, Shift+Enter adds a line. Your messages and what you typed in this calculator are sent to the AI service; it can make mistakes.
            </p>
          </form>
        </aside>
      )}
    </>
  );
};

export default CalculatorTutor;
