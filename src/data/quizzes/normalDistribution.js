/**
 * Question Bank: Normal Distribution & Z-Scores
 * 12 questions total: 4 MC, 3 MA, 3 Ordering, 2 Matching
 */

export const normalDistributionQuestions = [
  // MULTIPLE CHOICE (4 questions)
  {
    id: 'normal-mc-1',
    type: 'multipleChoice',
    question: 'What percentage of data falls within 1 standard deviation of the mean in a normal distribution?',
    options: ['50%', '68%', '95%', '99.7%'],
    correctAnswer: 'B',
    explanation: 'The Empirical Rule (68-95-99.7): About 68% of data falls within 1 SD, 95% within 2 SD, and 99.7% within 3 SD of the mean.'
  },
  {
    id: 'normal-mc-2',
    type: 'multipleChoice',
    question: 'If X ~ N(50, 10²), what is the z-score for X = 65?',
    options: ['0.5', '1.0', '1.5', '2.0'],
    correctAnswer: 'C',
    explanation: 'z = (X - μ) / σ = (65 - 50) / 10 = 15 / 10 = 1.5. The value 65 is 1.5 standard deviations above the mean.'
  },
  {
    id: 'normal-mc-3',
    type: 'multipleChoice',
    question: 'In a standard normal distribution (Z), what is the mean?',
    options: ['-1', '0', '1', 'Undefined'],
    correctAnswer: 'B',
    explanation: 'The standard normal distribution has mean μ = 0 and standard deviation σ = 1. It is denoted as Z ~ N(0,1).'
  },
  {
    id: 'normal-mc-4',
    type: 'multipleChoice',
    question: 'A z-score of -2.5 indicates that a data point is:',
    options: [
      '2.5 standard deviations above the mean',
      '2.5 standard deviations below the mean',
      'At the mean',
      'At the median'
    ],
    correctAnswer: 'B',
    explanation: 'Negative z-scores are BELOW the mean, positive z-scores are ABOVE the mean. z = -2.5 means 2.5 standard deviations below the mean.'
  },

  // MULTIPLE ANSWER (3 questions)
  {
    id: 'normal-ma-1',
    type: 'multipleAnswer',
    question: 'Which properties are true for the normal distribution? (Select all that apply)',
    options: [
      'It is symmetric about the mean',
      'Mean = Median = Mode',
      'The total area under the curve is 1',
      'It is a discrete distribution'
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'Normal distribution: symmetric ✓, Mean=Median=Mode ✓, total area=1 ✓. It is CONTINUOUS, not discrete.'
  },
  {
    id: 'normal-ma-2',
    type: 'multipleAnswer',
    question: 'What information do you need to calculate a z-score? (Select all that apply)',
    options: [
      'The data value (X)',
      'The population mean (μ)',
      'The population standard deviation (σ)',
      'The sample size (n)'
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'z-score formula: z = (X - μ) / σ. You need X, μ, and σ. Sample size n is not needed for individual z-scores (but is needed for sampling distributions).'
  },
  {
    id: 'normal-ma-3',
    type: 'multipleAnswer',
    question: 'When can we use the normal distribution to approximate other distributions? (Select all that apply)',
    options: [
      'Binomial when np ≥ 10 and n(1-p) ≥ 10',
      'Any distribution with large sample size (CLT)',
      'Poisson when λ is large (typically λ ≥ 10)',
      'Uniform distribution'
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'Normal approximation works for: binomial (when np and n(1-p) ≥10) ✓, any distribution via CLT ✓, Poisson (when λ large) ✓. Uniform does not become normal.'
  },

  // ORDERING (3 questions)
  {
    id: 'normal-ord-1',
    type: 'ordering',
    question: 'Order the steps to find P(X < 75) when X ~ N(60, 100):',
    options: [
      'Look up probability in z-table',
      'Calculate z = (75-60)/10 = 1.5',
      'Identify μ=60 and σ=10',
      'Find P(Z < 1.5)'
    ],
    correctAnswer: ['C', 'B', 'D', 'A'],
    explanation: 'Steps: 1) Identify μ and σ, 2) Calculate z-score, 3) Find P(Z < z) using standard normal, 4) Look up in z-table or use calculator.'
  },
  {
    id: 'normal-ord-2',
    type: 'ordering',
    question: 'Rank these z-scores from LOWEST to HIGHEST percentile:',
    options: [
      'z = -2.0 (≈2.3 percentile)',
      'z = 0.0 (50th percentile)',
      'z = 1.0 (≈84th percentile)',
      'z = 2.0 (≈97.7 percentile)'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Lower z-scores = lower percentiles. Order: z=-2.0 (2.3%), z=0 (50%), z=1.0 (84%), z=2.0 (97.7%).'
  },
  {
    id: 'normal-ord-3',
    type: 'ordering',
    question: 'For a normal distribution, order from SMALLEST to LARGEST:',
    options: [
      'The area below z = -1',
      'The area between z = -1 and z = 1',
      'The area above z = 1',
      'The total area under the curve'
    ],
    correctAnswer: ['A', 'C', 'B', 'D'],
    explanation: 'By symmetry: area below z=-1 ≈ 0.16, area above z=1 ≈ 0.16, area between -1 and 1 ≈ 0.68, total area = 1.0.'
  },

  // MATCHING (2 questions)
  {
    id: 'normal-match-1',
    type: 'matching',
    question: 'Match each z-score with its meaning:',
    options: [
      { id: 'A', left: 'z = 0', right: '' },
      { id: 'B', left: 'z > 0', right: '' },
      { id: 'C', left: 'z < 0', right: '' }
    ],
    choices: [
      'Value is at the mean',
      'Value is above the mean',
      'Value is below the mean'
    ],
    correctAnswer: {
      A: 'Value is at the mean',
      B: 'Value is above the mean',
      C: 'Value is below the mean'
    },
    explanation: 'z = 0: exactly at mean. Positive z: above mean. Negative z: below mean. The magnitude tells how many SDs away.'
  },
  {
    id: 'normal-match-2',
    type: 'matching',
    question: 'Match each interval with the approximate percentage of data (Empirical Rule):',
    options: [
      { id: 'A', left: 'μ ± 1σ', right: '' },
      { id: 'B', left: 'μ ± 2σ', right: '' },
      { id: 'C', left: 'μ ± 3σ', right: '' }
    ],
    choices: [
      '68%',
      '95%',
      '99.7%'
    ],
    correctAnswer: {
      A: '68%',
      B: '95%',
      C: '99.7%'
    },
    explanation: 'Empirical Rule (68-95-99.7): Within 1 SD → 68%, Within 2 SD → 95%, Within 3 SD → 99.7% of data.'
  }
];

export default normalDistributionQuestions;
