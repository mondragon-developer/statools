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
        This site does not require an account or use advertising or analytics cookies. Calculations, lessons,
        quizzes, and games run in your browser. Learning progress is saved on your device. Optional AI messages
        go to our server and Chatbase; voice features may send audio to your browser provider. Hosting requests
        also produce technical logs. External links open services with their own privacy practices.
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
        messages in that conversation, and, only if you turn on &quot;Share calculator inputs and results,&quot; a snapshot of the calculator are sent
        to our server and then to Chatbase, the service that generates the reply. Chatbase uses large language
        models from other providers to produce the answer, and keeps conversations in our Chatbase account so we
        can review how the tutor behaves and improve it.
      </p>
      <p>
        Each conversation gets a random identifier rather than an account name. This does not make the conversation anonymous: what you type may identify you. Please do not include names, student
        numbers, grades, or other personal details in your messages or in data you paste. If you do, you can ask us
        to delete that conversation (see Contact).
      </p>
    </InfoSection>

    <InfoSection title="Voice commands and dictation">
      <p>
        Voice features use the speech recognition built into your browser. Your browser may send the audio to its
        own provider to turn it into text (Chrome, for example, uses Google&apos;s speech service). We never receive
        the audio. Recognized text is used locally for voice commands and dictation. It reaches the AI service if you send it in chat or include it in a shared calculator snapshot. The microphone is on
        only while the button shows it listening.
      </p>
    </InfoSection>

    <InfoSection title="Server logs">
      <p>
        The site is hosted on Vercel. Like any web host, Vercel records technical details of each request (IP
        address, browser type, requested page, time) in logs used for security and troubleshooting. Log availability and retention depend on our hosting plan and provider settings. We
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
        <li>Chatbase Inc. (United States) and its subprocessors, including model providers: generating and storing AI conversations.</li>
        <li>Your browser&apos;s speech provider, if you use voice features.</li>
        <li>Our email provider, when you email us.</li>
      </ul>
      <p>
        We do not sell personal information or share it for targeted advertising. Service providers process information to operate these features. Information may also be disclosed when required by law.
      </p>
    </InfoSection>

    <InfoSection title="Conversation storage and deletion">
      <p>Conversations may remain in our Chatbase account until removed. We do not promise automatic deletion after a fixed number of days. Clearing browser data does not delete provider-held conversations. Contact us to request deletion; we will coordinate with our provider and explain any applicable legal retention requirements.</p>
      <p>Chatbase states that customer data is not used to train AI models. Its published deletion deadline applies after a customer deletion request or termination, rather than automatically after each conversation. See its <a href="https://www.chatbase.co/legal/privacy" target="_blank" rel="noopener noreferrer" className={linkClass}>privacy policy</a> and <a href="https://www.chatbase.co/legal/dpa" target="_blank" rel="noopener noreferrer" className={linkClass}>data processing addendum</a>.</p>
    </InfoSection>

    <InfoSection title="Your choices">
      <ul className="list-disc ml-6 space-y-1">
        <li>Every calculator, lesson, and quiz works without the chat or voice features.</li>
        <li>Clear your browser&apos;s site data to erase saved progress and preferences.</li>
        <li>Email us to ask what we hold about a conversation or to have it deleted; include the conversation reference shown in the chat panel and approximate date. Avoid resending sensitive content. We may need limited additional information to locate your conversation and verify your request.</li>
      </ul>
    </InfoSection>

    <InfoSection title="Children">
      <p>
        {SITE_NAME} is made for college and high school statistics students and is intended for users aged 13 and
        older. We do not knowingly collect personal information from children under 13. The AI assistant and calculator tutor are for adults aged 18 and older only. Before chat input or chat dictation is available, we ask you to confirm that you are 18 or older. This is a self-declaration, not identity verification. We do not request a birth date or identification document. The confirmation is held in memory while the tutor is mounted and is sent with chat requests to our server; it is not forwarded as a separate field to Chatbase. If you believe a child has
        sent us personal information through the chat, contact us so we can investigate and arrange deletion with our service provider.
      </p>
    </InfoSection>

    <InfoSection title="Visitors outside the United States">
      <p>
        The site is operated from the United States. Using the AI service involves processing in the United States
        and locations used by its providers. Where applicable law gives you rights to access, correct, erase,
        restrict, or object to processing, or to receive a copy of your data, contact us by email. You may also
        have the right to complain to your local data protection authority. This notice does not limit those rights.
      </p>
    </InfoSection>

    <InfoSection title="Changes">
      <p>
        We update the date when this notice changes. October 2, 2026: AI tutoring is now restricted to ages 18 and older; calculator sharing is optional and off by default; this notice clarifies provider storage, deletion, speech processing, and technical logs. Future material changes will be explained on this page. Where a change requires consent or additional notice under applicable law, we will obtain that consent or provide that notice before applying it.
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
