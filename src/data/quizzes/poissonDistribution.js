/**
 * Question Bank: Poisson Distribution
 * 12 questions total: 4 MC, 3 MA, 3 Ordering, 2 Matching
 */

export const poissonDistributionQuestions = [
  // MULTIPLE CHOICE (4 questions)
  {
    id: 'poisson-mc-1',
    type: 'multipleChoice',
    question: 'A Poisson distribution is best used to model:',
    options: [
      'Number of successes in a fixed number of trials',
      'Number of events occurring in a fixed interval',
      'Time between successive events',
      'Probability of exactly two outcomes'
    ],
    correctAnswer: 'B',
    explanation: 'Poisson models the COUNT of events in a fixed interval (time, space, volume, etc.). Examples: emails per hour, accidents per day, customers per minute.'
  },
  {
    id: 'poisson-mc-2',
    type: 'multipleChoice',
    question: 'A call center receives an average of 3 calls per minute. What is the parameter λ (lambda)?',
    options: ['1', '3', '6', '60'],
    correctAnswer: 'B',
    explanation: 'λ (lambda) is the average rate of events per interval. Here, λ = 3 calls per minute. Note: If asked about a different interval (e.g., per 2 minutes), λ would change to 6.'
  },
  {
    id: 'poisson-mc-3',
    type: 'multipleChoice',
    question: 'In a Poisson distribution with λ = 4, what is the variance?',
    options: ['2', '4', '8', '16'],
    correctAnswer: 'B',
    explanation: 'For Poisson distribution: Mean = λ and Variance = λ. Both equal λ! So if λ = 4, then variance = 4 and standard deviation = √4 = 2.'
  },
  {
    id: 'poisson-mc-4',
    type: 'multipleChoice',
    question: 'The Poisson distribution is a good approximation to the binomial when:',
    options: [
      'n is large and p is close to 0.5',
      'n is large and p is small',
      'n is small and p is large',
      'n and p are both small'
    ],
    correctAnswer: 'B',
    explanation: 'Poisson approximates binomial when n is large (many trials) and p is small (rare events). Use λ = np as the Poisson parameter.'
  },

  // MULTIPLE ANSWER (3 questions)
  {
    id: 'poisson-ma-1',
    type: 'multipleAnswer',
    question: 'Which scenarios can be modeled with a Poisson distribution? (Select all that apply)',
    options: [
      'Number of typos per page in a book',
      'Number of goals scored in a soccer match',
      'Time until next customer arrives',
      'Number of car accidents per day on a highway',
      'Whether a student passes or fails'
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'Poisson models: typos per page ✓, goals per match ✓, accidents per day ✓. Time until next event is exponential (not Poisson). Pass/fail is binomial.'
  },
  {
    id: 'poisson-ma-2',
    type: 'multipleAnswer',
    question: 'Which properties are true for the Poisson distribution? (Select all that apply)',
    options: [
      'Mean = Variance',
      'It is a discrete distribution',
      'Values can be negative',
      'It is used for rare events'
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'Poisson: Mean = Variance = λ ✓, Discrete (counts) ✓, Models rare events ✓. Values CANNOT be negative (counts are ≥ 0).'
  },
  {
    id: 'poisson-ma-3',
    type: 'multipleAnswer',
    question: 'What conditions must be met for a Poisson process? (Select all that apply)',
    options: [
      'Events occur independently',
      'Events occur at a constant average rate',
      'Two events can occur at exactly the same time',
      'The probability of an event is proportional to interval length'
    ],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'Poisson requires: independence ✓, constant rate ✓, probability proportional to interval ✓. Events CANNOT occur simultaneously (two at exact same instant).'
  },

  // ORDERING (3 questions)
  {
    id: 'poisson-ord-1',
    type: 'ordering',
    question: 'Order the steps to calculate P(X = k) for a Poisson distribution:',
    options: [
      'Divide by k! (k factorial)',
      'Calculate e^(-λ)',
      'Calculate λ^k',
      'Multiply the results together'
    ],
    correctAnswer: ['B', 'C', 'A', 'D'],
    explanation: 'Poisson formula: P(X=k) = [e^(-λ) × λ^k] / k!. Order: 1) e^(-λ), 2) λ^k, 3) Divide by k!, 4) Multiply components.'
  },
  {
    id: 'poisson-ord-2',
    type: 'ordering',
    question: 'Order these Poisson distributions by their spread/variability (LEAST to MOST):',
    options: [
      'λ = 2 (SD = √2 ≈ 1.41)',
      'λ = 5 (SD = √5 ≈ 2.24)',
      'λ = 10 (SD = √10 ≈ 3.16)',
      'λ = 20 (SD = √20 ≈ 4.47)'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Variance = λ, so SD = √λ. Larger λ means more variability. Order: λ=2 (least variable) to λ=20 (most variable).'
  },
  {
    id: 'poisson-ord-3',
    type: 'ordering',
    question: 'A website gets 2 visitors per hour. Order from LOWEST to HIGHEST probability:',
    options: [
      'Exactly 0 visitors in 1 hour',
      'Exactly 1 visitor in 1 hour',
      'Exactly 2 visitors in 1 hour',
      'Exactly 3 visitors in 1 hour'
    ],
    correctAnswer: ['D', 'A', 'C', 'B'],
    explanation: 'With λ=2: P(0)≈0.135, P(1)≈0.271, P(2)≈0.271, P(3)≈0.180. The mode is at k=λ, so highest probabilities are near 2. Order: P(3) < P(0) < P(2) < P(1).'
  },

  // MATCHING (2 questions)
  {
    id: 'poisson-match-1',
    type: 'matching',
    question: 'Match each Poisson parameter with its meaning:',
    options: [
      { id: 'A', left: 'λ (lambda)', right: '' },
      { id: 'B', left: 'X', right: '' },
      { id: 'C', left: 'e', right: '' }
    ],
    choices: [
      'Average rate of events per interval',
      'Random variable (count of events)',
      'Mathematical constant (≈ 2.718)'
    ],
    correctAnswer: {
      A: 'Average rate of events per interval',
      B: 'Random variable (count of events)',
      C: 'Mathematical constant (≈ 2.718)'
    },
    explanation: 'λ = average/expected count per interval, X = actual count (random variable), e = Euler\'s number used in the formula.'
  },
  {
    id: 'poisson-match-2',
    type: 'matching',
    question: 'Match each scenario with its appropriate λ value:',
    options: [
      { id: 'A', left: '3 emails per hour, find P(X in 1 hour)', right: '' },
      { id: 'B', left: '3 emails per hour, find P(X in 2 hours)', right: '' },
      { id: 'C', left: '3 emails per hour, find P(X in 30 min)', right: '' }
    ],
    choices: [
      'λ = 3',
      'λ = 6',
      'λ = 1.5'
    ],
    correctAnswer: {
      A: 'λ = 3',
      B: 'λ = 6',
      C: 'λ = 1.5'
    },
    explanation: 'λ must match the interval: 1 hour → λ=3, 2 hours → λ=3×2=6, 30 min (0.5 hour) → λ=3×0.5=1.5. Adjust λ proportionally to the time interval.'
  }
];

export default poissonDistributionQuestions;
