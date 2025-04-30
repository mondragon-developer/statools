import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-darkGrey text-white py-8" id="contact">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
          <span className="text-xl font-bold text-turquoise">MDragon Data Tools</span>
          <span className="text-lg text-yellow">Statistics</span>
        </div>
        <div className="space-x-4">
          <a href="#" className="text-white hover:text-yellow transition-colors">About</a>
          <a href="#" className="text-white hover:text-yellow transition-colors">Privacy</a>
          <a href="#" className="text-white hover:text-yellow transition-colors">Contact</a>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-4 text-center text-white opacity-60 text-sm">
        © {new Date().getFullYear()} MDragon Data Tools. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
