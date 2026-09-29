// Calculator Coach decision flow. A node either asks a question (options point to
// other nodes) or is a result card. `stage` links the result to its journey stage.
export const COACH_START = 'start';

export const COACH_NODES = {
  start: {
    question: 'What are you trying to do with your data?',
    options: [
      { label: 'Describe or visualize my data', next: 'describe' },
      { label: 'Find the chance of something happening', next: 'chance' },
      { label: 'See whether a value is unusual', next: 'r-normal' },
      { label: 'Estimate a range for a population value', next: 'estimate' },
      { label: 'Test a claim or compare groups', next: 'test' },
      { label: 'Find a relationship or predict an outcome', next: 'r-regression' },
      { label: 'I am not sure - help me choose', next: 'unsure' },
    ],
  },
  unsure: {
    question: 'Which sentence sounds most like your goal?',
    options: [
      { label: 'I want to summarize what my data looks like', next: 'describe' },
      { label: 'I want to guess an unknown value for a whole population', next: 'estimate' },
      { label: 'I want to check whether a claim or difference is real', next: 'test' },
      { label: 'I have pairs of X and Y values and want to predict Y from X', next: 'r-regression' },
      { label: 'I want to know how likely an event is', next: 'chance' },
    ],
  },
  describe: {
    question: 'Is your data a list of numbers (such as score, price, or time) or categories (such as yes/no or genre)?',
    options: [
      { label: 'Numbers', next: 'describe-numbers' },
      { label: 'Categories', next: 'r-frequency-categorical' },
    ],
  },
  'describe-numbers': {
    question: 'Do you want summary numbers or a picture of the shape?',
    options: [
      { label: 'Summary numbers (average, spread, outliers)', next: 'r-statistics' },
      { label: 'A picture of the shape (table and histogram)', next: 'r-frequency-numeric' },
    ],
  },
  chance: {
    question: 'What kind of chance are you asking about?',
    options: [
      { label: 'One event or a combination of events (and, or, not, given)', next: 'r-probability' },
      { label: 'How many successes in a fixed number of yes/no trials', next: 'r-binomial' },
      { label: 'How many events happen in a fixed time or space', next: 'r-poisson' },
      { label: 'A value on a bell-shaped (normal) distribution', next: 'r-normal' },
    ],
  },
  estimate: {
    question: 'Is the value you want to estimate an average (a number) or a proportion (a percentage of yes answers)?',
    options: [
      { label: 'An average', next: 'r-ci-mean' },
      { label: 'A proportion', next: 'r-ci-proportion' },
    ],
  },
  test: {
    question: 'Are you looking at one group, two separate groups, or the same group measured twice?',
    options: [
      { label: 'One group compared to a target value', next: 'test-one' },
      { label: 'Two separate groups', next: 'test-two' },
      { label: 'The same people measured twice (before and after)', next: 'r-paired' },
    ],
  },
  'test-one': {
    question: 'Is your outcome a number or a category/proportion?',
    options: [
      { label: 'A number (such as score or time)', next: 'r-test-mean' },
      { label: 'A proportion (such as percent who said yes)', next: 'r-test-proportion' },
    ],
  },
  'test-two': {
    question: 'Is your outcome a number or a category/proportion?',
    options: [
      { label: 'A number (compare two averages)', next: 'r-two-means' },
      { label: 'A proportion (compare two rates)', next: 'r-two-proportions' },
    ],
  },

  'r-statistics': {
    result: {
      calculator: 'statistics',
      reason: 'You have a list of numbers and want to know what is typical and how spread out it is.',
      checklist: ['Your list of numbers, separated by commas, spaces, or new lines'],
      interpretation: 'Mean and median describe the center; if they are far apart, outliers or skew may be pulling the mean. Standard deviation is the typical distance from the mean.',
      stage: 2,
      resource: 'central-tendency',
    },
  },
  'r-frequency-numeric': {
    result: {
      calculator: 'frequency-distribution',
      reason: 'A frequency table and histogram show where your numbers cluster and whether the shape is skewed.',
      checklist: ['Your list of numbers', 'Optional: how many classes (groups) you want'],
      interpretation: 'Tall bars show where most values are. A long tail on one side means the data is skewed that way.',
      stage: 1,
      resource: 'guide-statistics',
    },
  },
  'r-frequency-categorical': {
    result: {
      calculator: 'frequency-distribution',
      reason: 'Categories are summarized by counting how many observations fall in each group.',
      checklist: ['Your list of category labels, or each category with its count'],
      interpretation: 'Relative frequency is each category\'s share of the total. A bar chart makes the comparison visual.',
      stage: 1,
      resource: 'guide-statistics',
    },
  },
  'r-probability': {
    result: {
      calculator: 'probability',
      reason: 'The probability calculator applies the rules for combining events: and, or, not, and "given that".',
      checklist: ['The probability of each event (between 0 and 1)', 'Whether the events are independent'],
      interpretation: 'A probability of 0.25 means the event happens about 1 time in 4 over many repetitions. It does not guarantee what happens next time.',
      stage: 3,
      resource: 'probability-fundamentals',
    },
  },
  'r-binomial': {
    result: {
      calculator: 'binomial',
      reason: 'You have a fixed number of independent yes/no trials with the same chance of success each time.',
      checklist: ['n: number of trials', 'p: chance of success on one trial', 'k: the number of successes you care about'],
      interpretation: 'P(X = k) is the chance of exactly k successes; P(X <= k) adds up everything from 0 to k.',
      stage: 3,
      resource: 'binomial',
    },
  },
  'r-poisson': {
    result: {
      calculator: 'poisson',
      reason: 'You are counting events in a fixed interval of time or space, at a known average rate.',
      checklist: ['The average number of events per interval (lambda)', 'The count you care about'],
      interpretation: 'The result is the chance of seeing that many events in one interval if events happen independently at that average rate.',
      stage: 4,
      resource: 'poisson',
    },
  },
  'r-normal': {
    result: {
      calculator: 'normal',
      reason: 'A z-score tells you how many standard deviations a value is from the mean, which shows how typical or rare it is.',
      checklist: ['The mean', 'The standard deviation', 'The value (or values) you want to check'],
      interpretation: 'A z-score near 0 is typical. Beyond about 2 or -2 is unusual (roughly the outer 5% for a normal distribution).',
      stage: 4,
      resource: 'normal',
    },
  },
  'r-ci-mean': {
    result: {
      calculator: 'hypothesis-test',
      reason: 'A confidence interval for a mean gives a range of plausible values for the population average.',
      checklist: ['Sample mean', 'Standard deviation', 'Sample size', 'Confidence level (for example 95%)'],
      interpretation: 'A 95% interval comes from a method that captures the true average in about 95% of samples. A wider interval means more uncertainty.',
      stage: 5,
      resource: 'confidence-intervals',
    },
  },
  'r-ci-proportion': {
    result: {
      calculator: 'hypothesis-test',
      reason: 'A confidence interval for a proportion gives a range of plausible values for the population percentage.',
      checklist: ['Sample proportion (successes divided by sample size)', 'Sample size', 'Confidence level'],
      interpretation: 'The interval shows the plausible range for the true percentage. Larger samples give narrower intervals.',
      stage: 5,
      resource: 'confidence-intervals',
    },
  },
  'r-test-mean': {
    result: {
      calculator: 'hypothesis-test',
      reason: 'You are comparing one group\'s average to a target value, which is a one-sample t-test (or z-test if the population SD is known).',
      checklist: ['Target (hypothesized) mean', 'Sample mean', 'Standard deviation', 'Sample size', 'Significance level'],
      interpretation: 'A small p-value means data this far from the target would be unlikely if the target were true. It is not the chance that the target is true.',
      stage: 5,
      resource: 'hypothesis-one',
    },
  },
  'r-test-proportion': {
    result: {
      calculator: 'hypothesis-test',
      reason: 'You are comparing one group\'s percentage to a target percentage, which is a one-proportion z-test.',
      checklist: ['Target (hypothesized) proportion', 'Sample proportion', 'Sample size', 'Significance level'],
      interpretation: 'A small p-value is evidence against the target proportion. Also look at the size of the difference, not only the p-value.',
      stage: 5,
      resource: 'hypothesis-one',
    },
  },
  'r-two-means': {
    result: {
      calculator: 'two-sample',
      reason: 'You are comparing average scores from two separate groups. The Two-Sample calculator runs a Welch t-test.',
      checklist: [
        'Each group\'s sample size, mean, and standard deviation',
        'Only raw values? Get those numbers for each group from the Mean, Median, Variance, SD Calculator first',
      ],
      interpretation: 'The p-value checks whether the difference in averages is larger than random sampling would usually produce. The interval shows how big the difference plausibly is.',
      stage: 5,
      resource: 'hypothesis-two',
    },
  },
  'r-two-proportions': {
    result: {
      calculator: 'two-sample',
      reason: 'You are comparing two rates (such as sign-up rates) from separate groups, which is a two-proportion z-test.',
      checklist: ['Each group\'s number of successes', 'Each group\'s sample size'],
      interpretation: 'A small p-value suggests the rates really differ. Check whether the difference is large enough to matter in practice.',
      stage: 5,
      resource: 'hypothesis-two',
    },
  },
  'r-paired': {
    result: {
      calculator: 'hypothesis-test',
      reason: 'Before-and-after data from the same people is paired. Subtract each person\'s before score from their after score, then run a one-sample t-test on those differences with a target mean of 0.',
      checklist: ['Before and after values for each person, in the same order', 'The list of differences (after minus before)', 'Mean, standard deviation, and count of the differences'],
      interpretation: 'If the average difference is far from 0 relative to its variation, there is evidence of a real change for these people. It does not by itself prove what caused the change.',
      stage: 5,
      resource: 'hypothesis-two',
    },
  },
  'r-regression': {
    result: {
      calculator: 'correlation-regression',
      reason: 'You have paired X and Y values. Correlation measures the relationship and the regression line predicts Y from X.',
      checklist: ['X values and Y values, in matching order', 'An X value you want a prediction for (optional)'],
      interpretation: 'r shows direction and strength; R-squared is the share of variation in Y explained by the line. Residuals show how far off predictions typically are. Correlation does not prove causation.',
      stage: 6,
      resource: 'regression-interpreting',
    },
  },
};
