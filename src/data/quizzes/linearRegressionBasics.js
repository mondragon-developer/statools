/**
 * Question Bank: Linear Regression Basics
 * 12 questions total: 4 MC, 3 MA, 3 Ordering, 2 Matching
 */

export const linearRegressionBasicsQuestions = [
  // MULTIPLE CHOICE (4 questions)
  {
    id: 'reg-mc-1',
    type: 'multipleChoice',
    question: 'In the regression equation ŷ = a + bx, what does "b" represent?',
    options: ['Y-intercept', 'Slope', 'Predicted value', 'Residual'],
    correctAnswer: 'B',
    explanation: 'In ŷ = a + bx, "b" is the slope (regression coefficient). It represents the change in y for each one-unit increase in x. "a" is the y-intercept.'
  },
  {
    id: 'reg-mc-2',
    type: 'multipleChoice',
    question: 'The least squares method minimizes:',
    options: [
      'Sum of residuals',
      'Sum of squared residuals',
      'Correlation coefficient',
      'Slope of the line'
    ],
    correctAnswer: 'B',
    explanation: 'Least squares regression minimizes the sum of squared residuals (SSE = Σ(y - ŷ)²). This finds the line that best fits the data by minimizing vertical distances.'
  },
  {
    id: 'reg-mc-3',
    type: 'multipleChoice',
    question: 'A correlation of r = -0.85 indicates:',
    options: [
      'Strong positive linear relationship',
      'Strong negative linear relationship',
      'Weak positive relationship',
      'No relationship'
    ],
    correctAnswer: 'B',
    explanation: 'r = -0.85 is close to -1, indicating a strong negative linear relationship. As x increases, y tends to decrease. The negative sign shows inverse relationship.'
  },
  {
    id: 'reg-mc-4',
    type: 'multipleChoice',
    question: 'If the regression line is ŷ = 10 + 3x, what is the predicted y when x = 5?',
    options: ['15', '20', '25', '30'],
    correctAnswer: 'C',
    explanation: 'Substitute x = 5 into the equation: ŷ = 10 + 3(5) = 10 + 15 = 25. The predicted value of y is 25 when x equals 5.'
  },

  // MULTIPLE ANSWER (3 questions)
  {
    id: 'reg-ma-1',
    type: 'multipleAnswer',
    question: 'Which statements about correlation are true? (Select all that apply)',
    options: [
      'Correlation ranges from -1 to +1',
      'Correlation implies causation',
      'r = 0 means no linear relationship',
      'Correlation is unitless'
    ],
    correctAnswer: ['A', 'C', 'D'],
    explanation: 'Correlation: ranges -1 to +1 ✓, r=0 means no linear relationship ✓, unitless (no units) ✓. However, correlation does NOT imply causation!'
  },
  {
    id: 'reg-ma-2',
    type: 'multipleAnswer',
    question: 'Assumptions of linear regression include: (Select all that apply)',
    options: [
      'Linear relationship between x and y',
      'Residuals are normally distributed',
      'Constant variance of residuals (homoscedasticity)',
      'x and y must be normally distributed'
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'Assumptions: linearity ✓, normal residuals ✓, constant variance ✓. The variables x and y themselves don\'t need to be normal - only the residuals do.'
  },
  {
    id: 'reg-ma-3',
    type: 'multipleAnswer',
    question: 'The residual (error) in regression is: (Select all that apply)',
    options: [
      'The difference between observed and predicted values',
      'Calculated as e = y - ŷ',
      'Always positive',
      'Used to assess model fit'
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'Residual: e = y - ŷ (observed - predicted) ✓, measures fit ✓. Residuals can be positive OR negative, depending on whether the point is above or below the line.'
  },

  // ORDERING (3 questions)
  {
    id: 'reg-ord-1',
    type: 'ordering',
    question: 'Order the steps to perform simple linear regression:',
    options: [
      'Calculate the regression equation ŷ = a + bx',
      'Plot the data to check for linearity',
      'Calculate slope (b) and intercept (a)',
      'Assess model fit with R²'
    ],
    correctAnswer: ['B', 'C', 'A', 'D'],
    explanation: 'Steps: 1) Plot data (check assumptions), 2) Calculate b and a using formulas, 3) Write regression equation, 4) Assess fit with R².'
  },
  {
    id: 'reg-ord-2',
    type: 'ordering',
    question: 'Rank these correlation values from STRONGEST to WEAKEST relationship:',
    options: [
      'r = 0.95',
      'r = -0.88',
      'r = 0.45',
      'r = 0.12'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Strength is determined by absolute value |r|, not sign. Strongest: |0.95|, then |-0.88|=0.88, then |0.45|, weakest: |0.12|.'
  },
  {
    id: 'reg-ord-3',
    type: 'ordering',
    question: 'Order the steps to calculate the slope b in regression:',
    options: [
      'Divide covariance by variance of x',
      'Calculate covariance of x and y',
      'Calculate variance of x',
      'Result is the slope b'
    ],
    correctAnswer: ['B', 'C', 'A', 'D'],
    explanation: 'Calculate slope: 1) Find Cov(x,y), 2) Find Var(x), 3) b = Cov(x,y)/Var(x), 4) This is your slope. Alternatively: b = r(Sy/Sx).'
  },

  // MATCHING (2 questions)
  {
    id: 'reg-match-1',
    type: 'matching',
    question: 'Match each regression term with its symbol/formula:',
    options: [
      { id: 'A', left: 'Predicted value', right: '' },
      { id: 'B', left: 'Residual', right: '' },
      { id: 'C', left: 'Slope', right: '' }
    ],
    choices: [
      'ŷ (y-hat)',
      'e = y - ŷ',
      'b'
    ],
    correctAnswer: {
      A: 'ŷ (y-hat)',
      B: 'e = y - ŷ',
      C: 'b'
    },
    explanation: 'Predicted value = ŷ, Residual = e = y - ŷ, Slope = b (coefficient of x).'
  },
  {
    id: 'reg-match-2',
    type: 'matching',
    question: 'Match each scenario with its correlation interpretation:',
    options: [
      { id: 'A', left: 'r = 0.92', right: '' },
      { id: 'B', left: 'r = -0.15', right: '' },
      { id: 'C', left: 'r = 0', right: '' }
    ],
    choices: [
      'Strong positive correlation',
      'Weak negative correlation',
      'No linear correlation'
    ],
    correctAnswer: {
      A: 'Strong positive correlation',
      B: 'Weak negative correlation',
      C: 'No linear correlation'
    },
    explanation: 'r = 0.92: strong positive (close to 1). r = -0.15: weak negative (close to 0 with negative sign). r = 0: no linear relationship.'
  }
];

export default linearRegressionBasicsQuestions;
