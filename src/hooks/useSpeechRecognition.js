import { useState, useRef, useCallback, useEffect } from 'react';

// Web Speech API hook with feature detection
export default function useSpeechRecognition({ onResult, lang = 'en-US' } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const startTimer = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  const startListening = useCallback(() => {
    if (!isSupported || isListening) return;

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const current = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('');
      setTranscript(current);

      // Final result — send to callback
      if (event.results[event.results.length - 1].isFinal) {
        onResult?.(current);
      }
    };

    // Voice commands listen continuously; tell them to release the microphone while dictating.
    const announceDictation = (active) => window.dispatchEvent(new CustomEvent('statools:dictation', { detail: { active } }));
    recognition.onend = () => {
      setIsListening(false);
      announceDictation(false);
    };
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    announceDictation(true);
    // Give voice commands a moment to stop before this recognizer claims the microphone.
    startTimer.current = setTimeout(() => {
      startTimer.current = null;
      try {
        recognition.start();
      } catch {
        setIsListening(false);
        announceDictation(false);
      }
    }, 150);
    setIsListening(true);
    setTranscript('');
  }, [isSupported, isListening, lang, onResult]);

  // Stopping inside the start delay must cancel the pending start, or the mic comes on anyway.
  const cancelPendingStart = () => {
    if (!startTimer.current) return;
    clearTimeout(startTimer.current);
    startTimer.current = null;
    window.dispatchEvent(new CustomEvent('statools:dictation', { detail: { active: false } }));
  };

  const stopListening = useCallback(() => {
    cancelPendingStart();
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelPendingStart();
      recognitionRef.current?.abort();
    };
  }, []);

  return { isListening, isSupported, transcript, startListening, stopListening };
}
