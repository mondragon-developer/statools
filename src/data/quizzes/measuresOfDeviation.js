/**
 * Question Bank: Measures of Deviation (Dispersion/Variability)
 * 12 questions total: 4 MC, 3 MA, 3 Ordering, 2 Matching
 */

export const measuresOfDeviationQuestions = [
  // MULTIPLE CHOICE (4 questions)
  {
    id: 'dev-mc-1',
    type: 'multipleChoice',
    question: 'What is the range of the following dataset: 12, 18, 15, 22, 9, 25, 14?',
    options: ['13', '16', '17', '25'],
    correctAnswer: 'B',
    explanation: 'Range = Maximum - Minimum = 25 - 9 = 16. The range measures the spread between the highest and lowest values.'
  },
  {
    id: 'dev-mc-2',
    type: 'multipleChoice',
    question: 'Which measure of spread is MOST affected by outliers?',
    options: ['Range', 'Interquartile Range (IQR)', 'Median Absolute Deviation', 'All equally affected'],
    correctAnswer: 'A',
    explanation: 'The range is most affected by outliers because it only uses the two extreme values (min and max). A single outlier will drastically change the range, while IQR uses the middle 50% of data and is resistant to outliers.'
  },
  {
    id: 'dev-mc-3',
    type: 'multipleChoice',
    question: 'If all values in a dataset are the same, what is the standard deviation?',
    options: ['0', '1', 'Undefined', 'Equal to the mean'],
    correctAnswer: 'A',
    explanation: 'When all values are identical, there is no variability. The standard deviation measures spread, so if there is no spread, SD = 0.'
  },
  {
    id: 'dev-mc-4',
    type: 'multipleChoice',
    question: 'The variance of a dataset is 25. What is the standard deviation?',
    options: ['5', '12.5', '25', '625'],
    correctAnswer: 'A',
    explanation: 'Standard deviation is the square root of variance. SD = √25 = 5. Variance is in squared units, while standard deviation is in the original units.'
  },

  // MULTIPLE ANSWER (3 questions)
  {
    id: 'dev-ma-1',
    type: 'multipleAnswer',
    question: 'Which of the following are measures of dispersion/spread? (Select all that apply)',
    options: ['Standard Deviation', 'Mean', 'Range', 'Variance', 'Median'],
    correctAnswer: ['A', 'C', 'D'],
    explanation: 'Standard deviation, range, and variance all measure spread/dispersion. Mean and median are measures of central tendency, not spread.'
  },
  {
    id: 'dev-ma-2',
    type: 'multipleAnswer',
    question: 'Which statements about standard deviation are true? (Select all that apply)',
    options: [
      'It is always non-negative',
      'It has the same units as the original data',
      'A larger SD indicates more variability',
      'It is resistant to outliers'
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'Standard deviation is always ≥ 0, uses the same units as the data, and larger SD means more spread. However, SD is NOT resistant to outliers - it is strongly affected by extreme values.'
  },
  {
    id: 'dev-ma-3',
    type: 'multipleAnswer',
    question: 'When comparing two datasets, which would indicate Dataset A has MORE variability than Dataset B? (Select all that apply)',
    options: [
      'Dataset A has larger standard deviation',
      'Dataset A has smaller range',
      'Dataset A has larger variance',
      'Dataset A has larger IQR'
    ],
    correctAnswer: ['A', 'C', 'D'],
    explanation: 'Larger standard deviation, larger variance, and larger IQR all indicate MORE variability. A smaller range would indicate LESS variability.'
  },

  // ORDERING (3 questions)
  {
    id: 'dev-ord-1',
    type: 'ordering',
    question: 'Order the steps to calculate the sample standard deviation (from first to last):',
    options: [
      'Take the square root of the variance',
      'Calculate the mean of the dataset',
      'Find the squared deviations from the mean',
      'Divide the sum by (n-1) to get variance'
    ],
    correctAnswer: ['B', 'C', 'D', 'A'],
    explanation: 'Correct order: 1) Calculate mean, 2) Find squared deviations (x - x̄)², 3) Sum and divide by (n-1) for variance, 4) Take square root for standard deviation.'
  },
  {
    id: 'dev-ord-2',
    type: 'ordering',
    question: 'Rank these measures from MOST to LEAST resistant to outliers:',
    options: [
      'Range',
      'Interquartile Range (IQR)',
      'Standard Deviation',
      'Median Absolute Deviation'
    ],
    correctAnswer: ['D', 'B', 'C', 'A'],
    explanation: 'Most resistant: Median Absolute Deviation (uses median), IQR (middle 50%), Standard Deviation (uses all values), Range (only uses extremes) - Least resistant.'
  },
  {
    id: 'dev-ord-3',
    type: 'ordering',
    question: 'Order these datasets from LEAST to MOST variable (based on their ranges):',
    options: [
      'Dataset A: 10, 12, 14, 16 (Range = 6)',
      'Dataset B: 5, 10, 15, 20 (Range = 15)',
      'Dataset C: 50, 51, 52, 53 (Range = 3)',
      'Dataset D: 0, 25, 50, 100 (Range = 100)'
    ],
    correctAnswer: ['C', 'A', 'B', 'D'],
    explanation: 'Order by range (smallest to largest): C (3), A (6), B (15), D (100). Smaller range = less variability.'
  },

  // MATCHING (2 questions)
  {
    id: 'dev-match-1',
    type: 'matching',
    question: 'Match each measure with its definition:',
    options: [
      { id: 'A', left: 'Range', right: '' },
      { id: 'B', left: 'Variance', right: '' },
      { id: 'C', left: 'Standard Deviation', right: '' },
      { id: 'D', left: 'IQR', right: '' }
    ],
    choices: [
      'Difference between max and min',
      'Average of squared deviations',
      'Square root of variance',
      'Difference between Q3 and Q1'
    ],
    correctAnswer: {
      A: 'Difference between max and min',
      B: 'Average of squared deviations',
      C: 'Square root of variance',
      D: 'Difference between Q3 and Q1'
    },
    explanation: 'Range = max - min, Variance = average squared deviation, Standard Deviation = √variance, IQR = Q3 - Q1 (middle 50% spread).'
  },
  {
    id: 'dev-match-2',
    type: 'matching',
    question: 'Match each scenario with the best measure of spread:',
    options: [
      { id: 'A', left: 'Income data with billionaires', right: '' },
      { id: 'B', left: 'Normally distributed test scores', right: '' },
      { id: 'C', left: 'Quick estimate of spread', right: '' }
    ],
    choices: [
      'IQR (resistant to outliers)',
      'Standard Deviation (uses all data)',
      'Range (simple calculation)'
    ],
    correctAnswer: {
      A: 'IQR (resistant to outliers)',
      B: 'Standard Deviation (uses all data)',
      C: 'Range (simple calculation)'
    },
    explanation: 'Income with outliers → IQR (resistant), Normal distribution → SD (optimal for bell curves), Quick estimate → Range (easiest to calculate).'
  }
];

export default measuresOfDeviationQuestions;
