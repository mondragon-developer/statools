import React from 'react';

const CallToAction = () => {
  return (
    <section className="bg-darkGrey text-white py-16 text-center">
      <h2 className="text-4xl font-bold mb-6">
        Ready to <span className="text-yellow">Master Statistics?</span>
      </h2>
      <p className="text-xl mb-8 opacity-80">
        Access powerful tools and resources to enhance your statistical analysis skills.
      </p>
      <button className="bg-yellow text-darkGrey px-8 py-4 rounded-lg text-xl font-bold hover:bg-opacity-90 transition-all shadow-lg">
        Get Started
      </button>
    </section>
  );
};

export default CallToAction;
