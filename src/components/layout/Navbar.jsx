import React from 'react';

const Navbar = () => {
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      el.focus({ preventScroll: true });
    }
  };

  return (
    <nav className="bg-darkGrey text-white p-4 shadow-md" aria-label="Main navigation">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <a href="#main-content" onClick={(e) => scrollToSection(e, 'main-content')} className="focus-visible:outline-white" aria-label="MDragon Data Tools — home">
          <span className="text-2xl font-bold text-turquoise">MDragon Data Tools</span>{' '}
          <span className="text-xl text-accent">Statistics</span>
        </a>
        <div className="flex flex-wrap justify-end gap-x-6 gap-y-1">
          <a href="#main-content" onClick={(e) => scrollToSection(e, 'main-content')} className="text-white hover:text-accent transition-colors focus-visible:outline-white">Home</a>
          <a href="#tools" onClick={(e) => scrollToSection(e, 'tools')} className="text-white hover:text-accent transition-colors focus-visible:outline-white">Tools</a>
          <a href="#resources" onClick={(e) => scrollToSection(e, 'resources')} className="text-white hover:text-accent transition-colors focus-visible:outline-white">Tutorials</a>
          <a href="#ai-lab" onClick={(e) => scrollToSection(e, 'ai-lab')} className="text-white hover:text-accent transition-colors focus-visible:outline-white">AI Lab</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-white hover:text-accent transition-colors focus-visible:outline-white">Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
