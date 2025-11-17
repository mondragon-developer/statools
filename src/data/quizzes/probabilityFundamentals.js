/**
 * Question Bank: Probability Fundamentals
 * 12 questions total: 4 MC, 3 MA, 3 Ordering, 2 Matching
 */

export const probabilityFundamentalsQuestions = [
  // MULTIPLE CHOICE (4 questions)
  {
    id: 'prob-mc-1',
    type: 'multipleChoice',
    question: 'What is the probability of rolling a 4 on a fair six-sided die?',
    options: ['1/6', '1/4', '1/2', '1/3'],
    correctAnswer: 'A',
    explanation: 'A fair die has 6 equally likely outcomes. The probability of any single outcome is 1/6.'
  },
  {
    id: 'prob-mc-2',
    type: 'multipleChoice',
    question: 'If P(A) = 0.4, what is P(not A)?',
    options: ['0.4', '0.6', '0.8', '1.0'],
    correctAnswer: 'B',
    explanation: 'The complement rule states P(not A) = 1 - P(A). Therefore, P(not A) = 1 - 0.4 = 0.6.'
  },
  {
    id: 'prob-mc-3',
    type: 'multipleChoice',
    question: 'Two events A and B are mutually exclusive. If P(A) = 0.3 and P(B) = 0.5, what is P(A or B)?',
    options: ['0.15', '0.8', '0.2', '0.65'],
    correctAnswer: 'B',
    explanation: 'For mutually exclusive events, P(A or B) = P(A) + P(B) = 0.3 + 0.5 = 0.8. There is no overlap to subtract.'
  },
  {
    id: 'prob-mc-4',
    type: 'multipleChoice',
    question: 'What is the probability of getting exactly 2 heads when flipping a fair coin 3 times?',
    options: ['1/8', '1/4', '3/8', '1/2'],
    correctAnswer: 'C',
    explanation: 'Possible outcomes: HHH, HHT, HTH, HTT, THH, THT, TTH, TTT (8 total). Exactly 2 heads: HHT, HTH, THH (3 outcomes). Probability = 3/8.'
  },

  // MULTIPLE ANSWER (3 questions)
  {
    id: 'prob-ma-1',
    type: 'multipleAnswer',
    question: 'Which of the following are valid probability values? (Select all that apply)',
    options: ['0', '0.75', '1.2', '1', '-0.3'],
    correctAnswer: ['A', 'B', 'D'],
    explanation: 'Probabilities must be between 0 and 1 (inclusive). Valid values: 0, 0.75, and 1. Invalid: 1.2 (> 1) and -0.3 (< 0).'
  },
  {
    id: 'prob-ma-2',
    type: 'multipleAnswer',
    question: 'Which statements about independent events are true? (Select all that apply)',
    options: [
      'P(A and B) = P(A) × P(B)',
      'The occurrence of one affects the other',
      'P(A|B) = P(A)',
      'They cannot occur at the same time'
    ],
    correctAnswer: ['A', 'C'],
    explanation: 'Independent events: P(A and B) = P(A) × P(B) and P(A|B) = P(A). The occurrence of one does NOT affect the other, and they CAN occur simultaneously.'
  },
  {
    id: 'prob-ma-3',
    type: 'multipleAnswer',
    question: 'Which scenarios represent mutually exclusive events? (Select all that apply)',
    options: [
      'Rolling an even number and rolling a 6',
      'Drawing a heart and drawing a king from a deck',
      'Being born in January and being born in February',
      'Passing a test and scoring above 90%'
    ],
    correctAnswer: ['C'],
    explanation: 'Mutually exclusive means cannot happen together. Only "born in January AND February" is impossible. You CAN roll a 6 (which is even), draw a king of hearts, or score 90%+ and pass.'
  },

  // ORDERING (3 questions)
  {
    id: 'prob-ord-1',
    type: 'ordering',
    question: 'Order these probability values from LEAST to MOST likely:',
    options: [
      'Impossible event (P = 0)',
      'Unlikely event (P = 0.2)',
      'Equally likely (P = 0.5)',
      'Certain event (P = 1)'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Probabilities range from 0 (impossible) to 1 (certain). Order: 0 < 0.2 < 0.5 < 1.'
  },
  {
    id: 'prob-ord-2',
    type: 'ordering',
    question: 'Order the steps to calculate P(A or B) for non-mutually exclusive events:',
    options: [
      'Subtract P(A and B)',
      'Add P(A) + P(B)',
      'Identify P(A), P(B), and P(A and B)',
      'Calculate final probability'
    ],
    correctAnswer: ['C', 'B', 'A', 'D'],
    explanation: 'Correct order: 1) Identify the probabilities, 2) Add P(A) + P(B), 3) Subtract the overlap P(A and B), 4) Calculate the final result.'
  },
  {
    id: 'prob-ord-3',
    type: 'ordering',
    question: 'Order these events by probability when drawing from a standard deck (LOWEST to HIGHEST):',
    options: [
      'Drawing an ace',
      'Drawing a heart',
      'Drawing a red card',
      'Drawing any card'
    ],
    correctAnswer: ['A', 'B', 'C', 'D'],
    explanation: 'Ace: 4/52, Heart: 13/52, Red card: 26/52, Any card: 52/52. Order: 4/52 < 13/52 < 26/52 < 52/52.'
  },

  // MATCHING (2 questions)
  {
    id: 'prob-match-1',
    type: 'matching',
    question: 'Match each probability term with its definition:',
    options: [
      { id: 'A', left: 'Sample Space', right: '' },
      { id: 'B', left: 'Event', right: '' },
      { id: 'C', left: 'Complement', right: '' },
      { id: 'D', left: 'Outcome', right: '' }
    ],
    choices: [
      'Set of all possible results',
      'Specific subset of sample space',
      'Event NOT occurring',
      'Single result of an experiment'
    ],
    correctAnswer: {
      A: 'Set of all possible results',
      B: 'Specific subset of sample space',
      C: 'Event NOT occurring',
      D: 'Single result of an experiment'
    },
    explanation: 'Sample space = all possibilities, Event = subset of sample space, Complement = opposite outcome, Outcome = individual result.'
  },
  {
    id: 'prob-match-2',
    type: 'matching',
    question: 'Match each probability rule with its formula:',
    options: [
      { id: 'A', left: 'Addition Rule (Mutually Exclusive)', right: '' },
      { id: 'B', left: 'Multiplication Rule (Independent)', right: '' },
      { id: 'C', left: 'Complement Rule', right: '' }
    ],
    choices: [
      'P(A or B) = P(A) + P(B)',
      'P(A and B) = P(A) × P(B)',
      'P(not A) = 1 - P(A)'
    ],
    correctAnswer: {
      A: 'P(A or B) = P(A) + P(B)',
      B: 'P(A and B) = P(A) × P(B)',
      C: 'P(not A) = 1 - P(A)'
    },
    explanation: 'Addition rule adds probabilities for "or" (mutually exclusive), Multiplication rule multiplies for "and" (independent), Complement subtracts from 1.'
  }
];

export default probabilityFundamentalsQuestions;
