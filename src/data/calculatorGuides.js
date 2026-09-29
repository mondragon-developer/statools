// Tutor context sent to the LLM for each calculator page; every label here must match the real UI exactly.
export const CALCULATOR_GUIDES = {
  'statistics': {
    name: 'Basic Statistics Calculator',
    purpose: 'Descriptive statistics (center, spread, quartiles, outliers) for a list of numbers, with a histogram, bar chart, or box plot. Can compare two datasets.',
    whenToUse: [
      'Raw data values and you need the mean, median, mode, SD, or quartiles',
      'Finding outliers (1.5 x IQR rule) or drawing a box plot',
      'Comparing two raw datasets, such as two classes',
    ],
    notFor: [
      'Testing if two group means differ significantly: use Two-Sample Comparison',
      'Frequency tables for categorical data: use Frequency Distribution',
    ],
    modes: [
      'Standard Deviation Formula: Sample (s) divides by n-1; Population (sigma) divides by N',
      'Compare with a second dataset (checkbox): adds a Dataset B box and an A vs B results table',
      'Chart Type: Histogram, Bar Chart (one bar per exact value), Box Plot. After calculating, Histogram adds Number of Classes (3-15), Lower Boundary of First Class, Class Width; Box Plot adds Show Outliers',
    ],
    inputs: [
      'Your Data (Dataset A when comparing) - up to 1000 values separated by commas, spaces, semicolons, or new lines, or via Upload CSV/TXT - the observations in the problem',
      'Dataset B - same format - the second group',
    ],
    steps: [
      'Enter values in Your Data, or click an Example Data Sets button',
      'Choose Sample (s) or Population (sigma)',
      'Optionally tick Compare with a second dataset and fill Dataset B',
      'Choose a Chart Type and click Calculate Statistics',
      'Read Statistical Measures and What Your Results Mean; Copy Results Table and Download Chart (PNG) export',
    ],
    outputs: [
      'Min, Max, Range',
      'Mean, Median, Mode - Mode can say "No mode"',
      'Std Dev (s or sigma), Variance - typical distance from the mean, and its square',
      'Q1, Q3, IQR - quartiles and the middle-50% spread',
      'Outlier Boundaries Lower/Upper - Q1 - 1.5 IQR and Q3 + 1.5 IQR; outliers show red',
      'What Your Results Mean - shape (skew), variability, outlier count',
      'Frequency Distribution Table (Histogram) - Class, Frequency, Relative (%), Cumulative (%), Midpoint',
    ],
    mistakes: [
      'Choosing Population for sample data',
      'Typing value-count pairs instead of listing each value as often as it occurs',
      'Lower Boundary of First Class above the minimum drops small values from the histogram',
      'Using the mean as typical for skewed data instead of the median',
    ],
    starters: [
      'How do I use this calculator?',
      'Should I choose Sample or Population standard deviation?',
      'How do I tell if my data has outliers?',
    ],
  },

  'probability': {
    name: 'Comprehensive Probability Calculator',
    purpose: 'Four tabs: probability rules for two events, counting (combinations, permutations, factorials), expected value, and a dice simulator. Results update live; there is no Calculate button.',
    whenToUse: [
      'Given P(A), P(B), P(A and B), find P(not A), P(A or B), P(A|B)',
      'Counting selections or arrangements',
      'Expected value of a game or bet',
    ],
    notFor: [
      'k successes in n trials: use Binomial',
      'Areas under a bell curve: use Normal Distribution',
    ],
    modes: [
      'Probability Rules tab: How Events Relate menu is Independent (like coin flips), Dependent (like drawing cards), or Mutually Exclusive (like being in two places); Mutually Exclusive hides the intersection slider',
      "Combinatorics tab: Calculation Type is Combination - Order Doesn't Matter, Permutation - Order Matters, or Factorial - Arrange Everything; With replacement checkbox; Quick Examples buttons",
      'Expected Value tab: rows of Value ($) and Probability; + Add Another Outcome adds a row',
      'Dice Simulator tab: Number of dice (1-6), Roll Dice!, Roll History, chart of sums',
    ],
    inputs: [
      'P(A), P(B) sliders - 0 to 1, steps of 0.01 - stated chances',
      'P(A and B) slider (shown with the intersection symbol) - chance of both, max is the smaller of P(A), P(B); NOT automatic, so for Independent set it to P(A) x P(B)',
      'Total items (n) slider 1-20, Items to select (r) slider 0 to n - pool size and number chosen',
      'Value ($) and Probability per outcome - payoff (negative for a loss) and its chance',
    ],
    steps: [
      'Pick the tab that matches the question',
      'Rules: set P(A), P(B), How Events Relate, then P(A and B)',
      'Combinatorics: choose Calculation Type, set n and r, tick With replacement if items can repeat',
      'Expected Value: enter payoffs and probabilities until they sum to 1.00',
      'Read results; the circular Reset button by each tab title restores defaults',
    ],
    outputs: [
      'Calculated Probabilities - P(not A), P(not B), P(A or B) (union symbol on screen), P(A|B), P(B|A) with arithmetic; a total check says "Adds to 1.00" or "Check values"',
      'Combinatorics Result - the count, formula such as C(n,r), Real-World Meaning',
      'Expected Value - E(X) in dollars with a What This Means note',
      'Dice - Result sum, Roll History, frequency chart',
    ],
    mistakes: [
      'Choosing Independent but not setting P(A and B) to P(A) x P(B)',
      'Mutually Exclusive with P(A) + P(B) above 1',
      'Combination when order matters, or Permutation when it does not',
      'Expected Value probabilities not summing to 1, or losses entered as positive',
    ],
    starters: [
      'How do I use this calculator?',
      'How do I know if events are independent or mutually exclusive?',
      'When do I use a combination instead of a permutation?',
    ],
  },

  'normal': {
    name: 'Normal Distribution Calculator',
    purpose: 'Finds areas (probabilities) under a normal curve with any mean and SD, and works backward from a probability to cutoff values. Results update live.',
    whenToUse: [
      'Normal variable with known mean and SD: find P(X < a), P(X > a), P(a < X < b)',
      'Finding a percentile or cutoff, such as the top 10%',
    ],
    notFor: [
      'Testing a claim about a mean or proportion: use Hypothesis Test',
      'Counting successes in n trials: use Binomial',
    ],
    modes: [
      'Calculation Mode: Value -> Probability finds an area; Probability -> Value finds cutoffs (the screen shows an arrow)',
      'Input Type (Value mode): X values (actual values) or Z-scores (standardized)',
      'Calculation Type (Value mode): P(X <= value) - Left tail; P(X > value) - Right tail; P(a < X < b) - Between two values; P(X < a or X > b) - Outside interval',
      'Checkboxes: Show Percentiles Table and Show sigma markers on chart',
    ],
    inputs: [
      'Mean (mu) - any number - the stated average',
      'Standard Deviation (sigma) - must be above 0 - the stated SD (not the variance)',
      'Value (X or Z), or First Value and Second Value for Between/Outside - the cutoff(s) in the question; order of the two does not matter',
      'Target Probability (Probability mode) - slider or box as a decimal from 0.001 to 0.999 (the label shows a percent) - e.g. 0.10 for the top 10%',
    ],
    steps: [
      'Enter Mean and Standard Deviation, or click a Real-World Examples card (e.g. IQ Scores, Standard Normal)',
      'Choose the Calculation Mode',
      'Value mode: pick Input Type and Calculation Type, then enter the value(s)',
      'Probability mode: set Target Probability',
      'Read Calculation Results; check the amber shaded area matches the question',
    ],
    outputs: [
      'Main result - probability (4 decimals) and percent, labeled like P(X <= 110)',
      'Z-score (or Z-score 1 and 2) - SDs from the mean',
      'Left tail value / Right tail value (Probability mode) - X with the target probability below / above it, plus Left Z-score and Right Z-score',
      '68-95-99.7 Rule ranges and Key Percentiles (1st to 99th)',
    ],
    mistakes: [
      'Entering the variance instead of the SD',
      'Left tail chosen when the question says more than or at least',
      'Typing 10 instead of 0.10 for Target Probability',
      'For the top 10%, reading Left tail value instead of Right tail value',
      'Input Type left on X values while typing z-scores',
    ],
    starters: [
      'How do I use this calculator?',
      'How do I find the value that cuts off the top 5%?',
      'What does the z-score tell me?',
    ],
  },

  'binomial': {
    name: 'Binomial Distribution Calculator',
    purpose: 'Gives the probability of a number of successes in a fixed number of independent yes/no trials with the same success chance, plus mean, variance, SD, and a full probability table. Results update live.',
    whenToUse: [
      'Fixed n trials, two outcomes each, constant p, independent trials',
      'Questions about exactly, at most, or at least k successes',
      'Checking whether an observed count is unusual',
    ],
    notFor: [
      'Events counted over time or space with no fixed n: use Poisson',
      'More than 50 trials or a continuous measurement: use Normal Distribution',
      'Testing a claimed proportion with a p-value: use Hypothesis Test',
    ],
    modes: [
      'Probability Type radios: P(X = x) - Exactly x; P(X <= x) - At most x; P(X >= x) - At least x',
    ],
    inputs: [
      'Number of trials (n) slider - whole number 1 to 50 - how many times the experiment repeats',
      'Probability of success (p) slider - 0 to 1 in steps of 0.01 - chance of success on one trial (35% is 0.35)',
      'X value slider - 0 to n - the number of successes asked about',
    ],
    steps: [
      'Set n, p, and X value with the sliders (arrow keys fine-tune), or click a Common Examples card',
      'Choose the Probability Type that matches the wording',
      'Read Results and The Math, Step by Step',
      'Click Show Probability Table for sums not covered by the three types',
      'Optional: View Larger Chart, Copy Results, Download PNG',
    ],
    outputs: [
      'Selected probability - decimal, percent, and roughly 1 in N',
      'Exactly / At most / At least rows - all three probabilities for the current x',
      'Mean (mu) = np, Variance (sigma^2) = np(1-p), Standard Dev (sigma)',
      'Distribution Visualization - a bar for each k; amber bars are included in the answer',
      'Probability table - P(X = k), P(X <= k), P(X >= k) for every k',
      'What Your Results Mean - plain words, whether x is unusual (over 2 SD from the mean), skew, and whether a normal approximation is reasonable',
    ],
    mistakes: [
      'Strict inequalities: fewer than 5 is At most 4, and more than 5 is At least 6',
      'Between has no option: use At most (upper) minus At most (lower - 1), or add rows of the table',
      'Entering a percent for p, or needing a p with more than 2 decimals',
      'Using binomial when trials are not independent or n is not fixed',
    ],
    starters: [
      'How do I use this calculator?',
      'How do I find P(X < 4) or P(X > 7)?',
      'How do I know if a problem is binomial?',
    ],
  },

  'poisson': {
    name: 'Poisson Distribution Calculator',
    purpose: 'Finds the probability of a given number of events in a fixed interval when events happen independently at a known average rate (lambda). Results update live.',
    whenToUse: [
      'Counts per time, area, or volume: calls per hour, defects per batch, accidents per month',
      'Only an average rate is given, with no fixed number of trials',
      'Modeling rare events',
    ],
    notFor: [
      'A fixed number of trials with success probability p: use Binomial',
      'Continuous measurements like time or weight: use Normal Distribution',
    ],
    modes: [
      'Probability Type radios: P(X = x) - Exactly x events; P(X <= x) - At most x events; P(X >= x) - At least x events',
      'Show Normal Approximation checkbox - appears only when lambda is above 10; overlays a normal curve with mean and variance lambda',
    ],
    inputs: [
      'Rate parameter (lambda) slider - 0.1 to 30 in steps of 0.1 - average events per interval, rescaled to the interval asked (3 per hour means 6 per 2 hours)',
      'Target value (x) slider - whole number from 0 to the shown maximum (at least 20) - the count in the question',
    ],
    steps: [
      'Rescale the rate to the interval in the question',
      'Set Rate parameter (lambda), or click a Real-World Examples card (Call Center, Quality Control, Store Arrivals, Email Traffic, Traffic Safety, Server Errors), which also sets x near lambda',
      'Set Target value (x)',
      'Choose the Probability Type',
      'Read Calculation Results; amber bars on the chart are the outcomes included',
    ],
    outputs: [
      'Probability - decimal (4 places) and percent chance',
      'Mean (mu), Variance (sigma^2), Std Dev (sigma) - mean and variance both equal lambda; SD is the square root of lambda',
      'Distribution Visualization - a bar for each k, with the most likely k noted in the chart guide',
    ],
    mistakes: [
      'Not rescaling lambda to the interval in the question',
      'Strict inequalities: fewer than 3 is At most 2, and more than 3 is At least 4',
      'Between has no option: subtract two At most results',
      'Using Poisson when there is a fixed number of trials',
    ],
    starters: [
      'How do I use this calculator?',
      'How do I change the rate when the time interval is different?',
      'How is Poisson different from binomial?',
    ],
  },

  'hypothesis-test': {
    name: 'Hypothesis Testing Calculator',
    purpose: 'Runs a one-sample test for a proportion (z-test) or a mean (z or t) against a claimed value, giving the test statistic, critical value, p-value, decision, and an optional confidence interval.',
    whenToUse: [
      'Testing a claim about one population proportion (is the coin fair, is support above 50%)',
      'Testing a claim about one population mean from summary statistics',
    ],
    notFor: [
      'Comparing two groups: use Two-Sample Comparison',
      'Only raw data: get the mean and SD from Basic Statistics first',
    ],
    modes: [
      'Test Type: Proportion Test (Z-test) or Mean Test (Z or t-test); switching resets the inputs',
      'Tail Type: Two-Tailed (not equal), Right-Tailed (>), Left-Tailed (<); the Your Hypotheses box shows H0 and H1 live',
      'Population Standard Deviation (Mean Test): Known (sigma) - Use Z, or Unknown (s) - Use t',
      'Checkboxes: Include Confidence Interval, Show Error Type Explanation',
    ],
    inputs: [
      'Sample Proportion (p-hat) - decimal 0 to 1; compute x/n yourself (58 of 100 is 0.58)',
      'Hypothesized Proportion (p0) - the claimed value in H0, strictly between 0 and 1',
      'Sample Mean (x-bar) and Hypothesized Mean (mu0) - the sample average and the claimed mean',
      'Standard Deviation (sigma or s) - above 0',
      'Sample Size (n) - at least 1 (proportion) or 2 (mean)',
      'Significance Level (alpha) - between 0 and 1, usually 0.05',
    ],
    steps: [
      'Write H0 and H1 from the claim',
      'Choose Test Type, then the Tail Type that matches H1',
      'Fill in Input Values (Mean Test: pick Known or Unknown)',
      'Click Calculate Test (again after any change)',
      'Read Statistical Decision, Test Results, and Conditions Check; Try a Real Scenario loads examples',
    ],
    outputs: [
      'Test Statistic - z or t, standard errors away from H0',
      'Critical Value(s) - two-tailed shows only the negative cutoff; reject when |statistic| exceeds it',
      'P-Value - chance of a result this extreme if H0 is true; reject when p < alpha',
      'Degrees of Freedom (t only); CI - two-sided (1 - alpha) interval',
      'Statistical Decision - Reject or Fail to reject, plain-words conclusion',
      'Conditions Check - np0 and n(1-p0) at least 10, or n at least 30',
      'Chart - red rejection region, teal acceptance region, amber triangle is the statistic',
    ],
    mistakes: [
      'Entering a count or percent (58 or 58%) instead of p-hat 0.58',
      'Choosing the tail from the data instead of from the claim in H1',
      'Choosing Known (sigma) when the SD came from the sample',
      'Saying accept H0 or proves H1',
    ],
    starters: [
      'How do I use this calculator?',
      'How do I pick two-tailed, right-tailed, or left-tailed?',
      'What does the p-value mean for my decision?',
    ],
  },

  'two-sample': {
    name: 'Two-Sample Comparison Calculator',
    purpose: "Tests whether two independent groups differ, comparing two means with Welch's t-test or two proportions with a pooled z-test, and gives a confidence interval for the difference.",
    whenToUse: [
      'Two separate groups with summary statistics: drug vs placebo, method A vs method B',
      'Comparing two success rates, such as an A/B test',
      "Judging practical size of a difference with Cohen's d",
    ],
    notFor: [
      'One group vs a claimed value: use Hypothesis Test',
      'Before/after data on the same subjects (paired): not supported here',
      'Only raw data: get each mean and SD from Basic Statistics first',
    ],
    modes: [
      "What are you comparing?: Two Means (Welch's t-test) or Two Proportions (z-test); switching resets the inputs",
      'Tail Type: Two-Tailed (Group 1 not equal Group 2), Right-Tailed (Group 1 > Group 2), Left-Tailed (Group 1 < Group 2)',
    ],
    inputs: [
      'Two Means, per group: Mean (x-bar), Std Dev (s) above 0, Sample Size (n) at least 2',
      'Two Proportions, per group: Successes (x) as a COUNT from 0 to n, and Sample Size (n); p-hat appears below the fields',
      'Significance Level (alpha) - between 0 and 1, usually 0.05',
    ],
    steps: [
      'Decide which group is Group 1; the difference is Group 1 minus Group 2',
      'Choose What are you comparing? and Tail Type',
      'Enter both groups and alpha',
      'Click Compare Groups, and click it again after any change',
      'Read Statistical Decision, Test Results, CI insight, and Conditions Check. Try a Real Scenario has New Drug vs Placebo, Two Teaching Methods, A/B Website Test, Two Battery Brands',
    ],
    outputs: [
      'Group 1, Group 2, Difference (1 - 2) - proportions are shown as percents',
      'Test Statistic (t or z) and P-Value',
      'Degrees of Freedom - Welch approximation, often not a whole number (means only)',
      'Critical Value - two-tailed shows the negative cutoff',
      'CI for Difference - if 0 is inside, no difference is plausible',
      "Effect Size (Cohen's d) - means only: negligible, small, medium, or large",
      'Statistical Decision and Conditions Check (large samples or normality; at least 10 successes and failures per group)',
    ],
    mistakes: [
      'Typing proportions (0.24) into Successes instead of counts (48)',
      'Using it for paired before/after data',
      'Tail direction reversed relative to which group is Group 1',
      "Calling a significant result important without checking Cohen's d",
    ],
    starters: [
      'How do I use this calculator?',
      'Which group should be Group 1?',
      'What does it mean if the confidence interval contains 0?',
    ],
  },

  'correlation-regression': {
    name: 'Correlation & Linear Regression Calculator',
    purpose: 'Measures the linear relationship between paired X and Y data (r and R-squared), fits the least-squares regression line, and predicts Y from X.',
    whenToUse: [
      'Paired quantitative data where you want the strength and direction of the relationship',
      'Finding and interpreting the slope and intercept of a regression line',
      'Predicting Y for a given X',
    ],
    notFor: [
      'Comparing the means of two groups: use Two-Sample Comparison',
      'Summarizing a single variable: use Basic Statistics',
    ],
    modes: [
      'Show Residual Plot checkbox (in Visualization) - adds a plot of residuals vs X',
    ],
    inputs: [
      'X Variable (Independent) - explanatory values separated by commas, spaces, or new lines, up to 1000 - the predictor',
      'Y Variable (Dependent) - response values in the same order and the same count as X',
      'Enter X value (under Make Predictions) - an X to plug into the equation',
    ],
    steps: [
      'Enter X and Y in matching order, or click a Sample Datasets card (Study Hours vs Exam Scores, Temperature vs Ice Cream Sales, Price vs Demand, Age vs Reaction Time)',
      'Check that the two Values counters match',
      'Click Calculate (Clear empties everything)',
      'Read Statistical Results and the Regression Equation',
      'Type an X under Make Predictions and click Predict Y',
      'Optionally tick Show Residual Plot and read the Interpretation Guide',
    ],
    outputs: [
      'Sample Size - number of pairs',
      'Correlation (r) - from -1 to +1, with a label such as Strong Positive',
      'R-squared (percent and decimal) - share of the variation in Y explained by X',
      'Mean of X, Mean of Y',
      'Standard Error - typical distance of points from the line',
      'Regression Equation y-hat = a + (b)x - a is the intercept, b the slope',
      'Predicted Y value; Scatter Plot with Regression Line; Residual Plot',
    ],
    mistakes: [
      'Swapping X and Y, which changes the equation',
      'Lists of different lengths or pairs out of order',
      'Predicting far outside the range of the X data (extrapolation); the tool does not warn',
      'Reading correlation as causation',
      'Separating values with semicolons; use commas, spaces, or new lines',
    ],
    starters: [
      'How do I use this calculator?',
      'How do I interpret the slope and intercept?',
      'What is the difference between r and R-squared?',
    ],
  },

  'frequency-distribution': {
    name: 'Frequency Distribution Calculator',
    purpose: 'Builds a frequency distribution table for discrete, continuous, or categorical data, with a bar chart, histogram, frequency polygon, or Pareto chart.',
    whenToUse: [
      'Organizing raw data into a frequency table',
      'Grouping continuous data into classes',
      'Counting categories such as survey answers',
    ],
    notFor: [
      'Mean, median, SD, quartiles, box plots: use Basic Statistics',
    ],
    modes: [
      'Data Type: Discrete (Numeric) - one row per value; Continuous (Numeric) - class intervals; Categorical (Text) - one row per category, sorted most to least common',
      'Input Mode (Categorical): Raw Data (comma-separated) or Category Counts (name and count rows, Add Category, max 10)',
      "Auto-calculate (Sturges' Rule) checkbox (Continuous): on picks the classes for you; off shows Number of Classes, Class Width, Minimum Value (Start)",
      'Visualization Options (Continuous): Histogram Only, Frequency Polygon Only, Both (Histogram + Polygon)',
    ],
    inputs: [
      'Enter Data - up to 1000 values separated by commas or new lines (numbers may also use spaces) - the raw list',
      'Category name and Count (Category Counts mode) - positive whole-number counts',
      'Number of Classes, Class Width, Minimum Value (Start) - manual classes; start at or below the smallest value',
    ],
    steps: [
      'Pick the Data Type, or click a Sample Datasets button (it sets the type)',
      'Categorical: choose the Input Mode',
      'Enter the data',
      'Continuous: keep Auto-calculate or untick it and set classes, width, and start',
      'Click Calculate Distribution (Clear resets)',
      'Read the table, the chart, and Interpretation Examples from Your Data',
    ],
    outputs: [
      'Summary Statistics - Sample Size (n), Range, Min - Max, Mean, or Number of Categories; Number of Classes and Class Width (Continuous)',
      'Frequency Distribution Table - Midpoint (Continuous), Frequency (f), Relative Freq, Percentage (%), Cumulative Freq, Cumulative %, Cumulative Rel. Freq, Total row',
      'Class intervals [lower, upper) include the lower limit; the last class includes its upper limit too',
      'Charts - Bar Chart (Discrete, Categorical), histogram/polygon (Continuous), Pareto Chart (Categorical)',
      'Quick Stats Check - totals should equal n, 1.0000, 100%',
    ],
    mistakes: [
      'Continuous chosen for counts like number of children (use Discrete)',
      'Manual classes that miss data; an orange warning says values fall outside the intervals',
      'Categories ignore case (yes = Yes) but typos become new categories; over 10 categories is an error',
      'A Minimum Value (Start) of 0 is treated as blank and falls back to the data minimum',
    ],
    starters: [
      'How do I use this calculator?',
      'Should my data be discrete or continuous?',
      'How do I choose the number of classes and class width?',
    ],
  },
};
