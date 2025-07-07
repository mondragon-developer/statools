import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, BarChart3, Dices, PopsicleIcon, FileQuestionIcon } from 'lucide-react';
import { Circle } from 'lucide-react';

const LocalCalculatorsPage = () => {
  const calculators = [
    {
      id: 'statistics',
      title: 'Basic Statistics Calculator',
      description: 'Calculate mean, median, variance, standard deviation, and quartiles',
      icon: <TrendingUp size={32} />,
      path: '/calculators/statistics'
    },
    {
      id: 'probability',
      title: 'Probability Calculator',
      description: 'Comprehensive probability tools with 3D dice simulator',
      icon: <Dices size={32} />,
      path: '/calculators/probability'
    },
    {
      id: 'normal',
      title: 'Normal Distribution',
      description: 'Compute z-scores and probabilities for normal curves',
      icon: <Circle size={32} />,
      path: '/calculators/normal'
    },
    {
      id: 'binomial',
      title: 'Binomial Distribution',
      description: 'Interactive probability calculator for binomial distributions',
      icon: <BarChart3 size={32} />,
      path: '/calculators/binomial'
    },
    {
      id: 'poisson',
      title: 'Poisson Distribution',
      description: 'Calculate probabilities for Poisson distributed events',
      icon: <PopsicleIcon size={32} />,
      path: '/calculators/poisson'
    },
    {
      id: 'hypothesis',
      title: 'Hypothesis Testing Calculator',
      description: 'Perform z-tests and t-tests with p-values and confidence intervals',
      icon: <FileQuestionIcon size={32} />,
      path: '/calculators/hypothesis-test'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-darkGrey mb-8 text-center">
        Local Statistical Calculators
      </h1>
      <p className="text-xl text-darkGrey opacity-80 text-center mb-12">
        Privacy-focused statistical tools that run entirely in your browser
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {calculators.map((calc) => (
          <Link
            key={calc.id}
            to={calc.path}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div className="text-turquoise mb-4">{calc.icon}</div>
            <h3 className="text-xl font-bold text-darkGrey mb-2">{calc.title}</h3>
            <p className="text-darkGrey opacity-80">{calc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LocalCalculatorsPage;
