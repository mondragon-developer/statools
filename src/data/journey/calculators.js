// Keys are what lesson missions and the Calculator Coach reference.
// Paths are router paths; the router adds the deploy base (/statools/ on GitHub Pages).
export const CALCULATORS = {
  statistics: {
    name: 'Mean, Median, Variance, SD Calculator',
    path: '/calculators/statistics',
    summary: 'Center, spread, quartiles, and outliers for a list of numbers.',
  },
  'frequency-distribution': {
    name: 'Frequency Distribution & Histogram',
    path: '/calculators/frequency-distribution',
    summary: 'Frequency tables, grouped classes, histograms, and bar charts.',
  },
  probability: {
    name: 'Probability Calculator & Dice Simulator',
    path: '/calculators/probability',
    summary: 'Probability rules, counting, expected value, and a 3D dice simulator.',
  },
  binomial: {
    name: 'Binomial Distribution Calculator',
    path: '/calculators/binomial',
    summary: 'Chance of k successes in n repeated yes/no trials.',
  },
  poisson: {
    name: 'Poisson Distribution Calculator',
    path: '/calculators/poisson',
    summary: 'Chance of a number of events in a fixed interval.',
  },
  normal: {
    name: 'Normal Distribution & Z-Score Calculator',
    path: '/calculators/normal',
    summary: 'Z-scores, areas under the bell curve, and percentiles.',
  },
  'hypothesis-test': {
    name: 'Hypothesis Test & Confidence Interval Calculator',
    path: '/calculators/hypothesis-test',
    summary: 'One-sample z and t tests for a mean or a proportion, with confidence intervals.',
  },
  'two-sample': {
    name: 'Two-Sample Comparison Calculator',
    path: '/calculators/two-sample',
    summary: 'Compare two independent groups: Welch t-test for means, z-test for proportions.',
  },
  'correlation-regression': {
    name: 'Correlation & Regression Calculator',
    path: '/calculators/correlation-regression',
    summary: 'Scatterplot, correlation r, R-squared, fitted line, residuals, and predictions.',
  },
};
