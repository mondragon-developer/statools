import { useState, useRef, useCallback, useEffect } from 'react';

// Web Speech API hook with feature detection
export default function useSpeechRecognition({ onResult, lang = 'en-US' } = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

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

    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    setTranscript('');
  }, [isSupported, isListening, lang, onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  return { isListening, isSupported, transcript, startListening, stopListening };
}
