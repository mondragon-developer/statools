/**
 * Question Bank: Interpreting Regression Results
 * 12 questions total: 4 MC, 3 MA, 3 Ordering, 2 Matching
 */

export const interpretingRegressionQuestions = [
  // MULTIPLE CHOICE (4 questions)
  {
    id: 'interp-mc-1',
    type: 'multipleChoice',
    question: 'For the regression equation ŷ = 50 + 2.5x, the slope means:',
    options: [
      'When x = 0, y = 50',
      'For each 1-unit increase in x, y increases by 2.5',
      'For each 1-unit increase in x, y decreases by 2.5',
      'The correlation is 2.5'
    ],
    correctAnswer: 'B',
    explanation: 'The slope (2.5) means: for every 1-unit increase in x, y increases by 2.5 units on average. Positive slope indicates positive relationship.'
  },
  {
    id: 'interp-mc-2',
    type: 'multipleChoice',
    question: 'In regression output, a p-value < 0.05 for the slope indicates:',
    options: [
      'The slope equals zero',
      'The slope is significantly different from zero',
      'R² is greater than 0.05',
      'The model explains 5% of variance'
    ],
    correctAnswer: 'B',
    explanation: 'p-value < 0.05 means we reject H₀: β = 0. The slope is statistically significant, indicating a real relationship between x and y (not due to random chance).'
  },
  {
    id: 'interp-mc-3',
    type: 'multipleChoice',
    question: 'If ŷ = 100 - 5x, what happens to y as x increases?',
    options: [
      'y increases by 5',
      'y decreases by 5',
      'y stays at 100',
      'Cannot determine'
    ],
    correctAnswer: 'B',
    explanation: 'Negative slope (-5) means y decreases as x increases. Specifically, for each 1-unit increase in x, y decreases by 5 units.'
  },
  {
    id: 'interp-mc-4',
    type: 'multipleChoice',
    question: 'A 95% confidence interval for the slope is (1.2, 3.8). This means:',
    options: [
      'The slope is definitely between 1.2 and 3.8',
      'We are 95% confident the true slope is between 1.2 and 3.8',
      'The slope equals 2.5',
      '95% of the data falls in this range'
    ],
    correctAnswer: 'B',
    explanation: 'CI interpretation: we are 95% confident the true population slope (β) lies between 1.2 and 3.8. Note: the interval does not contain 0, so the slope is significant.'
  },

  // MULTIPLE ANSWER (3 questions)
  {
    id: 'interp-ma-1',
    type: 'multipleAnswer',
    question: 'When interpreting the y-intercept: (Select all that apply)',
    options: [
      'It is the predicted y when x = 0',
      'It is always meaningful',
      'It may not be interpretable if x = 0 is impossible',
      'It is denoted as "a" or "b₀"'
    ],
    correctAnswer: ['A', 'C', 'D'],
    explanation: 'Y-intercept: predicted y when x=0 ✓, may not be meaningful (e.g., height when age=0) ✓, denoted a or b₀ ✓. It is NOT always meaningful - depends on context.'
  },
  {
    id: 'interp-ma-2',
    type: 'multipleAnswer',
    question: 'A prediction interval differs from a confidence interval because it: (Select all that apply)',
    options: [
      'Accounts for uncertainty in individual predictions',
      'Is wider than the corresponding confidence interval',
      'Predicts a range for an individual y value',
      'Is the same as a confidence interval'
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'Prediction interval: accounts for individual prediction uncertainty ✓, wider than CI ✓, range for one y value ✓. CI estimates mean of y; PI estimates individual y.'
  },
  {
    id: 'interp-ma-3',
    type: 'multipleAnswer',
    question: 'Which indicate the slope is statistically significant? (Select all that apply)',
    options: [
      'p-value < α (e.g., 0.05)',
      'Confidence interval for slope does not contain zero',
      'R² is close to 1',
      't-statistic is large (far from zero)'
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'Significant slope indicated by: p-value < α ✓, CI excludes 0 ✓, large |t| statistic ✓. High R² indicates good fit but doesn\'t test slope significance directly.'
  },

  // ORDERING (3 questions)
  {
    id: 'interp-ord-1',
    type: 'ordering',
    question: 'Order these steps to make a prediction using regression:',
    options: [
      'Interpret the result in context',
      'Verify x is within the data range',
      'Substitute x value into regression equation',
      'Calculate ŷ'
    ],
    correctAnswer: ['B', 'C', 'D', 'A'],
    explanation: 'Prediction steps: 1) Check x is in range (avoid extrapolation), 2) Substitute x into ŷ = a + bx, 3) Calculate ŷ, 4) Interpret in context with units.'
  },
  {
    id: 'interp-ord-2',
    type: 'ordering',
    question: 'Rank these statements from STRONGEST to WEAKEST evidence of relationship:',
    options: [
      'p-value = 0.001, R² = 0.85',
      'p-value = 0.03, R² = 0.65',
      'p-value = 0.08, R² = 0.45',
      'p-value = 0.20, R² = 0.15'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Strongest evidence: very low p-value + high R². Order: (0.001, 0.85) strongest, then (0.03, 0.65), (0.08, 0.45), (0.20, 0.15) weakest.'
  },
  {
    id: 'interp-ord-3',
    type: 'ordering',
    question: 'Order the interpretation elements for ŷ = 20 + 3x:',
    options: [
      'State the direction (positive relationship)',
      'State the change: "y increases by 3"',
      'State the condition: "for each 1-unit increase in x"',
      'Add context with units if applicable'
    ],
    correctAnswer: ['A', 'C', 'B', 'D'],
    explanation: 'Complete interpretation: 1) Direction (positive), 2) Condition (per 1-unit x increase), 3) Magnitude (y changes by 3), 4) Context/units.'
  },

  // MATCHING (2 questions)
  {
    id: 'interp-match-1',
    type: 'matching',
    question: 'Match each regression output component with its interpretation:',
    options: [
      { id: 'A', left: 'Slope = 4.5', right: '' },
      { id: 'B', left: 'R² = 0.72', right: '' },
      { id: 'C', left: 'p-value = 0.002', right: '' }
    ],
    choices: [
      'y changes by 4.5 per unit increase in x',
      '72% of variance in y is explained',
      'Slope is highly significant'
    ],
    correctAnswer: {
      A: 'y changes by 4.5 per unit increase in x',
      B: '72% of variance in y is explained',
      C: 'Slope is highly significant'
    },
    explanation: 'Slope 4.5: rate of change in y. R² = 0.72: proportion explained. p = 0.002: strong evidence slope ≠ 0 (highly significant).'
  },
  {
    id: 'interp-match-2',
    type: 'matching',
    question: 'Match each scenario with appropriate conclusion:',
    options: [
      { id: 'A', left: 'CI for slope: (-1.2, -0.3)', right: '' },
      { id: 'B', left: 'CI for slope: (-0.5, 1.2)', right: '' },
      { id: 'C', left: 'p-value = 0.001', right: '' }
    ],
    choices: [
      'Significant negative relationship',
      'Slope not significantly different from zero',
      'Highly significant relationship'
    ],
    correctAnswer: {
      A: 'Significant negative relationship',
      B: 'Slope not significantly different from zero',
      C: 'Highly significant relationship'
    },
    explanation: 'CI (-1.2, -0.3): all negative, significant negative slope. CI (-0.5, 1.2): includes 0, not significant. p=0.001: highly significant.'
  }
];

export default interpretingRegressionQuestions;
