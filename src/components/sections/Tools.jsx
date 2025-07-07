import { LineChart, BarChart, PieChart, Calculator } from 'lucide-react';
import Spline from '@splinetool/react-spline';
import ToolCard from '../ui/ToolCard';

const Tools = () => {
  // Define the tools data (keeping the existing structure)
  const tools = [
    { 
      icon: <LineChart size={36} className="text-turquoise" />,
      // title: "Regression Analysis",
      // description: "Perform linear, multiple, and logistic regression with detailed outputs and visualizations."
    },
    { 
      icon: <BarChart size={36} className="text-turquoise" />,
      // title: "Hypothesis Testing",
      // description: "Conduct t-tests, chi-square tests, and non-parametric tests with step-by-step explanations."
    },
    { 
      icon: <PieChart size={36} className="text-turquoise" />,
      // title: "Descriptive Statistics",
      // description: "Calculate means, medians, standard deviations, and create summary statistics tables."
    },
    { 
      icon: <Calculator size={36} className="text-turquoise" />,
      // title: "Probability Distributions",
      // description: "Work with normal, binomial, Poisson, and other probability distributions."
    }
  ];

  return (
    <section className="bg-platinum py-16" id="resources">
      <div className="container mx-auto px-4">
        {/* 3D Spline Scene Container - Now respecting container width constraints */}
        <div className="w-full mb-15">
          <div 
            className="w-full h-65 bg-gradient-to-br from-turquoise/10 to-yellow/10 rounded-lg overflow-hidden"
            style={{
              // Adding a subtle background in case the 3D scene has loading time
              // Using brand colors
              background: 'linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(255, 255, 0, 0.1) 100%)'
            }}
          >
            {/* Spline 3D Scene */}
            <Spline 
              scene="https://prod.spline.design/L7DMmgXOSotFm3Vl/scene.splinecode"
              style={{ 
                width: '100%', 
                height: '100%',
                borderRadius: '8px'
              }}
              onLoad={() => console.log('3D scene loaded successfully')}
              onError={(error) => console.error('3D scene failed to load:', error)}
            />
          </div>
        </div>

        
        
        <h2 className="text-4xl font-bold text-center text-darkGrey mb-12">
          Content and Resources (Under Construction)
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