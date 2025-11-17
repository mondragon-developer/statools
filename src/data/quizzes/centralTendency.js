/**
 * Question Bank: Measures of Central Tendency
 *
 * Contains 12 questions covering mean, median, mode, and range.
 * Question types: multipleChoice, multipleAnswer, ordering, matching
 *
 * Each question has:
 * - id: unique identifier
 * - type: question type
 * - question: the question text
 * - options: array of choices (for MC/MA) or items (for ordering/matching)
 * - correctAnswer: answer key
 * - explanation: why the answer is correct
 */

export const centralTendencyQuestions = [
  // MULTIPLE CHOICE QUESTIONS (4 questions)
  {
    id: 'ct-mc-1',
    type: 'multipleChoice',
    question: 'What is the mean of the following data set: 4, 8, 6, 5, 3, 7?',
    options: ['5.0', '5.5', '6.0', '6.5'],
    correctAnswer: 'B',
    explanation: 'The mean is calculated by summing all values (4+8+6+5+3+7 = 33) and dividing by the count (6). 33 ÷ 6 = 5.5'
  },
  {
    id: 'ct-mc-2',
    type: 'multipleChoice',
    question: 'Which measure of central tendency is most affected by outliers?',
    options: ['Mode', 'Median', 'Mean', 'Range'],
    correctAnswer: 'C',
    explanation: 'The mean is most affected by outliers because it includes all values in its calculation. Extreme values can significantly shift the mean, while the median only depends on the middle value(s).'
  },
  {
    id: 'ct-mc-3',
    type: 'multipleChoice',
    question: 'What is the median of: 12, 15, 8, 19, 22, 10, 13?',
    options: ['12', '13', '14', '15'],
    correctAnswer: 'B',
    explanation: 'First, order the data: 8, 10, 12, 13, 15, 19, 22. The median is the middle value, which is 13 (the 4th value out of 7).'
  },
  {
    id: 'ct-mc-4',
    type: 'multipleChoice',
    question: 'When is the median preferred over the mean?',
    options: [
      'When data is normally distributed',
      'When data contains outliers or is skewed',
      'When calculating percentages',
      'When all values are the same'
    ],
    correctAnswer: 'B',
    explanation: 'The median is preferred when data contains outliers or is skewed because it is resistant to extreme values and better represents the "typical" value in such distributions.'
  },

  // MULTIPLE ANSWER QUESTIONS (3 questions)
  {
    id: 'ct-ma-1',
    type: 'multipleAnswer',
    question: 'Which of the following are measures of central tendency? (Select all that apply)',
    options: ['Mean', 'Standard Deviation', 'Median', 'Mode', 'Variance'],
    correctAnswer: ['A', 'C', 'D'],
    explanation: 'Mean, median, and mode are the three main measures of central tendency. Standard deviation and variance are measures of dispersion/spread, not central tendency.'
  },
  {
    id: 'ct-ma-2',
    type: 'multipleAnswer',
    question: 'Which statements about the mean are true? (Select all that apply)',
    options: [
      'It uses all data values in calculation',
      'It is resistant to outliers',
      'It can be calculated for any quantitative data',
      'It is always a value in the dataset'
    ],
    correctAnswer: ['A', 'C'],
    explanation: 'The mean uses all data values in its calculation and can be computed for any quantitative data. However, it is NOT resistant to outliers and is NOT always a value that exists in the dataset.'
  },
  {
    id: 'ct-ma-3',
    type: 'multipleAnswer',
    question: 'In which scenarios would the mode be the most useful measure? (Select all that apply)',
    options: [
      'Finding the most popular shoe size in a store',
      'Calculating average test scores',
      'Identifying the most common blood type',
      'Determining the most frequent customer complaint'
    ],
    correctAnswer: ['A', 'C', 'D'],
    explanation: 'The mode is most useful for categorical data or when identifying the most common/frequent value. Shoe sizes, blood types, and complaint categories are all situations where mode is the best measure. Average test scores would use the mean.'
  },

  // ORDERING QUESTIONS (3 questions)
  {
    id: 'ct-ord-1',
    type: 'ordering',
    question: 'Order the steps to calculate the median (from first to last):',
    options: [
      'Arrange data in ascending order',
      'Count the number of values',
      'Find the middle value (or average of two middle values)',
      'Identify the dataset'
    ],
    correctAnswer: ['D', 'A', 'B', 'C'],
    explanation: 'Correct order: 1) Identify the dataset, 2) Arrange data in ascending order, 3) Count the number of values, 4) Find the middle value (or average of two middle values if even count).'
  },
  {
    id: 'ct-ord-2',
    type: 'ordering',
    question: 'Rank these measures from MOST to LEAST resistant to outliers:',
    options: [
      'Mean',
      'Median',
      'Mode',
      'Trimmed Mean'
    ],
    correctAnswer: ['C', 'B', 'D', 'A'],
    explanation: 'Mode (most resistant - only cares about frequency), Median (resistant - uses position), Trimmed Mean (somewhat resistant - removes extremes), Mean (least resistant - uses all values).'
  },
  {
    id: 'ct-ord-3',
    type: 'ordering',
    question: 'Order the steps to calculate the mean (from first to last):',
    options: [
      'Divide sum by the count',
      'Sum all values',
      'Count the number of values',
      'Collect the data'
    ],
    correctAnswer: ['D', 'B', 'C', 'A'],
    explanation: 'Correct order: 1) Collect the data, 2) Sum all values, 3) Count the number of values, 4) Divide sum by the count to get the mean.'
  },

  // MATCHING QUESTIONS (2 questions)
  {
    id: 'ct-match-1',
    type: 'matching',
    question: 'Match each measure with its definition:',
    options: [
      { id: 'A', left: 'Mean', right: '' },
      { id: 'B', left: 'Median', right: '' },
      { id: 'C', left: 'Mode', right: '' },
      { id: 'D', left: 'Range', right: '' }
    ],
    choices: [
      'Most frequently occurring value',
      'Middle value when ordered',
      'Arithmetic average',
      'Difference between max and min'
    ],
    correctAnswer: {
      A: 'Arithmetic average',
      B: 'Middle value when ordered',
      C: 'Most frequently occurring value',
      D: 'Difference between max and min'
    },
    explanation: 'Mean = arithmetic average (sum ÷ count), Median = middle value when data is ordered, Mode = most frequent value, Range = max - min (measure of spread).'
  },
  {
    id: 'ct-match-2',
    type: 'matching',
    question: 'Match each dataset characteristic with the relationship between mean and median:',
    options: [
      { id: 'A', left: 'Right-skewed distribution', right: '' },
      { id: 'B', left: 'Left-skewed distribution', right: '' },
      { id: 'C', left: 'Symmetric distribution', right: '' },
      { id: 'D', left: 'Distribution with high outliers', right: '' }
    ],
    choices: [
      'Mean ≈ Median',
      'Mean < Median',
      'Mean > Median',
      'Mean > Median'
    ],
    correctAnswer: {
      A: 'Mean > Median',
      B: 'Mean < Median',
      C: 'Mean ≈ Median',
      D: 'Mean > Median'
    },
    explanation: 'Right-skewed (high outliers) → Mean > Median. Left-skewed (low outliers) → Mean < Median. Symmetric → Mean ≈ Median. The mean is pulled toward the tail.'
  }
];

export default centralTendencyQuestions;
