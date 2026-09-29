import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Home, Map, Calculator } from 'lucide-react';
import useScrollToHash from '../../hooks/useScrollToHash';

const JourneyLayout = () => {
  useScrollToHash();

  return (
    <div className="min-h-screen print:bg-white">
      <a className="skip-link print:hidden" href="#main-content">Skip to main content</a>
      <nav className="bg-darkGrey text-white p-4 shadow-md print:hidden" aria-label="Journey navigation">
        <div className="container mx-auto flex flex-wrap justify-between items-center gap-3">
          <Link to="/" className="flex items-center gap-2 hover:text-accent transition-colors">
            <Home size={20} aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
          <div className="flex flex-wrap gap-4">
            <Link to="/learn" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Map size={20} aria-hidden="true" />
              <span>Journey Map</span>
            </Link>
            <Link to="/calculators" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Calculator size={20} aria-hidden="true" />
              <span>All Calculators</span>
            </Link>
          </div>
        </div>
      </nav>
      <main id="main-content" tabIndex={-1} className="container mx-auto px-4 py-8 focus:outline-none">
        <Outlet />
      </main>
    </div>
  );
};

export default JourneyLayout;
