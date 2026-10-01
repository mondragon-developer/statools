import React from 'react';
import { Link } from 'react-router-dom';
import InfoPage, { InfoSection } from '../components/layout/InfoPage';
import { SITE_NAME, OWNER, OWNER_URL, CONTACT_EMAIL, LEGAL_UPDATED } from '../data/site';

const linkClass = 'text-darkTeal underline hover:no-underline';

const PrivacyPage = () => (
  <InfoPage
    title="Privacy"
    intro={`How ${SITE_NAME} handles your information. Last updated ${LEGAL_UPDATED}.`}
  >
    <InfoSection title="The short version">
      <p>
        This site has no accounts and sets no cookies. The calculators, lessons, quizzes, and games run in your
        browser, and your learning progress stays in your browser. The only time anything you type leaves your
        device is when you use the AI chat or tutor, or when you choose to email us.
      </p>
    </InfoSection>

    <InfoSection title="What stays on your device">
      <p>
        Your journey progress (completed lessons, badges, reflections, capstone answers, the name you type for the
        certificate) and a few preferences are saved in your browser&apos;s local storage. They are not sent to
        us. Clearing site data in your browser removes them. A progress code is a copy of that same information,
        packed into text: it goes only where you send it.
      </p>
    </InfoSection>

    <InfoSection title="What the AI chat and tutor send">
      <p>
        When you send a message to the Statistics Assistant or the calculator tutor, the message, the earlier
        messages in that conversation, and (for the tutor) the values and text visible in that calculator are sent
        to our server and then to Chatbase, the service that generates the reply. Chatbase uses large language
        models from other providers to produce the answer, and keeps conversations in our Chatbase account so we
        can review how the tutor behaves and improve it.
      </p>
      <p>
        Each conversation gets a random identifier that is not linked to you. Please do not include names, student
        numbers, grades, or other personal details in your messages or in data you paste. If you do, you can ask us
        to delete that conversation (see Contact).
      </p>
    </InfoSection>

    <InfoSection title="Voice commands and dictation">
      <p>
        Voice features use the speech recognition built into your browser. Your browser may send the audio to its
        own provider to turn it into text (Chrome, for example, uses Google&apos;s speech service). We never receive
        the audio, only the recognized text, and only if you then send it as a chat message. The microphone is on
        only while the button shows it listening.
      </p>
    </InfoSection>

    <InfoSection title="Server logs">
      <p>
        The site is hosted on Vercel. Like any web host, Vercel records technical details of each request (IP
        address, browser type, requested page, time) in short-lived logs used for security and troubleshooting. We
        do not run analytics or advertising trackers.
      </p>
    </InfoSection>

    <InfoSection title="Email">
      <p>
        If you write to us, we keep your message for as long as needed to answer it and for a reasonable time
        afterwards.
      </p>
    </InfoSection>

    <InfoSection title="Who processes your data">
      <ul className="list-disc ml-6 space-y-1">
        <li>Vercel Inc. (United States): hosting and the chat relay.</li>
        <li>Chatbase (Canada) and its model providers (United States): generating AI replies.</li>
        <li>Your browser&apos;s speech provider, if you use voice features.</li>
      </ul>
      <p>
        We do not sell personal information and we do not share it with anyone else.
      </p>
    </InfoSection>

    <InfoSection title="Your choices">
      <ul className="list-disc ml-6 space-y-1">
        <li>Every calculator, lesson, and quiz works without the chat or voice features.</li>
        <li>Clear your browser&apos;s site data to erase saved progress and preferences.</li>
        <li>Email us to ask what we hold about a conversation or to have it deleted; include the approximate date and the text you sent so we can find it.</li>
      </ul>
    </InfoSection>

    <InfoSection title="Children">
      <p>
        {SITE_NAME} is made for college and high school statistics students and is intended for users aged 13 and
        older. We do not knowingly collect personal information from children under 13. If you believe a child has
        sent us personal information through the chat, contact us and we will delete it.
      </p>
    </InfoSection>

    <InfoSection title="Visitors outside the United States">
      <p>
        The site is operated from the United States and the services above store data there. We process chat
        messages because you ask for a reply (our legitimate interest in running the tutor you chose to use). Where
        local law gives you rights to access, correct, or erase your data or to object to processing, you can
        exercise them by email.
      </p>
    </InfoSection>

    <InfoSection title="Changes">
      <p>
        If this page changes in a way that matters, the date at the top changes with it. Continued use of the chat
        or tutor after a change means you accept the updated terms.
      </p>
    </InfoSection>

    <InfoSection title="Contact">
      <p>
        {SITE_NAME} is published by <a href={OWNER_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>{OWNER}</a>.
        Privacy questions and deletion requests: <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Statools privacy request')}`} className={linkClass}>{CONTACT_EMAIL}</a>.
      </p>
      <p>
        See also the <Link to="/terms" className={linkClass}>Terms of Use</Link> and the{' '}
        <Link to="/accessibility" className={linkClass}>Accessibility</Link> page.
      </p>
    </InfoSection>
  </InfoPage>
);

export default PrivacyPage;
