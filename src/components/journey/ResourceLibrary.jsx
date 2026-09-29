import React, { useState } from 'react';
import { BookOpen, PieChart, BarChart, TrendingUp, Calculator } from 'lucide-react';
import ResourceCard from '../ui/ResourceCard';
import { RESOURCES, RESOURCE_CATEGORIES } from '../../data/journey/resources';

const CATEGORY_INFO = {
  Foundations: {
    icon: <BookOpen size={36} className="text-darkTeal" />,
    description: 'Center and spread: the first numbers to calculate for any dataset.',
  },
  Probability: {
    icon: <PieChart size={36} className="text-darkTeal" />,
    description: 'Chance, key distributions, and z-scores with step-by-step examples.',
  },
  Inference: {
    icon: <BarChart size={36} className="text-darkTeal" />,
    description: 'Samples, confidence intervals, and hypothesis tests.',
  },
  Regression: {
    icon: <TrendingUp size={36} className="text-darkTeal" />,
    description: 'Relationships, fitted lines, and how to interpret them.',
  },
  'Calculator Guides': {
    icon: <Calculator size={36} className="text-darkTeal" />,
    description: 'Quick references for the calculators and essential statistical tables.',
  },
};

const ResourceLibrary = () => {
  const [filter, setFilter] = useState('All');
  const categories = filter === 'All' ? RESOURCE_CATEGORIES : [filter];

  return (
    <div>
      <div role="group" aria-label="Filter guides by topic" className="flex flex-wrap justify-center gap-2 mb-6">
        {['All', ...RESOURCE_CATEGORIES].map(name => (
          <button
            key={name}
            type="button"
            onClick={() => setFilter(name)}
            aria-pressed={filter === name}
            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accentDark focus-visible:ring-offset-2
              ${filter === name ? 'bg-darkTeal border-darkTeal text-white' : 'bg-white border-platinum text-darkGrey hover:border-darkTeal'}`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {categories.map(category => (
          <ResourceCard
            key={category}
            icon={CATEGORY_INFO[category].icon}
            title={category}
            description={CATEGORY_INFO[category].description}
            resources={RESOURCES
              .filter(r => r.category === category)
              .map(r => ({ ...r, label: r.stage ? `Journey Stage ${r.stage}` : 'Reference for every stage' }))}
          />
        ))}
      </div>
    </div>
  );
};

export default ResourceLibrary;
