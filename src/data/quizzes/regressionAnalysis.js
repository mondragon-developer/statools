/**
 * Question Bank: Regression Analysis Step-by-Step
 * 12 questions total: 4 MC, 3 MA, 3 Ordering, 2 Matching
 */

export const regressionAnalysisQuestions = [
  // MULTIPLE CHOICE (4 questions)
  {
    id: 'reganalysis-mc-1',
    type: 'multipleChoice',
    question: 'R² (coefficient of determination) represents:',
    options: [
      'The correlation coefficient',
      'The proportion of variance in y explained by x',
      'The slope of the regression line',
      'The standard error of the estimate'
    ],
    correctAnswer: 'B',
    explanation: 'R² represents the proportion (percentage) of variance in the dependent variable (y) that is explained by the independent variable (x). R² = 0.80 means 80% of variance is explained.'
  },
  {
    id: 'reganalysis-mc-2',
    type: 'multipleChoice',
    question: 'If R² = 0.64, this means:',
    options: [
      '64% of y is explained by x',
      '36% of variability in y is unexplained',
      'Correlation r = 0.8 or -0.8',
      'All of the above'
    ],
    correctAnswer: 'D',
    explanation: 'R² = 0.64 means: 64% explained ✓, 36% unexplained (1-0.64) ✓, and r = ±√0.64 = ±0.8 ✓. All statements are correct!'
  },
  {
    id: 'reganalysis-mc-3',
    type: 'multipleChoice',
    question: 'The standard error of estimate (Se) measures:',
    options: [
      'The accuracy of the slope',
      'The average distance of points from the regression line',
      'The correlation between x and y',
      'The y-intercept uncertainty'
    ],
    correctAnswer: 'B',
    explanation: 'Se measures the typical (average) distance that observed y values deviate from the predicted ŷ values. Smaller Se means better model fit.'
  },
  {
    id: 'reganalysis-mc-4',
    type: 'multipleChoice',
    question: 'Extrapolation in regression refers to:',
    options: [
      'Using the model within the range of x data',
      'Predicting y for x values outside the observed range',
      'Calculating R²',
      'Finding the y-intercept'
    ],
    correctAnswer: 'B',
    explanation: 'Extrapolation means predicting y for x values outside the observed data range. This is risky because the relationship may not hold beyond the data range.'
  },

  // MULTIPLE ANSWER (3 questions)
  {
    id: 'reganalysis-ma-1',
    type: 'multipleAnswer',
    question: 'Which indicate a better fitting regression model? (Select all that apply)',
    options: [
      'Higher R²',
      'Smaller standard error (Se)',
      'Residuals randomly scattered around zero',
      'Larger slope value'
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'Better fit indicated by: higher R² (more variance explained) ✓, smaller Se (points closer to line) ✓, random residuals (assumptions met) ✓. Slope magnitude doesn\'t indicate fit quality.'
  },
  {
    id: 'reganalysis-ma-2',
    type: 'multipleAnswer',
    question: 'Residual plots are used to check for: (Select all that apply)',
    options: [
      'Linearity of relationship',
      'Constant variance (homoscedasticity)',
      'Outliers and influential points',
      'Normality of residuals'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Residual plots check ALL these: linearity ✓, constant variance ✓, outliers ✓, normality (with histogram/Q-Q plot) ✓. They are essential for validating regression assumptions.'
  },
  {
    id: 'reganalysis-ma-3',
    type: 'multipleAnswer',
    question: 'Problems detected in residual plots include: (Select all that apply)',
    options: [
      'Funnel pattern (heteroscedasticity)',
      'Curved pattern (non-linearity)',
      'Random scatter (good!)',
      'Points far from zero (outliers)'
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'Problems in residual plots: funnel shape = unequal variance ✓, curved pattern = non-linear relationship ✓, extreme points = outliers ✓. Random scatter is GOOD, not a problem!'
  },

  // ORDERING (3 questions)
  {
    id: 'reganalysis-ord-1',
    type: 'ordering',
    question: 'Order the steps for complete regression analysis:',
    options: [
      'Check assumptions with residual plots',
      'Fit the regression model',
      'Examine scatterplot for linearity',
      'Interpret R² and coefficients'
    ],
    correctAnswer: ['C', 'B', 'A', 'D'],
    explanation: 'Complete analysis: 1) Check linearity first (scatterplot), 2) Fit model, 3) Validate assumptions (residuals), 4) Interpret results if assumptions are met.'
  },
  {
    id: 'reganalysis-ord-2',
    type: 'ordering',
    question: 'Rank these R² values from BEST to WORST model fit:',
    options: [
      'R² = 0.92',
      'R² = 0.75',
      'R² = 0.45',
      'R² = 0.18'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Higher R² = better fit (more variance explained). Best: 0.92 (92%), then 0.75, 0.45, worst: 0.18 (18%).'
  },
  {
    id: 'reganalysis-ord-3',
    type: 'ordering',
    question: 'Order the components of sum of squares decomposition:',
    options: [
      'SSR (Regression - explained variation)',
      'SST (Total variation)',
      'SSE (Error - unexplained variation)',
      'Relationship: SST = SSR + SSE'
    ],
    correctAnswer: ['B', 'A', 'C', 'D'],
    explanation: 'Decomposition: 1) SST = total variation, 2) SSR = explained by model, 3) SSE = unexplained (residual), 4) SST = SSR + SSE. Also R² = SSR/SST.'
  },

  // MATCHING (2 questions)
  {
    id: 'reganalysis-match-1',
    type: 'matching',
    question: 'Match each regression statistic with what it measures:',
    options: [
      { id: 'A', left: 'R²', right: '' },
      { id: 'B', left: 'Se', right: '' },
      { id: 'C', left: 'r', right: '' }
    ],
    choices: [
      'Proportion of variance explained',
      'Average prediction error',
      'Strength and direction of linear relationship'
    ],
    correctAnswer: {
      A: 'Proportion of variance explained',
      B: 'Average prediction error',
      C: 'Strength and direction of linear relationship'
    },
    explanation: 'R² = variance explained (0-100%), Se = typical error/distance from line, r = correlation (direction + strength).'
  },
  {
    id: 'reganalysis-match-2',
    type: 'matching',
    question: 'Match each residual pattern with its meaning:',
    options: [
      { id: 'A', left: 'Random scatter around zero', right: '' },
      { id: 'B', left: 'Funnel shape', right: '' },
      { id: 'C', left: 'Curved pattern', right: '' }
    ],
    choices: [
      'Model assumptions are met',
      'Heteroscedasticity (unequal variance)',
      'Non-linear relationship'
    ],
    correctAnswer: {
      A: 'Model assumptions are met',
      B: 'Heteroscedasticity (unequal variance)',
      C: 'Non-linear relationship'
    },
    explanation: 'Random scatter = good (linear model appropriate). Funnel = variance changes with x (violates homoscedasticity). Curve = need non-linear model.'
  }
];

export default regressionAnalysisQuestions;
