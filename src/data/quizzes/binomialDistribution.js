/**
 * Question Bank: Binomial Distribution
 * 12 questions total: 4 MC, 3 MA, 3 Ordering, 2 Matching
 */

export const binomialDistributionQuestions = [
  // MULTIPLE CHOICE (4 questions)
  {
    id: 'binom-mc-1',
    type: 'multipleChoice',
    question: 'Which of the following is NOT a requirement for a binomial distribution?',
    options: [
      'Fixed number of trials',
      'Each trial has only two outcomes',
      'Probability of success changes with each trial',
      'Trials are independent'
    ],
    correctAnswer: 'C',
    explanation: 'In a binomial distribution, the probability of success (p) must remain CONSTANT across all trials. If p changes, it is not a binomial distribution.'
  },
  {
    id: 'binom-mc-2',
    type: 'multipleChoice',
    question: 'A fair coin is flipped 5 times. What is the probability of getting exactly 3 heads? (Use p=0.5, n=5, x=3)',
    options: ['0.3125', '0.5000', '0.1563', '0.0625'],
    correctAnswer: 'A',
    explanation: 'P(X=3) = C(5,3) × (0.5)³ × (0.5)² = 10 × 0.125 × 0.25 = 0.3125. Use the binomial formula or binomial table.'
  },
  {
    id: 'binom-mc-3',
    type: 'multipleChoice',
    question: 'In a binomial distribution with n=10 and p=0.4, what is the expected value (mean)?',
    options: ['2.4', '4.0', '6.0', '10.0'],
    correctAnswer: 'B',
    explanation: 'The mean of a binomial distribution is μ = n × p = 10 × 0.4 = 4.0. On average, we expect 4 successes in 10 trials.'
  },
  {
    id: 'binom-mc-4',
    type: 'multipleChoice',
    question: 'A binomial distribution is skewed right when:',
    options: ['p = 0.5', 'p < 0.5', 'p > 0.5', 'n is large'],
    correctAnswer: 'B',
    explanation: 'When p < 0.5, successes are rare, so the distribution is skewed right (tail extends toward higher values). When p > 0.5, it skews left. When p = 0.5, it is symmetric.'
  },

  // MULTIPLE ANSWER (3 questions)
  {
    id: 'binom-ma-1',
    type: 'multipleAnswer',
    question: 'Which scenarios can be modeled using a binomial distribution? (Select all that apply)',
    options: [
      'Number of heads in 20 coin flips',
      'Number of defective items in a sample of 50',
      'Time until the first success occurs',
      'Number of students who pass out of 100',
      'Height of randomly selected people'
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'Binomial applies to: coin flips (fixed trials, two outcomes), defective items (assuming independence), pass/fail counts. Time until first success is geometric. Height is continuous, not binomial.'
  },
  {
    id: 'binom-ma-2',
    type: 'multipleAnswer',
    question: 'For a binomial distribution, which statements are true? (Select all that apply)',
    options: [
      'Mean = n × p',
      'Variance = n × p × (1-p)',
      'Standard deviation = √(n × p)',
      'The distribution is discrete'
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'Mean = np ✓, Variance = np(1-p) ✓, It\'s discrete ✓. However, SD = √variance = √[np(1-p)], NOT √(np).'
  },
  {
    id: 'binom-ma-3',
    type: 'multipleAnswer',
    question: 'When can we use the normal approximation to the binomial? (Select all that apply)',
    options: [
      'When n is large',
      'When np ≥ 10',
      'When n(1-p) ≥ 10',
      'When p = 0.5'
    ],
    correctAnswer: ['B', 'C'],
    explanation: 'The normal approximation works well when BOTH np ≥ 10 AND n(1-p) ≥ 10. While large n helps, the specific conditions are np and n(1-p) ≥ 10. p = 0.5 is not required.'
  },

  // ORDERING (3 questions)
  {
    id: 'binom-ord-1',
    type: 'ordering',
    question: 'Order the steps to calculate a binomial probability P(X = k):',
    options: [
      'Multiply all components together',
      'Calculate the combination C(n,k)',
      'Raise p to the k power',
      'Raise (1-p) to the (n-k) power'
    ],
    correctAnswer: ['B', 'C', 'D', 'A'],
    explanation: 'Correct formula: P(X=k) = C(n,k) × p^k × (1-p)^(n-k). Order: 1) Find C(n,k), 2) Calculate p^k, 3) Calculate (1-p)^(n-k), 4) Multiply.'
  },
  {
    id: 'binom-ord-2',
    type: 'ordering',
    question: 'Order these binomial distributions from LOWEST to HIGHEST mean (n=20):',
    options: [
      'p = 0.1 (mean = 2)',
      'p = 0.3 (mean = 6)',
      'p = 0.5 (mean = 10)',
      'p = 0.8 (mean = 16)'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Mean = n × p. With n=20: p=0.1 gives 2, p=0.3 gives 6, p=0.5 gives 10, p=0.8 gives 16. Higher p means higher mean.'
  },
  {
    id: 'binom-ord-3',
    type: 'ordering',
    question: 'Order the steps to verify a scenario is binomial:',
    options: [
      'Confirm probability stays constant',
      'Check if trials are independent',
      'Identify if there are exactly two outcomes',
      'Count the number of trials (must be fixed)'
    ],
    correctAnswer: ['D', 'C', 'B', 'A'],
    explanation: 'Check: 1) Fixed n, 2) Two outcomes only, 3) Independence, 4) Constant p. All four conditions must be met for binomial distribution.'
  },

  // MATCHING (2 questions)
  {
    id: 'binom-match-1',
    type: 'matching',
    question: 'Match each binomial parameter/statistic with its meaning:',
    options: [
      { id: 'A', left: 'n', right: '' },
      { id: 'B', left: 'p', right: '' },
      { id: 'C', left: 'X', right: '' },
      { id: 'D', left: 'μ = np', right: '' }
    ],
    choices: [
      'Number of trials',
      'Probability of success',
      'Random variable (number of successes)',
      'Expected value/mean'
    ],
    correctAnswer: {
      A: 'Number of trials',
      B: 'Probability of success',
      C: 'Random variable (number of successes)',
      D: 'Expected value/mean'
    },
    explanation: 'n = number of trials, p = probability of success on each trial, X = random variable counting successes, μ = expected number of successes.'
  },
  {
    id: 'binom-match-2',
    type: 'matching',
    question: 'Match each scenario with whether it IS or IS NOT binomial:',
    options: [
      { id: 'A', left: 'Roll a die 10 times, count 6s', right: '' },
      { id: 'B', left: 'Draw 5 cards without replacement, count aces', right: '' },
      { id: 'C', left: 'Survey 50 people, count "yes" responses', right: '' }
    ],
    choices: [
      'IS binomial (fixed n, two outcomes, independent, constant p)',
      'NOT binomial (probability changes without replacement)',
      'IS binomial (assuming random sample from large population)'
    ],
    correctAnswer: {
      A: 'IS binomial (fixed n, two outcomes, independent, constant p)',
      B: 'NOT binomial (probability changes without replacement)',
      C: 'IS binomial (assuming random sample from large population)'
    },
    explanation: 'Die rolls: binomial ✓. Cards without replacement: NOT binomial (p changes). Survey: binomial if population is large enough that sampling doesn\'t significantly change probabilities.'
  }
];

export default binomialDistributionQuestions;
