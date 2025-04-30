import React from 'react';
import { Calculator, PieChart, BookOpen } from 'lucide-react';
import FeatureCard from '../ui/FeatureCard';

const Features = () => {
  // Define the features data
  const features = [
    { 
      icon: <Calculator size={48} className="text-turquoise mb-4" />,
      title: "Statistical Calculators",
      description: "Easy-to-use calculators for hypothesis testing, regression analysis, ANOVA, and more."
    },
    { 
      icon: <PieChart size={48} className="text-turquoise mb-4" />,
      title: "Data Visualization",
      description: "Tools to create professional charts, plots, and visual representations of your data."
    },
    { 
      icon: <BookOpen size={48} className="text-turquoise mb-4" />,
      title: "Learning Resources",
      description: "Comprehensive guides, tutorials, and examples to master statistical concepts."
    }
  ];

  return (
    <section className="bg-white py-16" id="tools">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-darkGrey mb-12">
          Statistical Resources
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
