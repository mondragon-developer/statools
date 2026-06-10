import React from 'react';

const scrollToSection = (e, id) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    el.focus({ preventScroll: true });
  }
};

const Footer = () => {
  return (
    <footer className="bg-darkGrey text-white py-8" id="contact" aria-label="Footer and contact information">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <span className="text-xl font-bold text-darkTeal">MDragon Data Tools</span>
          <span className="text-lg text-accent">Statistics</span>
        </div>
        <nav aria-label="Footer navigation" className="space-x-4">
          <a href="/statools/accessibility" className="text-white hover:text-accent transition-colors">Accessibility</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-white hover:text-accent transition-colors">Contact</a>
        </nav>
      </div>
      <div className="container mx-auto px-4 mt-4 text-center text-white opacity-60 text-sm">
        &copy; {new Date().getFullYear()} MDragon Data Tools. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
