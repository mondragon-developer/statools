import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Calculator, ChevronRight } from 'lucide-react';

const CALC_NAMES = {
  'statistics': 'Descriptive Statistics',
  'probability': 'Probability',
  'normal': 'Normal Distribution',
  'binomial': 'Binomial Distribution',
  'poisson': 'Poisson Distribution',
  'hypothesis-test': 'Hypothesis Test',
  'correlation-regression': 'Correlation & Regression',
  'frequency-distribution': 'Frequency Distribution',
};

const CalculatorLayout = () => {
  const location = useLocation();
  const pathSegments = location.pathname.replace(/^\/statools/, '').split('/').filter(Boolean);
  const currentCalc = pathSegments.length > 1 ? pathSegments[pathSegments.length - 1] : null;

  return (
    <div className="min-h-screen bg-platinum">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <nav className="bg-darkGrey text-white p-4 shadow-md" aria-label="Calculator navigation">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Home size={20} aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
          <Link to="/calculators" className="flex items-center space-x-2">
            <Calculator size={20} aria-hidden="true" />
            <span>All Calculators</span>
          </Link>
        </div>
      </nav>

      {/* Breadcrumb — SC 2.4.5 Multiple Ways */}
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-2">
        <ol className="flex items-center gap-1 text-sm text-darkGrey/70">
          <li><Link to="/" className="hover:text-darkTeal transition-colors">Home</Link></li>
          <li><ChevronRight size={14} aria-hidden="true" /></li>
          {currentCalc ? (
            <>
              <li><Link to="/calculators" className="hover:text-darkTeal transition-colors">Calculators</Link></li>
              <li><ChevronRight size={14} aria-hidden="true" /></li>
              <li aria-current="page" className="font-medium text-darkGrey">{CALC_NAMES[currentCalc] || currentCalc}</li>
            </>
          ) : (
            <li aria-current="page" className="font-medium text-darkGrey">Calculators</li>
          )}
        </ol>
      </nav>

      <main id="main-content" className="flex-grow" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="bg-darkGrey text-white py-4 text-center">
        <p className="text-sm opacity-80">
          &copy; {new Date().getFullYear()} MDragon Data Tools
        </p>
      </footer>
    </div>
  );
};

export default CalculatorLayout;
