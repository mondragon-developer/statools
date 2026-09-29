import React, { useState, useRef, useEffect, useCallback, useId, lazy, Suspense } from 'react';
import { X, Send, Mic, MicOff } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useFocusTrap from '../../hooks/useFocusTrap';
import useSpeechRecognition from '../../hooks/useSpeechRecognition';
import { announcePolite, announceAssertive } from '../../utils/announce';
import { sendMessage } from '../../api/chatApi';

const loadChatMarkdown = () => import('./ChatMarkdown');
const LOGO = `${import.meta.env.BASE_URL}mdragon.svg`;
const ChatMarkdown = lazy(loadChatMarkdown);

// Generate unique ID per browser session
function getConversationId() {
  let id = sessionStorage.getItem('chat-conversation-id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('chat-conversation-id', id);
  }
  return id;
}

const ChatWidget = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'assistant', content: 'Hi! I can help you with statistics questions. Ask me anything!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleBtnRef = useRef(null);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const panelRef = useFocusTrap(isOpen);
  const headingId = useId();
  const errorId = useId();
  const conversationId = useRef(getConversationId());

  // Voice input handler — appends transcript to input field
  const handleVoiceResult = useCallback((text) => {
    setInput(prev => prev ? `${prev} ${text}` : text);
    announcePolite('Voice input captured');
  }, []);

  const { isListening, isSupported, transcript, startListening, stopListening } =
    useSpeechRecognition({ onResult: handleVoiceResult });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      // Preloaded so the first reply does not flash raw markdown inside the live region.
      loadChatMarkdown();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen(prev => {
      const next = !prev;
      if (next) {
        announcePolite('Chat panel opened');
      } else {
        announcePolite('Chat panel closed');
        // Return focus to toggle button
        setTimeout(() => toggleBtnRef.current?.focus(), 50);
      }
      return next;
    });
  };

  // Close panel and return focus
  const closePanel = useCallback(() => {
    setIsOpen(false);
    announcePolite('Chat panel closed');
    setTimeout(() => toggleBtnRef.current?.focus(), 50);
  }, []);

  // Handle Escape key on the panel
  const handlePanelKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      closePanel();
    }
  }, [closePanel]);

  // Send a message to the API
  const handleSend = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setError(null);
    setIsLoading(true);
    announcePolite('Sending message');

    try {
      const history = [...messages, userMsg]
        .filter(m => m.id !== 'welcome' && !m.failed)
        .map(({ role, content }) => ({ role, content }));
      const reply = await sendMessage(history, conversationId.current);
      const assistantMsg = { id: `a-${Date.now()}`, role: 'assistant', content: reply };
      // No separate announcement: the role="log" region already reads new messages.
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      // Left out of later requests so a rejected message cannot keep failing the conversation.
      setMessages(prev => prev.map(m => (m.id === userMsg.id ? { ...m, failed: true } : m)));
      setError('Could not get a response. Please try again.');
      announceAssertive('Error: could not get a response');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle voice input
  const toggleVoice = () => {
    if (isListening) {
      stopListening();
      announcePolite('Voice input stopped');
    } else {
      startListening();
      announceAssertive('Listening for voice input');
    }
  };

  // Calculator pages have their own tutor panel with calculator context; one chat button is enough.
  if (/^\/calculators\/[^/]+/.test(pathname)) return null;

  return (
    <>
      {/* Toggle button — always visible */}
      <button
        ref={toggleBtnRef}
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close chat assistant' : 'Open chat assistant'}
        className="print:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full overflow-hidden bg-darkTeal text-white shadow-lg
          border-2 border-white hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2
          flex items-center justify-center transition-transform"
      >
        {isOpen
          ? <X size={24} aria-hidden="true" />
          : <img src={LOGO} alt="" className="w-full h-full object-cover" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          onKeyDown={handlePanelKeyDown}
          className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] sm:w-96
            max-h-[70vh] bg-white rounded-xl shadow-2xl border border-platinum
            flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-darkGrey text-white rounded-t-xl">
            <h2 id={headingId} className="flex items-center gap-2 text-sm font-semibold">
              <img src={LOGO} alt="" className="w-7 h-7 rounded-full object-cover bg-white" />
              Statistics Assistant
            </h2>
            <button
              onClick={closePanel}
              aria-label="Close chat"
              className="w-8 h-8 flex items-center justify-center rounded-full
                hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          {/* Message list */}
          <div
            role="log"
            aria-label="Chat messages"
            aria-live="polite"
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <img src={LOGO} alt="" className="w-7 h-7 flex-shrink-0 rounded-full object-cover mt-0.5" />
                )}
                <div
                  role="article"
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-darkTeal text-white'
                      : 'bg-platinum/50 text-darkGrey'
                  }`}
                >
                  <span className="sr-only">{msg.role === 'user' ? 'You said: ' : 'Assistant said: '}</span>
                  {msg.role === 'assistant' && msg.id !== 'welcome' ? (
                    <Suspense fallback={msg.content}>
                      <ChatMarkdown>{msg.content}</ChatMarkdown>
                    </Suspense>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-2 justify-start" role="status" aria-label="Assistant is typing">
                <img src={LOGO} alt="" className="w-7 h-7 flex-shrink-0 rounded-full object-cover" />
                <div className="bg-platinum/50 text-darkGrey px-3 py-2 rounded-lg text-sm flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                  <span className="sr-only">Assistant is typing</span>
                </div>
              </div>
            )}

            {/* Scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Error display */}
          {error && (
            <div id={errorId} role="alert" className="px-4 py-2 text-sm text-red-700 bg-red-50 border-t border-red-200">
              {error}
            </div>
          )}

          {/* Input bar */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 px-3 py-3 border-t border-platinum bg-white"
          >
            {/* Mic button — only rendered if browser supports speech */}
            {isSupported && (
              <button
                type="button"
                onClick={toggleVoice}
                aria-pressed={isListening}
                aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
                className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full transition-colors
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-1
                  ${isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-platinum/60 text-darkGrey hover:bg-platinum'
                  }`}
              >
                {isListening
                  ? <MicOff size={18} aria-hidden="true" />
                  : <Mic size={18} aria-hidden="true" />}
              </button>
            )}

            <label htmlFor="chat-input" className="sr-only">Type your message</label>
            <input
              id="chat-input"
              ref={inputRef}
              type="text"
              value={isListening ? transcript || input : input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about statistics..."
              maxLength={4000}
              disabled={isLoading}
              aria-describedby={error ? errorId : undefined}
              className="flex-1 px-3 py-2 text-sm border border-platinum rounded-lg
                focus:outline-none focus:ring-2 focus:ring-accentDark
                disabled:opacity-50 disabled:cursor-not-allowed"
            />

            <button
              type="submit"
              disabled={(!input.trim() && !isListening) || isLoading}
              aria-label="Send message"
              className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-darkTeal text-white
                hover:bg-turquoise transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-1
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
