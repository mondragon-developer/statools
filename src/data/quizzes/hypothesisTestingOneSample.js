/**
 * Question Bank: Hypothesis Testing - One Sample
 * 12 questions total: 4 MC, 3 MA, 3 Ordering, 2 Matching
 */

export const hypothesisTestingOneSampleQuestions = [
  // MULTIPLE CHOICE (4 questions)
  {
    id: 'ht1-mc-1',
    type: 'multipleChoice',
    question: 'In hypothesis testing, which hypothesis represents the status quo or "no effect"?',
    options: ['Alternative hypothesis (Hₐ)', 'Null hypothesis (H₀)', 'Research hypothesis', 'Test statistic'],
    correctAnswer: 'B',
    explanation: 'The null hypothesis (H₀) represents the status quo, no change, or no effect. It is what we assume to be true unless we have strong evidence against it.'
  },
  {
    id: 'ht1-mc-2',
    type: 'multipleChoice',
    question: 'A p-value of 0.03 means:',
    options: [
      'There is a 3% chance H₀ is true',
      'There is a 3% chance of observing data this extreme if H₀ is true',
      'There is a 97% chance Hₐ is true',
      'The test statistic equals 0.03'
    ],
    correctAnswer: 'B',
    explanation: 'The p-value is the probability of obtaining results as extreme as observed, ASSUMING H₀ is true. It is NOT the probability that H₀ is true.'
  },
  {
    id: 'ht1-mc-3',
    type: 'multipleChoice',
    question: 'If we use α = 0.05 and obtain p-value = 0.02, we should:',
    options: [
      'Fail to reject H₀',
      'Reject H₀',
      'Accept H₀',
      'Increase the sample size'
    ],
    correctAnswer: 'B',
    explanation: 'Since p-value (0.02) < α (0.05), we reject H₀. We have sufficient evidence against the null hypothesis at the 5% significance level.'
  },
  {
    id: 'ht1-mc-4',
    type: 'multipleChoice',
    question: 'A Type I error occurs when:',
    options: [
      'We reject H₀ when H₀ is true',
      'We fail to reject H₀ when H₀ is false',
      'We correctly reject H₀',
      'The p-value is large'
    ],
    correctAnswer: 'A',
    explanation: 'Type I error (false positive): Rejecting H₀ when it is actually true. The probability of Type I error is α (significance level).'
  },

  // MULTIPLE ANSWER (3 questions)
  {
    id: 'ht1-ma-1',
    type: 'multipleAnswer',
    question: 'Which statements about the null hypothesis are true? (Select all that apply)',
    options: [
      'It always contains an equality (=, ≤, or ≥)',
      'It represents the claim we are trying to prove',
      'We either reject it or fail to reject it',
      'It is assumed true until proven otherwise'
    ],
    correctAnswer: ['A', 'C', 'D'],
    explanation: 'H₀ contains equality ✓, we reject or fail to reject it ✓, assumed true initially ✓. However, H₀ is NOT what we\'re trying to prove - that\'s usually Hₐ.'
  },
  {
    id: 'ht1-ma-2',
    type: 'multipleAnswer',
    question: 'What factors affect the p-value? (Select all that apply)',
    options: [
      'The observed test statistic',
      'The significance level α',
      'The alternative hypothesis (one-tailed vs two-tailed)',
      'The sample size'
    ],
    correctAnswer: ['A', 'C', 'D'],
    explanation: 'P-value depends on: test statistic value ✓, type of test (one/two-tailed) ✓, sample size (affects SE) ✓. The p-value is independent of α - we compare them, but α doesn\'t affect p-value calculation.'
  },
  {
    id: 'ht1-ma-3',
    type: 'multipleAnswer',
    question: 'When would you use a one-sample t-test instead of z-test? (Select all that apply)',
    options: [
      'Population standard deviation is unknown',
      'Sample size is small (n < 30)',
      'Population is normally distributed',
      'You need to estimate σ with s'
    ],
    correctAnswer: ['A', 'D'],
    explanation: 'Use t-test when: σ is unknown ✓ and must use s ✓. While t-test is common with small samples and works best with normal populations, the KEY reason is unknown σ.'
  },

  // ORDERING (3 questions)
  {
    id: 'ht1-ord-1',
    type: 'ordering',
    question: 'Order the steps of hypothesis testing:',
    options: [
      'Make a decision (reject or fail to reject H₀)',
      'State the hypotheses (H₀ and Hₐ)',
      'Calculate the test statistic',
      'Find the p-value or compare to critical value'
    ],
    correctAnswer: ['B', 'C', 'D', 'A'],
    explanation: 'Correct order: 1) State H₀ and Hₐ, 2) Calculate test statistic, 3) Find p-value or critical value, 4) Make decision based on comparison.'
  },
  {
    id: 'ht1-ord-2',
    type: 'ordering',
    question: 'Order these significance levels from MOST to LEAST stringent:',
    options: [
      'α = 0.01',
      'α = 0.05',
      'α = 0.10',
      'α = 0.20'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Lower α = more stringent = harder to reject H₀ = less Type I error. Order: 0.01 (most stringent), 0.05, 0.10, 0.20 (least stringent).'
  },
  {
    id: 'ht1-ord-3',
    type: 'ordering',
    question: 'Order these p-values from STRONGEST to WEAKEST evidence against H₀:',
    options: [
      'p = 0.001',
      'p = 0.04',
      'p = 0.15',
      'p = 0.50'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Smaller p-value = stronger evidence against H₀. Order: 0.001 (very strong), 0.04 (moderate), 0.15 (weak), 0.50 (very weak/no evidence).'
  },

  // MATCHING (2 questions)
  {
    id: 'ht1-match-1',
    type: 'matching',
    question: 'Match each hypothesis test component with its symbol:',
    options: [
      { id: 'A', left: 'Null hypothesis', right: '' },
      { id: 'B', left: 'Alternative hypothesis', right: '' },
      { id: 'C', left: 'Significance level', right: '' }
    ],
    choices: [
      'H₀',
      'Hₐ (or H₁)',
      'α (alpha)'
    ],
    correctAnswer: {
      A: 'H₀',
      B: 'Hₐ (or H₁)',
      C: 'α (alpha)'
    },
    explanation: 'Standard notation: H₀ = null hypothesis, Hₐ or H₁ = alternative hypothesis, α = significance level (Type I error probability).'
  },
  {
    id: 'ht1-match-2',
    type: 'matching',
    question: 'Match each error type with its description:',
    options: [
      { id: 'A', left: 'Type I Error', right: '' },
      { id: 'B', left: 'Type II Error', right: '' },
      { id: 'C', left: 'Correct Decision', right: '' }
    ],
    choices: [
      'Reject H₀ when H₀ is true (false positive)',
      'Fail to reject H₀ when H₀ is false (false negative)',
      'Reject H₀ when Hₐ is true'
    ],
    correctAnswer: {
      A: 'Reject H₀ when H₀ is true (false positive)',
      B: 'Fail to reject H₀ when H₀ is false (false negative)',
      C: 'Reject H₀ when Hₐ is true'
    },
    explanation: 'Type I (α): False positive - reject true H₀. Type II (β): False negative - fail to reject false H₀. Correct: Reject H₀ when it\'s actually false (Hₐ is true).'
  }
];

export default hypothesisTestingOneSampleQuestions;
