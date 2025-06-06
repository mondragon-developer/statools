import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Home, Calculator } from 'lucide-react';

const CalculatorLayout = () => {
  return (
    <div className="min-h-screen bg-platinum">
      {/* Simple Navigation Bar */}
      <nav className="bg-darkGrey text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Home size={20} />
            <span>Back to Home</span>
          </Link>
          <Link to="/calculators" className="flex items-center space-x-2">
            <Calculator size={20} />
            <span>All Calculators</span>
          </Link>
        </div>
      </nav>
      
      {/* Calculator Content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Optional: Mini Footer */}
      <footer className="bg-darkGrey text-white py-4 text-center">
        <p className="text-sm opacity-80">
          © {new Date().getFullYear()} MDragon Data Tools
        </p>
      </footer>
    </div>
  );
};

export default CalculatorLayout;