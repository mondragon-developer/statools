import React from 'react';

// This component receives icon, title, and description as props
const ToolCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg flex items-start space-x-4 hover:shadow-lg transition-shadow">
      <div className="mt-1">{icon}</div>
      <div>
        <h3 className="text-xl font-bold text-darkGrey mb-2">{title}</h3>
        <p className="text-darkGrey opacity-80">{description}</p>
      </div>
    </div>
  );
};

export default ToolCard;