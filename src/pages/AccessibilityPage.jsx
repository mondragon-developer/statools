import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Keyboard, Mic, MessageCircle, Eye, Volume2 } from 'lucide-react';
import { CONTACT_EMAIL } from '../data/site';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Section = ({ icon, title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold text-darkGrey mb-3 flex items-center gap-2">
      {React.createElement(icon, { size: 22, className: 'text-darkTeal', 'aria-hidden': true })}
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
          <p>The site provides keyboard controls for navigation, calculators, quizzes, and the game. Please report any control you cannot reach or operate.</p>
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
              <tr><td className="py-2 pr-4">Skip to main content</td><td><KeyCombo keys={['Tab']} /> until the Skip to main content link appears</td></tr>
              <tr><td className="py-2 pr-4">Pause/resume Snake game (focus inside game)</td><td><KeyCombo keys={['Escape']} /></td></tr>
              <tr><td className="py-2 pr-4">Move snake</td><td><KeyCombo keys={['↑']} /> <KeyCombo keys={['↓']} /> <KeyCombo keys={['←']} /> <KeyCombo keys={['→']} /></td></tr>
            </tbody>
          </table>
        </Section>

        <Section icon={Volume2} title="Screen Reader Support">
          <p>The site uses headings, labels, and live announcements to support screen readers. Compatibility across NVDA, JAWS, and VoiceOver still needs a complete manual review.</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>The homepage dataset has numeric results and a described dot plot. Other charts may need further review.</li>
            <li>Math Snake offers step-by-step play without a timer, with text positions for the head, target, and body. Its usability with screen readers still needs user testing.</li>
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
              <tr><td className="py-2 pr-4">"Local calculators" (any name on the page)</td><td>Moves focus to it and frames it, like pressing Tab to reach it</td></tr>
              <tr><td className="py-2 pr-4">"Next" / "Previous"</td><td>Moves to the next or previous control, like Tab and Shift+Tab</td></tr>
              <tr><td className="py-2 pr-4">"Click" or "Click Calculate"</td><td>Presses the selected item, or the named button</td></tr>
              <tr><td className="py-2 pr-4">"Go to binomial" / "Go to stage 2"</td><td>Opens that calculator or journey stage</td></tr>
              <tr><td className="py-2 pr-4">"Scroll to tools" / "Scroll down" / "Go back"</td><td>Moves to a section, scrolls the page, or returns to the previous page</td></tr>
              <tr><td className="py-2 pr-4">"Type" and your words</td><td>Fills the selected text field, or sets a number field or slider</td></tr>
              <tr><td className="py-2 pr-4">"Open chat" / "Close chat"</td><td>Opens or closes the chat assistant (the AI tutor on calculator pages)</td></tr>
              <tr><td className="py-2 pr-4">"Help" / "Stop listening"</td><td>Lists the commands, or turns voice commands off</td></tr>
            </tbody>
          </table>
          <p className="mt-2 text-sm text-darkGrey/60">Voice commands are not available in Firefox or Safari.</p>
          <p className="mt-2 text-sm text-darkGrey/60">
            Speech is converted to text by your browser&apos;s own speech service (Google&apos;s, in Chrome). The site receives only the
            recognized words. See the <Link to="/privacy" className="underline text-darkTeal hover:no-underline">Privacy</Link> page.
          </p>
        </Section>

        <Section icon={MessageCircle} title="Chat Assistant with Voice Input">
          <p>The chat bubble opens an AI statistics tutor for users aged 18 and older. Keyboard users can confirm their age or choose Continue without AI.</p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>Fully keyboard accessible — Tab into the chat, type, and press Enter to send</li>
            <li>Press <KeyCombo keys={['Escape']} /> to close the chat and return to where you were</li>
            <li>On Chrome/Edge, a <strong>microphone button</strong> inside the chat lets you dictate messages by voice</li>
            <li>New responses are announced to your screen reader automatically</li>
          </ul>
        </Section>

        <Section icon={Eye} title="Visual Accessibility">
          <ul className="list-disc ml-6 space-y-1">
            <li>We target WCAG AA text contrast (4.5:1 for normal text and 3:1 for large text)</li>
            <li>Interactive elements (buttons, links, inputs) have a visible focus indicator</li>
            <li>Layouts are designed to reflow with zoom; wide data tables may require horizontal scrolling</li>
            <li>Labels and symbols supplement color in results and controls</li>
            <li>Browser zoom and text-spacing settings can be used to adjust readability</li>
          </ul>
        </Section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-darkGrey mb-3">Standards</h2>
          <p className="text-darkGrey/80">
            This site targets <strong>WCAG 2.2 Level AA</strong>. This is a development target, not a certification. An October 2, 2026 homepage review included automated WCAG checks and keyboard, narrow-layout, dialog, contrast, and text-spacing checks. It does not establish full conformance. Manual testing with NVDA, JAWS, and VoiceOver, and a complete audit of all calculators, quiz content, and PDFs, remain pending. Downloadable PDFs, external resources, and visual chart details may have accessibility limitations. Voice availability depends on your browser and provider.
          </p>
        </section>

        <section className="mb-8 p-4 bg-white border-2 border-darkTeal/30 rounded-lg">
          <h2 className="text-lg font-bold text-darkGrey mb-2">Feedback</h2>
          <p className="text-darkGrey/80 text-sm">
            If you find any part of this site difficult to use, we want to hear about it.
            Email <a className="underline text-darkTeal" href={`mailto:${CONTACT_EMAIL}?subject=Statools%20accessibility`}>{CONTACT_EMAIL}</a> with the page, the barrier, and your browser or assistive technology. Do not include personal student data. The AI assistant is not a support ticket system.
            We are committed to making these tools accessible to all learners.
          </p>
        </section>
      </main>
    </div>
  );
};

export default AccessibilityPage;
