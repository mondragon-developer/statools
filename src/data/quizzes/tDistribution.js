/**
 * Question Bank: T-Distribution
 * 12 questions total: 4 MC, 3 MA, 3 Ordering, 2 Matching
 */

export const tDistributionQuestions = [
  // MULTIPLE CHOICE (4 questions)
  {
    id: 't-mc-1',
    type: 'multipleChoice',
    question: 'When should you use the t-distribution instead of the normal distribution?',
    options: [
      'When the population is normally distributed',
      'When the sample size is large (n > 30)',
      'When the population standard deviation is unknown',
      'When you know the population mean'
    ],
    correctAnswer: 'C',
    explanation: 'Use t-distribution when σ (population SD) is UNKNOWN and you must estimate it with s (sample SD). This is common in practice since we rarely know σ.'
  },
  {
    id: 't-mc-2',
    type: 'multipleChoice',
    question: 'What parameter determines the shape of a t-distribution?',
    options: ['Mean', 'Standard deviation', 'Degrees of freedom (df)', 'Sample size'],
    correctAnswer: 'C',
    explanation: 'The t-distribution is defined by degrees of freedom (df = n - 1 for one sample). Different df values create different t-distributions.'
  },
  {
    id: 't-mc-3',
    type: 'multipleChoice',
    question: 'As the degrees of freedom increase, the t-distribution:',
    options: [
      'Becomes more skewed',
      'Approaches the normal distribution',
      'Gets wider tails',
      'Has lower variance'
    ],
    correctAnswer: 'B',
    explanation: 'As df increases (larger samples), the t-distribution approaches the standard normal distribution. With df ≥ 30, they are very similar.'
  },
  {
    id: 't-mc-4',
    type: 'multipleChoice',
    question: 'Compared to the standard normal distribution, the t-distribution has:',
    options: [
      'Thinner tails',
      'Thicker/heavier tails',
      'The same shape',
      'No tails'
    ],
    correctAnswer: 'B',
    explanation: 'The t-distribution has heavier/thicker tails than the normal distribution, accounting for additional uncertainty when estimating σ with s. This gives more probability to extreme values.'
  },

  // MULTIPLE ANSWER (3 questions)
  {
    id: 't-ma-1',
    type: 'multipleAnswer',
    question: 'Which statements about the t-distribution are true? (Select all that apply)',
    options: [
      'It is symmetric about zero',
      'It has heavier tails than the normal distribution',
      'The mean is always 0',
      'It requires degrees of freedom parameter'
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'T-distribution: symmetric about 0 ✓, heavier tails than normal ✓, requires df ✓. Mean is 0 for the standard t-distribution, but not always in all applications.'
  },
  {
    id: 't-ma-2',
    type: 'multipleAnswer',
    question: 'When is the t-distribution appropriate? (Select all that apply)',
    options: [
      'Constructing confidence intervals with unknown σ',
      'Hypothesis testing when σ is unknown',
      'Small sample sizes (n < 30)',
      'When the population is extremely skewed'
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'Use t-distribution for: confidence intervals when σ unknown ✓, hypothesis tests when σ unknown ✓, small samples ✓. For extremely skewed populations, may need non-parametric methods.'
  },
  {
    id: 't-ma-3',
    type: 'multipleAnswer',
    question: 'How do degrees of freedom affect the t-distribution? (Select all that apply)',
    options: [
      'Lower df = heavier tails',
      'Higher df = closer to normal',
      'df = n - 1 for one sample mean',
      'df affects the critical values'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'All are correct! Lower df → heavier tails ✓, Higher df → approaches normal ✓, df = n-1 for one sample ✓, df affects critical values ✓.'
  },

  // ORDERING (3 questions)
  {
    id: 't-ord-1',
    type: 'ordering',
    question: 'Order the steps to find a confidence interval using the t-distribution:',
    options: [
      'Calculate the margin of error: t* × (s/√n)',
      'Find the critical value t* from t-table',
      'Calculate sample mean (x̄) and sample SD (s)',
      'Construct interval: x̄ ± margin of error'
    ],
    correctAnswer: ['C', 'B', 'A', 'D'],
    explanation: 'Steps: 1) Calculate x̄ and s, 2) Find t* using df and confidence level, 3) Calculate margin of error, 4) Build interval: x̄ ± ME.'
  },
  {
    id: 't-ord-2',
    type: 'ordering',
    question: 'Rank these t-distributions from WIDEST to NARROWEST spread:',
    options: [
      'df = 5',
      'df = 10',
      'df = 30',
      'Normal distribution (df = ∞)'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Lower df = wider spread (heavier tails). Order: df=5 (widest), df=10, df=30, Normal/df=∞ (narrowest).'
  },
  {
    id: 't-ord-3',
    type: 'ordering',
    question: 'Order the steps to conduct a t-test for one sample mean:',
    options: [
      'Calculate the test statistic: t = (x̄ - μ₀)/(s/√n)',
      'Compare t to critical value or find p-value',
      'State hypotheses (H₀ and Hₐ)',
      'Make decision: reject or fail to reject H₀'
    ],
    correctAnswer: ['C', 'A', 'B', 'D'],
    explanation: 'Steps: 1) State hypotheses, 2) Calculate t-statistic, 3) Find p-value or compare to critical value, 4) Make decision.'
  },

  // MATCHING (2 questions)
  {
    id: 't-match-1',
    type: 'matching',
    question: 'Match each scenario with the appropriate degrees of freedom:',
    options: [
      { id: 'A', left: 'One sample t-test, n=25', right: '' },
      { id: 'B', left: 'Two sample t-test, n₁=20, n₂=15', right: '' },
      { id: 'C', left: 'Paired t-test, n=30 pairs', right: '' }
    ],
    choices: [
      'df = 24',
      'df = 33 (approximate)',
      'df = 29'
    ],
    correctAnswer: {
      A: 'df = 24',
      B: 'df = 33 (approximate)',
      C: 'df = 29'
    },
    explanation: 'One sample: df = n-1 = 24. Two sample: df ≈ n₁+n₂-2 = 33 (or use Welch approximation). Paired: df = n-1 = 29.'
  },
  {
    id: 't-match-2',
    type: 'matching',
    question: 'Match each statement with the correct distribution:',
    options: [
      { id: 'A', left: 'Used when σ is known', right: '' },
      { id: 'B', left: 'Used when σ is unknown', right: '' },
      { id: 'C', left: 'Has heavier tails for small samples', right: '' }
    ],
    choices: [
      'Normal (Z) distribution',
      'T-distribution',
      'T-distribution'
    ],
    correctAnswer: {
      A: 'Normal (Z) distribution',
      B: 'T-distribution',
      C: 'T-distribution'
    },
    explanation: 'Known σ → use Z (normal). Unknown σ → use t-distribution. Heavier tails (especially for small samples) → t-distribution.'
  }
];

export default tDistributionQuestions;
