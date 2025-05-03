import React from 'react';
import { Calculator, Cloud, CloudCogIcon, CloudFogIcon } from 'lucide-react';
import CalculatorLinks from './CalculatorLinks';

const CalculatorResourcesCard = () => {
  return (
    <div className="bg-platinum p-6 rounded-lg hover:shadow-lg transition-all h-full flex flex-col">      {/* Icon */}
      <div className="flex justify-center">
        <CloudFogIcon size={48} className="text-turquoise mb-4" />
      </div>
      
      {/* Title and Description */}
      <h3 className="text-2xl font-bold text-darkGrey mb-2 text-center">Online Calculators</h3>
      <p className="text-darkGrey opacity-80 mb-4 text-center">
        Access these statistical tools to perform calculations for your data analysis tasks.
      </p>
      
      {/* Scrollable Links */}
      <div className="flex-grow">
        <CalculatorLinks />
      </div>
    </div>
  );
};

export default CalculatorResourcesCard;
