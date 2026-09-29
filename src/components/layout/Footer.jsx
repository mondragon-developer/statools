import React from 'react';
import { Mail, Bug, Github, Accessibility } from 'lucide-react';

const EMAIL = 'jmondrag@mdc.edu';
const mailto = (subject) => `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;

const linkClass = 'inline-flex items-center gap-2 text-white hover:text-accent underline-offset-4 hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded';

const Footer = () => (
  <footer className="bg-darkGrey text-white py-10" aria-label="Footer and contact information">
    <div className="container mx-auto px-4 grid gap-8 md:grid-cols-3">
      <div>
        <p className="text-xl font-bold text-turquoise">MDragon Data Tools</p>
        <p className="text-white/80 mt-1">
          Free statistics calculators, lessons, and a learning journey for students. Everything runs in your browser.
        </p>
      </div>

      <section id="contact" tabIndex={-1} aria-labelledby="contact-heading" className="focus:outline-none">
        <h2 id="contact-heading" className="text-lg font-bold text-accent mb-2">Contact</h2>
        <p className="text-white/80 mb-3">
          Questions about a lesson, a calculator, or access to the MDC interactive lessons? Write to the instructor.
        </p>
        <ul className="space-y-2">
          <li>
            <a href={mailto('Statools question')} className={linkClass}>
              <Mail size={16} aria-hidden="true" /> {EMAIL}
            </a>
          </li>
          <li>
            <a href={mailto('Statools: problem report')} className={linkClass}>
              <Bug size={16} aria-hidden="true" /> Report a problem
            </a>
          </li>
        </ul>
      </section>

      <nav aria-label="Footer navigation">
        <h2 className="text-lg font-bold text-accent mb-2">More</h2>
        <ul className="space-y-2">
          <li>
            <a href={`${import.meta.env.BASE_URL}accessibility`} className={linkClass}>
              <Accessibility size={16} aria-hidden="true" /> Accessibility
            </a>
          </li>
          <li>
            <a href="https://github.com/mondragon-developer/statools" target="_blank" rel="noopener noreferrer" className={linkClass}>
              <Github size={16} aria-hidden="true" /> Source code<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
    <p className="container mx-auto px-4 mt-8 text-center text-white/70 text-sm">
      &copy; {new Date().getFullYear()} MDragon Data Tools. All rights reserved.
    </p>
  </footer>
);

export default Footer;
