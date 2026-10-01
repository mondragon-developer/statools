import React from 'react';
import { Link } from 'react-router-dom';
import InfoPage, { InfoSection } from '../components/layout/InfoPage';
import { SITE_NAME, OWNER, OWNER_URL, CONTACT_EMAIL, REPO_URL, LEGAL_UPDATED } from '../data/site';

const linkClass = 'text-darkTeal underline hover:no-underline';

const TermsPage = () => (
  <InfoPage
    title="Terms of Use"
    intro={`The ground rules for using ${SITE_NAME}. Last updated ${LEGAL_UPDATED}.`}
  >
    <InfoSection title="What this site is">
      <p>
        {SITE_NAME} (also called Statools) is a free, self-paced study resource: statistics calculators, lessons,
        practice quizzes, and an AI tutor. It is published by {OWNER} as an independent project. It is not a course,
        it does not award credit, and it is not operated by any school, college, or university. By using the site you
        agree to these terms; if you do not agree, please do not use it.
      </p>
    </InfoSection>

    <InfoSection title="Educational use only">
      <p>
        Everything here is for learning. The calculators and explanations are not professional statistical,
        financial, medical, or legal advice, and results should not be the sole basis for research findings,
        business decisions, or published work. Check important calculations with a second tool or your instructor.
      </p>
    </InfoSection>

    <InfoSection title="The AI assistant">
      <p>
        The Statistics Assistant and the calculator tutor are automated systems built on large language models. They
        can be wrong, incomplete, or confidently mistaken, including in arithmetic. They are set up to guide you
        through problems rather than to produce finished work, but no setting makes an AI reliable. Treat every
        reply as a suggestion to verify, not as an answer to copy.
      </p>
    </InfoSection>

    <InfoSection title="Academic integrity is yours">
      <p>
        You are responsible for following the academic integrity rules of your school, college, or employer. Those
        rules, not this site, decide what help is allowed on an assignment, quiz, or exam. The AI tutor is a study
        aid, like a textbook or a classmate: if your instructor says a task must be done alone, do it alone. We are
        not responsible for how you use what you learn here, and we cannot see or report your use to anyone.
      </p>
    </InfoSection>

    <InfoSection title="Acceptable use">
      <p>You agree not to:</p>
      <ul className="list-disc ml-6 space-y-1">
        <li>send the chat or tutor personal information about yourself or others, or content that is unlawful, abusive, or intended to make the assistant behave badly;</li>
        <li>use scripts or automation to send chat requests, or otherwise interfere with the service or its hosting;</li>
        <li>copy the lessons, quizzes, or guides for resale or republication without permission;</li>
        <li>misrepresent a progress code or certificate as an official record.</li>
      </ul>
    </InfoSection>

    <InfoSection title="Progress, codes, and certificates">
      <p>
        Your progress is stored in your own browser and can be lost if you clear site data or switch devices;
        progress codes exist so you can carry it yourself. The completion certificate is a self-generated record of
        the lessons you marked complete. It is not accredited, not verified by us, and carries no academic credit.
        Progress codes are self-reported and can be edited; a teacher reading one should treat it as a conversation
        starter, not as proof.
      </p>
    </InfoSection>

    <InfoSection title="Links to other sites">
      <p>
        The resource library and some lessons link to calculators and materials on other websites. We do not control
        those sites and are not responsible for their content, accuracy, or privacy practices.
      </p>
    </InfoSection>

    <InfoSection title="Ownership and license">
      <p>
        The lessons, quizzes, guides, PDFs, artwork, and the {SITE_NAME} name and logo are the property of {OWNER}.
        You may use them for personal study and classroom teaching with attribution; other uses need written
        permission. The site&apos;s source code is published separately under the MIT License at{' '}
        <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>GitHub</a>; that license
        covers the code, not the content.
      </p>
    </InfoSection>

    <InfoSection title="No warranty">
      <p>
        The site is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any kind, express or
        implied, including accuracy, fitness for a particular purpose, and uninterrupted availability. Features may
        change or be removed at any time.
      </p>
    </InfoSection>

    <InfoSection title="Limitation of liability">
      <p>
        To the fullest extent permitted by law, {OWNER} and its contributors are not liable for any loss or damage
        arising from use of the site, including lost grades, lost data, decisions made on the basis of a calculation
        or an AI reply, or unavailability of the service. Where liability cannot be excluded, it is limited to the
        amount you paid to use the site, which is nothing.
      </p>
    </InfoSection>

    <InfoSection title="Age">
      <p>
        The site is intended for users aged 13 and older. If you are under 18, use it with the knowledge of a parent,
        guardian, or teacher.
      </p>
    </InfoSection>

    <InfoSection title="Governing law">
      <p>
        These terms are governed by the laws of the State of Florida, United States, without regard to conflict of
        law rules. Any dispute will be brought in the state or federal courts located in Miami-Dade County, Florida.
      </p>
    </InfoSection>

    <InfoSection title="Changes and contact">
      <p>
        We may update these terms; the date at the top shows the current version. Questions:{' '}
        <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Statools terms question')}`} className={linkClass}>{CONTACT_EMAIL}</a>.
        Published by <a href={OWNER_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>{OWNER}</a>.
        See also the <Link to="/privacy" className={linkClass}>Privacy</Link> page.
      </p>
    </InfoSection>
  </InfoPage>
);

export default TermsPage;
