import React from 'react';
import { GraduationCap, ExternalLink, Mail, Lock } from 'lucide-react';
import { NETLIFY_LESSONS } from '../../data/netlifyLessons';

const NetlifyLessonsCard = () => {
  const { title, description, url, requestEmail } = NETLIFY_LESSONS;
  const mailto = requestEmail
    ? `mailto:${requestEmail}?subject=${encodeURIComponent('Access request: Statools interactive lessons')}&body=${encodeURIComponent('Hello,\n\nI would like access to the interactive statistics lessons.\n\nName:\nSchool or organization:\nHow I plan to use them:\n')}`
    : null;

  return (
    <section aria-labelledby="netlify-lessons-heading" className="bg-white rounded-lg shadow-md p-5 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        <GraduationCap size={40} className="text-darkTeal flex-shrink-0" aria-hidden="true" />
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <h3 id="netlify-lessons-heading" className="text-2xl font-bold text-darkGrey">{title}</h3>
            {!url && <span className="text-xs font-bold uppercase tracking-wide bg-accent text-darkGrey px-2 py-1 rounded-full">Coming soon</span>}
          </div>
          <p className="text-darkGrey/80">{description}</p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-platinum/50 rounded-md p-4">
              <p className="font-semibold text-darkGrey mb-2">MDC students</p>
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-darkTeal text-white font-bold px-4 py-2 rounded-lg hover:bg-darkTeal/90
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
                >
                  Open the lessons <ExternalLink size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                <p className="text-sm text-darkGrey">The link will appear here soon. Sign in with your MDC account when it opens.</p>
              )}
            </div>
            <div className="bg-platinum/50 rounded-md p-4">
              <p className="flex items-center gap-2 font-semibold text-darkGrey mb-2">
                <Lock size={16} aria-hidden="true" /> No MDC account?
              </p>
              <p className="text-sm text-darkGrey mb-3">Request access directly from the instructor.</p>
              {mailto ? (
                <a
                  href={mailto}
                  className="inline-flex items-center gap-2 border-2 border-darkTeal text-darkTeal font-bold px-4 py-2 rounded-lg hover:bg-darkTeal/5
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2"
                >
                  <Mail size={16} aria-hidden="true" /> Request access
                </a>
              ) : (
                <p className="text-sm font-semibold text-darkGrey/80">Access requests open soon.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetlifyLessonsCard;
