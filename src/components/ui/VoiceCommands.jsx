import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff } from 'lucide-react';
import { announceAssertive, announcePolite } from '../../utils/announce';
import { findTarget, highlight, moveFocus, nameOf, normalize, typeIntoFocused } from '../../utils/voiceTargets';

const NAV_ROUTES = {
  'home': '/',
  'home page': '/',
  'calculators': '/calculators',
  'all calculators': '/calculators',
  'statistics': '/calculators/statistics',
  'statistics calculator': '/calculators/statistics',
  'descriptive statistics': '/calculators/statistics',
  'probability': '/calculators/probability',
  'normal': '/calculators/normal',
  'normal distribution': '/calculators/normal',
  'binomial': '/calculators/binomial',
  'binomial distribution': '/calculators/binomial',
  'poisson': '/calculators/poisson',
  'poisson distribution': '/calculators/poisson',
  'hypothesis': '/calculators/hypothesis-test',
  'hypothesis test': '/calculators/hypothesis-test',
  'two sample': '/calculators/two-sample',
  'two sample comparison': '/calculators/two-sample',
  'correlation': '/calculators/correlation-regression',
  'regression': '/calculators/correlation-regression',
  'correlation regression': '/calculators/correlation-regression',
  'frequency': '/calculators/frequency-distribution',
  'frequency distribution': '/calculators/frequency-distribution',
  'learning journey': '/learn',
  'journey': '/learn',
  'lessons': '/learn',
  'learn': '/learn',
  'capstone': '/learn/capstone',
  'final case file': '/learn/capstone',
  'certificate': '/learn/certificate',
  'teacher report': '/learn/report',
  'accessibility': '/accessibility',
};

// Page sections reachable by name; ids win over a same-named menu link ("scroll to tools").
const SECTIONS = { tools: 'tools', resources: 'resources', tutorials: 'resources', contact: 'contact', 'resource library': 'resource-library', 'ai lab': 'ai-lab', 'ai': 'ai-lab', 'a i lab': 'ai-lab', 'a i': 'ai-lab' };

const NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 };

function routeFor(phrase) {
  if (NAV_ROUTES[phrase]) return NAV_ROUTES[phrase];
  const stage = phrase.match(/^stage (\d|one|two|three|four|five|six|seven)$/);
  if (stage) return `/learn/stage/${NUMBER_WORDS[stage[1]] || stage[1]}`;
  return null;
}

// Errors that mean listening cannot continue; others (no-speech, aborted) just restart.
const FATAL_ERRORS = {
  'not-allowed': 'Microphone access is blocked. Allow the microphone for this site in the browser settings.',
  'service-not-allowed': 'This browser does not allow speech recognition here. Try Chrome or Edge.',
  'audio-capture': 'No microphone was found. Plug one in and try again.',
  'network': 'The speech service could not be reached. Check your internet connection.',
  'language-not-supported': 'Speech recognition for English is not available in this browser.',
};

const HELP = [
  'Say a name to frame it, like "local calculators"',
  '"Next" or "previous" to move like Tab',
  '"Click" to press the framed item, or "click Calculate"',
  '"Go to binomial" or "go to stage 2"',
  '"Scroll down", "scroll up", "go back"',
  '"Type" and your words to fill the focused field',
  '"Open chat", "help", "stop listening"',
];

const getRecognizer = () => window.SpeechRecognition || window.webkitSpeechRecognition;

