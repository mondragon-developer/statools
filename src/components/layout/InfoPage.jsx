import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import useDocumentTitle from '../../hooks/useDocumentTitle';

// Shell for the standalone text pages (privacy, terms): the same frame the
// accessibility page uses, so they read as one set.
const InfoPage = ({ title, intro, children }) => {
  useDocumentTitle(title);

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
        <h1 className="text-3xl font-bold text-darkGrey mb-2">{title}</h1>
        {intro && <p className="text-darkGrey/70 mb-8">{intro}</p>}
        {children}
      </main>
    </div>
  );
};

export const InfoSection = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-bold text-darkGrey mb-3">{title}</h2>
    <div className="text-darkGrey/80 space-y-2">{children}</div>
  </section>
);

export default InfoPage;
