import React from 'react';

// This component receives icon, title, and description as props
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-platinum p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
      {icon}
      <h3 className="text-2xl font-bold text-darkGrey mb-4">{title}</h3>
      <p className="text-darkGrey opacity-80">{description}</p>
    </div>
  );
};

export default FeatureCard;
