import React from 'react';
import { LineChart, BarChart, PieChart, Calculator } from 'lucide-react';
import ToolCard from '../ui/ToolCard';

const Tools = () => {
  // Define the tools data
  const tools = [
    { 
      icon: <LineChart size={36} className="text-turquoise" />,
      title: "Regression Analysis",
      description: "Perform linear, multiple, and logistic regression with detailed outputs and visualizations."
    },
    { 
      icon: <BarChart size={36} className="text-turquoise" />,
      title: "Hypothesis Testing",
      description: "Conduct t-tests, chi-square tests, and non-parametric tests with step-by-step explanations."
    },
    { 
      icon: <PieChart size={36} className="text-turquoise" />,
      title: "Descriptive Statistics",
      description: "Calculate means, medians, standard deviations, and create summary statistics tables."
    },
    { 
      icon: <Calculator size={36} className="text-turquoise" />,
      title: "Probability Distributions",
      description: "Work with normal, binomial, Poisson, and other probability distributions."
    }
  ];

  return (
    <section className="bg-platinum py-16" id="resources">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-darkGrey mb-12">
          Popular Statistical Tools
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {tools.map((tool, index) => (
            <ToolCard
              key={index}
              icon={tool.icon}
              title={tool.title}
              description={tool.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tools;
