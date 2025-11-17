/**
 * Question Bank: Hypothesis Testing - Two Samples
 * 12 questions total: 4 MC, 3 MA, 3 Ordering, 2 Matching
 */

export const hypothesisTestingTwoSamplesQuestions = [
  // MULTIPLE CHOICE (4 questions)
  {
    id: 'ht2-mc-1',
    type: 'multipleChoice',
    question: 'When comparing two population means, the null hypothesis typically states:',
    options: ['μ₁ ≠ μ₂', 'μ₁ = μ₂', 'μ₁ > μ₂', 'μ₁ < μ₂'],
    correctAnswer: 'B',
    explanation: 'The null hypothesis for two-sample tests typically states no difference: H₀: μ₁ = μ₂ (or equivalently μ₁ - μ₂ = 0). The alternative hypothesis contains the inequality.'
  },
  {
    id: 'ht2-mc-2',
    type: 'multipleChoice',
    question: 'Which test is appropriate for comparing means of the SAME subjects measured twice (before/after)?',
    options: ['Independent samples t-test', 'Paired t-test', 'Z-test', 'Chi-square test'],
    correctAnswer: 'B',
    explanation: 'Use paired t-test when observations are dependent (same subjects measured twice). This accounts for the correlation within pairs and is more powerful than independent samples.'
  },
  {
    id: 'ht2-mc-3',
    type: 'multipleChoice',
    question: 'The pooled variance estimate is used when:',
    options: [
      'Samples are paired',
      'Population variances are assumed equal',
      'Sample sizes are very different',
      'Data is non-normal'
    ],
    correctAnswer: 'B',
    explanation: 'Pooled variance combines both sample variances when we assume σ₁² = σ₂² (equal population variances). It provides a better estimate than using them separately.'
  },
  {
    id: 'ht2-mc-4',
    type: 'multipleChoice',
    question: 'For independent samples, the standard error of (x̄₁ - x̄₂) is:',
    options: [
      'σ₁/√n₁ + σ₂/√n₂',
      '√(σ₁²/n₁ + σ₂²/n₂)',
      'σ₁σ₂/√(n₁n₂)',
      '(σ₁ + σ₂)/√(n₁ + n₂)'
    ],
    correctAnswer: 'B',
    explanation: 'For independent samples, SE(x̄₁ - x̄₂) = √(σ₁²/n₁ + σ₂²/n₂). We add the variances (not SDs) because variances of independent variables add.'
  },

  // MULTIPLE ANSWER (3 questions)
  {
    id: 'ht2-ma-1',
    type: 'multipleAnswer',
    question: 'Which conditions are required for independent two-sample t-test? (Select all that apply)',
    options: [
      'Samples are independent of each other',
      'Populations are approximately normal (or large n)',
      'Sample sizes must be equal',
      'Random sampling from populations'
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'Required: independence ✓, approximate normality ✓, random sampling ✓. Sample sizes do NOT need to be equal (though equal sizes increase power).'
  },
  {
    id: 'ht2-ma-2',
    type: 'multipleAnswer',
    question: 'Paired data occurs when: (Select all that apply)',
    options: [
      'Same subjects measured at two different times',
      'Two randomly selected independent groups',
      'Matched pairs (twins, siblings, etc.)',
      'Before/after measurements on same units'
    ],
    correctAnswer: ['A', 'C', 'D'],
    explanation: 'Paired data: same subjects measured twice ✓, matched pairs ✓, before/after on same units ✓. Independent random groups are NOT paired.'
  },
  {
    id: 'ht2-ma-3',
    type: 'multipleAnswer',
    question: 'Advantages of paired design include: (Select all that apply)',
    options: [
      'Reduces variability by controlling for individual differences',
      'More powerful than independent samples',
      'Requires fewer total observations',
      'Works even when samples are independent'
    ],
    correctAnswer: ['A', 'B', 'C'],
    explanation: 'Paired design: reduces variability ✓, more powerful ✓, needs fewer observations ✓. It does NOT work with independent samples - pairing is the key feature!'
  },

  // ORDERING (3 questions)
  {
    id: 'ht2-ord-1',
    type: 'ordering',
    question: 'Order the steps to perform a two-sample independent t-test:',
    options: [
      'Calculate the test statistic t = (x̄₁ - x̄₂) / SE',
      'State H₀: μ₁ = μ₂ and Hₐ',
      'Find p-value and make decision',
      'Calculate standard error of difference'
    ],
    correctAnswer: ['B', 'D', 'A', 'C'],
    explanation: 'Steps: 1) State hypotheses, 2) Calculate SE of difference, 3) Compute t-statistic, 4) Find p-value and decide.'
  },
  {
    id: 'ht2-ord-2',
    type: 'ordering',
    question: 'For a paired t-test, order the steps:',
    options: [
      'Perform one-sample t-test on differences',
      'Calculate differences d = x₁ - x₂ for each pair',
      'Check if mean difference equals zero',
      'Calculate mean and SD of differences'
    ],
    correctAnswer: ['B', 'D', 'C', 'A'],
    explanation: 'Paired t-test: 1) Calculate differences for each pair, 2) Find mean and SD of differences, 3) Test if mean difference = 0, 4) Use one-sample t-test on differences.'
  },
  {
    id: 'ht2-ord-3',
    type: 'ordering',
    question: 'Rank these two-sample scenarios from MOST to LEAST statistical power:',
    options: [
      'Paired design, n=20 pairs',
      'Independent samples, n₁=n₂=40',
      'Independent samples, n₁=20, n₂=20',
      'Independent samples, n₁=10, n₂=10'
    ],
    correctAnswer: ['B', 'A', 'C', 'D'],
    explanation: 'Power depends on sample size and design. Independent with n=80 total has most power, then paired with n=20 (less variability), then independent n=40 total, then n=20 total.'
  },

  // MATCHING (2 questions)
  {
    id: 'ht2-match-1',
    type: 'matching',
    question: 'Match each scenario with the appropriate test:',
    options: [
      { id: 'A', left: 'Compare heights of men vs women', right: '' },
      { id: 'B', left: 'Compare blood pressure before/after medication', right: '' },
      { id: 'C', left: 'Compare test scores of twins', right: '' }
    ],
    choices: [
      'Independent samples t-test',
      'Paired t-test',
      'Paired t-test'
    ],
    correctAnswer: {
      A: 'Independent samples t-test',
      B: 'Paired t-test',
      C: 'Paired t-test'
    },
    explanation: 'Men vs women: independent groups. Before/after same person: paired. Twins: matched pairs (natural pairing).'
  },
  {
    id: 'ht2-match-2',
    type: 'matching',
    question: 'Match each test assumption with its description:',
    options: [
      { id: 'A', left: 'Independence', right: '' },
      { id: 'B', left: 'Normality', right: '' },
      { id: 'C', left: 'Equal variances', right: '' }
    ],
    choices: [
      'Observations from one sample do not affect the other',
      'Populations are approximately normal (or large n)',
      'Homogeneity of variance (homoscedasticity)'
    ],
    correctAnswer: {
      A: 'Observations from one sample do not affect the other',
      B: 'Populations are approximately normal (or large n)',
      C: 'Homogeneity of variance (homoscedasticity)'
    },
    explanation: 'Independence: samples don\'t influence each other. Normality: populations normal or CLT applies. Equal variances: σ₁² = σ₂² (can use pooled variance).'
  }
];

export default hypothesisTestingTwoSamplesQuestions;
