import React from 'react';
import { BarChart, FileText, Calculator, PieChart, LineChart, BookOpen } from 'lucide-react';

const StaToolsLandingPage = () => {
  return (
    <div className="bg-platinum min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-darkGrey text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-turquoise">MDragon Statistics </span>
            <span className="text-xl text-yellow">Data Tools</span>
          </div>
          <div className="space-x-6">
            <a href="#" className="text-white hover:text-yellow transition-colors">Home</a>
            <a href="#tools" className="text-white hover:text-yellow transition-colors">Tools</a>
            <a href="#resources" className="text-white hover:text-yellow transition-colors">Resources</a>
            <a href="#contact" className="text-white hover:text-yellow transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-darkGrey">
            Statistical Tools 
            <br />
            <span className="text-turquoise">For Students & Researchers</span>
          </h1>
          <p className="text-xl text-darkGrey opacity-80">
            Explore powerful statistical tools and resources designed to help you analyze data, understand concepts, and master statistical methods.
          </p>
          <div className="flex space-x-4">
            <button className="bg-yellow text-darkGrey px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-lg">
              Explore Tools
            </button>
            <button className="border-2 border-darkGrey text-darkGrey px-6 py-3 rounded-lg font-bold hover:bg-darkGrey hover:text-white transition-all">
              View Tutorials
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="bg-turquoise rounded-lg p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform">
            <div className="bg-white rounded-lg p-4">
              <BarChart size={64} className="text-darkGrey mx-auto mb-4" />
              <div className="h-24 bg-platinum rounded w-full mb-2"></div>
              <div className="h-12 bg-yellow rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16" id="tools">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-darkGrey mb-12">
            Statistical Resources
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
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
            ].map((feature, index) => (
              <div key={index} className="bg-platinum p-6 rounded-lg text-center hover:shadow-lg transition-shadow">
                {feature.icon}
                <h3 className="text-2xl font-bold text-darkGrey mb-4">{feature.title}</h3>
                <p className="text-darkGrey opacity-80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="bg-platinum py-16" id="resources">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-darkGrey mb-12">
            Popular Statistical Tools
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
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
            ].map((tool, index) => (
              <div key={index} className="bg-white p-6 rounded-lg flex items-start space-x-4 hover:shadow-lg transition-shadow">
                <div className="mt-1">{tool.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-darkGrey mb-2">{tool.title}</h3>
                  <p className="text-darkGrey opacity-80">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-darkGrey text-white py-16 text-center">
        <h2 className="text-4xl font-bold mb-6">
          Ready to <span className="text-yellow">Master Statistics?</span>
        </h2>
        <p className="text-xl mb-8 opacity-80">
          Access powerful tools and resources to enhance your statistical analysis skills.
        </p>
        <button className="bg-yellow text-darkGrey px-8 py-4 rounded-lg text-xl font-bold hover:bg-opacity-90 transition-all shadow-lg">
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-darkGrey text-white py-8" id="contact">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <span className="text-xl font-bold text-turquoise">MDragon Data Tools</span>
            <span className="text-lg text-yellow">Statistics</span>
          </div>
          <div className="space-x-4">
            <a href="#" className="text-white hover:text-yellow transition-colors">About</a>
            <a href="#" className="text-white hover:text-yellow transition-colors">Privacy</a>
            <a href="#" className="text-white hover:text-yellow transition-colors">Contact</a>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-4 text-center text-white opacity-60 text-sm">
          © {new Date().getFullYear()} MDragon Data Tools. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default StaToolsLandingPage;
