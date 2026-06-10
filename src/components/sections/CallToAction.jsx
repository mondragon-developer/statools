import React from 'react';
import { useNavigate } from 'react-router-dom';

const CallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-darkGrey text-white py-16 text-center" aria-labelledby="cta-heading">
      <h2 id="cta-heading" className="text-4xl font-bold mb-6">
        Ready to <span className="text-accent">Master Statistics?</span>
      </h2>
      <p className="text-xl mb-8 opacity-80">
        Access powerful tools and resources to enhance your statistical analysis skills.
      </p>
      <button
        onClick={() => navigate('/calculators')}
        className="bg-accent text-darkGrey px-8 py-4 rounded-lg text-xl font-bold hover:bg-opacity-90 transition-all shadow-lg"
      >
        Get Started
      </button>
    </section>
  );
};

export default CallToAction;
