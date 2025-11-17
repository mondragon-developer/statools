/**
 * Question Bank: Confidence Intervals
 * 12 questions total: 4 MC, 3 MA, 3 Ordering, 2 Matching
 */

export const confidenceIntervalsQuestions = [
  // MULTIPLE CHOICE (4 questions)
  {
    id: 'ci-mc-1',
    type: 'multipleChoice',
    question: 'A 95% confidence interval means:',
    options: [
      '95% of the data falls within the interval',
      '95% probability the true parameter is in the interval',
      'If we repeated sampling, 95% of intervals would contain the parameter',
      'The parameter equals the center of the interval 95% of the time'
    ],
    correctAnswer: 'C',
    explanation: 'A 95% CI means that if we repeated the sampling process many times, 95% of the constructed intervals would contain the true parameter. The parameter is fixed; the interval varies.'
  },
  {
    id: 'ci-mc-2',
    type: 'multipleChoice',
    question: 'What happens to the width of a confidence interval when you increase the confidence level from 90% to 99%?',
    options: [
      'It gets narrower',
      'It gets wider',
      'It stays the same',
      'It becomes more accurate'
    ],
    correctAnswer: 'B',
    explanation: 'Higher confidence requires a wider interval. To be MORE confident (99% vs 90%), we need to cast a WIDER net. The critical value increases, making the margin of error larger.'
  },
  {
    id: 'ci-mc-3',
    type: 'multipleChoice',
    question: 'The margin of error in a confidence interval is calculated as:',
    options: [
      'Critical value only',
      'Standard error only',
      'Critical value × Standard error',
      'Sample mean × Critical value'
    ],
    correctAnswer: 'C',
    explanation: 'Margin of Error = Critical value × Standard Error. For example: ME = z* × (σ/√n) or ME = t* × (s/√n). It combines uncertainty from sampling and desired confidence.'
  },
  {
    id: 'ci-mc-4',
    type: 'multipleChoice',
    question: 'To reduce the width of a confidence interval, you can:',
    options: [
      'Decrease the sample size',
      'Increase the confidence level',
      'Increase the sample size',
      'Use a higher significance level'
    ],
    correctAnswer: 'C',
    explanation: 'Increasing sample size n reduces standard error (σ/√n), which decreases the margin of error and narrows the CI. Larger samples provide more precise estimates.'
  },

  // MULTIPLE ANSWER (3 questions)
  {
    id: 'ci-ma-1',
    type: 'multipleAnswer',
    question: 'A confidence interval provides: (Select all that apply)',
    options: [
      'A range of plausible values for the parameter',
      'A measure of precision/uncertainty',
      'Proof that the parameter is in the interval',
      'A point estimate plus margin of error'
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'CI gives: range of plausible values ✓, measures uncertainty ✓, point estimate ± ME ✓. It does NOT prove the parameter is in the interval (we can\'t be certain).'
  },
  {
    id: 'ci-ma-2',
    type: 'multipleAnswer',
    question: 'Which factors affect the width of a confidence interval? (Select all that apply)',
    options: [
      'Sample size',
      'Confidence level',
      'Population variability',
      'Sample mean'
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'CI width depends on: sample size (larger n → narrower) ✓, confidence level (higher % → wider) ✓, variability (larger σ → wider) ✓. Sample mean is the center, not the width.'
  },
  {
    id: 'ci-ma-3',
    type: 'multipleAnswer',
    question: 'When should you use a t-distribution for confidence intervals? (Select all that apply)',
    options: [
      'Population standard deviation is unknown',
      'Small sample size (n < 30)',
      'You must estimate σ with s',
      'Population is exactly normal'
    ],
    correctAnswer: ['A', 'C'],
    explanation: 'Use t-distribution when: σ is unknown ✓ and must use s ✓. While often used with small samples, the KEY reason is unknown σ. Exact normality is not required (CLT helps with larger n).'
  },

  // ORDERING (3 questions)
  {
    id: 'ci-ord-1',
    type: 'ordering',
    question: 'Order the steps to construct a confidence interval for a mean:',
    options: [
      'Calculate margin of error: critical value × SE',
      'Find the critical value (z* or t*)',
      'Calculate sample mean and standard error',
      'Construct interval: x̄ ± margin of error'
    ],
    correctAnswer: ['C', 'B', 'A', 'D'],
    explanation: 'Steps: 1) Calculate x̄ and SE, 2) Find critical value (z* or t*) based on confidence level, 3) Calculate ME, 4) Build interval: x̄ ± ME.'
  },
  {
    id: 'ci-ord-2',
    type: 'ordering',
    question: 'Rank these confidence intervals from NARROWEST to WIDEST (same data):',
    options: [
      '90% CI',
      '95% CI',
      '98% CI',
      '99% CI'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Higher confidence = wider interval. Narrowest: 90%, then 95%, 98%, widest: 99%. More confidence requires casting a wider net.'
  },
  {
    id: 'ci-ord-3',
    type: 'ordering',
    question: 'With the same confidence level, rank from WIDEST to NARROWEST CI:',
    options: [
      'n = 25',
      'n = 50',
      'n = 100',
      'n = 400'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Larger n → smaller SE → narrower CI. Widest: n=25 (SE = σ/5), then n=50, n=100, narrowest: n=400 (SE = σ/20).'
  },

  // MATCHING (2 questions)
  {
    id: 'ci-match-1',
    type: 'matching',
    question: 'Match each confidence interval component with its role:',
    options: [
      { id: 'A', left: 'Point estimate', right: '' },
      { id: 'B', left: 'Critical value', right: '' },
      { id: 'C', left: 'Standard error', right: '' }
    ],
    choices: [
      'Center of the interval (x̄)',
      'Multiplier based on confidence level',
      'Measure of sampling variability'
    ],
    correctAnswer: {
      A: 'Center of the interval (x̄)',
      B: 'Multiplier based on confidence level',
      C: 'Measure of sampling variability'
    },
    explanation: 'Point estimate (x̄) = center. Critical value (z* or t*) = multiplier from confidence level. Standard error = variability of estimate.'
  },
  {
    id: 'ci-match-2',
    type: 'matching',
    question: 'Match each scenario with its interpretation:',
    options: [
      { id: 'A', left: '95% CI for μ: (48, 52)', right: '' },
      { id: 'B', left: 'CI does not contain hypothesized value', right: '' },
      { id: 'C', left: 'Wider CI', right: '' }
    ],
    choices: [
      'We are 95% confident μ is between 48 and 52',
      'Reject H₀ at corresponding α level',
      'Less precision/more uncertainty'
    ],
    correctAnswer: {
      A: 'We are 95% confident μ is between 48 and 52',
      B: 'Reject H₀ at corresponding α level',
      C: 'Less precision/more uncertainty'
    },
    explanation: '95% CI (48,52): interpret as confidence about range. CI excludes H₀ value: reject H₀. Wider CI: less precise estimate, more uncertainty.'
  }
];

export default confidenceIntervalsQuestions;
