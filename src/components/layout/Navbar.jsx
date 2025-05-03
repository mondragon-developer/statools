import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-darkGrey text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-turquoise">MDragon Data Tools</span>
          <span className="text-xl text-yellow">Statistics</span>
        </div>
        <div className="space-x-6">
          <a href="#" className="text-white hover:text-yellow transition-colors">Home</a>
          <a href="#tools" className="text-white hover:text-yellow transition-colors">Tools</a>
          <a href="#resources" className="text-white hover:text-yellow transition-colors">Tutorials</a>
          <a href="#contact" className="text-white hover:text-yellow transition-colors">Contact</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
