import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Keyboard, Mic, MessageCircle, Eye, Volume2 } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Section = ({ icon: Icon, title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold text-darkGrey mb-3 flex items-center gap-2">
      <Icon size={22} className="text-darkTeal" aria-hidden="true" />
      {title}
    </h2>
    <div className="text-darkGrey/80 space-y-2">{children}</div>
  </section>
);

const KeyCombo = ({ keys }) => (
  <span className="inline-flex gap-1">
    {keys.map((key, i) => (
      <span key={i}>
        {i > 0 && <span className="text-darkGrey/50 mx-0.5">+</span>}
        <kbd className="px-2 py-0.5 bg-platinum border border-darkGrey/20 rounded text-sm font-mono">{key}</kbd>
      </span>
    ))}
  </span>
);

const AccessibilityPage = () => {
  useDocumentTitle('Accessibility');

  return (
    <div className="min-h-screen bg-platinum">
      <nav className="bg-darkGrey text-white p-4 shadow-md" aria-label="Page navigation">
        <div className="container mx-auto">
          <Link to="/" className="flex items-center space-x-2 w-fit">
            <Home size={20} aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
        </div>
      </nav>

      <main id="main-content" className="container mx-auto px-4 py-8 max-w-3xl" tabIndex={-1}>
        <h1 className="text-3xl font-bold text-darkGrey mb-2">Accessibility</h1>
        <p className="text-darkGrey/70 mb-8">
          MDragon Data Tools is designed to be usable by everyone. This page explains the accessibility features available throughout the site.
        </p>

        <Section icon={Keyboard} title="Keyboard Navigation">
          <p>Every feature on this site can be used with a keyboard alone — no mouse required.</p>
          <table className="w-full mt-3 text-sm">
            <caption className="sr-only">Keyboard shortcuts reference</caption>
            <thead>
              <tr className="border-b border-darkGrey/20">
                <th scope="col" className="text-left py-2 pr-4 font-semibold">Action</th>
                <th scope="col" className="text-left py-2 font-semibold">Keys</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkGrey/10">
              <tr><td className="py-2 pr-4">Move between elements</td><td><KeyCombo keys={['Tab']} /></td></tr>
              <tr><td className="py-2 pr-4">Move backwards</td><td><KeyCombo keys={['Shift', 'Tab']} /></td></tr>
              <tr><td className="py-2 pr-4">Activate buttons and links</td><td><KeyCombo keys={['Enter']} /> or <KeyCombo keys={['Space']} /></td></tr>
              <tr><td className="py-2 pr-4">Close dialogs and tooltips</td><td><KeyCombo keys={['Escape']} /></td></tr>
              <tr><td className="py-2 pr-4">Adjust sliders</td><td><KeyCombo keys={['←']} /> <KeyCombo keys={['→']} /></td></tr>
              <tr><td className="py-2 pr-4">Skip to main content</td><td><KeyCombo keys={['Tab']} /> on page load (first element)</td></tr>
              <tr><td className="py-2 pr-4">Pause/resume Snake game</td><td><KeyCombo keys={['Escape']} /></td></tr>
              <tr><td className="py-2 pr-4">Move snake</td><td><KeyCombo keys={['↑']} /> <KeyCombo keys={['↓']} /> <KeyCombo keys={['←']} /> <KeyCombo keys={['→']} /></td></tr>
            </tbody>
          </table>
        </Section>

        <Section icon={Volume2} title="Screen Reader Support">
          <p>The site works with screen readers like NVDA, JAWS, and VoiceOver.</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>All images, charts, and icons have text descriptions</li>
            <li>Form inputs are labeled so your screen reader announces what each field is for</li>
            <li>Calculation results and errors are announced automatically without losing your place</li>
            <li>Dialogs (quizzes, box plots, chat) trap focus so you stay within the dialog until you close it</li>
            <li>Each page has a descriptive title announced when you navigate</li>
            <li>Tables include headers and captions for clear data reading</li>
          </ul>
        </Section>

        <Section icon={Mic} title="Voice Commands">
          <p>On supported browsers (Chrome, Edge), you can control the site with your voice.</p>
          <ol className="list-decimal ml-6 mt-2 space-y-1">
            <li>Click the <strong>microphone button</strong> in the bottom-left corner of the screen</li>
            <li>Allow microphone access when your browser asks</li>
            <li>Speak a command — you will see a transcript and confirmation of what was recognized</li>
          </ol>
          <table className="w-full mt-3 text-sm">
            <caption className="sr-only">Available voice commands</caption>
            <thead>
              <tr className="border-b border-darkGrey/20">
                <th scope="col" className="text-left py-2 pr-4 font-semibold">Say this</th>
                <th scope="col" className="text-left py-2 font-semibold">What happens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-darkGrey/10">
              <tr><td className="py-2 pr-4">"Go to statistics"</td><td>Opens the Statistics calculator</td></tr>
              <tr><td className="py-2 pr-4">"Go to binomial"</td><td>Opens the Binomial calculator</td></tr>
              <tr><td className="py-2 pr-4">"Click Calculate"</td><td>Clicks the Calculate button on the current page</td></tr>
              <tr><td className="py-2 pr-4">"Scroll to tools"</td><td>Scrolls to the Tools section</td></tr>
              <tr><td className="py-2 pr-4">"Open chat"</td><td>Opens the chat assistant</td></tr>
              <tr><td className="py-2 pr-4">"Close chat"</td><td>Closes the chat assistant</td></tr>
            </tbody>
          </table>
          <p className="mt-2 text-sm text-darkGrey/60">Voice commands are not available in Firefox or Safari.</p>
        </Section>

        <Section icon={MessageCircle} title="Chat Assistant with Voice Input">
          <p>The chat bubble in the bottom-right corner opens a statistics assistant you can ask questions.</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Fully keyboard accessible — Tab into the chat, type, and press Enter to send</li>
            <li>Press <KeyCombo keys={['Escape']} /> to close the chat and return to where you were</li>
            <li>On Chrome/Edge, a <strong>microphone button</strong> inside the chat lets you dictate messages by voice</li>
            <li>New responses are announced to your screen reader automatically</li>
          </ul>
        </Section>

        <Section icon={Eye} title="Visual Accessibility">
          <ul className="list-disc ml-6 space-y-1">
            <li>All text meets a minimum contrast ratio of 4.5:1 (WCAG AA)</li>
            <li>Interactive elements (buttons, links, inputs) have a visible focus indicator</li>
            <li>The site works at 200% browser zoom without horizontal scrolling</li>
            <li>No content relies on color alone to convey meaning</li>
            <li>You can use browser extensions or settings to increase text spacing without breaking the layout</li>
          </ul>
        </Section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-darkGrey mb-3">Standards</h2>
          <p className="text-darkGrey/80">
            This site targets <strong>WCAG 2.1 Level AA</strong> conformance. The third-party content
            (if any external widgets are present) may not be fully within our control. If you encounter
            any accessibility barrier, please contact us so we can address it.
          </p>
        </section>

        <section className="mb-8 p-4 bg-white border-2 border-darkTeal/30 rounded-lg">
          <h2 className="text-lg font-bold text-darkGrey mb-2">Feedback</h2>
          <p className="text-darkGrey/80 text-sm">
            If you find any part of this site difficult to use, we want to hear about it.
            Please reach out through the chat assistant or the Contact section on the home page.
            We are committed to making these tools accessible to all learners.
          </p>
        </section>
      </main>
    </div>
  );
};

export default AccessibilityPage;
