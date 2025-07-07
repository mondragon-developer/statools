import React from "react";
import { BookOpen, Calculator, HouseIcon, Dices } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CalculatorResourcesCard from "../ui/CalculatorResourcesCard";
import Spline from "@splinetool/react-spline";

const Features = () => {
  const navigate = useNavigate();

  const handleLocalCalculatorsClick = () => {
    navigate('/calculators');
  };

  const localCalculators = [
    {
      name: "Basic Statistics",
      path: "/calculators/statistics",
      description: "Mean, median, variance, SD"
    },
    {
      name: 'Probability Calculator',
      path: '/calculators/probability',
      description: 'Comprehensive probability tools with 3D dice simulator',

    },
    {
      name: "Binomial Distribution",
      path: "/calculators/binomial",
      description: "Interactive probability calc"
    },
    {
      name: "Poisson Distribution", 
      path: "/calculators/poisson",
      description: "Event probability calculator"
    },
    {
      name: 'Normal Distribution',
      path: '/calculators/normal',
      description: 'Compute z-scores and probabilities'
    },
    {
      name: "Hypothesis Testing",
      path: "/calculators/hypothesis-test",
      description: "Z-test, t-test, p-values"
    }
  ];

  return (
    <section className="bg-white py-16" id="tools">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-darkGrey mb-12">
          Statistical Resources
        </h2>
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Spline Visualization Card */}
          <div className="bg-platinum p-6 rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-full h-80 mb-6">
              <Spline
                scene="https://prod.spline.design/1GfxCCZbNPvMURDn/scene.splinecode"
                className="rounded-lg"
              />
            </div>
            <h3 className="text-2xl font-bold text-darkGrey my-4 text-center">Statistical Calculators</h3>
            <p className="text-darkGrey opacity-80 text-center">
              Easy-to-use calculators for hypothesis testing, regression analysis, confidence intervals, and more.
            </p>
          </div>

          {/* Calculator Links Card */}
          <CalculatorResourcesCard />

          {/* Local Calculators Card with Navigation */}
          <div className="bg-platinum p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-center">
                <button 
                onClick={handleLocalCalculatorsClick}
                className=" bg-yellow border-2 border-darkGrey text-darkGrey px-4 py-2 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all mb-2 flex items-center space-x-2"
              >
                <HouseIcon size={48} className="text-turquoise" />
                Open Full Calculators Suite
              </button>
              
            </div>
            <h3 className="text-2xl font-bold text-darkGrey mb-4 text-center">
              Local Calculators
            </h3>
            <p className="text-darkGrey opacity-80 text-center mb-4">
              Same tools as online calculators but better and good for your privacy.
            </p>
            
            
            {/* Quick Links to Individual Calculators */}
            
            <div className="max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-sm text-darkGrey opacity-75 mb-2 text-center">Quick Access:</p>
              <div className="space-y-2">
                {localCalculators.map((calc, index) => (
                  <button
                    key={index}
                    onClick={() => navigate(calc.path)}
                    className="w-full text-left px-3 py-2 bg-white rounded-md hover:bg-yellow transition-colors group"
                  >
                    <div className="font-bold text-darkGrey text-sm">
                      {calc.name}
                    </div>
                    <div className="text-xs text-darkGrey opacity-75 mt-1 line-clamp-1">
                      {calc.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            {/* <button 
              onClick={handleLocalCalculatorsClick}
              className="w-full bg-yellow border-2 border-darkGrey text-darkGrey px-4 py-2 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all mb-4"
            >
              Open Calculator Suite
            </button> */}
            </div>
          </div>
        </div>
    </section>
  );
};

export default Features;
