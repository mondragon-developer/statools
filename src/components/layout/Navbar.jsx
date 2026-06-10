import React from 'react';

const Navbar = () => {
  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      el.focus({ preventScroll: true });
    }
  };

  return (
    <nav className="bg-darkGrey text-white p-4 shadow-md" aria-label="Main navigation">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#main-content" onClick={(e) => scrollToSection(e, 'main-content')} aria-label="MDragon Data Tools — home">
          <span className="text-2xl font-bold text-darkTeal">MDragon Data Tools</span>{' '}
          <span className="text-xl text-accent">Statistics</span>
        </a>
        <div className="space-x-6">
          <a href="#main-content" onClick={(e) => scrollToSection(e, 'main-content')} className="text-white hover:text-accent transition-colors">Home</a>
          <a href="#tools" onClick={(e) => scrollToSection(e, 'tools')} className="text-white hover:text-accent transition-colors">Tools</a>
          <a href="#resources" onClick={(e) => scrollToSection(e, 'resources')} className="text-white hover:text-accent transition-colors">Tutorials</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-white hover:text-accent transition-colors">Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
