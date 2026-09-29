// All datasets in the journey are fictional and made up for teaching.
const stage2 = {
  id: 2,
  slug: 'finding-the-baseline',
  title: 'Finding the Baseline',
  theme: 'Descriptive Statistics & Data Quality',
  question: 'What is typical, and what is unusually different?',
  detectiveCase:
    'A resume-screening system summarizes the salary expectations of job applicants. Most people ask for about $50,000 to $70,000 a year, but a few ask for $180,000 or more, and the "average" now looks unrealistic. What should the system call normal?',
  skills: [
    'Mean, median, and mode',
    'Range',
    'Variance and standard deviation',
    'Outliers',
    'Distribution shape',
  ],
  aiConnection:
    'Before many AI models are trained, data is inspected, cleaned, and often scaled. Outliers and unbalanced data can pull a model in misleading directions. A model learns from the examples it is given, including their mistakes and unusual values.',
  badge: {
    name: 'Baseline Builder',
    description: 'You can describe what is typical in a dataset, measure how spread out it is, and spot values that change the picture.',
  },
  coachPrompt: "Averages tell part of the story. Let's check whether a few unusual values are changing the picture.",
  calculators: ['statistics'],
  resources: ['central-tendency', 'deviation', 'guide-statistics'],
  lessons: [
    {
      id: 's2-l1',
      title: 'What Is Typical?',
      minutes: 12,
      objective: 'Find the mean, median, and mode of a small dataset and explain what each one means.',
      hook:
        'A recruiter asks the screening system a simple question: "What salary do applicants usually expect?" There is more than one honest way to answer. Each one is a different kind of "typical".',
      concept: {
        paragraphs: [
          'The center of a dataset is a single number that describes a typical value. Statistics has three common ways to measure it.',
          'The mean is the everyday average: add up all the values and divide by how many there are.',
          'The median is the middle value after you sort the data from smallest to largest. With an even number of values, it is the average of the two middle values.',
          'The mode is the value that appears most often. It is the only one of the three that also works for categories, like "remote" or "office".',
          'Here are the salary expectations of 7 applicants, in thousands of dollars per year (so 55 means $55,000). Mean: 392 / 7 = 56. Median: the 4th value in order, 55. Mode: 55, because it appears twice.',
        ],
        table: {
          caption: 'Salary expectations of 7 fictional applicants (thousands of dollars per year)',
          headers: ['Applicant', 'Expected salary'],
          rows: [
            ['A', '48'],
            ['B', '52'],
            ['C', '55'],
            ['D', '55'],
            ['E', '58'],
            ['F', '61'],
            ['G', '63'],
          ],
        },
        keyTerms: [
          { term: 'Mean', definition: 'The sum of all values divided by the number of values.' },
          { term: 'Median', definition: 'The middle value once the data is sorted. Half the values are below it and half are above.' },
          { term: 'Mode', definition: 'The value that appears most often. A dataset can have one mode, several, or none.' },
        ],
      },
      ai: {
        paragraphs: [
          'Data pipelines use these summaries all the time. For example, when a value is missing, some systems fill the gap with the mean or the median of that column.',
          'That choice is not automatic. If a column has a few extreme values, filling gaps with the mean can invent salary expectations that almost nobody actually has.',
        ],
      },
      practice: [
        {
          id: 's2-l1-p1',
          question: 'Using the table of 7 applicants, what is the mean salary expectation?',
          options: ['55', '56', '58', '392'],
          answer: 1,
          hints: ['Add all 7 values first.', 'The sum is 392. Now divide by the number of applicants.'],
          explanation: '48 + 52 + 55 + 55 + 58 + 61 + 63 = 392, and 392 / 7 = 56.',
        },
        {
          id: 's2-l1-p2',
          question: 'Four applicants expect 60, 50, 70, and 65. What is the median?',
          options: ['60', '61.25', '62.5', '65'],
          answer: 2,
          hints: ['Sort the values from smallest to largest first.', 'With 4 values, the median is the average of the 2nd and 3rd values.'],
          explanation: 'Sorted: 50, 60, 65, 70. The two middle values are 60 and 65, so the median is (60 + 65) / 2 = 62.5. (61.25 is the mean.)',
        },
        {
          id: 's2-l1-p3',
          question: 'Applicants also choose a preferred work style: remote, hybrid, or office. Which measure of center can summarize this variable?',
          options: ['Mean', 'Median', 'Mode', 'Standard deviation'],
          answer: 2,
          hints: ['Work style is a category, not a number. Can you add or sort categories?'],
          explanation: 'You cannot average or put categories like these in numerical order, but you can count which one appears most often. That is the mode.',
        },
      ],
      mission: {
        calculator: 'statistics',
        task: 'Find the mean, median, and mode for a larger group of applicants.',
        dataLabel: 'Salary expectations of 15 applicants (thousands of dollars per year)',
        data: '45, 48, 50, 52, 52, 55, 55, 55, 57, 58, 60, 62, 64, 66, 70',
        steps: [
          'Open the calculator and paste the 15 values.',
          'Press Calculate Statistics.',
          'Find the Mean, Median, and Mode in the results.',
        ],
        lookFor: 'Are the mean, median, and mode close to each other or far apart?',
        interpretation: 'The mean is 56.6, the median is 55, and the mode is 55. All three are close, which tells you there are no extreme values pulling the center in one direction. Any of them is a fair "typical" salary here.',
      },
      reflection: {
        prompt: 'In one sentence, explain the difference between the mean and the median.',
        sampleAnswer: 'The mean adds up every value and divides by the count, while the median is simply the middle value once the data is sorted.',
      },
    },
    {
      id: 's2-l2',
      title: 'The Pull of an Outlier',
      minutes: 12,
      objective: 'Show how one extreme value changes the mean much more than the median, and choose the better summary.',
      hook:
        'An eighth applicant joins the group and asks for $250,000 a year. Suddenly the system reports that applicants "usually" expect $80,000. Did everyone else change their minds? No. One clue is shouting over the others.',
      concept: {
        paragraphs: [
          'An outlier is a value that is far away from the rest of the data. It might be a typing mistake, or it might be real but rare.',
          'The mean uses every value, so one huge number pulls it toward itself. The median only cares about the middle position, so it barely moves.',
          'In the table, adding one expectation of 250 raises the mean from 56 to 80.25. The median only moves from 55 to 56.5. Now 7 of the 8 applicants expect less than the "average".',
          'A summary that resists outliers is called resistant. The median is resistant; the mean is not. When a few extreme values are present, the median is usually the better description of a typical value.',
        ],
        table: {
          caption: 'The 7 applicants from Lesson 1, before and after adding one applicant who expects 250',
          headers: ['Measure', 'Before (7 applicants)', 'After (8 applicants)'],
          rows: [
            ['Mean', '56', '80.25'],
            ['Median', '55', '56.5'],
            ['Mode', '55', '55'],
          ],
        },
        keyTerms: [
          { term: 'Outlier', definition: 'A value that is far away from most of the other values.' },
          { term: 'Resistant measure', definition: 'A summary that changes very little when a few extreme values are added.' },
        ],
      },
      ai: {
        paragraphs: [
          'A model learns from the examples it is given, including their mistakes and unusual values. If a few extreme salaries are in the training data, a system that predicts "expected salary" can be pulled upward for everyone.',
          'This is one reason data scientists compare the mean and the median of each column before training. A big gap between them is an early warning sign.',
        ],
      },
      practice: [
        {
          id: 's2-l2-p1',
          question: 'After the 250 is added, how many of the 8 applicants expect less than the new mean of 80.25?',
          options: ['1', '4', '7', '8'],
          answer: 2,
          hints: ['Only one applicant expects more than 80.25. Who is it?'],
          explanation: 'Every applicant except the one asking for 250 is below 80.25, so 7 of 8 are below the mean. That is why the mean no longer feels "typical".',
        },
        {
          id: 's2-l2-p2',
          question: 'The system must report one "typical" salary expectation, and the data contains a few extremely high requests. Which measure should it use?',
          options: ['Mean', 'Median', 'Maximum', 'Range'],
          answer: 1,
          hints: ['Which measure depends on the middle position rather than on the size of every value?'],
          explanation: 'The median is resistant to extreme values, so a few very high requests do not drag it upward the way they drag the mean.',
        },
        {
          id: 's2-l2-p3',
          question: 'Start again from the original 7 applicants (48, 52, 55, 55, 58, 61, 63). Which change would move the median the least?',
          options: [
            'Changing the largest value from 63 to 630',
            'Removing the two smallest values',
            'Adding three new values above 100',
            'Changing the middle value from 55 to 60',
          ],
          answer: 0,
          hints: ['The median depends on which value sits in the middle position.', 'Does making the biggest value even bigger change which value is in the middle?'],
          explanation: 'Making the largest value bigger does not change the order of the middle values, so the median stays exactly the same. The other changes shift or replace the middle value.',
        },
      ],
      mission: {
        calculator: 'statistics',
        task: 'Compare the results before and after adding one extreme salary expectation.',
        dataLabel: 'Salary expectations of 15 applicants (thousands of dollars per year)',
        data: '45, 48, 50, 52, 52, 55, 55, 55, 57, 58, 60, 62, 64, 66, 70',
        steps: [
          'Paste the 15 values and press Calculate Statistics. Write down the mean, median, and standard deviation.',
          'Add one more value, 240, to the end of the list (type a comma, then 240).',
          'Press Calculate Statistics again and compare the new results with the ones you wrote down.',
        ],
        lookFor: 'Which measure changed the most: the mean, the median, or the standard deviation?',
        interpretation: 'The mean jumps from 56.6 to about 68.06, while the median only moves from 55 to 56. The sample standard deviation grows from about 6.91 to about 46.33. One extreme value changed the average and the spread a lot, but barely changed the middle.',
      },
      reflection: {
        prompt: 'Why can one outlier change the mean so much but hardly change the median?',
        sampleAnswer: 'The mean adds up the actual size of every value, so one huge value raises it, but the median only depends on which value is in the middle, and that barely changes.',
      },
    },
    {
      id: 's2-l3',
      title: 'How Spread Out?',
      minutes: 14,
      objective: 'Calculate the range and standard deviation of a small dataset and explain what spread means.',
      hook:
        'Knowing the typical salary is only half the clue. If a company offers $56,000, will most applicants be close to happy, or will many be far away? To answer that, you need to know how spread out the expectations are.',
      concept: {
        paragraphs: [
          'Spread describes how much the values vary. A small spread means the values are bunched together; a large spread means they are scattered.',
          'The range is the simplest measure: maximum minus minimum. It is quick, but it only uses the two most extreme values.',
          'The standard deviation (SD) measures the typical distance of values from the mean. To find it: subtract the mean from each value (these are the deviations), square each deviation, add the squares, divide, then take the square root. The number before the square root is the variance.',
          'Why square? The deviations always add up to 0, because the values above the mean balance the values below it. Squaring makes every distance positive.',
          'What do you divide by? If your data is a sample drawn from a bigger group, divide by n - 1. This is the sample variance and sample SD (s). If your data is the entire group you care about, divide by n. This is the population variance and population SD (the Greek letter sigma). The calculator starts in Sample mode and lets you switch.',
          'Example with 5 applicants: 52, 54, 56, 58, 60. The mean is 56 and the range is 8. The table shows the steps.',
        ],
        table: {
          caption: 'Standard deviation step by step for 5 fictional applicants (mean = 56)',
          headers: ['Value', 'Deviation (value - 56)', 'Squared deviation'],
          rows: [
            ['52', '-4', '16'],
            ['54', '-2', '4'],
            ['56', '0', '0'],
            ['58', '2', '4'],
            ['60', '4', '16'],
            ['Total', '0', '40'],
          ],
        },
        keyTerms: [
          { term: 'Range', definition: 'Maximum minus minimum.' },
          { term: 'Variance', definition: 'The average squared distance from the mean (dividing by n - 1 for a sample, or n for a population).' },
          { term: 'Standard deviation', definition: 'The square root of the variance. It is in the same units as the data, so it is easier to read.' },
        ],
      },
      ai: {
        paragraphs: [
          'Many models work better when their input features are on similar scales. Salary in thousands and years of experience live on very different scales.',
          'A common fix is standardizing: subtract the column mean from each value and divide by the column standard deviation. Because both steps use the mean and SD, a few extreme values can distort the scaled data too.',
        ],
      },
      practice: [
        {
          id: 's2-l3-p1',
          question: 'What is the range of the 7 applicants from Lesson 1 (48, 52, 55, 55, 58, 61, 63)?',
          options: ['7', '15', '55', '63'],
          answer: 1,
          hints: ['Range = maximum - minimum.'],
          explanation: 'The maximum is 63 and the minimum is 48, so the range is 63 - 48 = 15.',
        },
        {
          id: 's2-l3-p2',
          question: 'In the 5-applicant example, the squared deviations add up to 40. What is the sample variance?',
          options: ['8', '10', '3.16', '40'],
          answer: 1,
          hints: ['Sample variance divides by n - 1.', 'Here n = 5, so divide 40 by 4.'],
          explanation: 'Sample variance = 40 / (5 - 1) = 10. The sample SD is the square root of 10, about 3.16. Dividing by 5 instead gives the population variance, 8.',
        },
        {
          id: 's2-l3-p3',
          question: 'Why do we square the deviations instead of just adding them up?',
          options: [
            'Squaring makes the numbers smaller and easier to work with',
            'The plain deviations always add up to 0, so they cannot measure spread',
            'Squaring removes outliers from the data',
            'It changes the units back to dollars',
          ],
          answer: 1,
          hints: ['Look at the "Total" row of the deviation column in the table.'],
          explanation: 'Positive and negative deviations cancel out and always total 0. Squaring makes every distance positive so they add up to a useful measure of spread.',
        },
      ],
      mission: {
        calculator: 'statistics',
        task: 'Measure the spread of the 15 salary expectations, first as a sample and then as a population.',
        dataLabel: 'Salary expectations of 15 applicants (thousands of dollars per year)',
        data: '45, 48, 50, 52, 52, 55, 55, 55, 57, 58, 60, 62, 64, 66, 70',
        steps: [
          'Paste the 15 values and leave the Standard Deviation Formula on Sample (s).',
          'Press Calculate Statistics and read the Range, Variance, and Std Dev.',
          'Switch the formula to Population and read the Variance and Std Dev again.',
        ],
        lookFor: 'What is the range, and how much do the sample and population standard deviations differ?',
        interpretation: 'The range is 25 (from 45 to 70). The sample SD is about 6.91 and the population SD is about 6.67. Either way, a typical applicant is roughly 7 thousand dollars away from the mean of 56.6. With 15 values, the two formulas give similar answers; the difference shrinks as n grows.',
      },
      reflection: {
        prompt: 'In your own words, what does a standard deviation of about 7 (thousand dollars) tell a recruiter about these applicants?',
        sampleAnswer: 'It means that a typical applicant expects a salary about 7 thousand dollars above or below the average, so most expectations are fairly close together.',
      },
    },
    {
      id: 's2-l4',
      title: 'Same Average, Different Story',
      minutes: 13,
      objective: 'Compare two datasets with the same mean but different spread, and explain why the mean alone is not enough.',
      hook:
        'Two job postings each received 8 applicants. The system reports that both groups expect $60,000 on average. The recruiter plans to offer $60,000 to everyone. Will both groups react the same way?',
      concept: {
        paragraphs: [
          'Two datasets can share the same center and still look very different. Here, both postings have a mean of 60 and a median of 60.',
          'In Posting A, every expectation is between 57 and 63. In Posting B, they range from 42 to 78.',
          'The spread tells the difference. Posting A has a range of 6 and a sample SD of 2. Posting B has a range of 36 and a sample SD of 12, six times larger.',
          'An offer of 60 would be close to what almost everyone in Posting A wants. In Posting B, many applicants would be far above or far below that offer.',
          'This is why a good summary always reports both a center and a spread, for example "mean 60, SD 12".',
        ],
        table: {
          caption: 'Salary expectations for two fictional postings (thousands of dollars per year)',
          headers: ['Posting', 'Values', 'Mean', 'Range', 'Sample SD'],
          rows: [
            ['A', '57, 58, 59, 60, 60, 61, 62, 63', '60', '6', '2'],
            ['B', '42, 48, 54, 60, 60, 66, 72, 78', '60', '36', '12'],
          ],
        },
        keyTerms: [
          { term: 'Center', definition: 'A typical value, such as the mean or median.' },
          { term: 'Spread', definition: 'How much the values vary, such as the range or standard deviation.' },
          { term: 'Consistency', definition: 'A small standard deviation means the values are consistent, or close together.' },
        ],
      },
      ai: {
        paragraphs: [
          'The same idea appears when people evaluate AI systems. Two models can have the same average error, but one might be steady while the other is very accurate on some cases and very wrong on others.',
          'Looking only at the average hides that difference. Checking the spread of errors, and which cases have large errors, gives a much more honest picture.',
        ],
      },
      practice: [
        {
          id: 's2-l4-p1',
          question: 'Posting A has a sample SD of 2 and Posting B has a sample SD of 12. Which statement is correct?',
          options: [
            'Posting B has a higher typical salary expectation',
            'Posting A expectations are more tightly clustered around the mean',
            'Posting A has more applicants',
            'The groups are basically the same because their means match',
          ],
          answer: 1,
          hints: ['Standard deviation measures spread, not center.', 'Both postings have 8 applicants and a mean of 60.'],
          explanation: 'A smaller SD means values sit closer to the mean. Both groups share the same center, so the only difference here is spread.',
        },
        {
          id: 's2-l4-p2',
          question: 'The recruiter offers $60,000 in both postings. In which posting would more applicants expect at least $10,000 more than the offer?',
          options: ['Posting A', 'Posting B', 'Both the same', 'It is impossible to tell from the data'],
          answer: 1,
          hints: ['At least $10,000 more means 70 or higher.', 'Check each list for values of 70 or more.'],
          explanation: 'Posting A has no value above 63. Posting B has 72 and 78, so two applicants there expect at least 10 thousand dollars more than the offer.',
        },
        {
          id: 's2-l4-p3',
          question: 'What would a standard deviation of 0 mean?',
          options: [
            'The mean is 0',
            'Every value in the dataset is the same',
            'The data has no outliers but still varies',
            'The data is skewed',
          ],
          answer: 1,
          hints: ['SD measures how far values are from the mean. When is every distance 0?'],
          explanation: 'An SD of 0 means no value is any distance from the mean, so every value is identical.',
        },
      ],
      mission: {
        calculator: 'statistics',
        task: 'Put the two postings side by side and compare their center and spread.',
        dataLabel: 'Posting A salary expectations (thousands of dollars per year)',
        data: '57, 58, 59, 60, 60, 61, 62, 63',
        steps: [
          'Paste the Posting A values into the main input.',
          'Turn on "Compare with a second dataset" and paste the Posting B values: 42, 48, 54, 60, 60, 66, 72, 78.',
          'Keep the Sample (s) formula, press Calculate Statistics, and compare the two columns of results and the charts.',
        ],
        lookFor: 'Which measures are the same for both postings, and which are very different?',
        interpretation: 'Mean, median, and mode are all 60 for both postings. The range (6 vs. 36) and the sample SD (2 vs. 12) are very different. The centers match, but Posting B is far more spread out.',
      },
      reflection: {
        prompt: 'Why is it risky to describe a group using only its mean?',
        sampleAnswer: 'Because two groups can have the same mean but very different spreads, so the mean alone hides how far many values are from it.',
      },
    },
    {
      id: 's2-l5',
      title: 'Spotting Outliers and Shape',
      minutes: 15,
      objective: 'Use the 1.5 x IQR rule to flag outliers, describe a distribution shape, and decide what "normal" should mean.',
      hook:
        'Back to the case. The system collected 20 salary expectations, and the mean is $92,100. Yet 17 of the 20 applicants expect less than that. Which values are unusual, and what should the system call a normal expectation?',
      concept: {
        paragraphs: [
          'Quartiles split sorted data into four equal parts. Q1 is the value about one quarter of the way up, and Q3 is about three quarters of the way up. The interquartile range (IQR) is Q3 - Q1, the spread of the middle half of the data.',
          'A common rule flags a value as an outlier if it is below Q1 - 1.5 x IQR or above Q3 + 1.5 x IQR. These two cutoffs are called fences, and the calculator reports them as the Lower and Upper Outlier Fence.',
          'Example with 9 applicants: 50, 54, 54, 56, 58, 60, 63, 63, 140. Q1 = 54 and Q3 = 63, so IQR = 9. The fences are 54 - 13.5 = 40.5 and 63 + 13.5 = 76.5. Only 140 is outside, so it is the only outlier.',
          'Shape matters too. When a few values stretch far to the right, the distribution is skewed right, and the mean is pulled above the median. When the long tail is on the left, it is skewed left, and the mean is usually below the median. When the data is roughly symmetric, the mean and median are close.',
          'Finding an outlier is a clue, not a verdict. Check whether it is a mistake (for example, someone typed 400 when they meant 40). If it is real, keep it and report the median, or report results with and without it.',
        ],
        keyTerms: [
          { term: 'Quartiles (Q1, Q3)', definition: 'Values that mark roughly the lowest 25% and the lowest 75% of the sorted data.' },
          { term: 'IQR', definition: 'Interquartile range: Q3 - Q1, the spread of the middle half of the data. It is resistant to outliers.' },
          { term: 'Fences', definition: 'Q1 - 1.5 x IQR and Q3 + 1.5 x IQR. Values outside them are flagged as possible outliers.' },
          { term: 'Skewed right / left', definition: 'A long tail toward high values (right) or toward low values (left).' },
        ],
      },
      ai: {
        paragraphs: [
          'Data cleaning is a normal step before training a model, but "remove every outlier" is not a safe rule. Some extreme values are errors; others are real people, such as very senior applicants.',
          'Data choices, missing information, and biased samples can affect model behavior. If a system quietly drops everyone who looks unusual, it may learn to treat that group badly. Good practice is to investigate each outlier and write down what was done and why.',
        ],
      },
      practice: [
        {
          id: 's2-l5-p1',
          question: 'In the 9-applicant example, the fences are 40.5 and 76.5. Which value would be flagged as an outlier?',
          options: ['50', '63', '76', '140'],
          answer: 3,
          hints: ['A value is an outlier only if it is below 40.5 or above 76.5.'],
          explanation: 'Only 140 is outside the fences. 76 is close to the upper fence, but it is still inside it.',
        },
        {
          id: 's2-l5-p2',
          question: 'A salary expectation of 5000 (thousand dollars per year) appears in the data. What is the best first step?',
          options: [
            'Delete it immediately because it is an outlier',
            'Replace it with the mean so the dataset stays the same size',
            'Check the original record to see whether it is a typing mistake or a real value',
            'Keep it and report only the mean',
          ],
          answer: 2,
          hints: ['An outlier is a clue. What would a detective do before throwing out a clue?'],
          explanation: 'First find out why the value is there. It could be an entry error (for example, two extra zeros typed after 50), which should be fixed, or a real value, which should not be silently deleted.',
        },
        {
          id: 's2-l5-p3',
          question: 'The 20 salary expectations have a mean of 92.1 and a median of 60.5. What does this suggest about the shape?',
          options: ['Symmetric', 'Skewed right', 'Skewed left', 'There is no way to tell'],
          answer: 1,
          hints: ['The mean is pulled toward the long tail.', 'Is the mean above or below the median?'],
          explanation: 'The mean is much larger than the median, which means a few very high values are stretching the data to the right. That is a right skew.',
        },
      ],
      mission: {
        calculator: 'statistics',
        task: 'Solve the case: find the outliers in the 20 salary expectations and decide what the system should call normal.',
        dataLabel: 'Salary expectations of 20 applicants (thousands of dollars per year)',
        data: '58, 62, 55, 180, 60, 49, 66, 57, 250, 61, 53, 64, 59, 70, 52, 400, 63, 56, 67, 60',
        steps: [
          'Paste the 20 values and press Calculate Statistics.',
          'Read the Mean, Median, Q1, Q3, and the Lower and Upper Outlier Fence.',
          'Set the Chart Type to Box Plot and find the values drawn as outlier dots.',
        ],
        lookFor: 'Which values are outside the fences, and which number better describes a typical applicant: the mean or the median?',
        interpretation: 'The mean is 92.1 but the median is 60.5. The upper fence is 80.5, so 180, 250, and 400 are flagged as outliers. The data is skewed right, and 17 of 20 applicants expect less than the mean. The median, about $60,500, is the better baseline, and the three extreme values should be checked, not silently removed.',
      },
      reflection: {
        prompt: 'If you were in charge of the screening system, what would you report as a "normal" salary expectation, and why?',
        sampleAnswer: 'I would report the median of about $60,500, because three very high requests pull the mean up to $92,100, which is higher than what 17 of the 20 applicants actually expect.',
      },
    },
  ],
  checkpoints: [
    {
      id: 's2-c1',
      question: 'Five applicants expect 50, 52, 55, 58, and 90 (thousand dollars). What are the mean and the median?',
      options: ['Mean 55, median 61', 'Mean 61, median 55', 'Mean 61, median 58', 'Mean 55, median 55'],
      answer: 1,
      hints: ['Add the values and divide by 5 for the mean.', 'The values are already sorted, so the median is the 3rd one.'],
      explanation: 'The sum is 305, and 305 / 5 = 61. The middle value is 55. The 90 pulls the mean above the median.',
    },
    {
      id: 's2-c2',
      question: 'A company has 40 employees earning between $45,000 and $70,000, and one executive earning $2,000,000. Which measure best describes a typical salary?',
      options: ['Mean', 'Median', 'Range', 'Maximum'],
      answer: 1,
      hints: ['Which measure of center is resistant to one extreme value?'],
      explanation: 'The executive salary would drag the mean far above what almost everyone earns. The median stays in the middle of the typical salaries.',
    },
    {
      id: 's2-c3',
      question: 'Two delivery services both average 30 minutes per delivery. Service X has a standard deviation of 3 minutes and Service Y has a standard deviation of 15 minutes. Which is more predictable?',
      options: [
        'Service X, because its delivery times vary less',
        'Service Y, because a larger SD means more data',
        'Neither, because they have the same mean',
        'Service Y, because some of its deliveries are faster',
      ],
      answer: 0,
      hints: ['Predictable means the times stay close to the average.'],
      explanation: 'With a smaller SD, Service X delivery times stay closer to 30 minutes. Service Y has the same average but much more variation.',
    },
    {
      id: 's2-c4',
      question: 'On an easy exam, most students score between 80 and 95, but a few score very low. How does the mean most likely compare with the median?',
      options: [
        'The mean is higher than the median',
        'The mean is lower than the median',
        'The mean equals the median',
        'The mean is always halfway between the lowest and highest score',
      ],
      answer: 1,
      hints: ['Where is the long tail: high scores or low scores?', 'The mean is pulled toward the tail.'],
      explanation: 'A few very low scores create a long tail on the left (skewed left), which pulls the mean below the median.',
    },
    {
      id: 's2-c5',
      question: 'A dataset has Q1 = 40 and Q3 = 60. Using the 1.5 x IQR rule, which value is an outlier?',
      options: ['12', '55', '85', '95'],
      answer: 3,
      hints: ['IQR = 60 - 40 = 20, and 1.5 x 20 = 30.', 'The fences are 40 - 30 = 10 and 60 + 30 = 90.'],
      explanation: 'The fences are 10 and 90. Only 95 is outside them. 12 and 85 are unusual-looking but still inside the fences.',
    },
  ],
};

export default stage2;
