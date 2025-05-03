import React from 'react';

const CalculatorLinks = () => {
  const calculators = [
    {
      id: 1,
      name: "Grouped Frequency Distribution",
      url: "https://goodcalculators.com/grouped-frequency-distribution-calculator/",
      description: "Identify class intervals and generate grouped frequency tables."
    },
    {
      id: 2,
      name: "Histogram Generator",
      url: "https://www.socscistatistics.com/descriptive/histograms/",
      description: "Create histograms representing frequency distributions."
    },
    {
      id: 3,
      name: "Mean, Median, Variance, SD",
      url: "https://openomnia.com/mean-median-variance-sd",
      description: "Calculate descriptive statistics with step-by-step solutions."
    },
    {
      id: 4,
      name: "Z-Score Calculator",
      url: "https://www.calculator.net/z-score-calculator.html",
      description: "Compute z-scores for normal distributions."
    },
    {
      id: 5,
      name: "Distribution Calculator",
      url: "https://www.statskingdom.com/distribution-calculator.html",
      description: "Work with normal, binomial, t, F, chi-square, and other distributions."
    },
    {
      id: 6,
      name: "Confidence Intervals",
      url: "https://www.analyticscalculators.com/calculator.aspx?id=96",
      description: "Calculate confidence intervals for normal populations."
    },
    {
      id: 7,
      name: "One Proportion Z-Test",
      url: "https://www.statology.org/one-proportion-z-test-calculator/",
      description: "Compare observed proportions to theoretical ones."
    },
    {
      id: 8,
      name: "CI for Known Population SD",
      url: "https://www.statology.org/one-proportion-z-test-calculator/",
      description: "Confidence intervals with known population standard deviation."
    },
    {
      id: 9,
      name: "Hypothesis Test Calculator",
      url: "https://365datascience.com/calculators/hypothesis-test-calculator/",
      description: "Hypothesis tests for single populations."
    },
    {
      id: 10,
      name: "Two Sample Proportions Test",
      url: "http://www2.psych.purdue.edu/~gfrancis/calculators/proportion_test_two_sample.shtml",
      description: "Test proportions across two independent samples."
    },
    {
      id: 11,
      name: "Dependent t-Test",
      url: "http://www2.psych.purdue.edu/~gfrancis/calculators/mean_test_two_sample_dependent.shtml",
      description: "Run t-tests for dependent means across samples."
    },
    {
      id: 12,
      name: "Independent t-Test",
      url: "http://www2.psych.purdue.edu/~gfrancis/calculators/mean_test_two_sample_independent.shtml",
      description: "Run t-tests for independent means across samples."
    },
    {
      id: 13,
      name: "Correlation and Regression",
      url: "https://www.mathportal.org/calculators/statistics-calculator/correlation-and-regression-calculator.php",
      description: "Analyze relationships between variables."
    },
    {
      id: 14,
      name: "Prediction Interval Calculator",
      url: "https://mathcracker.com/prediction-interval-calculator-regression-prediction#results",
      description: "Calculate prediction intervals for regression models."
    }
  ];

  return (
    <div className="mt-4 overflow-hidden">
      <div className="max-h-72 overflow-y-auto pr-2 custom-scrollbar">
        <ul className="space-y-2">
          {calculators.map(calc => (
            <li key={calc.id} className="bg-white rounded-md shadow-sm hover:shadow-md transition-shadow">
              <a 
                href={calc.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block p-2 hover:bg-yellow transition-colors"
              >
                <div className="font-bold text-darkGrey text-sm">{calc.name}</div>
                <div className="text-xs text-darkGrey opacity-75 mt-1 line-clamp-1" title={calc.description}>
                  {calc.description}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CalculatorLinks;