const VoiceCommands = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const recognitionRef = useRef(null);
  const activeRef = useRef(false);
  const pausedRef = useRef(false);
  const feedbackTimer = useRef(null);

  const isSupported = Boolean(getRecognizer());

  const say = useCallback((message, { urgent = true } = {}) => {
    setFeedback(message);
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(''), 4000);
    (urgent ? announceAssertive : announcePolite)(message);
  }, []);

  const frame = useCallback((target) => {
    highlight(target.element);
    say(`Selected ${nameOf(target.matched || target.element)}`);
  }, [say]);

  const stop = useCallback(() => {
    activeRef.current = false;
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    recognition?.abort();
    setIsActive(false);
    setTranscript('');
    setShowHelp(false);
  }, []);

  const processCommand = useCallback((spoken) => {
    const text = normalize(spoken);
    if (!text) return;
    setShowHelp(false);

    if (/^(help|what can i say|commands)$/.test(text)) {
      setShowHelp(true);
      announcePolite(`Voice commands. ${HELP.join('. ')}.`);
      return;
    }
    if (/^(stop listening|stop|turn off|microphone off)$/.test(text)) {
      stop();
      announcePolite('Voice commands turned off.');
      return;
    }
    if (/^(next|tab|next item)$/.test(text)) {
      const el = moveFocus(1);
      if (el) say(`Selected ${nameOf(el)}`);
      return;
    }
    if (/^(previous|back tab|previous item)$/.test(text)) {
      const el = moveFocus(-1);
      if (el) say(`Selected ${nameOf(el)}`);
      return;
    }
    if (/^(click|press|enter|select it|activate|open it)$/.test(text)) {
      const el = document.activeElement;
      if (el && el !== document.body) {
        const control = el.matches('button, a[href], summary, [role="button"], input, select, textarea')
          ? el
          : el.querySelector('button, a[href]');
        if (control) {
          control.click();
          say(`Pressed ${nameOf(control)}`);
          return;
        }
      }
      say('Nothing is selected to press. Say a name first, or "next".');
      return;
    }
    if (/^(go back|back)$/.test(text)) {
      navigate(-1);
      say('Going back.');
      return;
    }
    if (/^scroll (down|up|to top|to bottom|top|bottom)$/.test(text)) {
      const dir = text.replace('scroll ', '').replace('to ', '');
      const amount = window.innerHeight * 0.8;
      const top = dir === 'top' ? 0 : dir === 'bottom' ? document.body.scrollHeight : window.scrollY + (dir === 'down' ? amount : -amount);
      window.scrollTo({ top, behavior: 'smooth' });
      say(`Scrolled ${dir}.`, { urgent: false });
      return;
    }
    const typeMatch = spoken.trim().match(/^type\s+(.+)$/i);
    if (typeMatch) {
      if (typeIntoFocused(typeMatch[1])) say(`Typed ${typeMatch[1]}`);
      else say('Select a text field first, then say "type" and your words.');
      return;
    }
    if (/^(open|close) (chat|tutor|ai tutor)$/.test(text)) {
      const opening = text.startsWith('open');
      // Calculator pages swap the chat bubble for the tutor, so match whichever is present.
      const button = document.querySelector(opening
        ? '[aria-label="Open chat assistant"], [data-tutor-toggle]'
        : '[aria-label="Close chat assistant"], [aria-label="Close AI tutor"]');
      if (button) {
        button.click();
        say(opening ? 'Chat opened.' : 'Chat closed.');
      } else {
        say(opening ? 'The chat is already open.' : 'The chat is not open.');
      }
      return;
    }

    const clickMatch = text.match(/^(?:click|press|activate|choose)\s+(.+)$/);
    if (clickMatch) {
      const target = findTarget(clickMatch[1], { controlsOnly: true });
      if (target) {
        highlight(target.control);
        target.control.click();
        say(`Pressed ${nameOf(target.control)}`);
        return;
      }
    }

    const goMatch = text.match(/^(?:go to|navigate to|open|take me to)\s+(.+)$/);
    const destination = goMatch ? goMatch[1] : text;
    const route = routeFor(destination);
    // "go to X" prefers the page; a bare name prefers something on this page.
    if (goMatch && route) {
      navigate(route);
      say(`Opening ${destination}.`);
      return;
    }

    const lookup = text.match(/^(?:show|find|select|focus|scroll to|where is)\s+(.+)$/);
    const wanted = lookup ? lookup[1] : destination;
    const section = SECTIONS[wanted] && document.getElementById(SECTIONS[wanted]);
    if (section) {
      highlight(section);
      say(`Selected ${nameOf(section.querySelector('h1, h2, h3') || section)}`);
      return;
    }
    const target = findTarget(wanted);
    if (target) {
      frame(target);
      return;
    }
    if (route) {
      navigate(route);
      say(`Opening ${destination}.`);
      return;
    }

    say(`Not found: "${spoken.trim()}". Say "help" for commands.`, { urgent: false });
  }, [frame, navigate, say, stop]);

  const processRef = useRef(processCommand);
  processRef.current = processCommand;

  const start = useCallback(() => {
    const Recognizer = getRecognizer();
    if (!Recognizer || recognitionRef.current) return;
    const recognition = new Recognizer();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          setTranscript('');
          processRef.current(result[0].transcript);
        } else {
          setTranscript(result[0].transcript);
        }
      }
    };

    recognition.onerror = (e) => {
      const message = FATAL_ERRORS[e.error];
      if (message) {
        stop();
        say(message);
      }
    };

    // Chrome ends a session after a stretch of silence; restart unless the user
    // turned it off or chat dictation currently owns the microphone.
    recognition.onend = () => {
      if (recognitionRef.current !== recognition) return;
      recognitionRef.current = null;
      if (activeRef.current && !pausedRef.current) setTimeout(() => activeRef.current && !pausedRef.current && start(), 250);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
    }
  }, [say, stop]);

  // Only one recognizer can hold the microphone; step aside while the chat dictates.
  useEffect(() => {
    const onDictation = (e) => {
      pausedRef.current = e.detail.active;
      if (!activeRef.current) return;
      if (e.detail.active) {
        const recognition = recognitionRef.current;
        recognitionRef.current = null;
        recognition?.abort();
      } else {
        start();
      }
    };
    window.addEventListener('statools:dictation', onDictation);
    return () => window.removeEventListener('statools:dictation', onDictation);
  }, [start]);

  useEffect(() => () => {
    activeRef.current = false;
    recognitionRef.current?.abort();
    clearTimeout(feedbackTimer.current);
  }, []);

  const toggle = () => {
    if (isActive) {
      stop();
      announcePolite('Voice commands turned off.');
      return;
    }
    activeRef.current = true;
    setIsActive(true);
    setShowHelp(true);
    if (!pausedRef.current) start();
    announceAssertive('Voice commands on. Say a name like "local calculators" to select it, "next" to move, or "help".');
  };

  if (!isSupported) return null;

  return (
    <>
      <button
        onClick={toggle}
        aria-pressed={isActive}
        aria-label={isActive ? 'Turn off voice commands' : 'Turn on voice commands'}
        className={`print:hidden fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2
          ${isActive ? 'bg-red-600 text-white motion-safe:animate-pulse' : 'bg-darkGrey text-white hover:bg-darkTeal'}`}
      >
        {isActive ? <MicOff size={20} aria-hidden="true" /> : <Mic size={20} aria-hidden="true" />}
      </button>

      {/* Visual only: every message is already announced through the shared live regions. */}
      {/* Shown after a fatal error too, so a blocked microphone explains itself on screen. */}
      {(feedback || (isActive && (transcript || showHelp))) && (
        <div
          aria-hidden="true"
          data-voice-ignore
          className="print:hidden fixed bottom-20 left-6 z-50 max-w-xs bg-darkGrey text-white text-sm px-4 py-3 rounded-lg shadow-lg space-y-1"
        >
          {isActive && (
            <p className="flex items-center gap-2 text-xs text-accent font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 motion-safe:animate-pulse" /> Listening
            </p>
          )}
          {transcript && <p className="text-white/80 italic">"{transcript}"</p>}
          {feedback && <p className="font-medium">{feedback}</p>}
          {isActive && showHelp && !feedback && !transcript && (
            <ul className="text-xs text-white/85 space-y-0.5">
              {HELP.map(line => <li key={line}>{line}</li>)}
            </ul>
          )}
        </div>
      )}
    </>
  );
};

export default VoiceCommands;
