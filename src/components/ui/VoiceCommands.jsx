import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { announceAssertive, announcePolite } from '../../utils/announce';

// Navigation routes voice users can say
const NAV_ROUTES = {
  'home': '/',
  'calculators': '/calculators',
  'statistics': '/calculators/statistics',
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
  'correlation': '/calculators/correlation-regression',
  'regression': '/calculators/correlation-regression',
  'correlation regression': '/calculators/correlation-regression',
  'frequency': '/calculators/frequency-distribution',
  'frequency distribution': '/calculators/frequency-distribution',
};

// Section IDs voice users can scroll to
const SCROLL_TARGETS = ['main-content', 'tools', 'resources', 'contact'];

// Find a clickable element matching spoken text
function findClickable(text) {
  const lower = text.toLowerCase().trim();
  const selectors = 'button:not([disabled]), a[href], [role="tab"], [role="button"]';
  const elements = document.querySelectorAll(selectors);

  let bestMatch = null;
  let bestScore = 0;

  for (const el of elements) {
    if (el.offsetParent === null) continue; // skip hidden
    const visible = (el.textContent || '').trim().toLowerCase();
    const label = (el.getAttribute('aria-label') || '').toLowerCase();

    // Exact match on visible text or aria-label
    if (visible === lower || label === lower) return el;

    // Partial match — visible text contains spoken text
    if (visible.includes(lower) && lower.length > 2 && lower.length / visible.length > bestScore) {
      bestMatch = el;
      bestScore = lower.length / visible.length;
    }
    if (label.includes(lower) && lower.length > 2 && lower.length / label.length > bestScore) {
      bestMatch = el;
      bestScore = lower.length / label.length;
    }
  }

  return bestScore > 0.3 ? bestMatch : null;
}

const VoiceCommands = () => {
  const [isActive, setIsActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const recognitionRef = useRef(null);
  const feedbackTimer = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  // Clear feedback after delay
  const showFeedback = useCallback((msg) => {
    setFeedback(msg);
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(''), 3000);
  }, []);

  // Process a recognized command
  const processCommand = useCallback((spoken) => {
    const text = spoken.toLowerCase().trim();

    // "go to [page]" or "navigate to [page]"
    const goMatch = text.match(/^(?:go to|navigate to|open)\s+(.+)$/);
    if (goMatch) {
      const target = goMatch[1].trim();
      const route = NAV_ROUTES[target];
      if (route) {
        window.location.href = `/statools${route}`;
        showFeedback(`Navigating to ${target}`);
        announceAssertive(`Navigating to ${target}`);
        return true;
      }
    }

    // "scroll to [section]"
    const scrollMatch = text.match(/^scroll to\s+(.+)$/);
    if (scrollMatch) {
      const section = scrollMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
      const el = SCROLL_TARGETS.includes(section) ? document.getElementById(section) : null;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        el.focus?.({ preventScroll: true });
        showFeedback(`Scrolled to ${scrollMatch[1]}`);
        announceAssertive(`Scrolled to ${scrollMatch[1]}`);
        return true;
      }
    }

    // "open chat" / "close chat"
    if (text === 'open chat' || text === 'close chat') {
      const chatBtn = document.querySelector('[aria-label="Open chat assistant"], [aria-label="Close chat assistant"]');
      if (chatBtn) {
        chatBtn.click();
        showFeedback(text === 'open chat' ? 'Chat opened' : 'Chat closed');
        announceAssertive(text === 'open chat' ? 'Chat opened' : 'Chat closed');
        return true;
      }
    }

    // "click [text]"
    const clickMatch = text.match(/^click\s+(.+)$/);
    if (clickMatch) {
      const el = findClickable(clickMatch[1]);
      if (el) {
        el.click();
        el.focus?.();
        const name = el.textContent?.trim().slice(0, 40) || el.getAttribute('aria-label');
        showFeedback(`Clicked: ${name}`);
        announceAssertive(`Clicked ${name}`);
        return true;
      }
    }

    // Try direct match against clickable elements (no prefix needed)
    const el = findClickable(text);
    if (el) {
      el.click();
      el.focus?.();
      const name = el.textContent?.trim().slice(0, 40) || el.getAttribute('aria-label');
      showFeedback(`Clicked: ${name}`);
      announceAssertive(`Clicked ${name}`);
      return true;
    }

    // Try as navigation target
    const route = NAV_ROUTES[text];
    if (route) {
      window.location.href = `/statools${route}`;
      showFeedback(`Navigating to ${text}`);
      announceAssertive(`Navigating to ${text}`);
      return true;
    }

    showFeedback(`Not recognized: "${spoken}"`);
    announcePolite(`Command not recognized: ${spoken}`);
    return false;
  }, [showFeedback]);

  // Start continuous recognition
  const startListening = useCallback(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      const text = lastResult[0].transcript;
      setTranscript(text);

      if (lastResult.isFinal) {
        processCommand(text);
        setTranscript('');
      }
    };

    // Auto-restart on end (browser stops after silence)
    recognition.onend = () => {
      if (recognitionRef.current) {
        try { recognition.start(); } catch (e) { /* already started */ }
      }
    };

    recognition.onerror = (e) => {
      if (e.error === 'not-allowed') {
        showFeedback('Microphone access denied');
        setIsActive(false);
        recognitionRef.current = null;
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, processCommand, showFeedback]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      const ref = recognitionRef.current;
      recognitionRef.current = null; // prevent auto-restart
      ref.stop();
    }
  }, []);

  const toggle = () => {
    if (isActive) {
      stopListening();
      setIsActive(false);
      setTranscript('');
      announcePolite('Voice commands disabled');
    } else {
      setIsActive(true);
      startListening();
      announceAssertive('Voice commands enabled. Say a command like "go to statistics" or "click Calculate".');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
      clearTimeout(feedbackTimer.current);
    };
  }, [stopListening]);

  if (!isSupported) return null;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={toggle}
        aria-pressed={isActive}
        aria-label={isActive ? 'Disable voice commands' : 'Enable voice commands'}
        className={`fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2
          ${isActive
            ? 'bg-red-500 text-white animate-pulse'
            : 'bg-darkGrey text-white hover:bg-darkTeal'
          }`}
      >
        {isActive
          ? <MicOff size={20} aria-hidden="true" />
          : <Mic size={20} aria-hidden="true" />}
      </button>

      {/* Transcript + feedback banner */}
      {isActive && (transcript || feedback) && (
        <div
          className="fixed bottom-20 left-6 z-50 max-w-xs bg-darkGrey text-white text-sm px-4 py-2 rounded-lg shadow-lg"
          role="status"
          aria-live="polite"
        >
          {transcript && (
            <p className="text-white/70 italic">"{transcript}"</p>
          )}
          {feedback && (
            <p className="font-medium">{feedback}</p>
          )}
        </div>
      )}

      {/* Help tooltip when first activated */}
      {isActive && !transcript && !feedback && (
        <div
          className="fixed bottom-20 left-6 z-50 max-w-xs bg-darkGrey text-white text-xs px-4 py-3 rounded-lg shadow-lg"
          role="status"
        >
          <p className="font-semibold mb-1">Voice Commands:</p>
          <ul className="space-y-0.5 text-white/80">
            <li>"Go to statistics"</li>
            <li>"Click Calculate"</li>
            <li>"Scroll to tools"</li>
            <li>"Open chat"</li>
          </ul>
        </div>
      )}
    </>
  );
};

export default VoiceCommands;
