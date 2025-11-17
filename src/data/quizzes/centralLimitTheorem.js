/**
 * Question Bank: Central Limit Theorem
 * 12 questions total: 4 MC, 3 MA, 3 Ordering, 2 Matching
 */

export const centralLimitTheoremQuestions = [
  // MULTIPLE CHOICE (4 questions)
  {
    id: 'clt-mc-1',
    type: 'multipleChoice',
    question: 'According to the Central Limit Theorem, the sampling distribution of the sample mean approaches what distribution as n increases?',
    options: ['Uniform distribution', 'Normal distribution', 'Exponential distribution', 'Chi-square distribution'],
    correctAnswer: 'B',
    explanation: 'The CLT states that regardless of the population distribution, the sampling distribution of x̄ approaches a normal distribution as sample size n increases.'
  },
  {
    id: 'clt-mc-2',
    type: 'multipleChoice',
    question: 'The standard error of the mean is calculated as:',
    options: ['σ/n', 'σ/√n', 'σ²/n', 's/n'],
    correctAnswer: 'B',
    explanation: 'Standard error (SE) = σ/√n, where σ is the population standard deviation and n is the sample size. This measures the variability of sample means.'
  },
  {
    id: 'clt-mc-3',
    type: 'multipleChoice',
    question: 'What sample size is generally considered sufficient for the CLT to apply?',
    options: ['n ≥ 10', 'n ≥ 20', 'n ≥ 30', 'n ≥ 100'],
    correctAnswer: 'C',
    explanation: 'While it depends on the population distribution, n ≥ 30 is the common rule of thumb. For highly skewed populations, larger n may be needed. For normal populations, smaller n works.'
  },
  {
    id: 'clt-mc-4',
    type: 'multipleChoice',
    question: 'If a population has mean μ = 50 and standard deviation σ = 10, what is the mean of the sampling distribution of x̄ for samples of size 25?',
    options: ['2', '10', '50', '250'],
    correctAnswer: 'C',
    explanation: 'The mean of the sampling distribution (μₓ̄) equals the population mean μ. So μₓ̄ = 50. The sample size does not affect the mean, only the standard error.'
  },

  // MULTIPLE ANSWER (3 questions)
  {
    id: 'clt-ma-1',
    type: 'multipleAnswer',
    question: 'Which statements about the Central Limit Theorem are true? (Select all that apply)',
    options: [
      'It applies regardless of the population distribution shape',
      'Larger samples produce smaller standard errors',
      'The population must be normally distributed',
      'It allows us to use normal probabilities for sample means'
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'CLT works for ANY population shape ✓, larger n gives smaller SE ✓, enables normal probabilities ✓. The population does NOT need to be normal - that\'s the power of CLT!'
  },
  {
    id: 'clt-ma-2',
    type: 'multipleAnswer',
    question: 'What happens as sample size increases? (Select all that apply)',
    options: [
      'Standard error decreases',
      'Sampling distribution becomes more normal',
      'Sampling distribution becomes narrower',
      'Population mean changes'
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'As n increases: SE decreases (σ/√n gets smaller) ✓, distribution becomes more normal ✓, distribution gets narrower ✓. Population mean μ is fixed and does not change.'
  },
  {
    id: 'clt-ma-3',
    type: 'multipleAnswer',
    question: 'The Central Limit Theorem is important because: (Select all that apply)',
    options: [
      'It justifies using normal-based inference methods',
      'It explains why sample means vary less than individual values',
      'It requires knowing the population distribution',
      'It works for any sufficiently large sample'
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'CLT justifies normal methods ✓, explains why x̄ has less variability than X ✓, works for large n regardless of population ✓. We do NOT need to know the population distribution!'
  },

  // ORDERING (3 questions)
  {
    id: 'clt-ord-1',
    type: 'ordering',
    question: 'Order these steps to apply the CLT to find P(x̄ > 52):',
    options: [
      'Calculate z = (52 - μ) / (σ/√n)',
      'Find P(Z > z) using normal table',
      'Verify n is large enough (n ≥ 30)',
      'Identify μ, σ, and n'
    ],
    correctAnswer: ['D', 'C', 'A', 'B'],
    explanation: 'Steps: 1) Identify parameters, 2) Verify CLT applies (n ≥ 30), 3) Calculate z-score using SE = σ/√n, 4) Find probability using standard normal.'
  },
  {
    id: 'clt-ord-2',
    type: 'ordering',
    question: 'Rank these sampling distributions from MOST to LEAST variable:',
    options: [
      'n = 10 (SE = σ/√10)',
      'n = 25 (SE = σ/√25)',
      'n = 100 (SE = σ/√100)',
      'n = 400 (SE = σ/√400)'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Standard error decreases as n increases. Most variable: n=10 (SE = σ/3.16), then n=25 (SE = σ/5), n=100 (SE = σ/10), least: n=400 (SE = σ/20).'
  },
  {
    id: 'clt-ord-3',
    type: 'ordering',
    question: 'Order the conditions from EASIEST to HARDEST for CLT to apply well:',
    options: [
      'Population is normal',
      'Population is symmetric but not normal',
      'Population is moderately skewed',
      'Population is highly skewed'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'CLT works faster when population is closer to normal. Normal population: small n works. Symmetric: moderate n. Skewed: larger n needed. Highly skewed: very large n required.'
  },

  // MATCHING (2 questions)
  {
    id: 'clt-match-1',
    type: 'matching',
    question: 'Match each term with its definition:',
    options: [
      { id: 'A', left: 'Sampling Distribution', right: '' },
      { id: 'B', left: 'Standard Error', right: '' },
      { id: 'C', left: 'Central Limit Theorem', right: '' }
    ],
    choices: [
      'Distribution of a sample statistic across all possible samples',
      'Standard deviation of the sampling distribution',
      'Theorem stating x̄ approaches normal as n increases'
    ],
    correctAnswer: {
      A: 'Distribution of a sample statistic across all possible samples',
      B: 'Standard deviation of the sampling distribution',
      C: 'Theorem stating x̄ approaches normal as n increases'
    },
    explanation: 'Sampling distribution = distribution of statistics (like x̄), Standard error = SD of that distribution, CLT = theorem about normality of x̄.'
  },
  {
    id: 'clt-match-2',
    type: 'matching',
    question: 'Match each scenario with the appropriate distribution for x̄:',
    options: [
      { id: 'A', left: 'Normal population, n = 10', right: '' },
      { id: 'B', left: 'Unknown population, n = 50', right: '' },
      { id: 'C', left: 'Skewed population, n = 5', right: '' }
    ],
    choices: [
      'Normal (population is normal)',
      'Approximately normal (CLT applies)',
      'Unknown (CLT does not apply yet)'
    ],
    correctAnswer: {
      A: 'Normal (population is normal)',
      B: 'Approximately normal (CLT applies)',
      C: 'Unknown (CLT does not apply yet)'
    },
    explanation: 'Normal population: x̄ is always normal. Large n (≥30): CLT makes x̄ approximately normal. Small n with skewed population: cannot assume normality.'
  }
];

export default centralLimitTheoremQuestions;
